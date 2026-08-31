'use client';

import { Category, Package, Style } from '@/lib/types';
import { CustomerDataInput } from '@/lib/validation';
import { UploadedPhotoItem } from './PhotoUploadStep';
import { formatCurrencyBRL, formatWhatsApp } from '@/lib/utils';
import { ShieldCheck, Sparkles, CheckCircle2, User, Phone, Mail, Image as ImageIcon } from 'lucide-react';

interface SummaryStepProps {
  customer: CustomerDataInput;
  category?: Category;
  style?: Style;
  packageItem?: Package;
  photos: UploadedPhotoItem[];
  notes?: string;
  onNotesChange: (notes: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function SummaryStep({
  customer,
  category,
  style,
  packageItem,
  photos,
  notes,
  onNotesChange,
  onSubmit,
  isSubmitting,
}: SummaryStepProps) {
  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECE7DF] text-[#315B52] text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#C98576]" />
          <span>Revisão do Pedido</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#17212B] mb-2">
          Resumo do seu ensaio
        </h2>
        <p className="text-sm text-[#5E6973]">
          Confira todas as informações antes de prosseguir para o pagamento seguro.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Detalhes do Ensaio e Cliente */}
        <div className="lg:col-span-7 space-y-6">

          {/* Card do Ensaio */}
          <div className="p-6 rounded-3xl bg-[#FFFDF9] border border-[#D9D1C2] shadow-sm space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#17212B] border-b border-[#E6E1D8] pb-3">
              Detalhes da Produção
            </h3>

            <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
              <div>
                <span className="text-[#5E6973] block">Tipo de Ensaio</span>
                <span className="font-bold text-[#17212B] text-base">{category?.name || 'Não selecionado'}</span>
              </div>
              <div>
                <span className="text-[#5E6973] block">Estilo Visual</span>
                <span className="font-bold text-[#17212B] text-base">{style?.name || 'Não selecionado'}</span>
              </div>
              <div>
                <span className="text-[#5E6973] block">Pacote Escolhido</span>
                <span className="font-bold text-[#17212B] text-base">{packageItem?.name || 'Não selecionado'}</span>
              </div>
              <div>
                <span className="text-[#5E6973] block">Quantidade de Fotos</span>
                <span className="font-bold text-[#315B52] text-base">{packageItem?.photo_count} fotos em alta resolução</span>
              </div>
            </div>
          </div>

          {/* Dados do Cliente */}
          <div className="p-6 rounded-3xl bg-[#FFFDF9] border border-[#D9D1C2] shadow-sm space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#17212B] border-b border-[#E6E1D8] pb-3">
              Dados para Notificação e Entrega
            </h3>

            <div className="space-y-2 text-xs sm:text-sm text-[#17212B]">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#5E6973]" />
                <span className="font-medium">{customer.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#5E6973]" />
                <span>{formatWhatsApp(customer.whatsapp)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#5E6973]" />
                <span>{customer.email}</span>
              </div>
            </div>
          </div>

          {/* Observações Opcionais */}
          <div className="p-6 rounded-3xl bg-[#FFFDF9] border border-[#D9D1C2] shadow-sm space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#17212B]">
              Observações especiais para a produção (opcional)
            </label>
            <textarea
              rows={3}
              value={notes || ''}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder="Ex: Gostaria de dar ênfase na textura do vestido ou fotos com iluminação mais suave..."
              className="w-full p-3.5 rounded-xl border border-[#D9D1C2] bg-[#F6F4EF]/50 text-xs text-[#17212B] placeholder-[#5E6973]/50 focus:outline-none focus:ring-2 focus:ring-[#315B52]"
            />
          </div>

        </div>

        {/* Lado Direito: Fotos Enviadas e Totalização */}
        <div className="lg:col-span-5 space-y-6">

          {/* Galeria da Foto de Referência */}
          <div className="p-6 rounded-3xl bg-[#FFFDF9] border border-[#D9D1C2] shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#E6E1D8] pb-3">
              <h3 className="font-serif text-xl font-bold text-[#17212B]">
                Foto de Referência
              </h3>
              <span className="text-xs text-[#5E6973]">{photos.length} foto(s)</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {photos.map((p, i) => (
                <div key={i} className="rounded-xl overflow-hidden aspect-square bg-[#17212B] border border-[#D9D1C2]">
                  <img src={p.previewUrl} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <p className="text-[11px] text-[#5E6973]">
              Suas características físicas serão mantidas com fidelidade na produção.
            </p>
          </div>

          {/* Card de Investimento e Ação */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#17212B] text-[#FFFDF9] shadow-xl space-y-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#D9D1C2] block mb-1">
                Valor Total do Ensaio
              </span>
              <span className="font-serif text-4xl sm:text-5xl font-bold text-[#FFFDF9] tracking-tight">
                {packageItem ? formatCurrencyBRL(packageItem.price_cents) : 'R$ 0,00'}
              </span>
              <span className="text-xs text-[#D9D1C2]/80 block mt-1">
                Sem mensalidades ou cobranças surpresa
              </span>
            </div>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={onSubmit}
              className="w-full py-4 rounded-full bg-[#315B52] hover:bg-[#3d6d63] text-[#FFFDF9] text-xs sm:text-sm font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#315B52]/30 transition-all transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isSubmitting ? (
                <span>Iniciando pedido...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#D9D1C2]" />
                  <span>CONTINUAR PARA PAGAMENTO</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-[#D9D1C2]/70">
              <ShieldCheck className="w-4 h-4 text-[#315B52]" />
              <span>Garantia de aprovação antes da entrega final</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
