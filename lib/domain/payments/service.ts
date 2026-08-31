import { Order, Payment } from '@/lib/types';
import { CheckoutSessionResult, PaymentGateway, PaymentWebhookPayload, WebhookProcessingResult } from './types';
import { UnconfiguredPaymentGateway } from './providers/unconfigured';
import { MercadoPagoGateway } from './providers/mercadopago';

export class PaymentService {
  private static getGateway(providerName?: string): PaymentGateway {
    const activeProvider = providerName || process.env.PAYMENT_PROVIDER || 'unconfigured';

    if (activeProvider === 'mercadopago') {
      const mp = new MercadoPagoGateway();
      if (mp.isConfigured()) return mp;
    }

    return new UnconfiguredPaymentGateway();
  }

  static async initiatePayment(order: Order): Promise<CheckoutSessionResult> {
    const gateway = this.getGateway();
    return gateway.createCheckout(order);
  }

  static async handleWebhook(payload: PaymentWebhookPayload): Promise<WebhookProcessingResult> {
    const gateway = this.getGateway(payload.provider);
    return gateway.verifyWebhook(payload);
  }

  static async refundPayment(payment: Payment): Promise<boolean> {
    const gateway = this.getGateway(payment.provider);
    return gateway.refund(payment);
  }
}
