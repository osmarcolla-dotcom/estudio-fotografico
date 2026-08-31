import { Order, Payment } from '@/lib/types';
import { CheckoutSessionResult, PaymentGateway, PaymentWebhookPayload, WebhookProcessingResult } from '../types';
import { UnconfiguredPaymentGateway } from './unconfigured';

export class MercadoPagoGateway implements PaymentGateway {
  name = 'mercadopago';
  private accessToken?: string;

  constructor() {
    this.accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  }

  isConfigured(): boolean {
    return Boolean(this.accessToken && this.accessToken.trim().length > 10);
  }

  async createCheckout(order: Order): Promise<CheckoutSessionResult> {
    if (!this.isConfigured()) {
      return new UnconfiguredPaymentGateway().createCheckout(order);
    }

    // Exemplo de integração nativa do MercadoPago Preference/PIX
    // Em produção, usa a API oficial do MercadoPago
    try {
      const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.accessToken}`,
        },
        body: JSON.stringify({
          items: [
            {
              id: order.id,
              title: `Ensaio Fotográfico - ${order.category_name} (${order.style_name})`,
              description: `${order.package_name} - ${order.package_photo_count} fotos em alta resolução`,
              quantity: 1,
              currency_id: 'BRL',
              unit_price: order.package_price_cents / 100,
            },
          ],
          payer: {
            name: order.customer?.name,
            email: order.customer?.email,
            phone: {
              number: order.customer?.whatsapp,
            },
          },
          external_reference: order.id,
          back_urls: {
            success: `${process.env.NEXT_PUBLIC_APP_URL}/pedido/${order.id}?status=success`,
            pending: `${process.env.NEXT_PUBLIC_APP_URL}/pedido/${order.id}?status=pending`,
            failure: `${process.env.NEXT_PUBLIC_APP_URL}/pedido/${order.id}?status=failure`,
          },
          auto_return: 'approved',
          notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/webhook/mercadopago`,
        }),
      });

      const data = await response.json();
      if (data && data.init_point) {
        return {
          paymentId: order.payment?.id || `mp-${order.id}`,
          checkoutUrl: data.init_point,
          provider: this.name,
          transactionId: data.id,
        };
      }

      throw new Error(data.message || 'Falha ao criar preferência no MercadoPago');
    } catch (err: any) {
      console.error('Erro no MercadoPago Gateway:', err);
      return {
        paymentId: order.payment?.id || `mp-${order.id}`,
        provider: this.name,
        instructions: 'Erro ao conectar ao MercadoPago. Tente novamente mais tarde.',
      };
    }
  }

  async verifyWebhook(payload: PaymentWebhookPayload): Promise<WebhookProcessingResult> {
    if (!this.isConfigured()) {
      return {
        success: false,
        message: 'MercadoPago não configurado.',
      };
    }

    try {
      const parsed = JSON.parse(payload.rawBody);
      // Processamento de notificação de pagamento do MercadoPago
      if (parsed.type === 'payment' && parsed.data?.id) {
        const paymentId = parsed.data.id;
        const res = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        });
        const paymentData = await res.json();

        if (paymentData.status === 'approved') {
          return {
            success: true,
            orderId: paymentData.external_reference,
            transactionId: paymentData.id.toString(),
            status: 'PAID',
            amountCents: Math.round(paymentData.transaction_amount * 100),
            message: 'Pagamento aprovado via MercadoPago.',
          };
        }
      }

      return {
        success: true,
        message: 'Webhook recebido mas não exigiu alteração de status.',
      };
    } catch (err: any) {
      return {
        success: false,
        message: `Erro ao validar webhook: ${err.message}`,
      };
    }
  }

  async refund(payment: Payment): Promise<boolean> {
    if (!this.isConfigured() || !payment.transaction_id) return false;
    try {
      const res = await fetch(`https://api.mercadopago.com/v1/payments/${payment.transaction_id}/refunds`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });
      return res.ok;
    } catch {
      return false;
    }
  }
}
