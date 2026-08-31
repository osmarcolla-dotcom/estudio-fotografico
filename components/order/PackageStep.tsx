'use client';

import { Package } from '@/lib/types';
import { formatCurrencyBRL } from '@/lib/utils';
import { Check, Star } from 'lucide-react';

interface PackageStepProps {
  packages: Package[];
  selectedPackageId: string;
  onSelectPackage: (packageId: string) => void;
  error?: string;
}

export function PackageStep({
  packages,
  selectedPackageId,
  onSelectPackage,
  error,
}: PackageStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#17212B] mb-2">
          Escolha o pacote de fotos
        </h2>
        <p className="text-sm text-[#5E6973]">
          Todas as fotos são entregues em alta resolução com variação de poses, ângulos e iluminação profissional.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {packages.map((pkg) => {
          const isSelected = selectedPackageId === pkg.id;
          const isPopular = pkg.is_popular;

          return (
            <button
              key={pkg.id}
              type="button"
              onClick={() => onSelectPackage(pkg.id)}
              className={`relative text-left rounded-3xl p-6 sm:p-7 border-2 transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-[#315B52] bg-[#315B52]/5 shadow-xl ring-2 ring-[#315B52]'
                  : isPopular
                  ? 'border-[#C98576] bg-[#FFFDF9] shadow-md hover:border-[#17212B]'
                  : 'border-[#D9D1C2] bg-[#FFFDF9] hover:border-[#17212B] hover:bg-[#ECE7DF]/40'
              }`}
            >
              {isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#C98576] text-[#FFFDF9] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                  <Star className="w-3 h-3 fill-current" />
                  <span>Mais Vendido</span>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#17212B]">
                    {pkg.name}
                  </h3>

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

                <div className="mb-4">
                  <span className="font-serif text-3xl sm:text-4xl font-bold text-[#17212B] tracking-tight">
                    {formatCurrencyBRL(pkg.price_cents)}
                  </span>
                  <span className="text-xs text-[#5E6973] block mt-0.5">
                    Pagamento único
                  </span>
                </div>

                <p className="text-xs text-[#5E6973] leading-relaxed mb-6">
                  {pkg.description || 'Ensaio fotográfico completo com acabamento de estúdio.'}
                </p>
              </div>

              <div className="pt-4 border-t border-[#E6E1D8] space-y-2 text-xs text-[#17212B]">
                <div className="flex items-center gap-2 font-semibold text-[#315B52]">
                  <Check className="w-4 h-4 text-[#315B52] shrink-0" />
                  <span>{pkg.photo_count} fotos em alta resolução</span>
                </div>
                <div className="flex items-center gap-2 text-[#5E6973]">
                  <Check className="w-4 h-4 text-[#315B52] shrink-0" />
                  <span>Preservação facial garantida</span>
                </div>
                <div className="flex items-center gap-2 text-[#5E6973]">
                  <Check className="w-4 h-4 text-[#315B52] shrink-0" />
                  <span>Prévia exclusiva antes do download</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
    </div>
  );
}
