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
  CheckCircle2,
  Lock,
  AlertCircle,
  Calendar,
  User,
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

  // Form State do Cartão de Crédito
  const [cardNumber, setCardNumber] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [cardholderCpf, setCardholderCpf] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [installments, setInstallments] = useState('1');
  const [isSubmittingCard, setIsSubmittingCard] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);

  const pixCode = checkout?.pixCopiaECola || '';
  const qrImage = checkout?.qrCodeBase64
    ? `data:image/png;base64,${checkout.qrCodeBase64}`
    : null;

  // Formatação de Cartão
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  // Formatação de Data MM/AA
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      raw = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    }
    setExpiryDate(raw);
  };

  // Formatação de CPF
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 11);
    if (raw.length > 9) {
      raw = `${raw.slice(0, 3)}.${raw.slice(3, 6)}.${raw.slice(6, 9)}-${raw.slice(9)}`;
    } else if (raw.length > 6) {
      raw = `${raw.slice(0, 3)}.${raw.slice(3, 6)}.${raw.slice(6)}`;
    } else if (raw.length > 3) {
      raw = `${raw.slice(0, 3)}.${raw.slice(3)}`;
    }
    setCardholderCpf(raw);
  };

  // Copiar código PIX
  const handleCopyPix = () => {
    if (!pixCode) return;
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // Processar pagamento com Cartão de Crédito transparente
  const handleCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingCard(true);
    setCardError(null);

    const [expMonth, expYear] = expiryDate.split('/');
    if (!expMonth || !expYear || expMonth.length !== 2 || expYear.length !== 2) {
      setCardError('Data de validade inválida. Use o formato MM/AA.');
      setIsSubmittingCard(false);
      return;
    }

    try {
      const res = await fetch(`/api/orders/${order.id}/pay-card`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardNumber,
          cardholderName,
          cardholderCpf,
          expirationMonth: expMonth,
          expirationYear: expYear,
          securityCode: cvv,
          installments: parseInt(installments, 10) || 1,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Pagamento recusado. Verifique os dados do cartão.');
      }

      setIsPaid(true);
      router.refresh();
    } catch (err: any) {
      setCardError(err.message || 'Erro ao processar pagamento com cartão.');
    } finally {
      setIsSubmittingCard(false);
    }
  };

  // Polling automático para detectar quando o PIX for pago
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
    }, 3500);

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

  const priceCents = order.package_price_cents || 1990;

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
            {formatCurrencyBRL(priceCents)}
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
          ) : (
            <p className="text-xs text-[#5E6973]">Gerando código PIX seguro...</p>
          )}
        </div>
      )}

      {/* OPÇÃO 2: CHECKOUT NATIVO DE CARTÃO DE CRÉDITO */}
      {selectedMethod === 'card' && (
        <form onSubmit={handleCardSubmit} className="space-y-4 max-w-lg mx-auto text-left">
          {cardError && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{cardError}</span>
            </div>
          )}

          {/* Número do Cartão */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#17212B] mb-1.5">
              Número do Cartão
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5E6973]">
                <CreditCard className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                maxLength={19}
                value={cardNumber}
                onChange={handleCardNumberChange}
                placeholder="0000 0000 0000 0000"
                className="w-full pl-10 pr-4 py-3.5 rounded-2xl border border-[#D9D1C2] bg-[#F6F4EF] text-sm text-[#17212B] placeholder-[#5E6973]/40 focus:outline-none focus:ring-2 focus:ring-[#315B52]"
              />
            </div>
          </div>

          {/* Nome no Cartão */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#17212B] mb-1.5">
              Nome Impresso no Cartão
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5E6973]">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value.toUpperCase())}
                placeholder="NOME COMO NO CARTÃO"
                className="w-full pl-10 pr-4 py-3.5 rounded-2xl border border-[#D9D1C2] bg-[#F6F4EF] text-sm text-[#17212B] placeholder-[#5E6973]/40 focus:outline-none focus:ring-2 focus:ring-[#315B52]"
              />
            </div>
          </div>

          {/* CPF do Titular */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#17212B] mb-1.5">
              CPF do Titular do Cartão
            </label>
            <input
              type="text"
              required
              maxLength={14}
              value={cardholderCpf}
              onChange={handleCpfChange}
              placeholder="000.000.000-00"
              className="w-full px-4 py-3.5 rounded-2xl border border-[#D9D1C2] bg-[#F6F4EF] text-sm text-[#17212B] placeholder-[#5E6973]/40 focus:outline-none focus:ring-2 focus:ring-[#315B52]"
            />
          </div>

          {/* Validade e CVV */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#17212B] mb-1.5">
                Validade (MM/AA)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5E6973]">
                  <Calendar className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  maxLength={5}
                  value={expiryDate}
                  onChange={handleExpiryChange}
                  placeholder="MM/AA"
                  className="w-full pl-10 pr-4 py-3.5 rounded-2xl border border-[#D9D1C2] bg-[#F6F4EF] text-sm text-[#17212B] placeholder-[#5E6973]/40 focus:outline-none focus:ring-2 focus:ring-[#315B52]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#17212B] mb-1.5">
                Código CVV
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5E6973]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  maxLength={4}
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="123"
                  className="w-full pl-10 pr-4 py-3.5 rounded-2xl border border-[#D9D1C2] bg-[#F6F4EF] text-sm text-[#17212B] placeholder-[#5E6973]/40 focus:outline-none focus:ring-2 focus:ring-[#315B52]"
                />
              </div>
            </div>
          </div>

          {/* Parcelamento */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#17212B] mb-1.5">
              Número de Parcelas
            </label>
            <select
              value={installments}
              onChange={(e) => setInstallments(e.target.value)}
              className="w-full p-3.5 rounded-2xl border border-[#D9D1C2] bg-[#F6F4EF] text-sm text-[#17212B] font-medium focus:outline-none focus:ring-2 focus:ring-[#315B52]"
            >
              <option value="1">1x de {formatCurrencyBRL(priceCents)} (Sem juros)</option>
              <option value="2">2x de {formatCurrencyBRL(Math.round(priceCents / 2))}</option>
              <option value="3">3x de {formatCurrencyBRL(Math.round(priceCents / 3))}</option>
              <option value="4">4x de {formatCurrencyBRL(Math.round(priceCents / 4))}</option>
              <option value="6">6x de {formatCurrencyBRL(Math.round(priceCents / 6))}</option>
            </select>
          </div>

          {/* Botão de Pagar */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={isSubmittingCard}
              className="w-full py-4 rounded-full bg-[#17212B] hover:bg-[#315B52] text-[#FFFDF9] text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all transform active:scale-95 disabled:opacity-50"
            >
              {isSubmittingCard ? (
                <span>Processando pagamento seguro...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-[#D9D1C2]" />
                  <span>PAGAR {formatCurrencyBRL(priceCents)}</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      <div className="pt-4 border-t border-[#E6E1D8] flex items-center justify-center gap-2 text-xs text-[#5E6973]">
        <ShieldCheck className="w-4 h-4 text-[#315B52]" />
        <span>Pagamento seguro e criptografado com aprovação imediata</span>
      </div>

    </div>
  );
}
