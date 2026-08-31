'use client';

import { Package } from '@/lib/types';
import { formatCurrencyBRL } from '@/lib/utils';
import { Check, Star, Sparkles, ShieldCheck } from 'lucide-react';

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
      <div className="text-center sm:text-left space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECE7DF] text-[#315B52] text-[11px] font-bold uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5 text-[#C98576]" />
          <span>Pacotes de Ensaio</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#17212B]">
          Escolha a quantidade de fotos
        </h2>
        <p className="text-xs sm:text-sm text-[#5E6973]">
          Todas as fotografias são entregues em resolução máxima com variedade de poses e ângulos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
        {packages.map((pkg) => {
          const isSelected = selectedPackageId === pkg.id;
          const isPopular = pkg.is_popular;

          return (
            <button
              key={pkg.id}
              type="button"
              onClick={() => onSelectPackage(pkg.id)}
              className={`relative text-left rounded-3xl p-6 sm:p-7 border-2 transition-all duration-300 flex flex-col justify-between ${
                isSelected
                  ? 'border-[#315B52] bg-[#FFFDF9] shadow-2xl ring-2 ring-[#315B52] scale-[1.02]'
                  : isPopular
                  ? 'border-[#C98576] bg-[#FFFDF9] shadow-lg hover:border-[#17212B]'
                  : 'border-[#E6E1D8] bg-[#FFFDF9] hover:border-[#17212B] hover:shadow-md'
              }`}
            >
              {isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-[#C98576] text-[#FFFDF9] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-md">
                  <Star className="w-3 h-3 fill-current" />
                  <span>Mais Procurado</span>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-serif text-2xl font-bold text-[#17212B]">
                    {pkg.name}
                  </h3>

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

                <div className="mb-4 pb-4 border-b border-[#E6E1D8]">
                  <div className="flex items-baseline gap-1">
                    <span className="font-serif text-3xl sm:text-4xl font-bold text-[#17212B] tracking-tight">
                      {formatCurrencyBRL(pkg.price_cents)}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#5E6973] font-medium block mt-0.5">
                    Investimento único por ensaio
                  </span>
                </div>

                <p className="text-xs text-[#5E6973] leading-relaxed mb-6">
                  {pkg.description || 'Produção fotográfica completa com tratamento profissional de iluminação.'}
                </p>
              </div>

              <div className="pt-4 border-t border-[#E6E1D8] space-y-2.5 text-xs text-[#17212B]">
                <div className="flex items-center gap-2 font-bold text-[#315B52]">
                  <Check className="w-4 h-4 text-[#315B52] shrink-0" />
                  <span>{pkg.photo_count} fotos em alta resolução</span>
                </div>
                <div className="flex items-center gap-2 text-[#5E6973]">
                  <Check className="w-4 h-4 text-[#315B52] shrink-0" />
                  <span>Preservação facial 100% garantida</span>
                </div>
                <div className="flex items-center gap-2 text-[#5E6973]">
                  <Check className="w-4 h-4 text-[#315B52] shrink-0" />
                  <span>Variação de poses e enquadramentos</span>
                </div>
                <div className="flex items-center gap-2 text-[#5E6973]">
                  <Check className="w-4 h-4 text-[#315B52] shrink-0" />
                  <span>Download em resolução máxima</span>
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
