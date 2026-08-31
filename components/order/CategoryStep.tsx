'use client';

import { Category } from '@/lib/types';
import { Check, Sparkles } from 'lucide-react';

interface CategoryStepProps {
  categories: Category[];
  selectedCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
  error?: string;
}

const CATEGORY_IMAGES: Record<string, string> = {
  gravidez: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=800&q=80',
  casamento: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
  aniversario: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80',
  debutante: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
  'recem-nascido': 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=800&q=80',
  mesversario: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80',
  sensual: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
};

export function CategoryStep({
  categories,
  selectedCategoryId,
  onSelectCategory,
  error,
}: CategoryStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center sm:text-left space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECE7DF] text-[#315B52] text-[11px] font-bold uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5 text-[#C98576]" />
          <span>Catálogo de Produções</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#17212B]">
          Escolha o tipo de ensaio
        </h2>
        <p className="text-xs sm:text-sm text-[#5E6973]">
          Toque no tema desejado para ver os estilos e iluminações disponíveis.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {categories.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;

          // Se a imagem cadastrada for válida (http/https), usa ela; senão usa a foto HD do catálogo
          const validSample =
            cat.sample_image_url && cat.sample_image_url.startsWith('http')
              ? cat.sample_image_url
              : null;

          const imageUrl = validSample || CATEGORY_IMAGES[cat.slug] || CATEGORY_IMAGES['gravidez'];

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`group text-left rounded-3xl overflow-hidden border-2 transition-all duration-300 flex flex-col justify-between ${
                isSelected
                  ? 'border-[#315B52] bg-[#FFFDF9] shadow-xl ring-2 ring-[#315B52] scale-[1.02]'
                  : 'border-[#E6E1D8] bg-[#FFFDF9] hover:border-[#17212B] hover:shadow-md'
              }`}
            >
              {/* Foto de Capa do Ensaio */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#17212B]">
                <img
                  src={imageUrl}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#17212B]/80 via-transparent to-transparent" />

                {/* Selo de Selecionado */}
                <div className="absolute top-3 right-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center border shadow-sm transition-colors ${
                      isSelected
                        ? 'bg-[#315B52] border-[#315B52] text-[#FFFDF9]'
                        : 'border-[#FFFDF9]/60 bg-[#17212B]/60 text-transparent'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </div>
                </div>

                <span className="absolute bottom-2.5 left-3 text-[10px] uppercase tracking-wider font-bold text-[#D9D1C2]">
                  Ensaio de Estúdio
                </span>
              </div>

              {/* Informações */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#17212B] mb-1">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-[#5E6973] leading-relaxed line-clamp-2">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-[#E6E1D8] flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#315B52]">
                  <span>{isSelected ? 'Selecionado' : 'Escolher este'}</span>
                  <span>→</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {error && <p className="text-xs text-red-600 font-semibold">{error}</p>}
    </div>
  );
}
