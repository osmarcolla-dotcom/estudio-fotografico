import { NextRequest, NextResponse } from 'next/server';
import { PaymentService } from '@/lib/domain/payments/service';
import { OrderService } from '@/lib/domain/orders/service';
import { NotificationService } from '@/lib/domain/notifications/service';
import { ProductionService } from '@/lib/domain/production/service';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  try {
    const { provider } = await params;
    const rawBody = await req.text();

    const headersObj: Record<string, string> = {};
    req.headers.forEach((value, key) => {
      headersObj[key] = value;
    });

    // 1. Validar webhook através do PaymentService/Gateway específico
    const result = await PaymentService.handleWebhook({
      provider,
      rawBody,
      headers: headersObj,
      signature: req.headers.get('x-signature') || undefined,
    });

    if (!result.success || !result.orderId) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      );
    }

    // 2. Se o pagamento foi aprovado, atualizar pedido e banco de dados
    if (result.status === 'PAID') {
      const order = await OrderService.getOrderById(result.orderId);

      if (order) {
        const supabase = createAdminClient();
        const now = new Date().toISOString();

        if (supabase) {
          // Atualizar status do pagamento
          await supabase
            .from('payments')
            .update({
              status: 'PAID',
              transaction_id: result.transactionId || null,
              paid_at: now,
              updated_at: now,
            })
            .eq('order_id', order.id);

          // Atualizar status do pedido para PAID e em seguida PRODUCTION_QUEUED
          await supabase
            .from('orders')
            .update({
              status: 'PRODUCTION_QUEUED',
              updated_at: now,
            })
            .eq('id', order.id);
        }

        // 3. Notificar o cliente via WhatsApp
        if (order.customer) {
          await NotificationService.notifyCustomer({
            toPhone: order.customer.whatsapp,
            template: 'PAYMENT_CONFIRMED',
            params: {
              customerName: order.customer.name,
              orderNumber: order.order_number,
              categoryName: order.category_name,
            },
          }).catch((err) => console.error('Erro ao notificar WhatsApp:', err));
        }

        // 4. Iniciar motor de produção fotográfica (se configurado)
        const photoUrls = order.customer_photos?.map((p) => p.storage_path) || [];
        await ProductionService.startProduction(order, photoUrls).catch((err) =>
          console.error('Erro ao iniciar produção automática:', err)
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    console.error('Erro no webhook de pagamentos:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Erro interno no webhook.' },
      { status: 500 }
    );
  }
}
