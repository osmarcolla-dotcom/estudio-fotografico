import { Order, Payment } from '@/lib/types';
import { CheckoutSessionResult, PaymentGateway, PaymentWebhookPayload, WebhookProcessingResult } from '../types';

export class UnconfiguredPaymentGateway implements PaymentGateway {
  name = 'unconfigured';

  isConfigured(): boolean {
    return false;
  }

  async createCheckout(order: Order): Promise<CheckoutSessionResult> {
    return {
      paymentId: order.payment?.id || `unconfigured-${order.id}`,
      provider: this.name,
      instructions:
        'O gateway de pagamento ainda não está configurado neste ambiente. Para habilitar recebimentos automáticos via PIX ou Cartão, preencha as variáveis de ambiente do MercadoPago, Asaas ou Stripe no arquivo .env.',
    };
  }

  async verifyWebhook(payload: PaymentWebhookPayload): Promise<WebhookProcessingResult> {
    return {
      success: false,
      message: 'Gateway de pagamento não configurado para processar webhooks.',
    };
  }

  async refund(payment: Payment): Promise<boolean> {
    return false;
  }
}
