'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CustomerStep } from '@/components/order/CustomerStep';
import { PhotoUploadStep, UploadedPhotoItem } from '@/components/order/PhotoUploadStep';
import { CategoryStep } from '@/components/order/CategoryStep';
import { StyleStep } from '@/components/order/StyleStep';
import { PackageStep } from '@/components/order/PackageStep';
import { SummaryStep } from '@/components/order/SummaryStep';
import { Category, Package, Style } from '@/lib/types';
import { CustomerDataInput, customerDataSchema } from '@/lib/validation';
import { DEFAULT_CATEGORIES, DEFAULT_PACKAGES, DEFAULT_STYLES } from '@/lib/data/catalog';
import { Camera, ArrowLeft, ArrowRight, Check, ShieldCheck, Sparkles } from 'lucide-react';

const STEPS = [
  { number: 1, title: 'Seus Dados' },
  { number: 2, title: 'Sua Foto' },
  { number: 3, title: 'Tipo de Ensaio' },
  { number: 4, title: 'Estilo Visual' },
  { number: 5, title: 'Pacote' },
  { number: 6, title: 'Confirmar & Pagar' },
];

function DirectOrderFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [currentStep, setCurrentStep] = useState(1);
  const [categories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [packages] = useState<Package[]>(DEFAULT_PACKAGES);
  const [styles] = useState<Style[]>(DEFAULT_STYLES);

  // Form State
  const [customer, setCustomer] = useState<CustomerDataInput>({
    name: '',
    whatsapp: '',
    email: '',
  });
  const [customerErrors, setCustomerErrors] = useState<Record<string, string>>({});

  const [photos, setPhotos] = useState<UploadedPhotoItem[]>([]);
  const [photoError, setPhotoError] = useState<string | undefined>();

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [categoryError, setCategoryError] = useState<string | undefined>();

  const [selectedStyleId, setSelectedStyleId] = useState<string>('');
  const [styleError, setStyleError] = useState<string | undefined>();

  const [selectedPackageId, setSelectedPackageId] = useState<string>('');
  const [packageError, setPackageError] = useState<string | undefined>();

  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Pré-seleção inteligente
  useEffect(() => {
    const catParam = searchParams.get('categoria');
    const pkgParam = searchParams.get('pacote');

    if (catParam) {
      const foundCat = categories.find((c) => c.id === catParam || c.slug === catParam);
      if (foundCat) setSelectedCategoryId(foundCat.id);
    } else if (categories.length > 0 && !selectedCategoryId) {
      setSelectedCategoryId(categories[0].id);
    }

    if (pkgParam) {
      const foundPkg = packages.find((p) => p.id === pkgParam || p.slug === pkgParam);
      if (foundPkg) setSelectedPackageId(foundPkg.id);
    } else if (packages.length > 0 && !selectedPackageId) {
      const popular = packages.find((p) => p.is_popular) || packages[0];
      setSelectedPackageId(popular.id);
    }
  }, [searchParams, categories, packages]);

  // Estilos da categoria selecionada
  const availableStyles = styles.filter(
    (s) => s.category_id === selectedCategoryId && s.is_active
  );

  useEffect(() => {
    if (selectedCategoryId && availableStyles.length > 0) {
      const styleBelongs = availableStyles.some((s) => s.id === selectedStyleId);
      if (!styleBelongs) {
        setSelectedStyleId(availableStyles[0].id);
      }
    }
  }, [selectedCategoryId, availableStyles, selectedStyleId]);

  // Validações por etapa
  const validateStep = (step: number): boolean => {
    if (step === 1) {
      const res = customerDataSchema.safeParse(customer);
      if (!res.success) {
        const errorsMap: Record<string, string> = {};
        res.error.errors.forEach((err) => {
          if (err.path[0]) errorsMap[err.path[0].toString()] = err.message;
        });
        setCustomerErrors(errorsMap);
        return false;
      }
      setCustomerErrors({});
      return true;
    }

    if (step === 2) {
      if (photos.length === 0) {
        setPhotoError('Por favor, adicione sua foto para o ensaio.');
        return false;
      }
      setPhotoError(undefined);
      return true;
    }

    if (step === 3) {
      if (!selectedCategoryId) {
        setCategoryError('Selecione o tipo de ensaio desejado.');
        return false;
      }
      setCategoryError(undefined);
      return true;
    }

    if (step === 4) {
      if (!selectedStyleId) {
        setStyleError('Selecione o estilo visual desejado.');
        return false;
      }
      setStyleError(undefined);
      return true;
    }

    if (step === 5) {
      if (!selectedPackageId) {
        setPackageError('Selecione um pacote de fotos.');
        return false;
      }
      setPackageError(undefined);
      return true;
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitOrder = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        customer,
        categoryId: selectedCategoryId,
        styleId: selectedStyleId,
        packageId: selectedPackageId,
        notes: notes || undefined,
        uploadedPhotos: photos.map((p) => ({
          fileName: p.fileName,
          fileSize: p.fileSize,
          mimeType: p.mimeType,
          base64Data: p.base64Data,
          width: p.width,
          height: p.height,
        })),
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Erro ao processar pedido.');
      }

      router.push(`/pedido/${data.orderId}`);
    } catch (err: any) {
      setSubmitError(err.message || 'Falha ao registrar pedido.');
      setIsSubmitting(false);
    }
  };

  const currentCategory = categories.find((c) => c.id === selectedCategoryId);
  const currentStyle = styles.find((s) => s.id === selectedStyleId);
  const currentPackage = packages.find((p) => p.id === selectedPackageId);

  return (
    <div className="min-h-screen bg-[#F6F4EF] flex flex-col justify-between text-[#17212B]">

      {/* Topo Limpo do Estúdio */}
      <header className="w-full bg-[#F6F4EF] border-b border-[#E6E1D8] py-4 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#17212B] text-[#FFFDF9] flex items-center justify-center shadow-sm">
              <Camera className="w-4 h-4 text-[#D9D1C2]" />
            </div>
            <div>
              <span className="font-serif text-xl font-bold tracking-tight block leading-none">
                Estúdio Fotográfico
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#5E6973] font-medium">
                Ensaio Personalizado em Alta Resolução
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal do Fluxo */}
      <main className="flex-1 py-6 sm:py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">

          {/* Barra de Progresso Rápida */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between text-xs font-semibold text-[#5E6973] mb-2">
              <span>Etapa {currentStep} de {STEPS.length}</span>
              <span className="text-[#17212B] font-bold">{STEPS[currentStep - 1].title}</span>
            </div>
            <div className="w-full h-2 bg-[#E6E1D8] rounded-full overflow-hidden">
              <div
                className="bg-[#17212B] h-full transition-all duration-300"
                style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Card do Formulário */}
          <div className="bg-[#FFFDF9] border border-[#E6E1D8] rounded-3xl p-6 sm:p-8 shadow-sm">
            {submitError && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                {submitError}
              </div>
            )}

            {currentStep === 1 && (
              <CustomerStep
                data={customer}
                onChange={(updated) => setCustomer((prev) => ({ ...prev, ...updated }))}
                errors={customerErrors}
              />
            )}

            {currentStep === 2 && (
              <PhotoUploadStep
                photos={photos}
                onPhotosChange={setPhotos}
                error={photoError}
              />
            )}

            {currentStep === 3 && (
              <CategoryStep
                categories={categories}
                selectedCategoryId={selectedCategoryId}
                onSelectCategory={setSelectedCategoryId}
                error={categoryError}
              />
            )}

            {currentStep === 4 && (
              <StyleStep
                styles={availableStyles}
                selectedStyleId={selectedStyleId}
                onSelectStyle={setSelectedStyleId}
                categoryName={currentCategory?.name}
                error={styleError}
              />
            )}

            {currentStep === 5 && (
              <PackageStep
                packages={packages}
                selectedPackageId={selectedPackageId}
                onSelectPackage={setSelectedPackageId}
                error={packageError}
              />
            )}

            {currentStep === 6 && (
              <SummaryStep
                customer={customer}
                category={currentCategory}
                style={currentStyle}
                packageItem={currentPackage}
                photos={photos}
                notes={notes}
                onNotesChange={setNotes}
                onSubmit={handleSubmitOrder}
                isSubmitting={isSubmitting}
              />
            )}

            {/* Controles Voltar / Avançar */}
            {currentStep < 6 && (
              <div className="mt-8 pt-6 border-t border-[#E6E1D8] flex items-center justify-between">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-[#D9D1C2] text-xs font-semibold uppercase text-[#5E6973] hover:text-[#17212B] hover:bg-[#ECE7DF] transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Voltar</span>
                  </button>
                ) : (
                  <div />
                )}

                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#17212B] hover:bg-[#315B52] text-[#FFFDF9] text-xs font-semibold uppercase tracking-wider transition-all shadow-md active:scale-95"
                >
                  <span>Avançar</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Rodapé Discreto */}
      <footer className="py-4 text-center text-xs text-[#5E6973] border-t border-[#E6E1D8]">
        <p>© {new Date().getFullYear()} Estúdio Fotográfico Digital. Suas fotos e dados são 100% confidenciais.</p>
      </footer>

    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F6F4EF] flex items-center justify-center text-xs text-[#5E6973]">Carregando estúdio...</div>}>
      <DirectOrderFlow />
    </Suspense>
  );
}
