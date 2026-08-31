import {
  GenerateImageParams,
  GenerationResult,
  ImageAnalysisResult,
  UpscaleParams,
  UpscaleResult,
} from '../types';
import { ImageGenerationProvider } from './image-generation-provider';
import { ImageUpscaleProvider } from './image-upscale-provider';

const SAMPLE_PHOTO_LIBRARY = [
  'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=1200&q=85',
];

export class MockDevImageProvider implements ImageGenerationProvider, ImageUpscaleProvider {
  name = 'mock-dev-provider';

  isConfigured(): boolean {
    return true;
  }

  async analyzeImage(imageUrl: string): Promise<ImageAnalysisResult> {
    // Simula delay de análise visual inteligente
    await new Promise((resolve) => setTimeout(resolve, 80));

    return {
      people_count: 1,
      face_detected: true,
      face_confidence: 0.99,
      framing: 'medium',
      orientation: 'portrait',
      lighting_quality: 'good',
      source_width: 1200,
      source_height: 1500,
      quality_issues: [],
      recommendation: 'proceed',
      identity_profile: {
        face_description: 'Harmonious oval face shape, sharp cheekbones, balanced proportions and natural studio look',
        hair_description: 'Natural texture, color and length matching the uploaded reference photograph',
        skin_description: 'Uniform natural skin tone with realistic pores and soft studio highlight reflection',
        body_description: 'Graceful posture and balanced physical proportions',
        apparent_age: 'Adult',
        distinctive_features: ['Preserved eye geometry and iris color', 'Authentic facial landmark alignment'],
        source_image_reference: imageUrl,
        face_landmarks_summary: '68 landmarks mapped, high symmetry score (0.97)',
        lighting_in_source: 'Directional soft natural light',
      },
    };
  }

  async generateImage(params: GenerateImageParams): Promise<GenerationResult> {
    const startTime = Date.now();
    await new Promise((resolve) => setTimeout(resolve, 150));

    const sampleIndex = (params.photoIndex - 1) % SAMPLE_PHOTO_LIBRARY.length;
    const imageUrl = SAMPLE_PHOTO_LIBRARY[sampleIndex];

    return {
      success: true,
      providerJobId: `mock-job-${params.sessionId}-${params.photoIndex}-${Date.now()}`,
      imageUrl,
      seed: params.seed || Math.floor(100000 + Math.random() * 900000),
      durationMs: Date.now() - startTime,
      estimatedCostCents: 6,
    };
  }

  async checkGenerationStatus(providerJobId: string): Promise<{
    status: 'COMPLETED' | 'PROCESSING' | 'FAILED';
    imageUrl?: string;
  }> {
    return {
      status: 'COMPLETED',
      imageUrl: SAMPLE_PHOTO_LIBRARY[0],
    };
  }

  async upscaleImage(params: UpscaleParams): Promise<UpscaleResult> {
    const startTime = Date.now();
    await new Promise((resolve) => setTimeout(resolve, 100));

    const scale = params.targetResolution === '8K' ? 4 : 2;
    return {
      success: true,
      upscaledUrl: params.imageUrl,
      sourceWidth: 1024,
      sourceHeight: 1280,
      finalWidth: 1024 * scale,
      finalHeight: 1280 * scale,
      provider: this.name,
      model: 'clarity-upscaler-v2',
      durationMs: Date.now() - startTime,
    };
  }
}
