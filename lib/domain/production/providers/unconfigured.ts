import {
  GenerateImageParams,
  GenerationResult,
  ImageAnalysisResult,
} from '../types';
import { ImageGenerationProvider } from './image-generation-provider';

export class UnconfiguredImageProvider implements ImageGenerationProvider {
  name = 'unconfigured';

  isConfigured(): boolean {
    return false;
  }

  async analyzeImage(imageUrl: string): Promise<ImageAnalysisResult> {
    return {
      people_count: 1,
      face_detected: true,
      face_confidence: 0.95,
      framing: 'medium',
      orientation: 'portrait',
      lighting_quality: 'good',
      source_width: 1024,
      source_height: 1280,
      quality_issues: [],
      recommendation: 'proceed',
      identity_profile: {
        face_description: 'Provedor não configurado — análise de demonstração',
        hair_description: 'Cabelo natural conforme foto de referência',
        skin_description: 'Tom de pele conforme foto de referência',
        body_description: 'Proporções naturais',
        apparent_age: 'Adulto',
        distinctive_features: ['Traços originais'],
        source_image_reference: imageUrl,
      },
    };
  }

  async generateImage(params: GenerateImageParams): Promise<GenerationResult> {
    return {
      success: false,
      providerJobId: `unconfigured-job-${params.sessionId}-${params.photoIndex}`,
      errorMessage:
        'Motor de produção fotográfica não configurado. Para habilitar a produção automatizada, preencha as variáveis IMAGE_PROVIDER_API_KEY no arquivo .env.',
    };
  }

  async checkGenerationStatus(providerJobId: string): Promise<{
    status: 'COMPLETED' | 'PROCESSING' | 'FAILED';
    imageUrl?: string;
    errorMessage?: string;
  }> {
    return {
      status: 'FAILED',
      errorMessage: 'Provedor não configurado.',
    };
  }
}
