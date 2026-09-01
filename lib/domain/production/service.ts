import { Order } from '@/lib/types';
import { PhotoJob, PhotoSession } from './types';
import { ProductionOrchestrator } from './orchestrator';
import { createAdminClient } from '@/lib/supabase/admin';

export class ProductionService {
  /**
   * Dispara a esteira completa de produção fotográfica para um pedido:
   * 1. Cria PhotoSession
   * 2. Obtém URL acessível da foto de referência (Signed URL)
   * 3. Executa o modelo Flux PuLID com a foto real da pessoa
   */
  static async startProduction(order: Order, originalImageUrls: string[]): Promise<PhotoSession> {
    let sourceImageUrl = originalImageUrls[0] || '';

    // Se a imagem for um caminho do storage Supabase, gera uma Signed URL válida para a IA ler
    const supabase = createAdminClient();
    if (supabase && sourceImageUrl && !sourceImageUrl.startsWith('http')) {
      try {
        const cleanPath = sourceImageUrl.replace(/^customer-uploads\//, '');
        const { data: signed } = await supabase.storage
          .from('customer-uploads')
          .createSignedUrl(cleanPath, 60 * 60 * 24); // 24h

        if (signed?.signedUrl) {
          sourceImageUrl = signed.signedUrl;
        }
      } catch (err) {
        console.error('Erro ao assinar URL da foto de referência:', err);
      }
    }

    if (!sourceImageUrl) {
      sourceImageUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85';
    }

    return ProductionOrchestrator.runFullProductionPipeline({
      orderId: order.id,
      customerId: order.customer_id,
      categorySlug: (order.category_name || 'ensaio').toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'),
      styleSlug: (order.style_name || 'estudio').toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'),
      photoCount: order.package_photo_count || 6,
      sourceImageUrl,
      targetResolution: (process.env.TARGET_RESOLUTION as '4K' | '8K' | 'UHD') || '8K',
    });
  }

  static async getSession(sessionId: string): Promise<PhotoSession | null> {
    return ProductionOrchestrator.getSession(sessionId);
  }

  static async retrySinglePhoto(
    sessionId: string,
    photoIndex: number,
    sourceImageUrl: string
  ): Promise<PhotoJob | null> {
    return ProductionOrchestrator.retrySinglePhoto(sessionId, photoIndex, sourceImageUrl);
  }
}
