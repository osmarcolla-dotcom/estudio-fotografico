import { UpscaleParams, UpscaleResult } from '../types';

/**
 * Interface abstrata dedicada ao motor de upscale e ampliação em alta resolução
 * (Clarity Upscaler, Real-ESRGAN, Topaz API, Magnific, etc.)
 */
export interface ImageUpscaleProvider {
  name: string;
  isConfigured(): boolean;

  /**
   * Amplia e trata a imagem gerada para a resolução alvo configurada (ex: 4K / 8K)
   */
  upscaleImage(params: UpscaleParams): Promise<UpscaleResult>;
}
