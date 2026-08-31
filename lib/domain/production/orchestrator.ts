import {
  IdentityProfile,
  ImageAnalysisResult,
  PhotoJob,
  PhotoSession,
  PhotoSessionStatus,
  ShootPlan,
} from './types';
import { ImageGenerationProvider } from './providers/image-generation-provider';
import { ImageUpscaleProvider } from './providers/image-upscale-provider';
import { ExternalImageGenerationProvider } from './providers/external-provider';
import { ExternalImageUpscaleProvider } from './providers/external-upscale-provider';
import { MockDevImageProvider } from './providers/dev-mock-provider';
import { PromptEngine } from './engine/prompt-engine';
import { JobQueue } from './queue/job-queue';
import { PollingWorker } from './queue/polling-worker';
import { createAdminClient } from '@/lib/supabase/admin';
import { NotificationService } from '../notifications/service';

export interface ProductionPipelineOptions {
  sessionId?: string;
  orderId: string;
  customerId: string;
  categorySlug: string;
  styleSlug: string;
  photoCount: number;
  sourceImageUrl: string;
  targetResolution?: '4K' | '8K' | 'UHD';
}

export class ProductionOrchestrator {
  private static sessionsMap = new Map<string, PhotoSession>();

  /**
   * Resolve os adapters de geração e upscale com base na configuração do ambiente
   */
  private static getProviders(): {
    generationProvider: ImageGenerationProvider;
    upscaleProvider: ImageUpscaleProvider;
  } {
    const isConfigured = Boolean(
      (process.env.IMAGE_PROVIDER_API_KEY && process.env.IMAGE_PROVIDER_API_KEY.trim().length > 10) ||
      (process.env.REPLICATE_API_TOKEN && process.env.REPLICATE_API_TOKEN.trim().length > 10)
    );

    if (isConfigured) {
      return {
        generationProvider: new ExternalImageGenerationProvider(),
        upscaleProvider: new ExternalImageUpscaleProvider(),
      };
    }

    // Modo de desenvolvimento / mock de alta fidelidade sem custos
    const mock = new MockDevImageProvider();
    return {
      generationProvider: mock,
      upscaleProvider: mock,
    };
  }

  /**
   * Obtém ou inicializa a sessão em memória / Supabase
   */
  static async getSession(sessionId: string): Promise<PhotoSession | null> {
    if (this.sessionsMap.has(sessionId)) {
      return this.sessionsMap.get(sessionId)!;
    }

    const supabase = createAdminClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('photo_sessions')
          .select('*, photo_jobs(*, versions:photo_versions(*))')
          .eq('id', sessionId)
          .maybeSingle();

        if (!error && data) {
          return data as unknown as PhotoSession;
        }
      } catch {
        // Fallback para memória
      }
    }

    return null;
  }

  /**
   * Salva o estado da sessão
   */
  private static async saveSession(session: PhotoSession): Promise<void> {
    this.sessionsMap.set(session.id, session);

    const supabase = createAdminClient();
    if (supabase) {
      try {
        await supabase.from('photo_sessions').upsert({
          id: session.id,
          order_id: session.order_id,
          customer_id: session.customer_id,
          category_slug: session.category_slug,
          style_slug: session.style_slug,
          package_photo_count: session.package_photo_count,
          identity_profile: session.identity_profile,
          shoot_plan: session.shoot_plan,
          status: session.status,
          total_photos: session.total_photos,
          completed_photos: session.completed_photos,
          failed_photos: session.failed_photos,
          error_message: session.error_message || null,
          started_at: session.started_at,
          completed_at: session.completed_at,
          updated_at: new Date().toISOString(),
        });
      } catch {
        // Silencioso se migration ainda não tiver sido rodada
      }
    }
  }

  /**
   * Pipeline Completo de Produção do Ensaio Fotográfico:
   * 1. ANALYZING: Análise da imagem original -> extração de IdentityProfile
   * 2. PLANNING: Construção do ShootPlan com variações distintas (PromptEngine)
   * 3. GENERATING: Execução de N PhotoJobs independentes com retry e validação
   * 4. PREVIEW_READY / READY_FOR_REVIEW: Fotos finalizadas e separadas em preview/final
   */
  static async runFullProductionPipeline(
    options: ProductionPipelineOptions
  ): Promise<PhotoSession> {
    const {
      orderId,
      customerId,
      categorySlug,
      styleSlug,
      photoCount,
      sourceImageUrl,
      targetResolution = '8K',
    } = options;

    const sessionId = options.sessionId || `session-${orderId}-${Date.now()}`;
    const { generationProvider, upscaleProvider } = this.getProviders();

    // 1. Inicializar Sessão
    const session: PhotoSession = {
      id: sessionId,
      order_id: orderId,
      customer_id: customerId,
      category_slug: categorySlug,
      style_slug: styleSlug,
      package_photo_count: photoCount,
      status: 'ANALYZING',
      total_photos: photoCount,
      completed_photos: 0,
      failed_photos: 0,
      photo_jobs: [],
      started_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await this.saveSession(session);
    await JobQueue.logEvent(sessionId, 'ANALYZE', 'STARTED', {
      provider: generationProvider.name,
    });

    try {
      // 2. ETAPA DE ANÁLISE VISUAL (IdentityProfile)
      const analysis: ImageAnalysisResult = await generationProvider.analyzeImage(sourceImageUrl);
      session.identity_profile = analysis.identity_profile;
      session.status = 'PLANNING';
      await this.saveSession(session);

      await JobQueue.logEvent(sessionId, 'PLAN', 'STARTED');

      // 3. ETAPA DE PLANEJAMENTO DO ENSAIO (ShootPlan)
      const shootPlan: ShootPlan = PromptEngine.buildShootPlan(
        categorySlug,
        styleSlug,
        photoCount
      );
      session.shoot_plan = shootPlan;

      // 4. CRIAÇÃO DOS N PHOTO JOBS INDEPENDENTES
      session.photo_jobs = shootPlan.variations.map((variation) => ({
        id: `job-${sessionId}-${variation.photo_index}`,
        session_id: sessionId,
        photo_index: variation.photo_index,
        status: 'QUEUED',
        variation,
        attempts: 0,
        max_attempts: 3,
        versions: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));

      session.status = 'GENERATING';
      await this.saveSession(session);

      // 5. EXECUÇÃO DOS PHOTO JOBS COM POLLING CONTROLADO QUANDO NECESSÁRIO
      for (const job of session.photo_jobs) {
        await JobQueue.processPhotoJob({
          sessionId,
          sourceImageUrl,
          identityProfile: session.identity_profile,
          categorySlug,
          styleSlug,
          job,
          generationProvider,
          upscaleProvider,
          targetResolution,
        });

        // Se o provedor gerou de forma assíncrona sem webhook direto
        if (job.status === 'GENERATING' && job.provider_job_id) {
          const pollResult = await PollingWorker.waitForCompletion({
            providerJobId: job.provider_job_id,
            provider: generationProvider,
          });

          if (pollResult.success && pollResult.imageUrl) {
            job.status = 'COMPLETED';
          }
        }

        // Atualiza contadores
        session.completed_photos = session.photo_jobs.filter(
          (j) => j.status === 'COMPLETED'
        ).length;
        session.failed_photos = session.photo_jobs.filter(
          (j) => j.status === 'FAILED'
        ).length;

        await this.saveSession(session);
      }

      // 6. FINALIZAÇÃO DA PRODUÇÃO
      if (session.completed_photos === session.total_photos) {
        session.status = 'READY_FOR_REVIEW';
        session.completed_at = new Date().toISOString();
      } else if (session.failed_photos > 0) {
        session.status = 'FAILED';
        session.error_message = `${session.failed_photos} foto(s) falharam na geração após 3 tentativas.`;
      } else {
        session.status = 'PREVIEW_READY';
      }

      await this.saveSession(session);

      // 7. Salvar fotos produzidas na tabela de fotos do pedido
      const supabase = createAdminClient();
      if (supabase) {
        const producedPhotosPayload = session.photo_jobs
          .filter((j) => j.active_version)
          .map((j) => ({
            order_id: orderId,
            photo_index: j.photo_index,
            preview_storage_path: j.active_version!.preview_storage_path || j.active_version!.raw_image_url!,
            final_storage_path: j.active_version!.final_storage_path || j.active_version!.upscaled_image_url!,
            variation_description: `${j.variation.framing} — ${j.variation.pose_description}`,
            is_approved: false,
          }));

        if (producedPhotosPayload.length > 0) {
          await supabase
            .from('produced_photos')
            .upsert(producedPhotosPayload, { onConflict: 'order_id, photo_index' });
        }

        // Se concluído, atualizar status do pedido para READY_FOR_APPROVAL
        if (session.status === 'READY_FOR_REVIEW') {
          await supabase
            .from('orders')
            .update({ status: 'READY_FOR_APPROVAL', updated_at: new Date().toISOString() })
            .eq('id', orderId);
        }
      }

      return session;
    } catch (err: any) {
      session.status = 'FAILED';
      session.error_message = err.message || 'Erro fatal no pipeline de produção.';
      await this.saveSession(session);
      return session;
    }
  }

  /**
   * Refaz uma única fotografia específica da sessão (sem reprocessar o ensaio todo)
   */
  static async retrySinglePhoto(
    sessionId: string,
    photoIndex: number,
    sourceImageUrl: string
  ): Promise<PhotoJob | null> {
    const session = await this.getSession(sessionId);
    if (!session || !session.identity_profile) return null;

    const job = session.photo_jobs.find((j) => j.photo_index === photoIndex);
    if (!job) return null;

    const { generationProvider, upscaleProvider } = this.getProviders();

    job.attempts = 0; // Reseta tentativas para retry explícito
    job.status = 'QUEUED';

    await JobQueue.logEvent(sessionId, 'REVISION', 'STARTED', {
      photoJobId: job.id,
      photoIndex,
    });

    const updatedJob = await JobQueue.processPhotoJob({
      sessionId,
      sourceImageUrl,
      identityProfile: session.identity_profile,
      categorySlug: session.category_slug,
      styleSlug: session.style_slug,
      job,
      generationProvider,
      upscaleProvider,
    });

    // Atualiza contadores da sessão
    session.completed_photos = session.photo_jobs.filter(
      (j) => j.status === 'COMPLETED'
    ).length;
    session.failed_photos = session.photo_jobs.filter(
      (j) => j.status === 'FAILED'
    ).length;

    if (session.completed_photos === session.total_photos) {
      session.status = 'READY_FOR_REVIEW';
    }

    await this.saveSession(session);
    return updatedJob;
  }
}
