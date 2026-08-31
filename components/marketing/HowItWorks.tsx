import { Upload, Sliders, CheckCircle2, Download } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Envie sua foto de referência',
      description: 'Envie uma foto nítida e bem iluminada pelo celular ou computador. Suas características físicas e expressões serão rigorosamente preservadas.',
      icon: Upload,
    },
    {
      number: '02',
      title: 'Escolha categoria, estilo e pacote',
      description: 'Defina o tema do seu ensaio (maternidade, casamento, sensual, etc.), a iluminação/ambiente desejado e o número de fotos em alta resolução.',
      icon: Sliders,
    },
    {
      number: '03',
      title: 'Acompanhe a produção do ensaio',
      description: 'Nosso estúdio produz retratos exclusivos com variedade de poses, enquadramentos cinematográficos e iluminação de estúdio profissional.',
      icon: CheckCircle2,
    },
    {
      number: '04',
      title: 'Aprove e baixe em alta resolução',
      description: 'Você recebe um link exclusivo para visualizar a prévia de todas as fotos, solicitar ajustes se desejar e baixar os arquivos finais em resolução máxima.',
      icon: Download,
    },
  ];

  return (
    <section id="como-funciona" className="py-20 md:py-28 bg-[#ECE7DF] border-y border-[#E6E1D8]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#315B52] block">
            Simplicidade & Elegância
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#17212B] tracking-tight">
            Como funciona seu ensaio digital
          </h2>
          <p className="text-[#5E6973] text-base sm:text-lg font-light leading-relaxed">
            Uma experiência completa de estúdio fotográfico sem sair de casa, com comodidade total e entrega rápida.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative bg-[#FFFDF9] rounded-2xl p-8 border border-[#D9D1C2] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-serif text-3xl font-bold text-[#D9D1C2]">
                      {step.number}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-[#17212B] text-[#FFFDF9] flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#C98576]" />
                    </div>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-[#17212B] mb-3 leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5E6973] leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E6E1D8] text-[10px] uppercase tracking-wider font-semibold text-[#315B52]">
                  Etapa Segura & Privada
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
