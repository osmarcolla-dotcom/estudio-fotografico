import { WhatsAppMessagePayload, WhatsAppNotifier } from '../types';

export class UnconfiguredWhatsAppNotifier implements WhatsAppNotifier {
  name = 'unconfigured';

  isConfigured(): boolean {
    return false;
  }

  async sendMessage(payload: WhatsAppMessagePayload): Promise<{ success: boolean; messageId?: string; error?: string }> {
    return {
      success: false,
      error:
        'Notificador WhatsApp não configurado. Para enviar mensagens automáticas de confirmação, produção e aprovação, configure as variáveis WHATSAPP_API_URL e WHATSAPP_API_KEY no arquivo .env.',
    };
  }
}
