import {
  GenerateImageParams,
  GenerationResult,
  IdentityProfile,
  ImageAnalysisResult,
  ShootPlan,
} from '../types';

/**
 * Interface abstrata independente de qualquer fornecedor específico
 * (Replicate, Fal.ai, ComfyUI, Midjourney API, etc.)
 */
export interface ImageGenerationProvider {
  name: string;
  isConfigured(): boolean;

  /**
   * 1. Analisa a foto original e extrai o IdentityProfile e parâmetros técnicos
   */
  analyzeImage(imageUrl: string): Promise<ImageAnalysisResult>;

  /**
   * 2. Gera uma fotografia individual com base no prompt, imagem de referência e parâmetros
   */
  generateImage(params: GenerateImageParams): Promise<GenerationResult>;

  /**
   * 3. Verifica o status de uma geração assíncrona
   */
  checkGenerationStatus(providerJobId: string): Promise<{
    status: 'COMPLETED' | 'PROCESSING' | 'FAILED';
    imageUrl?: string;
    errorMessage?: string;
  }>;
}
