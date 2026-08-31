import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, ArrowRight, ShieldCheck, Star, Camera } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 border-b border-[#E6E1D8]">
      {/* Elemento de iluminação e fundo sutil */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#ECE7DF]/60 to-transparent pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Lado Esquerdo: Mensagem e Proposta de Valor */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ECE7DF] border border-[#D9D1C2] text-[#315B52] text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#C98576]" />
              <span>Estúdio Fotográfico de Alta Resolução</span>
            </div>

            <div className="space-y-4">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#17212B] leading-[1.1]">
                Seu ensaio fotográfico personalizado
              </h1>
              <p className="text-lg sm:text-xl text-[#5E6973] font-light max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Transforme sua ideia em um ensaio fotográfico exclusivo, produzido especialmente para você com acabamento profissional e alta definição.
              </p>
            </div>

            {/* CTAs e Segurança */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/criar-ensaio"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#17212B] text-[#FFFDF9] text-base font-semibold tracking-wide uppercase shadow-lg shadow-[#17212B]/10 hover:bg-[#315B52] hover:shadow-[#315B52]/20 transition-all duration-300 transform active:scale-95"
              >
                <span>CRIAR MEU ENSAIO</span>
                <ArrowRight className="w-4 h-4 text-[#D9D1C2]" />
              </Link>

              <Link
                href="#como-funciona"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-transparent border border-[#D9D1C2] text-[#17212B] text-base font-medium hover:bg-[#ECE7DF]/50 transition-colors"
              >
                <span>Como Funciona</span>
              </Link>
            </div>

            {/* Selos de Qualidade */}
            <div className="pt-6 border-t border-[#E6E1D8]/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-[#5E6973] font-medium">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#315B52]" />
                <span>Preservação facial e identidade</span>
              </div>
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#315B52]" />
                <span>Entrega em alta resolução</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-[#C98576] fill-[#C98576]" />
                <span>Aprovação antes do download final</span>
              </div>
            </div>

          </div>

          {/* Lado Direito: Composição Visual Editorial (Fita de Prova de Estúdio) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm sm:max-w-md lg:max-w-none">

              {/* Card Fotográfico Principal */}
              <div className="relative z-20 rounded-2xl overflow-hidden shadow-2xl border-4 border-[#FFFDF9] bg-[#17212B] aspect-[4/5] transform hover:-rotate-1 transition-transform duration-500">
                <img
                  src="https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=1000&q=85"
                  alt="Exemplo de ensaio fotográfico profissional de gestante"
                  className="w-full h-full object-cover"
                />

                {/* Overlay de Estúdio */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#17212B]/80 via-transparent to-transparent flex items-end p-6">
                  <div className="text-[#FFFDF9]">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#D9D1C2] block mb-1">
                      Ensaio Maternidade • Prova #04
                    </span>
                    <p className="font-serif text-xl font-medium leading-tight">
                      Luz de Estúdio & Tecidos Nobres
                    </p>
                  </div>
                </div>
              </div>

              {/* Card Secundário Sobreposto (Efeito Estúdio) */}
              <div className="hidden sm:block absolute -bottom-8 -left-8 z-30 w-48 rounded-xl overflow-hidden shadow-xl border-4 border-[#FFFDF9] bg-[#17212B] aspect-square transform rotate-6 hover:rotate-0 transition-transform duration-300">
                <img
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80"
                  alt="Exemplo de ensaio fotográfico de casamento"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 right-2 px-2 py-1 bg-[#17212B]/90 backdrop-blur-sm rounded text-[9px] text-[#FFFDF9] font-medium text-center uppercase tracking-wider">
                  Alta Definição
                </div>
              </div>

              {/* Selo Flutuante */}
              <div className="absolute -top-4 -right-4 z-30 bg-[#315B52] text-[#FFFDF9] p-4 rounded-full shadow-lg flex flex-col items-center justify-center text-center w-24 h-24 border-2 border-[#FFFDF9]">
                <span className="text-[9px] uppercase tracking-wider font-semibold text-[#D9D1C2]">A partir de</span>
                <span className="text-xl font-bold font-serif leading-none mt-0.5">R$ 19,90</span>
                <span className="text-[9px] font-medium text-[#ECE7DF] mt-0.5">por ensaio</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
