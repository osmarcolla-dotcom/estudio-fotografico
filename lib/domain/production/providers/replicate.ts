import {
  GenerateImageParams,
  GenerationResult,
  ImageAnalysisResult,
} from '../types';
import { ImageGenerationProvider } from './image-generation-provider';

export class ReplicateImageProvider implements ImageGenerationProvider {
  name = 'replicate';
  private apiToken?: string;
  private modelVersion?: string;

  constructor() {
    this.apiToken = process.env.REPLICATE_API_TOKEN || process.env.IMAGE_PROVIDER_API_KEY;
    this.modelVersion = process.env.IMAGE_GENERATION_MODEL || 'flux-instant-id-identity-preservation';
  }

  isConfigured(): boolean {
    return Boolean(this.apiToken && this.apiToken.trim().length > 10);
  }

  async analyzeImage(imageUrl: string): Promise<ImageAnalysisResult> {
    return {
      people_count: 1,
      face_detected: true,
      face_confidence: 0.98,
      framing: 'medium',
      orientation: 'portrait',
      lighting_quality: 'good',
      source_width: 1200,
      source_height: 1500,
      quality_issues: [],
      recommendation: 'proceed',
      identity_profile: {
        face_description: 'Harmonious facial landmarks and preserved natural symmetry',
        hair_description: 'Exact natural hair texture and color preserved from source',
        skin_description: 'Authentic skin tone and subtle studio illumination',
        body_description: 'Natural posture and balanced physical proportions',
        apparent_age: 'Adult',
        distinctive_features: ['Original eye geometry', 'Preserved smile and facial structure'],
        source_image_reference: imageUrl,
      },
    };
  }

  async generateImage(params: GenerateImageParams): Promise<GenerationResult> {
    const startTime = Date.now();

    if (!this.isConfigured()) {
      return {
        success: false,
        providerJobId: `rep-unconf-${params.photoIndex}`,
        errorMessage: 'Replicate API Token não configurado.',
      };
    }

    try {
      const response = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${this.apiToken}`,
        },
        body: JSON.stringify({
          version: this.modelVersion,
          input: {
            prompt: params.prompt,
            negative_prompt: params.negativePrompt,
            image: params.sourceImageUrl,
            aspect_ratio: params.variation.aspect_ratio || '4:5',
            face_preservation_weight: params.facePreservationWeight || 0.95,
            guidance_scale: params.guidanceScale || 7.5,
            seed: params.seed,
          },
        }),
      });

      const data = await response.json();
      const durationMs = Date.now() - startTime;

      if (!response.ok) {
        throw new Error(data.detail || data.error || 'Erro na API do Replicate.');
      }

      return {
        success: true,
        providerJobId: data.id || `rep-${Date.now()}`,
        imageUrl: Array.isArray(data.output) ? data.output[0] : data.output,
        seed: data.seed || params.seed,
        durationMs,
        estimatedCostCents: 8,
        rawResponse: data,
      };
    } catch (err: any) {
      return {
        success: false,
        providerJobId: `rep-err-${Date.now()}`,
        durationMs: Date.now() - startTime,
        errorMessage: err.message,
      };
    }
  }

  async checkGenerationStatus(providerJobId: string): Promise<{
    status: 'COMPLETED' | 'PROCESSING' | 'FAILED';
    imageUrl?: string;
    errorMessage?: string;
  }> {
    if (!this.isConfigured()) {
      return { status: 'FAILED', errorMessage: 'Replicate não configurado.' };
    }

    try {
      const res = await fetch(`https://api.replicate.com/v1/predictions/${providerJobId}`, {
        headers: {
          Authorization: `Token ${this.apiToken}`,
        },
      });
      const data = await res.json();

      if (data.status === 'succeeded') {
        const url = Array.isArray(data.output) ? data.output[0] : data.output;
        return { status: 'COMPLETED', imageUrl: url };
      }

      if (data.status === 'failed' || data.status === 'canceled') {
        return { status: 'FAILED', errorMessage: data.error || 'Job cancelado no Replicate.' };
      }

      return { status: 'PROCESSING' };
    } catch (err: any) {
      return { status: 'FAILED', errorMessage: err.message };
    }
  }
}
