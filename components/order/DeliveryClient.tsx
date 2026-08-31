'use client';

import { useState } from 'react';
import { ProducedPhoto, Order } from '@/lib/types';
import { Download, Camera, CheckCircle2, ShieldCheck, Sparkles, Image as ImageIcon, ExternalLink } from 'lucide-react';

interface DeliveryClientProps {
  order: Order;
  token: string;
  photos: ProducedPhoto[];
}

export function DeliveryClient({ order, token, photos }: DeliveryClientProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<ProducedPhoto | null>(null);

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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">

          {/* Card de Boas-Vindas e Download Principal */}
          <div className="bg-[#FFFDF9] border border-[#E6E1D8] rounded-3xl p-6 sm:p-10 shadow-sm text-center space-y-6">

            <div className="w-16 h-16 rounded-full bg-[#315B52] text-[#FFFDF9] flex items-center justify-center mx-auto shadow-md">
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
                Seu ensaio fotográfico foi produzido em alta resolução e já está pronto para download.
              </p>
            </div>

            {/* Botão de Download Principal */}
            <div className="pt-2 max-w-md mx-auto">
              <a
                href={`/api/download/${token}`}
                download
                className="w-full py-4 px-8 rounded-full bg-[#17212B] hover:bg-[#315B52] text-[#FFFDF9] text-sm sm:text-base font-semibold uppercase tracking-wider inline-flex items-center justify-center gap-3 shadow-xl transition-all transform active:scale-95"
              >
                <Download className="w-5 h-5 text-[#D9D1C2]" />
                <span>BAIXAR ENSAIO EM ALTA RESOLUÇÃO</span>
              </a>
              <span className="text-[11px] text-[#5E6973] block mt-2">
                Arquivo com todas as {photos.length} fotos em resolução máxima
              </span>
            </div>

            <div className="pt-4 border-t border-[#E6E1D8] flex items-center justify-center gap-2 text-xs text-[#5E6973]">
              <ShieldCheck className="w-4 h-4 text-[#315B52]" />
              <span>Fotos protegidas e exclusivas para você</span>
            </div>

          </div>

          {/* Galeria de Fotos Entregues */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl font-bold text-[#17212B]">
                Suas Fotografias ({photos.length})
              </h2>
              <span className="text-xs text-[#5E6973]">Toque na foto para ampliar</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {photos.map((photo) => (
                <div
                  key={photo.id || photo.photo_index}
                  onClick={() => setSelectedPhoto(photo)}
                  className="cursor-pointer group relative rounded-2xl overflow-hidden aspect-[4/5] bg-[#17212B] border border-[#D9D1C2] shadow-sm hover:shadow-md transition-all"
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
              ))}
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
