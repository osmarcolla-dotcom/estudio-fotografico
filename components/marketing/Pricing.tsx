import Link from 'next/link';
import { Package } from '@/lib/types';
import { formatCurrencyBRL } from '@/lib/utils';
import { Check, Sparkles, Star, ArrowRight } from 'lucide-react';

interface PricingProps {
  packages: Package[];
}

export function Pricing({ packages }: PricingProps) {
  return (
    <section id="pacotes" className="py-20 md:py-28 bg-[#F6F4EF]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Cabeçalho */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ECE7DF] text-[#315B52] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#C98576]" />
            <span>Investimento Transparente</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#17212B] tracking-tight">
            Escolha o pacote ideal para você
          </h2>
          <p className="text-[#5E6973] text-base sm:text-lg font-light leading-relaxed">
            Sem custos ocultos ou taxas adicionais. Todas as fotos entregues passam por curadoria e tratamento de iluminação em alta definição.
          </p>
        </div>

        {/* Cards de Pacotes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {packages.map((pkg) => {
            const isPopular = pkg.is_popular;

            return (
              <div
                key={pkg.id}
                className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                  isPopular
                    ? 'bg-[#17212B] text-[#FFFDF9] shadow-2xl scale-105 border-2 border-[#C98576] z-10'
                    : 'bg-[#FFFDF9] text-[#17212B] border border-[#E6E1D8] shadow-sm hover:shadow-xl hover:border-[#D9D1C2]'
                }`}
              >
                {/* Selo Mais Vendido */}
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-[#C98576] text-[#FFFDF9] text-[11px] font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-md">
                    <Star className="w-3 h-3 fill-current" />
                    <span>Mais Vendido</span>
                  </div>
                )}

                <div>
                  <div className="mb-6">
                    <h3 className="font-serif text-2xl font-bold mb-2">
                      {pkg.name}
                    </h3>
                    <p className={`text-xs leading-relaxed ${isPopular ? 'text-[#D9D1C2]' : 'text-[#5E6973]'}`}>
                      {pkg.description || 'Ensaio fotográfico completo com iluminação de estúdio profissional.'}
                    </p>
                  </div>

                  {/* Preço */}
                  <div className="mb-8 pb-6 border-b border-current/10">
                    <div className="flex items-baseline gap-1">
                      <span className="font-serif text-4xl sm:text-5xl font-bold tracking-tight">
                        {formatCurrencyBRL(pkg.price_cents)}
                      </span>
                    </div>
                    <span className={`text-xs font-medium block mt-1 ${isPopular ? 'text-[#D9D1C2]' : 'text-[#5E6973]'}`}>
                      Pagamento único por ensaio
                    </span>
                  </div>

                  {/* Benefícios Inclusos */}
                  <ul className="space-y-3.5 text-xs sm:text-sm mb-8">
                    <li className="flex items-start gap-3 font-semibold">
                      <Check className={`w-4 h-4 mt-0.5 shrink-0 ${isPopular ? 'text-[#C98576]' : 'text-[#315B52]'}`} />
                      <span>{pkg.photo_count} fotos em alta resolução</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className={`w-4 h-4 mt-0.5 shrink-0 ${isPopular ? 'text-[#C98576]' : 'text-[#315B52]'}`} />
                      <span>Preservação rigorosa de traços faciais</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className={`w-4 h-4 mt-0.5 shrink-0 ${isPopular ? 'text-[#C98576]' : 'text-[#315B52]'}`} />
                      <span>Composições, ângulos e luzes variadas</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className={`w-4 h-4 mt-0.5 shrink-0 ${isPopular ? 'text-[#C98576]' : 'text-[#315B52]'}`} />
                      <span>Link exclusivo para prévia e aprovação</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className={`w-4 h-4 mt-0.5 shrink-0 ${isPopular ? 'text-[#C98576]' : 'text-[#315B52]'}`} />
                      <span>Possibilidade de solicitar ajustes</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className={`w-4 h-4 mt-0.5 shrink-0 ${isPopular ? 'text-[#C98576]' : 'text-[#315B52]'}`} />
                      <span>Download em resolução máxima</span>
                    </li>
                  </ul>
                </div>

                {/* Botão CTA */}
                <Link
                  href={`/criar-ensaio?pacote=${pkg.id}`}
                  className={`w-full py-4 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider inline-flex items-center justify-center gap-2 transition-all transform active:scale-95 ${
                    isPopular
                      ? 'bg-[#C98576] text-[#FFFDF9] hover:bg-[#b57365] shadow-lg shadow-[#C98576]/20'
                      : 'bg-[#17212B] text-[#FFFDF9] hover:bg-[#315B52]'
                  }`}
                >
                  <span>ESCOLHER ESTE PACOTE</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
