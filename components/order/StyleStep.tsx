'use client';

import { Style } from '@/lib/types';
import { Check, Sparkles } from 'lucide-react';

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
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECE7DF] text-[#315B52] text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#C98576]" />
          <span>{categoryName ? `Estilos para ${categoryName}` : 'Estilos Disponíveis'}</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#17212B] mb-2">
          Escolha o estilo visual do ensaio
        </h2>
        <p className="text-sm text-[#5E6973]">
          Defina o cenário, paleta de cores e atmosfera de iluminação para a produção das suas fotos.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {styles.map((style) => {
          const isSelected = selectedStyleId === style.id;

          return (
            <button
              key={style.id}
              type="button"
              onClick={() => onSelectStyle(style.id)}
              className={`text-left rounded-2xl p-4 sm:p-5 border-2 transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-[#315B52] bg-[#315B52]/5 shadow-md ring-1 ring-[#315B52]'
                  : 'border-[#D9D1C2] bg-[#FFFDF9] hover:border-[#17212B] hover:bg-[#ECE7DF]/40'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-[10px] uppercase font-semibold tracking-wider text-[#315B52] bg-[#ECE7DF] px-2 py-0.5 rounded-full">
                  Produção de Estúdio
                </span>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors ${
                    isSelected
                      ? 'bg-[#315B52] border-[#315B52] text-[#FFFDF9]'
                      : 'border-[#D9D1C2] bg-[#FFFDF9]'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                </div>
              </div>

              <div>
                <h3 className="font-serif text-xl font-bold text-[#17212B] mb-1">
                  {style.name}
                </h3>
                <p className="text-xs text-[#5E6973] leading-relaxed">
                  {style.description || 'Iluminação refinada e composição personalizada de estúdio.'}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
    </div>
  );
}
