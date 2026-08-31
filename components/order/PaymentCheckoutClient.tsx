'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Order } from '@/lib/types';
import { formatCurrencyBRL } from '@/lib/utils';
import {
  QrCode,
  CreditCard,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
  Clock,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';

interface PaymentCheckoutClientProps {
  order: Order;
  checkout: {
    paymentId?: string;
    checkoutUrl?: string;
    cardCheckoutUrl?: string;
    qrCodeBase64?: string;
    pixCopiaECola?: string;
    paymentMethod?: string;
  } | null;
}

export function PaymentCheckoutClient({ order, checkout }: PaymentCheckoutClientProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'pix' | 'card'>('pix');
  const [isPaid, setIsPaid] = useState(
    order.status === 'PAID' ||
      order.status === 'PRODUCTION_QUEUED' ||
      order.status === 'IN_PRODUCTION' ||
      order.status === 'READY_FOR_APPROVAL' ||
      order.status === 'APPROVED' ||
      order.status === 'COMPLETED'
  );

  const pixCode = checkout?.pixCopiaECola || '';
  const qrImage = checkout?.qrCodeBase64
    ? `data:image/png;base64,${checkout.qrCodeBase64}`
    : null;
  const cardUrl = checkout?.cardCheckoutUrl || checkout?.checkoutUrl;

  // Copiar código PIX
  const handleCopyPix = () => {
    if (!pixCode) return;
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // Polling automático para detectar quando o pagamento for confirmado
  useEffect(() => {
    if (isPaid) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/${order.id}/check-payment`);
        const data = await res.json();

        if (data.isPaid) {
          setIsPaid(true);
          clearInterval(interval);
          router.refresh();
        }
      } catch {
        // Silencioso em caso de oscilação de rede
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [order.id, isPaid, router]);

  if (isPaid) {
    return (
      <div className="bg-[#FFFDF9] border border-[#E6E1D8] rounded-3xl p-8 sm:p-12 shadow-sm text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#315B52] text-[#FFFDF9] flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-8 h-8 text-[#D9D1C2]" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#315B52] block">
            Pagamento Confirmado
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#17212B]">
            Seu ensaio já está em produção! 📸
          </h1>
          <p className="text-sm text-[#5E6973] max-w-md mx-auto leading-relaxed">
            Identificamos seu pagamento com sucesso. Nosso estúdio iniciou a criação das suas {order.package_photo_count} fotos em alta resolução.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#ECE7DF]/70 border border-[#D9D1C2] max-w-md mx-auto text-xs text-[#17212B] space-y-1">
          <p><strong>Pedido:</strong> {order.order_number}</p>
          <p><strong>Ensaio:</strong> {order.category_name} ({order.style_name})</p>
          <p className="text-[#315B52] font-semibold pt-1">
            Você receberá o link exclusivo no seu WhatsApp assim que as fotos estiverem prontas!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFDF9] border border-[#E6E1D8] rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">

      {/* Topo do Resumo */}
      <div className="text-center space-y-2 pb-6 border-b border-[#E6E1D8]">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#ECE7DF] text-[#315B52] text-[11px] font-bold uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5 text-[#C98576]" />
          <span>Finalização Segura</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#17212B]">
          Pagamento do seu Ensaio
        </h1>
        <p className="text-xs sm:text-sm text-[#5E6973]">
          {order.package_name} • {order.category_name} ({order.style_name})
        </p>
        <div className="pt-2">
          <span className="font-serif text-3xl sm:text-4xl font-bold text-[#315B52]">
            {formatCurrencyBRL(order.package_price_cents)}
          </span>
          <span className="text-[11px] text-[#5E6973] block mt-0.5">Pagamento único sem mensalidades</span>
        </div>
      </div>

      {/* Seletor de Método de Pagamento */}
      <div className="grid grid-cols-2 gap-3 p-1.5 rounded-2xl bg-[#ECE7DF]/80 border border-[#D9D1C2]">
        <button
          type="button"
          onClick={() => setSelectedMethod('pix')}
          className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
            selectedMethod === 'pix'
              ? 'bg-[#17212B] text-[#FFFDF9] shadow-md'
              : 'text-[#5E6973] hover:text-[#17212B]'
          }`}
        >
          <QrCode className="w-4 h-4 text-[#D9D1C2]" />
          <span>Pagar via PIX</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedMethod('card')}
          className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
            selectedMethod === 'card'
              ? 'bg-[#17212B] text-[#FFFDF9] shadow-md'
              : 'text-[#5E6973] hover:text-[#17212B]'
          }`}
        >
          <CreditCard className="w-4 h-4 text-[#D9D1C2]" />
          <span>Cartão de Crédito</span>
        </button>
      </div>

      {/* OPÇÃO 1: PIX INSTANTÂNEO DIRETO NA TELA */}
      {selectedMethod === 'pix' && (
        <div className="space-y-6 text-center">
          {pixCode ? (
            <>
              {/* QR Code */}
              {qrImage && (
                <div className="w-48 h-48 sm:w-56 sm:h-56 mx-auto bg-white p-3 rounded-3xl border-2 border-[#D9D1C2] shadow-md flex items-center justify-center">
                  <img src={qrImage} alt="QR Code PIX" className="w-full h-full object-contain" />
                </div>
              )}

              {/* Caixa Copia e Cola */}
              <div className="space-y-3 max-w-lg mx-auto">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#17212B]">
                  Código PIX Copia e Cola:
                </label>

                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    value={pixCode}
                    onClick={handleCopyPix}
                    className="w-full pl-3.5 pr-28 py-3.5 rounded-2xl bg-[#F6F4EF] border border-[#D9D1C2] text-xs font-mono text-[#5E6973] truncate cursor-pointer focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleCopyPix}
                    className="absolute right-1.5 top-1.5 bottom-1.5 px-4 rounded-xl bg-[#315B52] hover:bg-[#3d6d63] text-[#FFFDF9] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Instruções do PIX */}
              <div className="p-4 rounded-2xl bg-[#ECE7DF]/60 border border-[#D9D1C2] max-w-lg mx-auto text-left space-y-2 text-xs text-[#5E6973]">
                <p className="font-bold text-[#17212B] flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#315B52]" />
                  <span>Como pagar em 3 passos:</span>
                </p>
                <ol className="list-decimal list-inside space-y-1 pl-1">
                  <li>Abra o aplicativo do seu banco no celular.</li>
                  <li>Escolha a opção <strong>PIX</strong> e depois <strong>PIX Copia e Cola</strong> (ou ler QR Code).</li>
                  <li>Cole o código copiado e confirme o pagamento.</li>
                </ol>
                <p className="text-[11px] text-[#315B52] font-semibold pt-1">
                  ⚡ O reconhecimento é instantâneo e a produção começa na mesma hora.
                </p>
              </div>
            </>
          ) : cardUrl ? (
            <div className="space-y-4 max-w-md mx-auto">
              <a
                href={cardUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 px-6 rounded-full bg-[#17212B] hover:bg-[#315B52] text-[#FFFDF9] text-sm font-bold uppercase tracking-wider inline-flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <span>GERAR PIX NO MERCADO PAGO</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ) : (
            <p className="text-xs text-[#5E6973]">Carregando dados de pagamento seguro...</p>
          )}
        </div>
      )}

      {/* OPÇÃO 2: CARTÃO DE CRÉDITO */}
      {selectedMethod === 'card' && (
        <div className="space-y-6 text-center max-w-md mx-auto">
          <div className="p-6 rounded-3xl bg-[#F6F4EF] border border-[#D9D1C2] space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#17212B] text-[#FFFDF9] flex items-center justify-center mx-auto">
              <CreditCard className="w-6 h-6 text-[#D9D1C2]" />
            </div>

            <div className="space-y-1">
              <h3 className="font-serif text-xl font-bold text-[#17212B]">
                Pagamento com Cartão de Crédito
              </h3>
              <p className="text-xs text-[#5E6973]">
                Pague em ambiente 100% criptografado com opção de parcelamento e aprovação imediata.
              </p>
            </div>

            {cardUrl ? (
              <a
                href={cardUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 px-6 rounded-full bg-[#17212B] hover:bg-[#315B52] text-[#FFFDF9] text-sm font-bold uppercase tracking-wider inline-flex items-center justify-center gap-2 shadow-xl transition-all"
              >
                <span>PAGAR COM CARTÃO DE CRÉDITO</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            ) : (
              <p className="text-xs text-[#5E6973]">Carregando ambiente seguro de cartão...</p>
            )}
          </div>
        </div>
      )}

      <div className="pt-4 border-t border-[#E6E1D8] flex items-center justify-center gap-2 text-xs text-[#5E6973]">
        <ShieldCheck className="w-4 h-4 text-[#315B52]" />
        <span>Pagamento seguro e processado pelo Mercado Pago</span>
      </div>

    </div>
  );
}
