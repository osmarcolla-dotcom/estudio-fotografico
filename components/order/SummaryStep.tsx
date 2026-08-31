'use client';

import { Category, Package, Style } from '@/lib/types';
import { CustomerDataInput } from '@/lib/validation';
import { UploadedPhotoItem } from './PhotoUploadStep';
import { formatCurrencyBRL, formatWhatsApp } from '@/lib/utils';
import { ShieldCheck, Sparkles, CheckCircle2, User, Phone, Mail, Lock, Check } from 'lucide-react';

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
      <div className="text-center sm:text-left space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECE7DF] text-[#315B52] text-[11px] font-bold uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5 text-[#C98576]" />
          <span>Etapa Final • Confirmação</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#17212B]">
          Resumo do seu ensaio fotográfico
        </h2>
        <p className="text-xs sm:text-sm text-[#5E6973]">
          Confira os detalhes da sua produção antes de prosseguir para o pagamento seguro.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Detalhes do Ensaio e Cliente */}
        <div className="lg:col-span-7 space-y-5">

          {/* Card do Ensaio */}
          <div className="p-6 rounded-3xl bg-[#FFFDF9] border border-[#E6E1D8] shadow-sm space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#17212B] border-b border-[#E6E1D8] pb-3">
              Especificações da Produção
            </h3>

            <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
              <div>
                <span className="text-[#5E6973] text-[11px] uppercase tracking-wider font-semibold block">Tipo de Ensaio</span>
                <span className="font-bold text-[#17212B] text-base mt-0.5 block">{category?.name || 'Não selecionado'}</span>
              </div>
              <div>
                <span className="text-[#5E6973] text-[11px] uppercase tracking-wider font-semibold block">Estilo Visual</span>
                <span className="font-bold text-[#17212B] text-base mt-0.5 block">{style?.name || 'Não selecionado'}</span>
              </div>
              <div>
                <span className="text-[#5E6973] text-[11px] uppercase tracking-wider font-semibold block">Pacote Escolhido</span>
                <span className="font-bold text-[#17212B] text-base mt-0.5 block">{packageItem?.name || 'Não selecionado'}</span>
              </div>
              <div>
                <span className="text-[#5E6973] text-[11px] uppercase tracking-wider font-semibold block">Quantidade de Fotos</span>
                <span className="font-bold text-[#315B52] text-base mt-0.5 block">{packageItem?.photo_count} fotos em 8K</span>
              </div>
            </div>
          </div>

          {/* Dados do Cliente */}
          <div className="p-6 rounded-3xl bg-[#FFFDF9] border border-[#E6E1D8] shadow-sm space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#17212B] border-b border-[#E6E1D8] pb-3">
              Dados para Notificação & Entrega
            </h3>

            <div className="space-y-2.5 text-xs sm:text-sm text-[#17212B]">
              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4 text-[#5E6973]" />
                <span className="font-semibold">{customer.name}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#5E6973]" />
                <span>{formatWhatsApp(customer.whatsapp)}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#5E6973]" />
                <span>{customer.email}</span>
              </div>
            </div>
          </div>

          {/* Observações Opcionais */}
          <div className="p-6 rounded-3xl bg-[#FFFDF9] border border-[#E6E1D8] shadow-sm space-y-2">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#17212B]">
              Observações especiais para a produção (opcional)
            </label>
            <textarea
              rows={3}
              value={notes || ''}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder="Ex: Prefiro fotos com iluminação mais suave, ênfase no olhar..."
              className="w-full p-3.5 rounded-2xl border border-[#D9D1C2] bg-[#F6F4EF]/50 text-xs text-[#17212B] placeholder-[#5E6973]/50 focus:outline-none focus:ring-2 focus:ring-[#315B52]"
            />
          </div>

        </div>

        {/* Lado Direito: Foto de Referência e Pagamento */}
        <div className="lg:col-span-5 space-y-5">

          {/* Foto de Referência */}
          <div className="p-6 rounded-3xl bg-[#FFFDF9] border border-[#E6E1D8] shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-[#E6E1D8] pb-2.5">
              <h3 className="font-serif text-lg font-bold text-[#17212B]">
                Foto de Referência
              </h3>
              <span className="text-[11px] text-[#315B52] font-bold uppercase tracking-wider">Identidade Preservada</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {photos.map((p, i) => (
                <div key={i} className="rounded-2xl overflow-hidden aspect-[4/5] bg-[#17212B] border border-[#D9D1C2]">
                  <img src={p.previewUrl} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <p className="text-[11px] text-[#5E6973] leading-tight">
              Suas expressões, formato facial, olhar e cabelo serão mantidos na produção do ensaio.
            </p>
          </div>

          {/* Card de Investimento e Ação */}
          <div className="p-6 sm:p-7 rounded-3xl bg-[#17212B] text-[#FFFDF9] shadow-2xl space-y-5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#D9D1C2] block mb-1">
                Valor Total do Ensaio
              </span>
              <span className="font-serif text-4xl sm:text-5xl font-bold text-[#FFFDF9] tracking-tight">
                {packageItem ? formatCurrencyBRL(packageItem.price_cents) : 'R$ 0,00'}
              </span>
              <span className="text-[11px] text-[#D9D1C2]/80 block mt-1">
                Pagamento único via PIX ou Cartão
              </span>
            </div>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={onSubmit}
              className="w-full py-4 rounded-full bg-[#315B52] hover:bg-[#3d6d63] text-[#FFFDF9] text-xs sm:text-sm font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-[#315B52]/30 transition-all transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
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
              <span>Garantia de entrega em alta resolução</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
