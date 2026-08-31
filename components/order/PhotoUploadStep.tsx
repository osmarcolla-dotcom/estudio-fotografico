'use client';

import { useState, useRef } from 'react';
import { Upload, Camera, AlertCircle, X, Check, Sparkles, Image as ImageIcon } from 'lucide-react';

export interface UploadedPhotoItem {
  fileName: string;
  fileSize: number;
  mimeType: string;
  base64Data?: string;
  previewUrl: string;
  width?: number;
  height?: number;
}

interface PhotoUploadStepProps {
  photos: UploadedPhotoItem[];
  onPhotosChange: (photos: UploadedPhotoItem[]) => void;
  error?: string;
}

export function PhotoUploadStep({ photos, onPhotosChange, error }: PhotoUploadStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [processingError, setProcessingError] = useState<string | null>(null);

  const processFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setProcessingError(null);

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
    const maxSizeBytes = 25 * 1024 * 1024; // 25MB

    Array.from(files).forEach((file) => {
      if (!allowedTypes.includes(file.type.toLowerCase()) && !file.name.match(/\.(jpg|jpeg|png|webp|heic|heif)$/i)) {
        setProcessingError('Formato não suportado. Por favor, envie fotos em JPG, PNG ou WEBP.');
        return;
      }

      if (file.size > maxSizeBytes) {
        setProcessingError('O arquivo é muito grande. O tamanho máximo permitido é 25MB por foto.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const img = new Image();
        img.onload = () => {
          if (img.width < 400 || img.height < 400) {
            setProcessingError('A resolução da foto é muito baixa. Envie uma foto com pelo menos 400x400 pixels para garantir nitidez profissional.');
            return;
          }

          const newPhoto: UploadedPhotoItem = {
            fileName: file.name,
            fileSize: file.size,
            mimeType: file.type || 'image/jpeg',
            base64Data: result,
            previewUrl: result,
            width: img.width,
            height: img.height,
          };

          onPhotosChange([...photos, newPhoto]);
        };

        img.onerror = () => {
          setProcessingError('Não foi possível ler o arquivo. Ele pode estar corrompido.');
        };

        img.src = result;
      };

      reader.onerror = () => {
        setProcessingError('Falha ao processar o arquivo.');
      };

      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    const updated = photos.filter((_, i) => i !== index);
    onPhotosChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="text-center sm:text-left space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECE7DF] text-[#315B52] text-[11px] font-bold uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5 text-[#C98576]" />
          <span>Foto de Referência</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#17212B]">
          Envie sua foto para o ensaio
        </h2>
        <p className="text-xs sm:text-sm text-[#5E6973]">
          Nossa tecnologia preservará seu rosto, olhar, cabelo e traços com fidelidade absoluta de estúdio.
        </p>
      </div>

      {/* Dicas Visuais de Qualidade */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[#ECE7DF]/70 border border-[#D9D1C2] text-xs">
        <div className="flex items-start gap-2">
          <Check className="w-4 h-4 text-[#315B52] shrink-0 mt-0.5" />
          <span className="text-[#17212B]">Rosto bem iluminado e nítido</span>
        </div>
        <div className="flex items-start gap-2">
          <Check className="w-4 h-4 text-[#315B52] shrink-0 mt-0.5" />
          <span className="text-[#17212B]">Olhar direcionado ou ângulo natural</span>
        </div>
        <div className="flex items-start gap-2">
          <Check className="w-4 h-4 text-[#315B52] shrink-0 mt-0.5" />
          <span className="text-[#17212B]">Sem filtros pesados ou óculos escuros</span>
        </div>
      </div>

      {/* Dropzone de Upload */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          processFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`cursor-pointer relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all ${
          dragOver
            ? 'border-[#315B52] bg-[#315B52]/5 scale-[1.01]'
            : 'border-[#D9D1C2] bg-[#FFFDF9] hover:border-[#17212B] hover:bg-[#ECE7DF]/30'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic"
          multiple
          className="hidden"
          onChange={(e) => processFiles(e.target.files)}
        />

        <div className="w-16 h-16 rounded-full bg-[#ECE7DF] text-[#17212B] flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Upload className="w-7 h-7 text-[#315B52]" />
        </div>

        <h3 className="font-serif text-xl font-bold text-[#17212B] mb-1">
          Toque para enviar sua foto aqui
        </h3>
        <p className="text-xs text-[#5E6973] max-w-sm mx-auto">
          Você pode tirar uma selfie agora ou escolher da galeria (JPG, PNG ou WEBP).
        </p>
      </div>

      {/* Erros */}
      {(processingError || error) && (
        <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{processingError || error}</span>
        </div>
      )}

      {/* Galeria de Fotos Selecionadas */}
      {photos.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#17212B]">
            Foto Selecionada para a Produção
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {photos.map((photo, idx) => (
              <div key={idx} className="relative group rounded-2xl overflow-hidden bg-[#17212B] border-2 border-[#315B52] aspect-[4/5] shadow-md">
                <img
                  src={photo.previewUrl}
                  alt={photo.fileName}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removePhoto(idx);
                  }}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[#17212B]/80 text-[#FFFDF9] hover:bg-red-600 flex items-center justify-center transition-colors shadow"
                  title="Remover foto"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-0 inset-x-0 bg-[#17212B]/80 text-[#FFFDF9] text-[10px] p-2 truncate text-center font-medium">
                  Foto de Referência
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
