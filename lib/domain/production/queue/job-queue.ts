import {
  GenerateImageParams,
  IdentityProfile,
  PhotoJob,
  PhotoVariation,
  PhotoVersion,
  ProductionLog,
  ShootPlan,
} from '../types';
import { ImageGenerationProvider } from '../providers/image-generation-provider';
import { ImageUpscaleProvider } from '../providers/image-upscale-provider';
import { PromptEngine } from '../engine/prompt-engine';
import { PhotoValidator } from '../engine/validator';
import { createAdminClient } from '@/lib/supabase/admin';

export interface ProcessJobOptions {
  sessionId: string;
  sourceImageUrl: string;
  identityProfile: IdentityProfile;
  categorySlug: string;
  styleSlug: string;
  job: PhotoJob;
  generationProvider: ImageGenerationProvider;
  upscaleProvider: ImageUpscaleProvider;
  targetResolution?: '4K' | '8K' | 'UHD';
}

export class JobQueue {
  private static logs: ProductionLog[] = [];

  /**
   * Registra log estruturado de observabilidade (banco de dados ou memória)
   */
  static async logEvent(
    sessionId: string,
    operation: ProductionLog['operation'],
    status: ProductionLog['status'],
    options?: {
      photoJobId?: string;
      photoIndex?: number;
      provider?: string;
      durationMs?: number;
      error?: string | null;
      metadata?: Record<string, unknown>;
    }
  ): Promise<void> {
    const logItem: ProductionLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      session_id: sessionId,
      photo_job_id: options?.photoJobId,
      photo_index: options?.photoIndex,
      provider: options?.provider || 'engine',
      operation,
      status,
      duration_ms: options?.durationMs,
      error: options?.error,
      metadata: options?.metadata,
      created_at: new Date().toISOString(),
    };

    this.logs.unshift(logItem);
    if (this.logs.length > 200) this.logs.pop();

    const supabase = createAdminClient();
    if (supabase) {
      try {
        await supabase.from('production_logs').insert({
          session_id: sessionId,
          photo_job_id: options?.photoJobId || null,
          photo_index: options?.photoIndex || null,
          provider: options?.provider || 'engine',
          operation,
          status,
          duration_ms: options?.durationMs || null,
          error: options?.error || null,
          metadata: options?.metadata || {},
        });
      } catch {
        // Silencioso se a tabela ainda não existir
      }
    }
  }

  static getLogsBySession(sessionId: string): ProductionLog[] {
    return this.logs.filter((l) => l.session_id === sessionId);
  }

  /**
   * Processa uma fotografia individual (PhotoJob) com:
   * 1. Verificação de Idempotência (evita reprocessamento indevido)
   * 2. Montagem de Prompt com PromptEngine (Identidade > Estilo > Variação)
   * 3. Chamada ao Provedor de Geração com Retry automático (até 3 tentativas)
   * 4. Validação técnica de integridade e resolução
   * 5. Upscale em alta resolução (4K / 8K) com ImageUpscaleProvider
   * 6. Criação de nova versão versionada (v1, v2, v3)
   */
  static async processPhotoJob(options: ProcessJobOptions): Promise<PhotoJob> {
    const {
      sessionId,
      sourceImageUrl,
      identityProfile,
      categorySlug,
      styleSlug,
      job,
      generationProvider,
      upscaleProvider,
      targetResolution = '8K',
    } = options;

    const startTime = Date.now();

    // 1. Idempotência: se o job já possui versão ativa completada e válida, não reexecutar
    if (job.status === 'COMPLETED' && job.active_version && job.active_version.final_storage_path) {
      return job;
    }

    job.status = 'GENERATING';
    const currentAttempt = (job.attempts || 0) + 1;
    job.attempts = currentAttempt;

    await this.logEvent(sessionId, 'GENERATE', 'STARTED', {
      photoJobId: job.id,
      photoIndex: job.photo_index,
      provider: generationProvider.name,
      metadata: { attempt: currentAttempt },
    });

    try {
      // 2. Construção determinística de prompt
      const { prompt, negativePrompt } = PromptEngine.buildImagePrompt({
        identityProfile,
        categorySlug,
        styleSlug,
        variation: job.variation,
      });

      // 3. Execução da geração com retry controlado
      const generateParams: GenerateImageParams = {
        sessionId,
        photoJobId: job.id,
        photoIndex: job.photo_index,
        prompt,
        negativePrompt,
        sourceImageUrl,
        identityProfile,
        variation: job.variation,
        facePreservationWeight: 0.95,
      };

      let genResult = await generationProvider.generateImage(generateParams);

      // Retry automático imediato se a primeira tentativa falhar
      if (!genResult.success && currentAttempt < job.max_attempts) {
        await this.logEvent(sessionId, 'RETRY', 'RETRYING', {
          photoJobId: job.id,
          photoIndex: job.photo_index,
          provider: generationProvider.name,
          error: genResult.errorMessage,
        });

        // Espera curta antes do retry
        await new Promise((r) => setTimeout(r, 200));
        genResult = await generationProvider.generateImage(generateParams);
      }

      if (!genResult.success || !genResult.imageUrl) {
        throw new Error(genResult.errorMessage || 'Falha na geração da imagem pelo provedor.');
      }

      // 4. Validação técnica da imagem gerada
      job.status = 'VALIDATING';
      await this.logEvent(sessionId, 'VALIDATE', 'STARTED', {
        photoJobId: job.id,
        photoIndex: job.photo_index,
      });

      const validation = PhotoValidator.validateGeneratedImage({
        imageUrl: genResult.imageUrl,
        expectedAspectRatio: job.variation.aspect_ratio || '4:5',
      });

      if (!validation.isValid) {
        throw new Error(`Imagem reprovada na validação técnica: ${validation.issues.join(', ')}`);
      }

      // 5. Upscale para alta resolução (4K/8K)
      job.status = 'UPSCALING';
      await this.logEvent(sessionId, 'UPSCALE', 'STARTED', {
        photoJobId: job.id,
        photoIndex: job.photo_index,
        provider: upscaleProvider.name,
      });

      const upscaleResult = await upscaleProvider.upscaleImage({
        imageUrl: genResult.imageUrl,
        targetResolution,
      });

      const finalImageUrl = upscaleResult.upscaledUrl || genResult.imageUrl;
      const previewImageUrl = genResult.imageUrl; // Preview usa a versão leve gerada

      // 6. Criação de nova versão da fotografia
      const nextVersionNumber = (job.versions?.length || 0) + 1;
      const newVersion: PhotoVersion = {
        id: `ver-${job.id}-${nextVersionNumber}-${Date.now()}`,
        photo_job_id: job.id,
        version_number: nextVersionNumber,
        prompt_used: prompt,
        raw_image_url: genResult.imageUrl,
        upscaled_image_url: finalImageUrl,
        preview_image_url: previewImageUrl,
        final_storage_path: `final-images/${sessionId}/photo_${job.photo_index}_v${nextVersionNumber}.jpg`,
        preview_storage_path: previewImageUrl,
        source_width: upscaleResult.sourceWidth,
        source_height: upscaleResult.sourceHeight,
        final_width: upscaleResult.finalWidth,
        final_height: upscaleResult.finalHeight,
        upscale_provider: upscaleResult.provider,
        upscale_model: upscaleResult.model,
        is_active: true,
        created_at: new Date().toISOString(),
      };

      // Desativa versões antigas
      if (job.versions) {
        job.versions.forEach((v) => (v.is_active = false));
      } else {
        job.versions = [];
      }

      job.versions.push(newVersion);
      job.active_version = newVersion;
      job.status = 'COMPLETED';
      job.duration_ms = Date.now() - startTime;
      job.generation_cost_cents = genResult.estimatedCostCents || 8;
      job.provider_job_id = genResult.providerJobId;
      job.provider_name = generationProvider.name;
      job.last_error = null;
      job.updated_at = new Date().toISOString();

      await this.logEvent(sessionId, 'GENERATE', 'SUCCESS', {
        photoJobId: job.id,
        photoIndex: job.photo_index,
        durationMs: job.duration_ms,
        provider: generationProvider.name,
      });

      return job;
    } catch (err: any) {
      job.last_error = err.message || 'Erro no processamento da foto';
      job.duration_ms = Date.now() - startTime;
      job.updated_at = new Date().toISOString();

      if (job.attempts >= job.max_attempts) {
        job.status = 'FAILED';
      } else {
        job.status = 'QUEUED'; // Fica disponível para nova tentativa
      }

      await this.logEvent(sessionId, 'GENERATE', 'FAILED', {
        photoJobId: job.id,
        photoIndex: job.photo_index,
        error: job.last_error,
        durationMs: job.duration_ms,
      });

      return job;
    }
  }
}
