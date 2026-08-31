import Link from 'next/link';
import { Header } from '@/components/marketing/Header';
import { Footer } from '@/components/marketing/Footer';
import { OrderService } from '@/lib/domain/orders/service';
import { PaymentService } from '@/lib/domain/payments/service';
import { formatCurrencyBRL, formatWhatsApp, formatDateBR } from '@/lib/utils';
import { CheckCircle2, Clock, ShieldCheck, ArrowRight, Camera, Copy, AlertCircle } from 'lucide-react';

interface OrderPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ status?: string }>;
}

export default async function OrderPage({ params, searchParams }: OrderPageProps) {
  const { id } = await params;
  const { status: paymentStatusParam } = await searchParams;

  const order = await OrderService.getOrderById(id);

  // Informações de checkout / pagamento
  const checkout = order ? await PaymentService.initiatePayment(order) : null;

  const isPaid = order?.status === 'PAID' || order?.payment?.status === 'PAID' || paymentStatusParam === 'success';

  return (
    <div className="flex flex-col min-h-screen bg-[#F6F4EF]">
      <Header />

      <main className="flex-1 py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">

          {/* Card Principal de Confirmação */}
          <div className="bg-[#FFFDF9] border border-[#E6E1D8] rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">

            {/* Cabeçalho do Status */}
            <div className="text-center space-y-3 pb-6 border-b border-[#E6E1D8]">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-sm ${
                  isPaid ? 'bg-[#315B52] text-[#FFFDF9]' : 'bg-[#ECE7DF] text-[#17212B]'
                }`}
              >
                {isPaid ? <CheckCircle2 className="w-8 h-8 text-[#D9D1C2]" /> : <Clock className="w-8 h-8 text-[#C98576]" />}
              </div>

              <span className="text-[11px] font-bold uppercase tracking-widest text-[#5E6973] block">
                {isPaid ? 'Pagamento Confirmado' : 'Pedido Registrado — Aguardando Pagamento'}
              </span>

              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#17212B]">
                {isPaid ? 'Seu ensaio está em produção!' : 'Quase lá! Conclua o pagamento'}
              </h1>

              <p className="text-sm text-[#5E6973] max-w-md mx-auto">
                {isPaid
                  ? 'Recebemos a confirmação do seu pagamento. Nosso estúdio iniciou o tratamento das suas fotografias.'
                  : 'Assim que o pagamento for confirmado, nosso estúdio iniciará a produção exclusiva do seu ensaio.'}
              </p>
            </div>

            {/* Resumo do Pedido */}
            <div className="bg-[#F6F4EF]/60 rounded-2xl p-6 border border-[#D9D1C2] space-y-4">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-[#5E6973]">Número do Pedido</span>
                <span className="font-mono font-bold text-[#17212B]">{order?.order_number || id.slice(0, 8)}</span>
              </div>

              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-[#5E6973]">Ensaio & Estilo</span>
                <span className="font-semibold text-[#17212B]">{order?.category_name || 'Ensaio'} • {order?.style_name || 'Estúdio'}</span>
              </div>

              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-[#5E6973]">Pacote Selecionado</span>
                <span className="font-semibold text-[#17212B]">{order?.package_name || 'Profissional'} ({order?.package_photo_count || 12} fotos)</span>
              </div>

              <div className="flex items-center justify-between text-base font-bold pt-3 border-t border-[#E6E1D8]">
                <span className="text-[#17212B]">Valor Total</span>
                <span className="text-[#315B52] text-xl font-serif">
                  {order ? formatCurrencyBRL(order.package_price_cents) : 'R$ 29,90'}
                </span>
              </div>
            </div>

            {/* Bloco de Ação de Pagamento */}
            {!isPaid && (
              <div className="space-y-6">
                {checkout?.checkoutUrl ? (
                  <div className="text-center space-y-4">
                    <a
                      href={checkout.checkoutUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-4 rounded-full bg-[#17212B] hover:bg-[#315B52] text-[#FFFDF9] text-sm font-semibold uppercase tracking-wider inline-flex items-center justify-center gap-2 shadow-lg transition-all"
                    >
                      <span>EFETUAR PAGAMENTO SEGURO</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                ) : (
                  <div className="p-6 rounded-2xl bg-[#ECE7DF]/80 border border-[#D9D1C2] space-y-3 text-xs text-[#17212B]">
                    <div className="flex items-center gap-2 font-bold text-[#17212B]">
                      <AlertCircle className="w-4 h-4 text-[#C98576]" />
                      <span>Ambiente de Demonstração / Gateway em Configuração</span>
                    </div>
                    <p className="leading-relaxed text-[#5E6973]">
                      O pedido foi registrado como <strong>PENDENTE</strong>. Para habilitar pagamentos em produção via PIX ou Cartão, conecte o token do MercadoPago ou gateway de sua escolha nas variáveis de ambiente.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Próximos Passos */}
            <div className="border-t border-[#E6E1D8] pt-6 space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#17212B]">
                O que acontece a seguir?
              </h3>

              <div className="space-y-3 text-xs text-[#5E6973]">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#17212B] text-[#FFFDF9] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    1
                  </div>
                  <p>
                    <strong className="text-[#17212B]">Confirmação de Pagamento:</strong> O sistema identifica automaticamente e inicia a produção fotográfica.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#17212B] text-[#FFFDF9] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    2
                  </div>
                  <p>
                    <strong className="text-[#17212B]">Produção do Ensaio:</strong> O estúdio elabora suas fotografias respeitando seus traços e iluminação de alta resolução.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#17212B] text-[#FFFDF9] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    3
                  </div>
                  <p>
                    <strong className="text-[#17212B]">Prévia e Aprovação:</strong> Você receberá o link exclusivo no WhatsApp para conferir suas fotos e aprovar o resultado final.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center pt-4">
              <Link
                href="/"
                className="text-xs font-semibold uppercase tracking-wider text-[#5E6973] hover:text-[#17212B] transition-colors"
              >
                ← Voltar para a Página Inicial
              </Link>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
