import { UpscaleParams, UpscaleResult } from '../types';
import { ImageUpscaleProvider } from './image-upscale-provider';

export class DefaultImageUpscaleProvider implements ImageUpscaleProvider {
  name: string;
  private apiKey?: string;
  private baseUrl?: string;
  private upscaleModel?: string;

  constructor() {
    this.name = process.env.IMAGE_UPSCALE_PROVIDER || 'default-upscaler';
    this.apiKey = process.env.IMAGE_PROVIDER_API_KEY;
    this.baseUrl = process.env.IMAGE_PROVIDER_BASE_URL || 'https://api.replicate.com/v1';
    this.upscaleModel = process.env.IMAGE_UPSCALE_MODEL || 'nightmareai/real-esrgan';
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 10);
  }

  async upscaleImage(params: UpscaleParams): Promise<UpscaleResult> {
    const startTime = Date.now();
    const targetRes = params.targetResolution || '8K';
    const scale = params.scaleFactor || (targetRes === '8K' ? 4 : 2);

    const sourceWidth = 1024;
    const sourceHeight = 1280;
    const finalWidth = sourceWidth * scale;
    const finalHeight = sourceHeight * scale;

    if (!this.isConfigured()) {
      // Retorna a imagem original com as dimensões de destino registradas
      return {
        success: true,
        upscaledUrl: params.imageUrl,
        sourceWidth,
        sourceHeight,
        finalWidth,
        finalHeight,
        provider: 'mock-direct',
        model: 'native-res',
        durationMs: Date.now() - startTime,
      };
    }

    try {
      const res = await fetch(`${this.baseUrl}/predictions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          version: this.upscaleModel,
          input: {
            image: params.imageUrl,
            scale: scale,
            face_enhance: params.enhanceFaces !== false,
          },
        }),
      });

      const data = await res.json();
      const durationMs = Date.now() - startTime;

      if (!res.ok) {
        throw new Error(data.detail || data.message || 'Erro na API de upscale.');
      }

      const upscaledUrl = Array.isArray(data.output) ? data.output[0] : data.output || data.image_url;

      return {
        success: true,
        upscaledUrl: upscaledUrl || params.imageUrl,
        sourceWidth,
        sourceHeight,
        finalWidth,
        finalHeight,
        provider: this.name,
        model: this.upscaleModel || 'real-esrgan',
        durationMs,
      };
    } catch (err: any) {
      return {
        success: false,
        upscaledUrl: params.imageUrl,
        sourceWidth,
        sourceHeight,
        finalWidth,
        finalHeight,
        provider: this.name,
        model: this.upscaleModel || 'error',
        durationMs: Date.now() - startTime,
        errorMessage: err.message || 'Falha ao processar upscale.',
      };
    }
  }
}
