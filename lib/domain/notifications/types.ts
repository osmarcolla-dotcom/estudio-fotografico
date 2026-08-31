export interface WhatsAppMessagePayload {
  toPhone: string;
  template: 'PAYMENT_CONFIRMED' | 'PRODUCTION_STARTED' | 'READY_FOR_APPROVAL' | 'APPROVED' | 'DOWNLOAD_READY';
  params: {
    customerName: string;
    orderNumber: string;
    categoryName?: string;
    approvalUrl?: string;
    downloadUrl?: string;
    photoCount?: number;
  };
}

export interface WhatsAppNotifier {
  name: string;
  isConfigured(): boolean;
  sendMessage(payload: WhatsAppMessagePayload): Promise<{ success: boolean; messageId?: string; error?: string }>;
}
