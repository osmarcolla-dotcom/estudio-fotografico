import Link from 'next/link';
import { Camera, Sparkles, ShieldCheck } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#F6F4EF]/90 backdrop-blur-md border-b border-[#E6E1D8] transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        {/* Logo & Marca do Estúdio */}
        <Link href="/" className="group flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-full bg-[#17212B] text-[#F6F4EF] flex items-center justify-center transition-transform group-hover:scale-105 duration-300">
            <Camera className="w-5 h-5 text-[#D9D1C2]" />
          </div>
          <div>
            <span className="block font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#17212B] leading-none">
              Estúdio Fotográfico
            </span>
            <span className="block text-[11px] tracking-[0.2em] uppercase text-[#5E6973] font-medium mt-0.5">
              Digital & Personalizado
            </span>
          </div>
        </Link>

        {/* Links de Apoio e CTA */}
        <div className="flex items-center gap-4 sm:gap-6">
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#5E6973]">
            <Link href="/#categorias" className="hover:text-[#17212B] transition-colors">
              Categorias
            </Link>
            <Link href="/#como-funciona" className="hover:text-[#17212B] transition-colors">
              Como Funciona
            </Link>
            <Link href="/#pacotes" className="hover:text-[#17212B] transition-colors">
              Pacotes
            </Link>
          </nav>

          <Link
            href="/criar-ensaio"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#17212B] text-[#FFFDF9] text-xs sm:text-sm font-semibold tracking-wide uppercase shadow-sm hover:bg-[#315B52] transition-all duration-300 transform active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-[#C98576]" />
            <span>Criar Ensaio</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
