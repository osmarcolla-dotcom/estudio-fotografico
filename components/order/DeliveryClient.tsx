'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProducedPhoto, Order, Category } from '@/lib/types';
import { DEFAULT_CATEGORIES } from '@/lib/data/catalog';
import {
  Download,
  Camera,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Eye,
  Heart,
  DownloadCloud,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DeliveryClientProps {
  order: Order;
  token: string;
  photos: ProducedPhoto[];
}

export function DeliveryClient({ order, token, photos }: DeliveryClientProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<ProducedPhoto | null>(null);
  const [downloading, setDownloading] = useState(false);

  // Dispara animação de celebração com confetes ao carregar a página
  useEffect(() => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#315B52', '#C98576', '#D9D1C2', '#17212B'],
      });
    } catch {
      // Silencioso se bloqueado pelo browser
    }
  }, []);

  // Outros ensaios recomendados para cross-sell
  const otherCategories = DEFAULT_CATEGORIES.filter(
    (c) => c.slug !== order.category_name?.toLowerCase().replace(/\s+/g, '-')
  ).slice(0, 3);

  const handleDownloadZip = () => {
    setDownloading(true);
    setTimeout(() => setDownloading(false), 4000);
  };

  return (
    <div className="min-h-screen bg-[#F6F4EF] flex flex-col justify-between text-[#17212B]">

      {/* Topo Limpo */}
      <header className="w-full bg-[#F6F4EF] border-b border-[#E6E1D8] py-4 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#17212B] text-[#FFFDF9] flex items-center justify-center shadow-sm">
              <Camera className="w-4 h-4 text-[#D9D1C2]" />
            </div>
            <div>
              <span className="font-serif text-xl font-bold tracking-tight block leading-none">
                Estúdio Fotográfico
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#5E6973] font-medium">
                Entrega em Alta Resolução
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#315B52] bg-[#ECE7DF] px-3.5 py-1 rounded-full">
            <CheckCircle2 className="w-4 h-4" />
            <span>Ensaio Concluído</span>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">

          {/* Card de Boas-Vindas e Download Principal */}
          <div className="bg-[#FFFDF9] border border-[#E6E1D8] rounded-3xl p-6 sm:p-10 shadow-sm text-center space-y-6">

            <div className="w-16 h-16 rounded-full bg-[#315B52] text-[#FFFDF9] flex items-center justify-center mx-auto shadow-md animate-bounce">
              <Sparkles className="w-8 h-8 text-[#D9D1C2]" />
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest font-bold text-[#C98576] block">
                {order.category_name} • {order.style_name}
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#17212B] tracking-tight">
                Parabéns pela sua aquisição! 📸
              </h1>
              <p className="text-sm sm:text-base text-[#5E6973] max-w-xl mx-auto leading-relaxed">
                Seu ensaio fotográfico profissional foi produzido com sucesso. Clique no botão abaixo para baixar todas as {photos.length} fotos em alta resolução em um único arquivo ZIP pronto para celular e computador.
              </p>
            </div>

            {/* Botão de Download Principal em ZIP */}
            <div className="pt-2 max-w-md mx-auto space-y-2">
              <a
                href={`/api/download/${token}`}
                download={`Ensaio_${order.order_number || 'fotos'}.zip`}
                onClick={handleDownloadZip}
                className="w-full py-4 px-8 rounded-full bg-[#17212B] hover:bg-[#315B52] text-[#FFFDF9] text-sm sm:text-base font-semibold uppercase tracking-wider inline-flex items-center justify-center gap-3 shadow-xl transition-all transform active:scale-95"
              >
                <DownloadCloud className="w-5 h-5 text-[#D9D1C2]" />
                <span>{downloading ? 'Baixando Arquivos...' : 'BAIXAR TODAS AS FOTOS EM 1 CLIQUE'}</span>
              </a>
              <span className="text-[11px] text-[#5E6973] block">
                Arquivo .ZIP com todas as fotografias em alta definição (JPG)
              </span>
            </div>

            <div className="pt-4 border-t border-[#E6E1D8] flex items-center justify-center gap-2 text-xs text-[#5E6973]">
              <ShieldCheck className="w-4 h-4 text-[#315B52]" />
              <span>Suas fotos são 100% confidenciais e protegidas.</span>
            </div>

          </div>

          {/* Galeria de Fotos Entregues */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl font-bold text-[#17212B]">
                Suas Fotografias ({photos.length})
              </h2>
              <span className="text-xs text-[#5E6973]">Toque para ver em tela cheia</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {photos.map((photo) => (
                <div
                  key={photo.id || photo.photo_index}
                  className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-[#17212B] border border-[#D9D1C2] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div
                    onClick={() => setSelectedPhoto(photo)}
                    className="cursor-pointer w-full h-full relative"
                  >
                    <img
                      src={photo.preview_storage_path}
                      alt={`Foto ${photo.photo_index}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#17212B]/80 text-[#FFFDF9] text-[10px] font-bold">
                      #{photo.photo_index}
                    </div>
                  </div>

                  {/* Botão de download individual da foto */}
                  <a
                    href={photo.preview_storage_path}
                    download={`Foto_${photo.photo_index}.jpg`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-2 right-2 p-2 rounded-xl bg-[#17212B]/85 text-[#FFFDF9] hover:bg-[#315B52] transition-colors shadow"
                    title="Baixar esta foto avulsa"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* SEÇÃO DE UPSELL / OUTROS ENSAIOS */}
          <div className="bg-[#FFFDF9] border border-[#E6E1D8] rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECE7DF] text-[#315B52] text-[11px] font-bold uppercase tracking-wider">
                <Heart className="w-3.5 h-3.5 text-[#C98576] fill-current" />
                <span>Gostou da Experiência?</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#17212B]">
                Que tal criar mais um ensaio fotográfico?
              </h3>
              <p className="text-xs sm:text-sm text-[#5E6973] leading-relaxed">
                Aproveite para eternizar outros momentos especiais. Escolha uma das opções abaixo e crie uma nova produção em minutos:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {otherCategories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/criar-ensaio?categoria=${cat.slug}`}
                  className="group rounded-2xl overflow-hidden border border-[#E6E1D8] bg-[#F6F4EF] hover:border-[#17212B] hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="aspect-[16/10] w-full overflow-hidden bg-[#17212B] relative">
                    <img
                      src={cat.sample_image_url || 'https://images.unsplash.com/photo-1544126592-807ade215a0b'}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#17212B]/70 via-transparent to-transparent" />
                    <span className="absolute bottom-2 left-3 text-xs font-bold text-[#FFFDF9] font-serif">
                      {cat.name}
                    </span>
                  </div>

                  <div className="p-3.5 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#315B52]">
                    <span>Criar Ensaio</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center pt-2">
              <Link
                href="/criar-ensaio"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#17212B] text-[#FFFDF9] text-xs font-bold uppercase tracking-wider hover:bg-[#315B52] transition-colors"
              >
                <span>Ver Todos os Tipos de Ensaio</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </main>

      {/* Modal de Zoom */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-[#17212B]/95 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full bg-[#17212B] rounded-3xl overflow-hidden border border-[#D9D1C2]/20 p-4 space-y-3 text-center"
          >
            <div className="flex justify-between items-center text-[#FFFDF9] px-2">
              <span className="font-serif font-bold text-base">Foto #{selectedPhoto.photo_index}</span>
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="text-xs uppercase font-semibold text-[#D9D1C2] hover:text-white"
              >
                Fechar ✕
              </button>
            </div>

            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-black max-h-[70vh] flex items-center justify-center">
              <img
                src={selectedPhoto.preview_storage_path}
                alt="Foto ampliada"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="pt-2">
              <a
                href={selectedPhoto.preview_storage_path}
                download={`Foto_${selectedPhoto.photo_index}.jpg`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#315B52] text-[#FFFDF9] text-xs font-bold uppercase tracking-wider hover:bg-[#3d6d63]"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Baixar esta foto avulsa</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Rodapé */}
      <footer className="py-4 text-center text-xs text-[#5E6973] border-t border-[#E6E1D8]">
        <p>© {new Date().getFullYear()} Estúdio Fotográfico Digital. Obrigado pela preferência!</p>
      </footer>

    </div>
  );
}
