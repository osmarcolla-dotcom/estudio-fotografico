import Link from 'next/link';
import { Camera, ShieldCheck, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#17212B] text-[#F6F4EF] pt-16 pb-12 border-t border-[#17212B]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#2C3844]">
          {/* Coluna 1: Marca */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#315B52] text-[#FFFDF9] flex items-center justify-center">
                <Camera className="w-4 h-4 text-[#D9D1C2]" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight">
                Estúdio Fotográfico
              </span>
            </div>
            <p className="text-sm text-[#D9D1C2]/80 font-light max-w-md leading-relaxed">
              Produção de ensaios fotográficos digitais personalizados em alta resolução. Preservamos sua identidade, traços e expressões com acabamento editorial de estúdio.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#D9D1C2]/60 pt-2">
              <ShieldCheck className="w-4 h-4 text-[#315B52]" />
              <span>Privacidade garantida: seus arquivos são confidenciais e protegidos.</span>
            </div>
          </div>

          {/* Coluna 2: Ensaios */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#C98576]">
              Tipos de Ensaio
            </h4>
            <ul className="space-y-2 text-sm text-[#D9D1C2]/80">
              <li><Link href="/criar-ensaio?categoria=gravidez" className="hover:text-[#FFFDF9] transition-colors">Gravidez & Maternidade</Link></li>
              <li><Link href="/criar-ensaio?categoria=casamento" className="hover:text-[#FFFDF9] transition-colors">Casamento & Noivos</Link></li>
              <li><Link href="/criar-ensaio?categoria=debutante" className="hover:text-[#FFFDF9] transition-colors">Debutante (15 Anos)</Link></li>
              <li><Link href="/criar-ensaio?categoria=recem-nascido" className="hover:text-[#FFFDF9] transition-colors">Recém-nascido & Bebê</Link></li>
              <li><Link href="/criar-ensaio?categoria=sensual" className="hover:text-[#FFFDF9] transition-colors">Sensual & Boudoir</Link></li>
            </ul>
          </div>

          {/* Coluna 3: Atendimento e Acesso */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#C98576]">
              Atendimento & Suporte
            </h4>
            <p className="text-sm text-[#D9D1C2]/80 leading-relaxed">
              Atendimento exclusivo via WhatsApp para dúvidas e acompanhamento de produção.
            </p>
            <div className="pt-2">
              <Link
                href="/admin/login"
                className="text-xs text-[#D9D1C2]/50 hover:text-[#D9D1C2] transition-colors underline"
              >
                Acesso Administrativo
              </Link>
            </div>
          </div>
        </div>

        {/* Linha Inferior de Direitos */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#D9D1C2]/60 gap-4">
          <p>© {new Date().getFullYear()} Estúdio Fotográfico Digital. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1">
            Produzido com <Heart className="w-3 h-3 text-[#C98576] fill-current" /> para momentos inesquecíveis.
          </p>
        </div>
      </div>
    </footer>
  );
}
