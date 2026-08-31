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

  /**
   * Gera simultaneamente:
   * 1. PIX Direto nativo (com QR Code + Copia e Cola instantâneo)
   * 2. Link oficial de Checkout para Cartão de Crédito (com parcelamento)
   */
  async createPixPayment(order: Order): Promise<CheckoutSessionResult> {
    if (!this.isConfigured()) {
      return new UnconfiguredPaymentGateway().createCheckout(order);
    }

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes('localhost')
          ? process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '')
          : 'https://estudio-fotografico-app.vercel.app';

      const rawEmail = order.customer?.email || '';
      const cleanPhone = (order.customer?.whatsapp || '').replace(/\D/g, '');
      const validEmail =
        rawEmail && rawEmail.includes('@') && rawEmail.includes('.') && !rawEmail.endsWith('.estudio')
          ? rawEmail
          : `cliente.${cleanPhone || Date.now()}@estudiofotografico.com.br`;

      const unitPrice = Number((order.package_price_cents / 100).toFixed(2));

      // Executa a criação do PIX direto e da preferência de Cartão em paralelo
      const [pixPromise, prefPromise] = await Promise.allSettled([
        // 1. PIX direto
        fetch('https://api.mercadopago.com/v1/payments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.accessToken}`,
            'X-Idempotency-Key': `pix-${order.id}`,
          },
          body: JSON.stringify({
            transaction_amount: unitPrice,
            description: `Ensaio Fotográfico - ${order.category_name} (${order.style_name})`,
            payment_method_id: 'pix',
            payer: {
              email: validEmail,
              first_name: order.customer?.name || 'Cliente',
              last_name: 'Estúdio',
            },
            external_reference: order.id,
          }),
        }).then((r) => r.json()),

        // 2. Preferência de Cartão de Crédito
        fetch('https://api.mercadopago.com/checkout/preferences', {
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
                unit_price: unitPrice,
              },
            ],
            payer: {
              name: order.customer?.name || 'Cliente Estúdio',
              email: validEmail,
              phone: {
                number: cleanPhone || '999999999',
              },
            },
            external_reference: order.id,
            back_urls: {
              success: `${baseUrl}/pedido/${order.id}?status=success`,
              pending: `${baseUrl}/pedido/${order.id}?status=pending`,
              failure: `${baseUrl}/pedido/${order.id}?status=failure`,
            },
            auto_return: 'approved',
          }),
        }).then((r) => r.json()),
      ]);

      const pixData = pixPromise.status === 'fulfilled' ? pixPromise.value : null;
      const prefData = prefPromise.status === 'fulfilled' ? prefPromise.value : null;

      const txData = pixData?.point_of_interaction?.transaction_data;
      const cardUrl = prefData?.init_point || prefData?.sandbox_init_point;

      return {
        paymentId: pixData?.id?.toString() || `pay-${order.id}`,
        transactionId: pixData?.id?.toString(),
        provider: this.name,
        qrCodeBase64: txData?.qr_code_base64,
        pixCopiaECola: txData?.qr_code,
        checkoutUrl: txData?.ticket_url || cardUrl,
        cardCheckoutUrl: cardUrl,
        paymentMethod: 'all',
      };
    } catch (err: any) {
      console.error('Erro ao gerar opções de pagamento:', err);
      return this.createCheckout(order);
    }
  }

  async createCheckout(order: Order): Promise<CheckoutSessionResult> {
    if (!this.isConfigured()) {
      return new UnconfiguredPaymentGateway().createCheckout(order);
    }

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes('localhost')
          ? process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '')
          : 'https://estudio-fotografico-app.vercel.app';

      const rawEmail = order.customer?.email || '';
      const cleanPhone = (order.customer?.whatsapp || '').replace(/\D/g, '');
      const validEmail =
        rawEmail && rawEmail.includes('@') && rawEmail.includes('.') && !rawEmail.endsWith('.estudio')
          ? rawEmail
          : `cliente.${cleanPhone || Date.now()}@estudiofotografico.com.br`;

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
              unit_price: Number((order.package_price_cents / 100).toFixed(2)),
            },
          ],
          payer: {
            name: order.customer?.name || 'Cliente Estúdio',
            email: validEmail,
            phone: {
              number: cleanPhone || '999999999',
            },
          },
          external_reference: order.id,
          back_urls: {
            success: `${baseUrl}/pedido/${order.id}?status=success`,
            pending: `${baseUrl}/pedido/${order.id}?status=pending`,
            failure: `${baseUrl}/pedido/${order.id}?status=failure`,
          },
          auto_return: 'approved',
        }),
      });

      const data = await response.json();

      if (response.ok && data && (data.init_point || data.sandbox_init_point)) {
        return {
          paymentId: order.payment?.id || `mp-${order.id}`,
          checkoutUrl: data.init_point || data.sandbox_init_point,
          cardCheckoutUrl: data.init_point || data.sandbox_init_point,
          provider: this.name,
          transactionId: data.id,
        };
      }

      throw new Error(data.message || data.error || 'Falha ao criar preferência no Mercado Pago');
    } catch (err: any) {
      console.error('Erro no MercadoPago Gateway:', err);
      return {
        paymentId: order.payment?.id || `mp-${order.id}`,
        provider: this.name,
        instructions: err.message || 'Erro ao conectar ao Mercado Pago.',
      };
    }
  }

  async verifyWebhook(payload: PaymentWebhookPayload): Promise<WebhookProcessingResult> {
    if (!this.isConfigured()) {
      return {
        success: false,
        message: 'Mercado Pago não configurado.',
      };
    }

    try {
      const parsed = JSON.parse(payload.rawBody);
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
            message: 'Pagamento aprovado via Mercado Pago.',
          };
        }
      }

      return {
        success: true,
        message: 'Webhook recebido.',
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
