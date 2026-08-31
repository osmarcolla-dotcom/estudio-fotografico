'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/marketing/Header';
import { Footer } from '@/components/marketing/Footer';
import { CustomerStep } from '@/components/order/CustomerStep';
import { PhotoUploadStep, UploadedPhotoItem } from '@/components/order/PhotoUploadStep';
import { CategoryStep } from '@/components/order/CategoryStep';
import { StyleStep } from '@/components/order/StyleStep';
import { PackageStep } from '@/components/order/PackageStep';
import { SummaryStep } from '@/components/order/SummaryStep';
import { Category, Package, Style } from '@/lib/types';
import { CustomerDataInput, customerDataSchema } from '@/lib/validation';
import { DEFAULT_CATEGORIES, DEFAULT_PACKAGES, DEFAULT_STYLES } from '@/lib/data/catalog';
import { ArrowLeft, ArrowRight, Camera, Check } from 'lucide-react';

const STEPS = [
  { number: 1, title: 'Dados' },
  { number: 2, title: 'Foto' },
  { number: 3, title: 'Ensaio' },
  { number: 4, title: 'Estilo' },
  { number: 5, title: 'Pacote' },
  { number: 6, title: 'Resumo' },
];

function OrderWizardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [currentStep, setCurrentStep] = useState(1);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [packages, setPackages] = useState<Package[]>(DEFAULT_PACKAGES);
  const [styles, setStyles] = useState<Style[]>(DEFAULT_STYLES);

  // Estado do formulário
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

  // Pré-seleção via query params (ex: vindo da landing page)
  useEffect(() => {
    const catParam = searchParams.get('categoria');
    const pkgParam = searchParams.get('pacote');

    if (catParam) {
      const foundCat = categories.find((c) => c.id === catParam || c.slug === catParam);
      if (foundCat) {
        setSelectedCategoryId(foundCat.id);
      }
    } else if (categories.length > 0 && !selectedCategoryId) {
      setSelectedCategoryId(categories[0].id);
    }

    if (pkgParam) {
      const foundPkg = packages.find((p) => p.id === pkgParam || p.slug === pkgParam);
      if (foundPkg) {
        setSelectedPackageId(foundPkg.id);
      }
    } else if (packages.length > 0 && !selectedPackageId) {
      // Pacote profissional como padrão sugerido
      const popular = packages.find((p) => p.is_popular) || packages[0];
      setSelectedPackageId(popular.id);
    }
  }, [searchParams, categories, packages]);

  // Filtrar estilos da categoria selecionada
  const availableStyles = styles.filter(
    (s) => s.category_id === selectedCategoryId && s.is_active
  );

  // Auto-selecionar primeiro estilo ao mudar categoria
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
        setPhotoError('Por favor, envie pelo menos 1 foto nítida da pessoa.');
        return false;
      }
      setPhotoError(undefined);
      return true;
    }

    if (step === 3) {
      if (!selectedCategoryId) {
        setCategoryError('Selecione um tipo de ensaio para continuar.');
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

      // Redireciona para a página de confirmação e pagamento
      router.push(`/pedido/${data.orderId}`);
    } catch (err: any) {
      setSubmitError(err.message || 'Falha ao registrar pedido. Tente novamente.');
      setIsSubmitting(false);
    }
  };

  const currentCategory = categories.find((c) => c.id === selectedCategoryId);
  const currentStyle = styles.find((s) => s.id === selectedStyleId);
  const currentPackage = packages.find((p) => p.id === selectedPackageId);

  return (
    <div className="flex flex-col min-h-screen bg-[#F6F4EF]">
      <Header />

      <main className="flex-1 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">

          {/* Barra de Progresso em Etapas */}
          <div className="mb-8 sm:mb-12">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-full bg-[#D9D1C2] -z-0" />
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-[#315B52] -z-0 transition-all duration-300"
                style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
              />

              {STEPS.map((step) => {
                const isCompleted = currentStep > step.number;
                const isCurrent = currentStep === step.number;

                return (
                  <button
                    key={step.number}
                    type="button"
                    onClick={() => {
                      if (step.number < currentStep) setCurrentStep(step.number);
                    }}
                    disabled={step.number > currentStep}
                    className={`relative z-10 flex flex-col items-center group focus:outline-none ${
                      step.number > currentStep ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all shadow-sm ${
                        isCompleted
                          ? 'bg-[#315B52] text-[#FFFDF9]'
                          : isCurrent
                          ? 'bg-[#17212B] text-[#FFFDF9] ring-4 ring-[#D9D1C2]'
                          : 'bg-[#FFFDF9] border-2 border-[#D9D1C2] text-[#5E6973]'
                      }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4 text-[#FFFDF9]" /> : step.number}
                    </div>
                    <span
                      className={`text-[10px] sm:text-xs font-semibold uppercase tracking-wider mt-2 hidden sm:block ${
                        isCurrent ? 'text-[#17212B]' : 'text-[#5E6973]'
                      }`}
                    >
                      {step.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Container do Formulário */}
          <div className="bg-[#FFFDF9] border border-[#E6E1D8] rounded-3xl p-6 sm:p-10 shadow-sm">
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

            {/* Controles de Navegação (Exceto no resumo que possui botão próprio) */}
            {currentStep < 6 && (
              <div className="mt-10 pt-6 border-t border-[#E6E1D8] flex items-center justify-between">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-[#D9D1C2] text-xs font-semibold uppercase tracking-wider text-[#17212B] hover:bg-[#ECE7DF]/50 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Voltar</span>
                  </button>
                ) : (
                  <div />
                )}

                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#17212B] text-[#FFFDF9] text-xs font-semibold uppercase tracking-wider hover:bg-[#315B52] shadow-sm transition-all"
                >
                  <span>Avançar</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function OrderWizardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F6F4EF] flex items-center justify-center text-sm text-[#5E6973]">Carregando estúdio...</div>}>
      <OrderWizardContent />
    </Suspense>
  );
}
