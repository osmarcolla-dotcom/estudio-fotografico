'use client';

import { Style } from '@/lib/types';
import { Check, Sparkles, Sliders } from 'lucide-react';

interface StyleStepProps {
  styles: Style[];
  selectedStyleId: string;
  onSelectStyle: (styleId: string) => void;
  categoryName?: string;
  error?: string;
}

export function StyleStep({
  styles,
  selectedStyleId,
  onSelectStyle,
  categoryName,
  error,
}: StyleStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center sm:text-left space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECE7DF] text-[#315B52] text-[11px] font-bold uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5 text-[#C98576]" />
          <span>{categoryName ? `Estilos para ${categoryName}` : 'Estilos Visuais'}</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#17212B]">
          Escolha o estilo e iluminação
        </h2>
        <p className="text-xs sm:text-sm text-[#5E6973]">
          Defina a estética, paleta de cores e atmosfera visual da sua produção fotográfica.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {styles.map((style) => {
          const isSelected = selectedStyleId === style.id;

          return (
            <button
              key={style.id}
              type="button"
              onClick={() => onSelectStyle(style.id)}
              className={`group text-left rounded-3xl p-5 sm:p-6 border-2 transition-all duration-300 flex flex-col justify-between ${
                isSelected
                  ? 'border-[#315B52] bg-[#FFFDF9] shadow-xl ring-2 ring-[#315B52] scale-[1.02]'
                  : 'border-[#E6E1D8] bg-[#FFFDF9] hover:border-[#17212B] hover:shadow-md'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#315B52] bg-[#ECE7DF] px-2.5 py-1 rounded-full">
                    Acabamento de Estúdio
                  </span>

                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center border shadow-sm transition-colors ${
                      isSelected
                        ? 'bg-[#315B52] border-[#315B52] text-[#FFFDF9]'
                        : 'border-[#D9D1C2] bg-[#FFFDF9]'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </div>
                </div>

                <h3 className="font-serif text-xl font-bold text-[#17212B] mb-1.5">
                  {style.name}
                </h3>
                <p className="text-xs text-[#5E6973] leading-relaxed">
                  {style.description || 'Iluminação refinada, nitidez cristalina e composição personalizada.'}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E6E1D8] flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#315B52]">
                <span>{isSelected ? 'Estilo Selecionado' : 'Selecionar'}</span>
                <span>→</span>
              </div>
            </button>
          );
        })}
      </div>

      {error && <p className="text-xs text-red-600 font-semibold">{error}</p>}
    </div>
  );
}
