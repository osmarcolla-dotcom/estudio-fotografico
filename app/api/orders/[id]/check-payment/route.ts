import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { OrderService } from '@/lib/domain/orders/service';
import { ProductionService } from '@/lib/domain/production/service';
import { NotificationService } from '@/lib/domain/notifications/service';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params;
    const supabase = createAdminClient();
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

    if (!supabase) {
      return NextResponse.json({ isPaid: false, status: 'PENDING_PAYMENT' });
    }

    // 1. Busca pedido no Supabase
    const order = await OrderService.getOrderById(orderId);
    if (!order) {
      return NextResponse.json({ isPaid: false, status: 'PENDING_PAYMENT' });
    }

    // Se já está marcado como pago ou em produção/concluído no banco
    const alreadyPaid =
      order.status === 'PAID' ||
      order.status === 'PRODUCTION_QUEUED' ||
      order.status === 'IN_PRODUCTION' ||
      order.status === 'READY_FOR_APPROVAL' ||
      order.status === 'APPROVED' ||
      order.status === 'COMPLETED' ||
      (Array.isArray(order.payment) && order.payment.some((p: any) => p.status === 'PAID')) ||
      (order.payment && (order.payment as any).status === 'PAID');

    if (alreadyPaid) {
      return NextResponse.json({
        isPaid: true,
        status: order.status,
      });
    }

    // 2. Consulta em tempo real na API do Mercado Pago (Instant Sync)
    if (accessToken) {
      try {
        const mpRes = await fetch(
          `https://api.mercadopago.com/v1/payments/search?external_reference=${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (mpRes.ok) {
          const mpData = await mpRes.json();
          const approvedPayment = mpData.results?.find(
            (p: any) => p.status === 'approved'
          );

          if (approvedPayment) {
            const now = new Date().toISOString();

            // Atualiza pagamento no Supabase
            await supabase
              .from('payments')
              .update({
                status: 'PAID',
                transaction_id: approvedPayment.id.toString(),
                paid_at: approvedPayment.date_approved || now,
                updated_at: now,
              })
              .eq('order_id', orderId);

            // Atualiza pedido para IN_PRODUCTION
            await supabase
              .from('orders')
              .update({
                status: 'IN_PRODUCTION',
                updated_at: now,
              })
              .eq('id', orderId);

            // Dispara notificação WhatsApp
            if (order.customer) {
              await NotificationService.notifyCustomer({
                toPhone: order.customer.whatsapp,
                template: 'PAYMENT_CONFIRMED',
                params: {
                  customerName: order.customer.name,
                  orderNumber: order.order_number,
                  categoryName: order.category_name,
                },
              }).catch(() => {});
            }

            // Inicia esteira de produção das fotografias via IA
            const photoUrls = order.customer_photos?.map((p) => p.storage_path) || [];
            ProductionService.startProduction(order, photoUrls).catch((err) =>
              console.error('Erro ao iniciar produção automática:', err)
            );

            return NextResponse.json({
              isPaid: true,
              status: 'IN_PRODUCTION',
              message: 'Pagamento confirmado com sucesso!',
            });
          }
        }
      } catch (err: any) {
        console.error('Erro ao sincronizar pagamento com Mercado Pago:', err);
      }
    }

    return NextResponse.json({
      isPaid: false,
      status: order.status,
    });
  } catch (error: any) {
    return NextResponse.json({ isPaid: false, error: error.message }, { status: 500 });
  }
}
