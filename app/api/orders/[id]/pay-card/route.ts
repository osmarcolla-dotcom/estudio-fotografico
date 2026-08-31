import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { OrderService } from '@/lib/domain/orders/service';
import { ProductionService } from '@/lib/domain/production/service';
import { NotificationService } from '@/lib/domain/notifications/service';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params;
    const body = await req.json();
    const {
      cardNumber,
      cardholderName,
      cardholderCpf,
      expirationMonth,
      expirationYear,
      securityCode,
      installments = 1,
    } = body;

    if (!cardNumber || !cardholderName || !expirationMonth || !expirationYear || !securityCode) {
      return NextResponse.json(
        { success: false, message: 'Preencha todos os dados do cartão de crédito.' },
        { status: 400 }
      );
    }

    const order = await OrderService.getOrderById(orderId);
    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Pedido não encontrado.' },
        { status: 404 }
      );
    }

    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!accessToken) {
      return NextResponse.json(
        { success: false, message: 'Gateway de pagamento não configurado.' },
        { status: 500 }
      );
    }

    // 1. Criar Token do Cartão de forma segura com a API do Mercado Pago
    const cleanCardNumber = cardNumber.replace(/\D/g, '');
    const cleanCpf = (cardholderCpf || '').replace(/\D/g, '') || '19119119100';

    const tokenRes = await fetch('https://api.mercadopago.com/v1/card_tokens', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        card_number: cleanCardNumber,
        cardholder: {
          name: cardholderName,
          identification: {
            type: 'CPF',
            number: cleanCpf,
          },
        },
        security_code: securityCode,
        expiration_month: parseInt(expirationMonth, 10),
        expiration_year: parseInt(expirationYear.length === 2 ? `20${expirationYear}` : expirationYear, 10),
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.id) {
      console.error('Erro ao gerar token do cartão:', tokenData);
      return NextResponse.json(
        { success: false, message: tokenData.message || 'Dados do cartão inválidos. Verifique o número, validade e CVV.' },
        { status: 400 }
      );
    }

    // 2. Processar cobrança com o token
    const cleanPhone = (order.customer?.whatsapp || '').replace(/\D/g, '');
    const rawEmail = order.customer?.email || '';
    const payerEmail =
      rawEmail && rawEmail.includes('@') && rawEmail.includes('.') && !rawEmail.endsWith('.estudio')
        ? rawEmail
        : `cliente.${cleanPhone || Date.now()}@estudiofotografico.com.br`;

    const paymentRes = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'X-Idempotency-Key': `card-${order.id}-${Date.now()}`,
      },
      body: JSON.stringify({
        token: tokenData.id,
        transaction_amount: Number((order.package_price_cents / 100).toFixed(2)),
        description: `Ensaio Fotográfico - ${order.category_name} (${order.style_name})`,
        installments: parseInt(installments, 10) || 1,
        payment_method_id: tokenData.payment_method_id || undefined,
        payer: {
          email: payerEmail,
          first_name: cardholderName.split(' ')[0] || 'Cliente',
          last_name: cardholderName.split(' ').slice(1).join(' ') || 'Estúdio',
          identification: {
            type: 'CPF',
            number: cleanCpf,
          },
        },
        external_reference: order.id,
      }),
    });

    const paymentData = await paymentRes.json();

    if (!paymentRes.ok || !paymentData.id) {
      console.error('Erro no pagamento com cartão:', paymentData);
      return NextResponse.json(
        {
          success: false,
          message:
            paymentData.message ||
            paymentData.cause?.[0]?.description ||
            'Pagamento recusado pelo emissor do cartão.',
        },
        { status: 400 }
      );
    }

    const isApproved = paymentData.status === 'approved';

    // 3. Se aprovado, atualizar banco e iniciar produção
    if (isApproved) {
      const supabase = createAdminClient();
      const now = new Date().toISOString();

      if (supabase) {
        await supabase
          .from('payments')
          .update({
            status: 'PAID',
            transaction_id: paymentData.id.toString(),
            paid_at: now,
            updated_at: now,
          })
          .eq('order_id', order.id);

        await supabase
          .from('orders')
          .update({
            status: 'PRODUCTION_QUEUED',
            updated_at: now,
          })
          .eq('id', order.id);
      }

      // Notificar WhatsApp
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

      // Iniciar produção fotográfica
      const photoUrls = order.customer_photos?.map((p) => p.storage_path) || [];
      ProductionService.startProduction(order, photoUrls).catch((err) =>
        console.error('Erro ao iniciar produção:', err)
      );

      return NextResponse.json({
        success: true,
        status: 'approved',
        message: 'Pagamento aprovado com sucesso!',
      });
    }

    if (paymentData.status === 'in_process') {
      return NextResponse.json({
        success: true,
        status: 'in_process',
        message: 'Pagamento em análise pelo emissor do cartão.',
      });
    }

    return NextResponse.json(
      {
        success: false,
        status: paymentData.status,
        message: 'Pagamento não aprovado. Verifique os dados ou tente outro cartão.',
      },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Erro interno no processamento do cartão:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Erro ao processar pagamento.' },
      { status: 500 }
    );
  }
}
