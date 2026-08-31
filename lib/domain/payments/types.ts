import { Order, Payment } from '@/lib/types';

export interface CheckoutSessionResult {
  paymentId: string;
  checkoutUrl?: string;
  qrCodePix?: string;
  pixCopiaECola?: string;
  instructions?: string;
  provider: string;
  transactionId?: string;
}

export interface PaymentWebhookPayload {
  provider: string;
  rawBody: string;
  signature?: string;
  headers: Record<string, string | string[] | undefined>;
}

export interface WebhookProcessingResult {
  success: boolean;
  orderId?: string;
  transactionId?: string;
  status?: 'PAID' | 'FAILED' | 'REFUNDED';
  amountCents?: number;
  message: string;
}

export interface PaymentGateway {
  name: string;
  isConfigured(): boolean;
  createCheckout(order: Order): Promise<CheckoutSessionResult>;
  verifyWebhook(payload: PaymentWebhookPayload): Promise<WebhookProcessingResult>;
  refund(payment: Payment): Promise<boolean>;
}
