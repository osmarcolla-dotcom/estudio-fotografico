'use client';

import { useState } from 'react';
import { PhotoJob, PhotoSession, ProductionLog } from '@/lib/domain/production/types';
import {
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  Sparkles,
  Eye,
  Sliders,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Zap,
} from 'lucide-react';

interface ProductionProgressTrackerProps {
  orderId: string;
  session?: PhotoSession | null;
  totalPhotos: number;
  onRefresh?: () => void;
}

export function ProductionProgressTracker({
  orderId,
  session: initialSession,
  totalPhotos,
  onRefresh,
}: ProductionProgressTrackerProps) {
  const [session, setSession] = useState<PhotoSession | null>(initialSession || null);
  const [isLoading, setIsLoading] = useState(false);
  const [retryingIndex, setRetryingIndex] = useState<number | null>(null);
  const [showIdentityProfile, setShowIdentityProfile] = useState(false);
  const [showShootPlan, setShowShootPlan] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Contagens para a barra de progresso
  const completedCount = session?.completed_photos || 0;
  const failedCount = session?.failed_photos || 0;
  const inProgressCount = (session?.photo_jobs || []).filter(
    (j) => j.status === 'GENERATING' || j.status === 'UPSCALING' || j.status === 'VALIDATING'
  ).length;
  const queuedCount = (session?.photo_jobs || []).filter((j) => j.status === 'QUEUED').length;

  const progressPercent = Math.round((completedCount / (session?.total_photos || totalPhotos || 6)) * 100);

  // Disparar início da produção
  const handleStartProduction = async () => {
    setIsLoading(true);
    setFeedback(null);

    try {
      const res = await fetch(`/api/admin/orders/${orderId}/session`, {
        method: 'POST',
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Falha ao iniciar produção.');
      }

      setSession(data.session);
      setFeedback('Esteira de produção fotográfica iniciada com sucesso!');
      if (onRefresh) onRefresh();
    } catch (err: any) {
      setFeedback(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Refazer uma foto individual
  const handleRetrySinglePhoto = async (photoIndex: number) => {
    setRetryingIndex(photoIndex);
    setFeedback(null);

    try {
      const res = await fetch(`/api/admin/orders/${orderId}/photo-job/${photoIndex}/retry`, {
        method: 'POST',
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Erro ao refazer fotografia.');
      }

      setFeedback(`Fotografia #${photoIndex} reenviada para produção!`);
      if (session) {
        const updatedJobs = session.photo_jobs.map((j) =>
          j.photo_index === photoIndex ? data.job : j
        );
        setSession({ ...session, photo_jobs: updatedJobs });
      }
    } catch (err: any) {
      setFeedback(err.message);
    } finally {
      setRetryingIndex(null);
    }
  };

  return (
    <div className="bg-[#FFFDF9] border border-[#E6E1D8] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">

      {/* Cabeçalho do Motor de Produção */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E6E1D8]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECE7DF] text-[#315B52] text-xs font-semibold uppercase tracking-wider mb-2">
            <Zap className="w-3.5 h-3.5 text-[#C98576]" />
            <span>Motor de Produção Fotográfica</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#17212B]">
            Status da Produção do Ensaio
          </h2>
          <p className="text-xs text-[#5E6973] mt-0.5">
            Pipeline automático com preservação facial, análise visual, 8K upscale e controle por fotografia.
          </p>
        </div>

        <button
          type="button"
          disabled={isLoading}
          onClick={handleStartProduction}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#17212B] hover:bg-[#315B52] text-[#FFFDF9] text-xs font-semibold uppercase tracking-wider transition-all shadow-sm disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{session ? 'Reiniciar Produção Completa' : 'Iniciar Produção Automática'}</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl bg-[#315B52]/10 border border-[#315B52] text-[#315B52] text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Barra de Progresso Visual (Ex: [████████░░] 80%) */}
      <div className="space-y-3 bg-[#F6F4EF] p-5 rounded-2xl border border-[#D9D1C2]">
        <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-[#17212B]">
          <div className="flex items-center gap-2">
            <span className="font-mono text-base">{progressPercent}% Concluído</span>
            <span className="text-[#5E6973] font-normal">
              ({completedCount} de {session?.total_photos || totalPhotos} fotos prontas)
            </span>
          </div>
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${
              session?.status === 'READY_FOR_REVIEW'
                ? 'bg-emerald-100 text-emerald-800'
                : session?.status === 'FAILED'
                ? 'bg-red-100 text-red-800'
                : 'bg-indigo-100 text-indigo-800'
            }`}
          >
            Status da Sessão: {session?.status || 'AGUARDANDO INÍCIO'}
          </span>
        </div>

        {/* Barra Gráfica */}
        <div className="w-full h-3.5 bg-[#D9D1C2] rounded-full overflow-hidden flex">
          <div
            className="bg-[#315B52] transition-all duration-500 h-full"
            style={{ width: `${progressPercent}%` }}
          />
          {inProgressCount > 0 && (
            <div
              className="bg-[#C98576] animate-pulse h-full"
              style={{ width: `${(inProgressCount / (session?.total_photos || totalPhotos)) * 100}%` }}
            />
          )}
        </div>

        {/* Métricas por Status */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
          <div className="flex items-center gap-2 text-[#315B52]">
            <CheckCircle2 className="w-4 h-4" />
            <span className="font-medium">{completedCount} Concluídas</span>
          </div>
          <div className="flex items-center gap-2 text-[#C98576]">
            <Clock className="w-4 h-4" />
            <span className="font-medium">{inProgressCount} Processando</span>
          </div>
          <div className="flex items-center gap-2 text-[#5E6973]">
            <Sliders className="w-4 h-4" />
            <span className="font-medium">{queuedCount} Na Fila</span>
          </div>
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="w-4 h-4" />
            <span className="font-medium">{failedCount} Falhas / Retry</span>
          </div>
        </div>
      </div>

      {/* Accordion: Perfil de Identidade Visual Extraído */}
      {session?.identity_profile && (
        <div className="border border-[#D9D1C2] rounded-2xl overflow-hidden">
          <button
            type="button"
            onClick={() => setShowIdentityProfile(!showIdentityProfile)}
            className="w-full p-4 bg-[#F6F4EF]/70 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#17212B] hover:bg-[#F6F4EF]"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#315B52]" />
              <span>Perfil de Identidade Visual Extraído (Preservação Facial)</span>
            </div>
            {showIdentityProfile ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showIdentityProfile && (
            <div className="p-5 bg-[#FFFDF9] text-xs space-y-3 border-t border-[#D9D1C2]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="font-bold text-[#17212B] block">Rosto & Estrutura:</span>
                  <p className="text-[#5E6973]">{session.identity_profile.face_description}</p>
                </div>
                <div>
                  <span className="font-bold text-[#17212B] block">Cabelo & Penteado:</span>
                  <p className="text-[#5E6973]">{session.identity_profile.hair_description}</p>
                </div>
                <div>
                  <span className="font-bold text-[#17212B] block">Pele & Textura:</span>
                  <p className="text-[#5E6973]">{session.identity_profile.skin_description}</p>
                </div>
                <div>
                  <span className="font-bold text-[#17212B] block">Traços Distintivos Preservados:</span>
                  <p className="text-[#5E6973]">{session.identity_profile.distinctive_features?.join(', ') || 'Nenhum'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Grid de PhotoJobs Individuais */}
      {session?.photo_jobs && session.photo_jobs.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold text-[#17212B]">
              Fotografias do Ensaio (Jobs Individuais)
            </h3>
            <span className="text-xs text-[#5E6973]">{session.photo_jobs.length} variações planejadas</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {session.photo_jobs.map((job) => {
              const isCompleted = job.status === 'COMPLETED';
              const isRetrying = retryingIndex === job.photo_index;

              return (
                <div
                  key={job.id}
                  className="bg-[#FFFDF9] border border-[#E6E1D8] rounded-2xl p-4 shadow-sm flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-serif text-lg font-bold text-[#17212B] block">
                        Foto #{job.photo_index}
                      </span>
                      <span className="text-[10px] text-[#315B52] font-semibold block uppercase">
                        {job.variation.framing}
                      </span>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        isCompleted
                          ? 'bg-emerald-50 text-emerald-800'
                          : job.status === 'FAILED'
                          ? 'bg-red-50 text-red-800'
                          : 'bg-indigo-50 text-indigo-800 animate-pulse'
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>

                  {/* Thumbnail da versão ativa se houver */}
                  {job.active_version?.preview_image_url && (
                    <div className="aspect-[4/5] rounded-xl overflow-hidden bg-[#17212B] relative">
                      <img
                        src={job.active_version.preview_image_url}
                        alt={`Foto ${job.photo_index}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-[#17212B]/80 rounded text-[9px] text-[#FFFDF9]">
                        v{job.active_version.version_number} • {job.active_version.final_width || 4096}x{job.active_version.final_height || 5120}
                      </div>
                    </div>
                  )}

                  <div className="text-[11px] text-[#5E6973] space-y-1">
                    <p className="line-clamp-2">
                      <strong>Cenário:</strong> {job.variation.setting_scene}
                    </p>
                    <p className="line-clamp-1">
                      <strong>Pose:</strong> {job.variation.pose_description}
                    </p>
                    {job.attempts > 0 && (
                      <p className="text-[10px] text-[#5E6973]">
                        Tentativas: {job.attempts}/{job.max_attempts}
                      </p>
                    )}
                  </div>

                  {/* Controles do Job */}
                  <div className="pt-2 border-t border-[#E6E1D8] flex items-center justify-between">
                    <button
                      type="button"
                      disabled={isRetrying}
                      onClick={() => handleRetrySinglePhoto(job.photo_index)}
                      className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-[#17212B] hover:text-[#315B52] transition-colors disabled:opacity-50"
                    >
                      <RotateCcw className={`w-3 h-3 ${isRetrying ? 'animate-spin' : ''}`} />
                      <span>{isRetrying ? 'Refazendo...' : 'Refazer Foto'}</span>
                    </button>

                    {job.versions && job.versions.length > 1 && (
                      <span className="text-[10px] text-[#5E6973] font-mono">
                        {job.versions.length} versões
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
