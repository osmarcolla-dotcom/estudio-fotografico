'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Order, OrderStatus } from '@/lib/types';
import { formatCurrencyBRL, formatDateBR, formatWhatsApp } from '@/lib/utils';
import {
  ArrowLeft,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  Send,
  Camera,
  User,
  Phone,
  Mail,
  Calendar,
  Layers,
  Image as ImageIcon,
  MessageSquare,
  AlertCircle,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { ProductionProgressTracker } from './ProductionProgressTracker';

interface OrderDetailClientProps {
  order: Order;
}

const ALL_STATUSES: Array<{ value: OrderStatus; label: string }> = [
  { value: 'PENDING_PAYMENT', label: 'Aguardando Pagamento' },
  { value: 'PAID', label: 'Pagamento Confirmado' },
  { value: 'PRODUCTION_QUEUED', label: 'Fila de Produção' },
  { value: 'IN_PRODUCTION', label: 'Em Produção' },
  { value: 'READY_FOR_APPROVAL', label: 'Aguardando Aprovação' },
  { value: 'REVISION_REQUESTED', label: 'Ajuste Solicitado' },
  { value: 'APPROVED', label: 'Aprovado pelo Cliente' },
  { value: 'COMPLETED', label: 'Concluído & Entregue' },
  { value: 'CANCELLED', label: 'Cancelado' },
];

export function OrderDetailClient({ order: initialOrder }: OrderDetailClientProps) {
  const router = useRouter();
  const [order, setOrder] = useState<Order>(initialOrder);
  const [status, setStatus] = useState<OrderStatus>(initialOrder.status);
  const [notes, setNotes] = useState<string>(initialOrder.notes || '');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const approvalToken = order.approval_link?.token || `token-${order.id.slice(0, 8)}`;
  const approvalUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/ensaio/${approvalToken}`
    : `/ensaio/${approvalToken}`;

  const copyApprovalLink = () => {
    navigator.clipboard.writeText(approvalUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleUpdateStatus = async () => {
    setIsUpdatingStatus(true);
    setFeedback(null);

    try {
      const res = await fetch(`/api/admin/orders/${order.id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Falha ao atualizar status.');
      }

      setFeedback({ type: 'success', text: data.message });
      setOrder((prev) => ({ ...prev, status, notes }));
      router.refresh();
    } catch (err: any) {
      setFeedback({ type: 'error', text: err.message });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleStartProduction = async () => {
    if (!confirm('Deseja iniciar ou reenviar o processamento deste ensaio fotográfico?')) return;
    setIsProcessing(true);
    setFeedback(null);

    try {
      const res = await fetch(`/api/admin/orders/${order.id}/process`, {
        method: 'POST',
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Erro ao iniciar produção.');
      }

      setFeedback({ type: 'success', text: data.message });
      setOrder((prev) => ({ ...prev, status: 'IN_PRODUCTION' }));
      setStatus('IN_PRODUCTION');
      router.refresh();
    } catch (err: any) {
      setFeedback({ type: 'error', text: err.message });
    } finally {
      setIsProcessing(false);
    }
  };

  const openWhatsAppCustomer = () => {
    const rawPhone = order.customer?.whatsapp.replace(/\D/g, '') || '';
    const phoneWithDDI = rawPhone.startsWith('55') ? rawPhone : `55${rawPhone}`;
    const text = encodeURIComponent(
      `Olá, ${order.customer?.name}! Aqui é do Estúdio Fotográfico Digital sobre o seu pedido ${order.order_number}.\n\nSeu link exclusivo para visualizar o ensaio:\n${approvalUrl}`
    );
    window.open(`https://wa.me/${phoneWithDDI}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-8">

      {/* Navegação Superior */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#5E6973] hover:text-[#17212B] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para Lista de Pedidos</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={copyApprovalLink}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#D9D1C2] bg-[#FFFDF9] text-xs font-semibold uppercase tracking-wider text-[#17212B] hover:bg-[#ECE7DF] transition-colors"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-[#315B52]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Copiado!' : 'Copiar Link do Cliente'}</span>
          </button>

          <Link
            href={`/ensaio/${approvalToken}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#17212B] text-[#FFFDF9] text-xs font-semibold uppercase tracking-wider hover:bg-[#315B52] transition-colors"
          >
            <span>Ver Prévia</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-xs sm:text-sm flex items-center gap-3 ${
            feedback.type === 'success'
              ? 'bg-[#315B52]/10 border-[#315B52] text-[#315B52]'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Cabeçalho do Pedido */}
      <div className="bg-[#FFFDF9] border border-[#E6E1D8] rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#E6E1D8]">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#5E6973] block mb-1">
              Pedido de Ensaio Fotográfico
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#17212B]">
              {order.order_number}
            </h1>
            <p className="text-xs text-[#5E6973] mt-1 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>Registrado em {formatDateBR(order.created_at)}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleStartProduction}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#315B52] text-[#FFFDF9] text-xs font-semibold uppercase tracking-wider hover:bg-[#3d6d63] transition-all shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
              <span>{isProcessing ? 'Processando...' : 'Reenviar Produção'}</span>
            </button>

            <button
              type="button"
              onClick={openWhatsAppCustomer}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366] text-[#FFFDF9] text-xs font-semibold uppercase tracking-wider hover:bg-[#20bd5a] transition-all shadow-sm"
            >
              <Send className="w-4 h-4" />
              <span>WhatsApp do Cliente</span>
            </button>
          </div>
        </div>

        {/* Grid de Informações Chave */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 text-xs sm:text-sm">
          <div>
            <span className="text-[#5E6973] block">Cliente</span>
            <span className="font-bold text-[#17212B] text-base block mt-0.5">{order.customer?.name || 'Cliente'}</span>
            <span className="text-[#5E6973] text-xs block">{order.customer?.whatsapp ? formatWhatsApp(order.customer.whatsapp) : ''}</span>
          </div>

          <div>
            <span className="text-[#5E6973] block">Tipo & Estilo</span>
            <span className="font-bold text-[#17212B] text-base block mt-0.5">{order.category_name}</span>
            <span className="text-[#5E6973] text-xs block">{order.style_name}</span>
          </div>

          <div>
            <span className="text-[#5E6973] block">Pacote & Fotos</span>
            <span className="font-bold text-[#17212B] text-base block mt-0.5">{order.package_name}</span>
            <span className="text-[#315B52] font-semibold text-xs block">{order.package_photo_count} fotos em alta resolução</span>
          </div>

          <div>
            <span className="text-[#5E6973] block">Valor do Pedido</span>
            <span className="font-serif font-bold text-[#17212B] text-2xl block mt-0.5">
              {formatCurrencyBRL(order.package_price_cents)}
            </span>
            <span className="text-[11px] text-[#5E6973] block">
              Status Pagamento: {order.payment?.status || (order.status === 'PENDING_PAYMENT' ? 'PENDENTE' : 'PAGO')}
            </span>
          </div>
        </div>
      </div>

      {/* Acompanhamento do Motor de Produção em Tempo Real */}
      <ProductionProgressTracker
        orderId={order.id}
        totalPhotos={order.package_photo_count || 6}
        onRefresh={() => router.refresh()}
      />

      {/* Controle de Status e Observações Operacionais */}
      <div className="bg-[#FFFDF9] border border-[#E6E1D8] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <h2 className="font-serif text-2xl font-bold text-[#17212B] border-b border-[#E6E1D8] pb-3">
          Controle de Status e Fluxo do Ensaio
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          <div className="md:col-span-5 space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#17212B]">
              Alterar Status do Pedido
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as OrderStatus)}
              className="w-full p-3 rounded-xl border border-[#D9D1C2] bg-[#F6F4EF] text-xs sm:text-sm text-[#17212B] font-medium focus:ring-2 focus:ring-[#315B52]"
            >
              {ALL_STATUSES.map((st) => (
                <option key={st.value} value={st.value}>
                  {st.label}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-5 space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#17212B]">
              Notas Internas do Estúdio (Opcional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Cliente solicitou ênfase na luz natural..."
              className="w-full p-3 rounded-xl border border-[#D9D1C2] bg-[#F6F4EF] text-xs text-[#17212B] focus:ring-2 focus:ring-[#315B52]"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="button"
              disabled={isUpdatingStatus}
              onClick={handleUpdateStatus}
              className="w-full py-3 rounded-xl bg-[#17212B] hover:bg-[#315B52] text-[#FFFDF9] text-xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-50"
            >
              {isUpdatingStatus ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </div>
      </div>

      {/* Solicitações de Ajuste do Cliente */}
      {order.revision_requests && order.revision_requests.length > 0 && (
        <div className="bg-[#FFFDF9] border border-rose-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-rose-800">
            <MessageSquare className="w-5 h-5 text-rose-600" />
            <h2 className="font-serif text-2xl font-bold">
              Solicitações de Ajuste do Cliente ({order.revision_requests.length})
            </h2>
          </div>

          <div className="divide-y divide-rose-100">
            {order.revision_requests.map((rev) => (
              <div key={rev.id} className="py-4 first:pt-0 last:pb-0 space-y-1 text-xs sm:text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#17212B]">
                    {rev.photo_index ? `Foto #${rev.photo_index}` : 'Ensaio Geral'} • {rev.reason}
                  </span>
                  <span className="text-[11px] text-[#5E6973]">{formatDateBR(rev.created_at)}</span>
                </div>
                {rev.comment && <p className="text-[#5E6973] leading-relaxed">"{rev.comment}"</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Seção de Fotos Originais Enviadas */}
      <div className="bg-[#FFFDF9] border border-[#E6E1D8] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-[#E6E1D8] pb-3">
          <h2 className="font-serif text-2xl font-bold text-[#17212B]">
            Fotos de Referência Enviadas pelo Cliente
          </h2>
          <span className="text-xs font-semibold text-[#5E6973]">
            {order.customer_photos?.length || 1} foto(s)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {order.customer_photos && order.customer_photos.length > 0 ? (
            order.customer_photos.map((photo, i) => (
              <div key={photo.id || i} className="rounded-2xl overflow-hidden aspect-square bg-[#17212B] border border-[#D9D1C2] shadow-sm relative group">
                <img
                  src={photo.storage_path.startsWith('http') || photo.storage_path.startsWith('data:')
                    ? photo.storage_path
                    : 'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=600&q=80'}
                  alt={photo.file_name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 inset-x-0 p-2 bg-[#17212B]/80 text-[#FFFDF9] text-[10px] truncate">
                  {photo.file_name}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-8 text-center text-[#5E6973] text-xs">
              Nenhuma foto original encontrada.
            </div>
          )}
        </div>
      </div>

      {/* Seção de Fotos Produzidas / Previews */}
      <div className="bg-[#FFFDF9] border border-[#E6E1D8] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-[#E6E1D8] pb-3">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#17212B]">
              Fotografias Produzidas para o Ensaio
            </h2>
            <p className="text-xs text-[#5E6973]">
              Imagens geradas com iluminação de estúdio e preservação facial.
            </p>
          </div>
          <span className="text-xs font-semibold text-[#315B52] bg-[#ECE7DF] px-3 py-1 rounded-full">
            {order.produced_photos?.length || order.package_photo_count} fotos
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: order.package_photo_count || 6 }).map((_, idx) => {
            const photo = order.produced_photos?.[idx];
            const sampleUrl = `https://images.unsplash.com/photo-${
              [
                '1544126592-807ade215a0b',
                '1519741497674-611481863552',
                '1534528741775-53994a69daeb',
                '1517841905240-472988babdf9',
                '1530103862676-de8c9debad1d',
                '1555252333-9f8e92e65df9',
              ][idx % 6]
            }?auto=format&fit=crop&w=800&q=80`;

            const imgUrl = photo?.preview_storage_path || sampleUrl;

            return (
              <div key={idx} className="rounded-2xl overflow-hidden bg-[#17212B] border border-[#D9D1C2] shadow-sm flex flex-col justify-between">
                <div className="aspect-[4/5] relative">
                  <img src={imgUrl} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#17212B]/80 text-[#FFFDF9] text-[9px] font-bold">
                    #{idx + 1}
                  </div>
                </div>
                <div className="p-2.5 bg-[#FFFDF9] text-[10px] text-[#5E6973] border-t border-[#E6E1D8] truncate">
                  {photo?.variation_description || `Variação de iluminação #${idx + 1}`}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
