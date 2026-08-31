'use client';

import { Category } from '@/lib/types';
import { Check } from 'lucide-react';

interface CategoryStepProps {
  categories: Category[];
  selectedCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
  error?: string;
}

export function CategoryStep({
  categories,
  selectedCategoryId,
  onSelectCategory,
  error,
}: CategoryStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#17212B] mb-2">
          Escolha o tipo de ensaio
        </h2>
        <p className="text-sm text-[#5E6973]">
          Selecione o momento ou tema que você deseja eternizar com nosso acabamento de estúdio.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`text-left rounded-2xl p-4 sm:p-5 border-2 transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-[#315B52] bg-[#315B52]/5 shadow-md ring-1 ring-[#315B52]'
                  : 'border-[#D9D1C2] bg-[#FFFDF9] hover:border-[#17212B] hover:bg-[#ECE7DF]/40'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-8 h-8 rounded-full bg-[#17212B] text-[#FFFDF9] flex items-center justify-center font-serif font-bold text-sm">
                  {cat.name.charAt(0)}
                </div>

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
                  {cat.name}
                </h3>
                <p className="text-xs text-[#5E6973] leading-relaxed line-clamp-2">
                  {cat.description}
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
