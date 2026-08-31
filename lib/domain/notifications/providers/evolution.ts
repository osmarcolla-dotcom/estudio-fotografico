import { WhatsAppMessagePayload, WhatsAppNotifier } from '../types';
import { UnconfiguredWhatsAppNotifier } from './unconfigured';

export class EvolutionWhatsAppNotifier implements WhatsAppNotifier {
  name = 'evolution-api';
  private apiUrl?: string;
  private apiKey?: string;
  private instanceName?: string;

  constructor() {
    this.apiUrl = process.env.WHATSAPP_API_URL;
    this.apiKey = process.env.WHATSAPP_API_KEY;
    this.instanceName = process.env.WHATSAPP_INSTANCE_NAME || 'estudio';
  }

  isConfigured(): boolean {
    return Boolean(this.apiUrl && this.apiKey && this.apiUrl.trim().length > 5);
  }

  private buildMessageText(payload: WhatsAppMessagePayload): string {
    const { customerName, orderNumber, categoryName, approvalUrl, downloadUrl, photoCount } = payload.params;

    switch (payload.template) {
      case 'PAYMENT_CONFIRMED':
        return `✨ *Olá, ${customerName}!* Recebemos seu pedido *${orderNumber}* para o ensaio de *${categoryName}*.\n\nSeu pagamento foi confirmado com sucesso e seu ensaio já entrou em nossa fila de produção! 📸`;
      case 'PRODUCTION_STARTED':
        return `🎨 *${customerName}*, a produção do seu ensaio *${orderNumber}* foi iniciada! Estamos trabalhando na iluminação, enquadramento e harmonia visual das suas ${photoCount} fotos.`;
      case 'READY_FOR_APPROVAL':
        return `📸 *Seu ensaio está pronto, ${customerName}!* 📸\n\nPreparamos a prévia exclusiva do seu ensaio fotográfico. Acesse o link abaixo para conferir suas fotos e aprovar:\n\n👉 ${approvalUrl}`;
      case 'APPROVED':
        return `🎉 *Que alegria, ${customerName}!* Seu ensaio *${orderNumber}* foi aprovado com sucesso! Estamos liberando os arquivos finais em alta resolução para download.`;
      case 'DOWNLOAD_READY':
        return `💾 *Suas fotos em alta resolução estão prontas!* 💾\n\n${customerName}, você já pode baixar todas as fotos do seu ensaio fotográfico digital no link abaixo:\n\n👉 ${downloadUrl}\n\nObrigado por escolher nosso estúdio! ✨`;
      default:
        return `Olá ${customerName}, atualizamos o status do seu ensaio fotográfico (${orderNumber}).`;
    }
  }

  async sendMessage(payload: WhatsAppMessagePayload): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.isConfigured()) {
      return new UnconfiguredWhatsAppNotifier().sendMessage(payload);
    }

    try {
      const cleanPhone = payload.toPhone.replace(/\D/g, '');
      const formattedPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
      const messageText = this.buildMessageText(payload);

      const response = await fetch(`${this.apiUrl}/message/sendText/${this.instanceName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: this.apiKey!,
        },
        body: JSON.stringify({
          number: formattedPhone,
          text: messageText,
        }),
      });

      const data = await response.json();
      return {
        success: response.ok,
        messageId: data.key?.id || data.id,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message,
      };
    }
  }
}
