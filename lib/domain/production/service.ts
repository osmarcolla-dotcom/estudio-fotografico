import { Order } from '@/lib/types';
import { PhotoJob, PhotoSession } from './types';
import { ProductionOrchestrator } from './orchestrator';

export class ProductionService {
  /**
   * Dispara a esteira completa de produção fotográfica para um pedido:
   * 1. Cria PhotoSession
   * 2. Analisa foto de referência (IdentityProfile)
   * 3. Cria ShootPlan com variações distintas de pose/luz/enquadramento
   * 4. Gera as N fotos via PhotoJobs com retry e validação
   * 5. Realiza upscale em alta resolução e gera previews separados
   */
  static async startProduction(order: Order, originalImageUrls: string[]): Promise<PhotoSession> {
    const sourceImageUrl =
      originalImageUrls[0] ||
      'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=1200&q=85';

    return ProductionOrchestrator.runFullProductionPipeline({
      orderId: order.id,
      customerId: order.customer_id,
      categorySlug: order.category_name.toLowerCase().replace(/\s+/g, '-'),
      styleSlug: order.style_name.toLowerCase().replace(/\s+/g, '-'),
      photoCount: order.package_photo_count || 6,
      sourceImageUrl,
      targetResolution: (process.env.TARGET_RESOLUTION as '4K' | '8K' | 'UHD') || '8K',
    });
  }

  /**
   * Obtém os detalhes completos e tempo real da sessão de produção
   */
  static async getSession(sessionId: string): Promise<PhotoSession | null> {
    return ProductionOrchestrator.getSession(sessionId);
  }

  /**
   * Refaz uma única fotografia com base no índice solicitado
   */
  static async retrySinglePhoto(
    sessionId: string,
    photoIndex: number,
    sourceImageUrl: string
  ): Promise<PhotoJob | null> {
    return ProductionOrchestrator.retrySinglePhoto(sessionId, photoIndex, sourceImageUrl);
  }
}
