import { ImageGenerationProvider } from '../providers/image-generation-provider';
import { PhotoJob } from '../types';

export interface PollingOptions {
  providerJobId: string;
  provider: ImageGenerationProvider;
  maxAttempts?: number;
  intervalMs?: number;
  timeoutMs?: number;
}

export class PollingWorker {
  /**
   * Executa polling controlado para aguardar a conclusão assíncrona da geração de uma imagem.
   * Evita polling infinito, aplicando timeout e limite máximo de tentativas.
   */
  static async waitForCompletion(options: PollingOptions): Promise<{
    success: boolean;
    imageUrl?: string;
    errorMessage?: string;
  }> {
    const {
      providerJobId,
      provider,
      maxAttempts = 30, // 30 tentativas x 2 segundos = ~60 segundos máx
      intervalMs = 2000,
      timeoutMs = 90000,
    } = options;

    const startTime = Date.now();
    let attempts = 0;

    while (attempts < maxAttempts) {
      if (Date.now() - startTime > timeoutMs) {
        return {
          success: false,
          errorMessage: 'Tempo limite esgotado (timeout) aguardando o provedor de imagens.',
        };
      }

      attempts++;
      try {
        const result = await provider.checkGenerationStatus(providerJobId);

        if (result.status === 'COMPLETED' && result.imageUrl) {
          return {
            success: true,
            imageUrl: result.imageUrl,
          };
        }

        if (result.status === 'FAILED') {
          return {
            success: false,
            errorMessage: result.errorMessage || 'Falha na geração informada pelo provedor.',
          };
        }

        // Aguarda o intervalo antes de checar novamente
        await new Promise((resolve) => setTimeout(resolve, intervalMs));
      } catch (err: any) {
        // Erros de rede temporários não abortam imediatamente
        await new Promise((resolve) => setTimeout(resolve, intervalMs));
      }
    }

    return {
      success: false,
      errorMessage: `Geração não finalizada após ${maxAttempts} tentativas.`,
    };
  }
}
