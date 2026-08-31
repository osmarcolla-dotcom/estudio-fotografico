'use client';

import { useState } from 'react';
import { ProducedPhoto, Order } from '@/lib/types';
import { CheckCircle2, Download, MessageSquare, AlertCircle, Eye, X, Sparkles, Check } from 'lucide-react';

interface ApprovalClientProps {
  order: Order;
  token: string;
  isApproved: boolean;
  photos: ProducedPhoto[];
}

export function ApprovalClient({
  order,
  token,
  isApproved: initialIsApproved,
  photos,
}: ApprovalClientProps) {
  const [isApproved, setIsApproved] = useState(initialIsApproved);
  const [selectedPhoto, setSelectedPhoto] = useState<ProducedPhoto | null>(null);
  const [revisionModalPhoto, setRevisionModalPhoto] = useState<ProducedPhoto | null>(null);
  const [revisionReason, setRevisionReason] = useState('Ajuste de enquadramento ou iluminação');
  const [revisionComment, setRevisionComment] = useState('');
  const [isSubmittingRevision, setIsSubmittingRevision] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Aprovar ensaio
  const handleApproveOrder = async () => {
    if (!confirm('Deseja confirmar a aprovação do seu ensaio fotográfico?')) return;
    setIsApproving(true);
    setFeedbackMessage(null);

    try {
      const res = await fetch(`/api/approval/${token}/approve`, {
        method: 'POST',
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Não foi possível aprovar o ensaio.');
      }

      setIsApproved(true);
      setFeedbackMessage({
        type: 'success',
        text: 'Seu ensaio foi aprovado com sucesso! Os arquivos em alta resolução já estão liberados para download.',
      });
    } catch (err: any) {
      setFeedbackMessage({ type: 'error', text: err.message });
    } finally {
      setIsApproving(false);
    }
  };

  // Solicitar ajuste em uma foto
  const handleSubmitRevision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revisionModalPhoto) return;

    setIsSubmittingRevision(true);
    setFeedbackMessage(null);

    try {
      const res = await fetch(`/api/approval/${token}/revision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          producedPhotoId: revisionModalPhoto.id,
          photoIndex: revisionModalPhoto.photo_index,
          reason: revisionReason,
          comment: revisionComment,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Falha ao registrar solicitação de ajuste.');
      }

      setFeedbackMessage({
        type: 'success',
        text: `Solicitação de ajuste para a Foto #${revisionModalPhoto.photo_index} enviada ao estúdio com sucesso!`,
      });
      setRevisionModalPhoto(null);
      setRevisionComment('');
    } catch (err: any) {
      setFeedbackMessage({ type: 'error', text: err.message });
    } finally {
      setIsSubmittingRevision(false);
    }
  };

  return (
    <div className="space-y-12">

      {/* Banner Superior de Feedback */}
      {feedbackMessage && (
        <div
          className={`p-4 rounded-2xl border text-sm flex items-center justify-between shadow-sm ${
            feedbackMessage.type === 'success'
              ? 'bg-[#315B52]/10 border-[#315B52] text-[#315B52]'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <div className="flex items-center gap-3">
            {feedbackMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0" />
            )}
            <span>{feedbackMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackMessage(null)}
            className="p-1 hover:opacity-75"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Cabeçalho do Ensaio */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ECE7DF] text-[#315B52] text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#C98576]" />
          <span>Prévia Exclusiva do Ensaio</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#17212B] tracking-tight">
          {isApproved ? 'Seu ensaio foi aprovado! 🎉' : 'Seu ensaio está pronto! 📸'}
        </h1>

        <p className="text-[#5E6973] text-sm sm:text-base leading-relaxed">
          {isApproved
            ? 'Agradecemos sua aprovação! Baixe abaixo as suas fotografias em resolução máxima.'
            : 'Confira as fotografias produzidas para você. Você pode visualizar cada foto em tamanho maior ou solicitar ajustes pontuais antes da aprovação final.'}
        </p>
      </div>

      {/* Galeria de Fotos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {photos.map((photo) => (
          <div
            key={photo.id || photo.photo_index}
            className="group relative bg-[#FFFDF9] rounded-3xl overflow-hidden border border-[#D9D1C2] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            {/* Imagem com Marca d'água / Preview */}
            <div className="relative aspect-[4/5] bg-[#17212B] overflow-hidden">
              <img
                src={photo.preview_storage_path}
                alt={`Fotografia ${photo.photo_index} do Ensaio`}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
              />

              {/* Tag de Índice da Foto */}
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#17212B]/80 backdrop-blur-sm border border-[#FFFDF9]/20 text-[11px] font-bold text-[#FFFDF9] uppercase tracking-wider">
                Foto #{photo.photo_index}
              </div>

              {/* Botão Flutuante de Zoom */}
              <button
                type="button"
                onClick={() => setSelectedPhoto(photo)}
                className="absolute bottom-3 right-3 p-2.5 rounded-full bg-[#17212B]/80 text-[#FFFDF9] hover:bg-[#315B52] transition-colors shadow-md"
                title="Ampliar visualização"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>

            {/* Ações da Foto */}
            <div className="p-4 bg-[#FFFDF9] border-t border-[#E6E1D8] space-y-3">
              <p className="text-xs text-[#5E6973] line-clamp-1">
                {photo.variation_description || `Composição ${photo.photo_index} com iluminação personalizada.`}
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPhoto(photo)}
                  className="flex-1 py-2 px-3 rounded-xl border border-[#D9D1C2] text-xs font-semibold uppercase tracking-wider text-[#17212B] hover:bg-[#ECE7DF] transition-colors flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Visualizar</span>
                </button>

                {!isApproved && (
                  <button
                    type="button"
                    onClick={() => setRevisionModalPhoto(photo)}
                    className="py-2 px-3 rounded-xl border border-[#C98576] text-xs font-semibold uppercase tracking-wider text-[#C98576] hover:bg-[#C98576]/10 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Ajuste</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bloco de Aprovação ou Download */}
      <div className="p-8 sm:p-12 rounded-3xl bg-[#17212B] text-[#FFFDF9] text-center max-w-2xl mx-auto shadow-2xl space-y-6">
        {!isApproved ? (
          <>
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-[#D9D1C2] font-semibold">
                Finalização do Ensaio
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold">
                Gostou do resultado?
              </h2>
              <p className="text-xs sm:text-sm text-[#D9D1C2]/80 max-w-md mx-auto leading-relaxed">
                Ao clicar em aprovar, liberamos imediatamente os arquivos em resolução máxima para você salvar e imprimir.
              </p>
            </div>

            <button
              type="button"
              disabled={isApproving}
              onClick={handleApproveOrder}
              className="w-full py-4 rounded-full bg-[#315B52] hover:bg-[#3d6d63] text-[#FFFDF9] text-sm font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#315B52]/30 transition-all transform active:scale-95 disabled:opacity-50"
            >
              {isApproving ? (
                <span>Aprovando ensaio...</span>
              ) : (
                <>
                  <Check className="w-5 h-5 text-[#D9D1C2]" />
                  <span>APROVAR ENSAIO E LIBERAR DOWNLOAD</span>
                </>
              )}
            </button>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#315B52] text-[#FFFDF9] flex items-center justify-center mx-auto mb-2">
                <Check className="w-6 h-6 text-[#D9D1C2]" />
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold">
                Seu ensaio foi aprovado!
              </h2>
              <p className="text-xs sm:text-sm text-[#D9D1C2]/80 max-w-md mx-auto">
                Clique no botão abaixo para baixar todas as fotografias em alta resolução.
              </p>
            </div>

            <a
              href={`/api/download/${token}`}
              download
              className="w-full py-4 rounded-full bg-[#C98576] hover:bg-[#b57365] text-[#FFFDF9] text-sm font-semibold uppercase tracking-wider inline-flex items-center justify-center gap-2 shadow-lg shadow-[#C98576]/30 transition-all transform active:scale-95"
            >
              <Download className="w-5 h-5" />
              <span>BAIXAR FOTOS EM ALTA RESOLUÇÃO</span>
            </a>
          </>
        )}
      </div>

      {/* Modal de Zoom da Foto */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-[#17212B]/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full bg-[#17212B] rounded-3xl overflow-hidden border border-[#D9D1C2]/20 shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-[#2C3844] text-[#FFFDF9]">
              <span className="font-serif text-lg font-bold">
                Fotografia #{selectedPhoto.photo_index}
              </span>
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="p-1 rounded-full hover:bg-[#2C3844] text-[#D9D1C2]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[75vh] overflow-hidden flex items-center justify-center bg-black">
              <img
                src={selectedPhoto.preview_storage_path}
                alt="Visualização ampliada"
                className="max-h-[75vh] w-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal de Solicitação de Ajuste */}
      {revisionModalPhoto && (
        <div className="fixed inset-0 z-50 bg-[#17212B]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-lg w-full bg-[#FFFDF9] rounded-3xl p-6 sm:p-8 border border-[#D9D1C2] shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#E6E1D8] mb-4">
              <h3 className="font-serif text-2xl font-bold text-[#17212B]">
                Solicitar Ajuste — Foto #{revisionModalPhoto.photo_index}
              </h3>
              <button
                type="button"
                onClick={() => setRevisionModalPhoto(null)}
                className="p-1 rounded-full hover:bg-[#ECE7DF] text-[#5E6973]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitRevision} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#17212B] mb-1.5">
                  Motivo Principal
                </label>
                <select
                  value={revisionReason}
                  onChange={(e) => setRevisionReason(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#D9D1C2] bg-[#F6F4EF] text-xs text-[#17212B] focus:ring-2 focus:ring-[#315B52]"
                >
                  <option value="Ajuste de iluminação ou contraste">Ajuste de iluminação ou contraste</option>
                  <option value="Alterar enquadramento ou ângulo">Alterar enquadramento ou ângulo</option>
                  <option value="Ajustar elementos do cenário">Ajustar elementos do cenário</option>
                  <option value="Expressão facial mais natural">Expressão facial mais natural</option>
                  <option value="Outro motivo">Outro motivo</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#17212B] mb-1.5">
                  Detalhes do ajuste desejado
                </label>
                <textarea
                  rows={4}
                  required
                  value={revisionComment}
                  onChange={(e) => setRevisionComment(e.target.value)}
                  placeholder="Ex: Gostaria que a iluminação ficasse um pouco mais quente ou com foco mais suave no fundo..."
                  className="w-full p-3 rounded-xl border border-[#D9D1C2] bg-[#F6F4EF] text-xs text-[#17212B] placeholder-[#5E6973]/50 focus:ring-2 focus:ring-[#315B52]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setRevisionModalPhoto(null)}
                  className="px-4 py-2.5 rounded-full border border-[#D9D1C2] text-xs font-semibold uppercase text-[#5E6973] hover:bg-[#ECE7DF]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingRevision}
                  className="px-6 py-2.5 rounded-full bg-[#17212B] hover:bg-[#315B52] text-[#FFFDF9] text-xs font-semibold uppercase tracking-wider shadow-md disabled:opacity-50"
                >
                  {isSubmittingRevision ? 'Enviando...' : 'Enviar Solicitação'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
