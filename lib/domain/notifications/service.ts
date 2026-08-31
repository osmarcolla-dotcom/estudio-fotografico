import { WhatsAppMessagePayload, WhatsAppNotifier } from './types';
import { UnconfiguredWhatsAppNotifier } from './providers/unconfigured';
import { EvolutionWhatsAppNotifier } from './providers/evolution';

export class NotificationService {
  private static getNotifier(): WhatsAppNotifier {
    const provider = process.env.WHATSAPP_PROVIDER || 'unconfigured';

    if (provider === 'evolution') {
      const evo = new EvolutionWhatsAppNotifier();
      if (evo.isConfigured()) return evo;
    }

    return new UnconfiguredWhatsAppNotifier();
  }

  static async notifyCustomer(payload: WhatsAppMessagePayload): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const notifier = this.getNotifier();
    return notifier.sendMessage(payload);
  }
}
