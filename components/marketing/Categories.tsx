import Link from 'next/link';
import { Category } from '@/lib/types';
import { ArrowRight, Sparkles } from 'lucide-react';

interface CategoriesProps {
  categories: Category[];
}

export function Categories({ categories }: CategoriesProps) {
  return (
    <section id="categorias" className="py-20 md:py-28 bg-[#F6F4EF]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Cabeçalho da Seção */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ECE7DF] text-[#315B52] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#C98576]" />
            <span>Portfólio de Produções</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#17212B] tracking-tight">
            Escolha seu tipo de ensaio
          </h2>
          <p className="text-[#5E6973] text-base sm:text-lg font-light leading-relaxed">
            Cada ensaio é produzido individualmente com composições, ângulos e iluminações desenvolvidas especificamente para o seu momento.
          </p>
        </div>

        {/* Grid de Categorias */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/criar-ensaio?categoria=${category.id}`}
              className="group relative flex flex-col rounded-2xl overflow-hidden bg-[#FFFDF9] border border-[#E6E1D8] shadow-sm hover:shadow-xl hover:border-[#17212B] transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Imagem do Ensaio */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#17212B]">
                {category.sample_image_url ? (
                  <img
                    src={category.sample_image_url}
                    alt={`Ensaio de ${category.name}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#D9D1C2] font-serif text-2xl">
                    {category.name}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#17212B]/90 via-[#17212B]/20 to-transparent" />

                {/* Tag de Produção */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#17212B]/80 backdrop-blur-sm border border-[#FFFDF9]/20 text-[10px] uppercase tracking-wider font-semibold text-[#FFFDF9]">
                  Ensaio Exclusivo
                </div>

                {/* Título Sobreposto */}
                <div className="absolute bottom-4 left-4 right-4 text-[#FFFDF9]">
                  <h3 className="font-serif text-2xl font-bold tracking-tight">
                    {category.name}
                  </h3>
                </div>
              </div>

              {/* Descrição e CTA */}
              <div className="p-5 flex flex-col flex-1 justify-between bg-[#FFFDF9]">
                <p className="text-xs text-[#5E6973] leading-relaxed mb-4 line-clamp-2">
                  {category.description}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-[#E6E1D8] text-xs font-semibold uppercase tracking-wider text-[#17212B] group-hover:text-[#315B52] transition-colors">
                  <span>Criar Ensaio</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
