'use client';

import { useState } from 'react';
import { Category, Package, Style } from '@/lib/types';
import { formatCurrencyBRL } from '@/lib/utils';
import {
  Layers,
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Camera,
  Star,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

interface CatalogManagementClientProps {
  initialCategories: Category[];
  initialPackages: Package[];
  initialStyles: Style[];
}

export function CatalogManagementClient({
  initialCategories,
  initialPackages,
  initialStyles,
}: CatalogManagementClientProps) {
  const [activeTab, setActiveTab] = useState<'packages' | 'categories' | 'styles'>('packages');

  const [packages, setPackages] = useState<Package[]>(initialPackages);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [styles, setStyles] = useState<Style[]>(initialStyles);

  // Estados de edição de pacote
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [pkgName, setPkgName] = useState('');
  const [pkgSlug, setPkgSlug] = useState('');
  const [pkgPriceCents, setPkgPriceCents] = useState<number>(1990);
  const [pkgPhotoCount, setPkgPhotoCount] = useState<number>(6);
  const [pkgDescription, setPkgDescription] = useState('');
  const [pkgIsPopular, setPkgIsPopular] = useState(false);

  // Estados de edição de categoria
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catDescription, setCatDescription] = useState('');
  const [catSampleUrl, setCatSampleUrl] = useState('');

  // Estados de edição de estilo
  const [editingStyle, setEditingStyle] = useState<Style | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    initialCategories[0]?.id || ''
  );
  const [styleName, setStyleName] = useState('');
  const [styleSlug, setStyleSlug] = useState('');
  const [styleDescription, setStyleDescription] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Salvar Pacote no Banco de Dados Real
  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);
    setErrorMessage(null);

    const payload = {
      id: editingPackage?.id,
      name: pkgName,
      slug: pkgSlug || pkgName.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'),
      price_cents: pkgPriceCents,
      photo_count: pkgPhotoCount,
      description: pkgDescription,
      is_popular: pkgIsPopular,
      is_active: editingPackage ? editingPackage.is_active : true,
      display_order: editingPackage ? editingPackage.display_order : packages.length + 1,
    };

    try {
      const res = await fetch('/api/admin/catalog/package', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Falha ao salvar pacote.');
      }

      if (editingPackage) {
        setPackages((prev) =>
          prev.map((p) => (p.id === editingPackage.id ? (data.package || { ...p, ...payload }) : p))
        );
        setFeedback('Pacote atualizado com sucesso no banco de dados!');
      } else {
        setPackages((prev) => [...prev, data.package || payload]);
        setFeedback('Novo pacote cadastrado e publicado com sucesso!');
      }

      setEditingPackage(null);
      resetPackageForm();
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const resetPackageForm = () => {
    setPkgName('');
    setPkgSlug('');
    setPkgPriceCents(1990);
    setPkgPhotoCount(6);
    setPkgDescription('');
    setPkgIsPopular(false);
  };

  const startEditPackage = (pkg: Package) => {
    setEditingPackage(pkg);
    setPkgName(pkg.name);
    setPkgSlug(pkg.slug);
    setPkgPriceCents(pkg.price_cents);
    setPkgPhotoCount(pkg.photo_count);
    setPkgDescription(pkg.description || '');
    setPkgIsPopular(pkg.is_popular);
  };

  const togglePackageActive = async (pkg: Package) => {
    const updatedStatus = !pkg.is_active;
    try {
      await fetch('/api/admin/catalog/package', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...pkg, is_active: updatedStatus }),
      });
      setPackages((prev) =>
        prev.map((p) => (p.id === pkg.id ? { ...p, is_active: updatedStatus } : p))
      );
      setFeedback(`Pacote ${updatedStatus ? 'ativado' : 'desativado'} com sucesso!`);
    } catch {
      // Reverte em caso de erro
    }
  };

  // Salvar Categoria no Banco Real
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);
    setErrorMessage(null);

    const payload = {
      id: editingCategory?.id,
      name: catName,
      slug: catSlug || catName.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'),
      description: catDescription,
      sample_image_url: catSampleUrl || null,
      is_active: editingCategory ? editingCategory.is_active : true,
      display_order: editingCategory ? editingCategory.display_order : categories.length + 1,
    };

    try {
      const res = await fetch('/api/admin/catalog/category', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Falha ao salvar categoria.');
      }

      if (editingCategory) {
        setCategories((prev) =>
          prev.map((c) => (c.id === editingCategory.id ? (data.category || { ...c, ...payload }) : c))
        );
        setFeedback('Categoria atualizada com sucesso!');
      } else {
        setCategories((prev) => [...prev, data.category || payload]);
        setFeedback('Nova categoria criada com sucesso!');
      }

      setEditingCategory(null);
      resetCategoryForm();
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const resetCategoryForm = () => {
    setCatName('');
    setCatSlug('');
    setCatDescription('');
    setCatSampleUrl('');
  };

  const startEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setCatName(cat.name);
    setCatSlug(cat.slug);
    setCatDescription(cat.description);
    setCatSampleUrl(cat.sample_image_url || '');
  };

  // Salvar Estilo no Banco Real
  const handleSaveStyle = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);
    setErrorMessage(null);

    const payload = {
      id: editingStyle?.id,
      category_id: selectedCategoryId,
      name: styleName,
      slug: styleSlug || styleName.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'),
      description: styleDescription,
      is_active: editingStyle ? editingStyle.is_active : true,
      display_order: editingStyle ? editingStyle.display_order : styles.length + 1,
    };

    try {
      const res = await fetch('/api/admin/catalog/style', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Falha ao salvar estilo.');
      }

      if (editingStyle) {
        setStyles((prev) =>
          prev.map((s) => (s.id === editingStyle.id ? (data.style || { ...s, ...payload }) : s))
        );
        setFeedback('Estilo atualizado com sucesso!');
      } else {
        setStyles((prev) => [...prev, data.style || payload]);
        setFeedback('Novo estilo criado com sucesso!');
      }

      setEditingStyle(null);
      resetStyleForm();
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const resetStyleForm = () => {
    setStyleName('');
    setStyleSlug('');
    setStyleDescription('');
  };

  const startEditStyle = (style: Style) => {
    setEditingStyle(style);
    setSelectedCategoryId(style.category_id);
    setStyleName(style.name);
    setStyleSlug(style.slug);
    setStyleDescription(style.description || '');
  };

  return (
    <div className="space-y-8">

      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#17212B]">
            Gerenciamento de Catálogo
          </h1>
          <p className="text-xs sm:text-sm text-[#5E6973] mt-1">
            Altere preços, pacotes, categorias e estilos visuais do estúdio sem modificar código.
          </p>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div className="p-4 rounded-2xl bg-[#315B52]/10 border border-[#315B52] text-[#315B52] text-xs sm:text-sm flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{feedback}</span>
          </div>
          <button type="button" onClick={() => setFeedback(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button type="button" onClick={() => setErrorMessage(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Abas */}
      <div className="flex border-b border-[#E6E1D8] gap-4 text-xs font-semibold uppercase tracking-wider">
        <button
          type="button"
          onClick={() => setActiveTab('packages')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'packages'
              ? 'border-[#17212B] text-[#17212B]'
              : 'border-transparent text-[#5E6973] hover:text-[#17212B]'
          }`}
        >
          Pacotes de Fotos ({packages.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('categories')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'categories'
              ? 'border-[#17212B] text-[#17212B]'
              : 'border-transparent text-[#5E6973] hover:text-[#17212B]'
          }`}
        >
          Tipos de Ensaio ({categories.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('styles')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'styles'
              ? 'border-[#17212B] text-[#17212B]'
              : 'border-transparent text-[#5E6973] hover:text-[#17212B]'
          }`}
        >
          Estilos Visuais ({styles.length})
        </button>
      </div>

      {/* TAB 1: PACOTES */}
      {activeTab === 'packages' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Lista de Pacotes */}
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-[#FFFDF9] border border-[#E6E1D8] rounded-3xl p-6 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-serif text-xl font-bold text-[#17212B]">
                        {pkg.name}
                      </h3>
                      {pkg.is_popular && (
                        <span className="px-2 py-0.5 rounded-full bg-[#C98576] text-[#FFFDF9] text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                          <Star className="w-2.5 h-2.5 fill-current" />
                          <span>Destaque</span>
                        </span>
                      )}
                    </div>

                    <div className="mb-3">
                      <span className="font-serif text-3xl font-bold text-[#17212B]">
                        {formatCurrencyBRL(pkg.price_cents)}
                      </span>
                      <span className="text-xs text-[#315B52] font-semibold block mt-0.5">
                        {pkg.photo_count} fotos em alta resolução
                      </span>
                    </div>

                    <p className="text-xs text-[#5E6973] line-clamp-2 mb-4">
                      {pkg.description || 'Sem descrição cadastrada.'}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#E6E1D8] flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => startEditPackage(pkg)}
                      className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#17212B] hover:text-[#315B52]"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Editar</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => togglePackageActive(pkg)}
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full transition-colors ${
                        pkg.is_active
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}
                    >
                      {pkg.is_active ? 'Ativo na Loja' : 'Oculto'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Formulário de Pacote */}
          <div className="lg:col-span-5 bg-[#FFFDF9] border border-[#E6E1D8] rounded-3xl p-6 sm:p-8 shadow-sm">
            <h3 className="font-serif text-2xl font-bold text-[#17212B] mb-4 pb-3 border-b border-[#E6E1D8]">
              {editingPackage ? 'Editar Pacote' : 'Novo Pacote'}
            </h3>

            <form onSubmit={handleSavePackage} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-[#17212B] mb-1">
                  Nome do Pacote
                </label>
                <input
                  type="text"
                  required
                  value={pkgName}
                  onChange={(e) => setPkgName(e.target.value)}
                  placeholder="Ex: Pacote Exclusivo 20 Fotos"
                  className="w-full p-3 rounded-xl border border-[#D9D1C2] bg-[#F6F4EF] text-[#17212B] focus:ring-2 focus:ring-[#315B52]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[#17212B] mb-1">
                    Preço (em Centavos)
                  </label>
                  <input
                    type="number"
                    required
                    value={pkgPriceCents}
                    onChange={(e) => setPkgPriceCents(Number(e.target.value))}
                    placeholder="2990 = R$ 29,90"
                    className="w-full p-3 rounded-xl border border-[#D9D1C2] bg-[#F6F4EF] text-[#17212B] focus:ring-2 focus:ring-[#315B52]"
                  />
                  <span className="text-[10px] text-[#5E6973] block mt-1">
                    Valor formatado: <strong>{formatCurrencyBRL(pkgPriceCents)}</strong>
                  </span>
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[#17212B] mb-1">
                    Quantidade de Fotos
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={pkgPhotoCount}
                    onChange={(e) => setPkgPhotoCount(Number(e.target.value))}
                    className="w-full p-3 rounded-xl border border-[#D9D1C2] bg-[#F6F4EF] text-[#17212B] focus:ring-2 focus:ring-[#315B52]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-[#17212B] mb-1">
                  Descrição Comercial
                </label>
                <textarea
                  rows={3}
                  value={pkgDescription}
                  onChange={(e) => setPkgDescription(e.target.value)}
                  placeholder="Descrição exibida no card do cliente..."
                  className="w-full p-3 rounded-xl border border-[#D9D1C2] bg-[#F6F4EF] text-[#17212B] focus:ring-2 focus:ring-[#315B52]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="pkgIsPopular"
                  checked={pkgIsPopular}
                  onChange={(e) => setPkgIsPopular(e.target.checked)}
                  className="w-4 h-4 text-[#315B52] rounded focus:ring-[#315B52]"
                />
                <label htmlFor="pkgIsPopular" className="text-xs font-semibold text-[#17212B]">
                  Marcar como "Mais Vendido / Destaque"
                </label>
              </div>

              <div className="pt-4 flex items-center gap-3">
                {editingPackage && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingPackage(null);
                      resetPackageForm();
                    }}
                    className="w-1/3 py-3 rounded-xl border border-[#D9D1C2] uppercase font-semibold text-[#5E6973] hover:bg-[#ECE7DF]"
                  >
                    Cancelar
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-3 rounded-xl bg-[#17212B] hover:bg-[#315B52] text-[#FFFDF9] uppercase font-semibold tracking-wider transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSaving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isSaving ? 'Salvando no Banco...' : editingPackage ? 'Salvar Alterações' : 'Criar e Publicar Pacote'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: CATEGORIAS */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Lista de Categorias */}
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="bg-[#FFFDF9] border border-[#E6E1D8] rounded-3xl p-5 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-[#17212B] text-[#FFFDF9] flex items-center justify-center font-serif font-bold text-sm">
                        {cat.name.charAt(0)}
                      </div>
                      <h3 className="font-serif text-xl font-bold text-[#17212B]">
                        {cat.name}
                      </h3>
                    </div>

                    <p className="text-xs text-[#5E6973] line-clamp-2 mb-3">
                      {cat.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#E6E1D8] flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => startEditCategory(cat)}
                      className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#17212B] hover:text-[#315B52]"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Editar</span>
                    </button>

                    <span className="text-[10px] font-mono text-[#5E6973]">
                      slug: {cat.slug}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Formulário de Categoria */}
          <div className="lg:col-span-5 bg-[#FFFDF9] border border-[#E6E1D8] rounded-3xl p-6 sm:p-8 shadow-sm">
            <h3 className="font-serif text-2xl font-bold text-[#17212B] mb-4 pb-3 border-b border-[#E6E1D8]">
              {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
            </h3>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-[#17212B] mb-1">
                  Nome da Categoria
                </label>
                <input
                  type="text"
                  required
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="Ex: Formatura & Conquistas"
                  className="w-full p-3 rounded-xl border border-[#D9D1C2] bg-[#F6F4EF] text-[#17212B] focus:ring-2 focus:ring-[#315B52]"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-[#17212B] mb-1">
                  Descrição Curta
                </label>
                <textarea
                  rows={3}
                  required
                  value={catDescription}
                  onChange={(e) => setCatDescription(e.target.value)}
                  placeholder="Descrição da temática..."
                  className="w-full p-3 rounded-xl border border-[#D9D1C2] bg-[#F6F4EF] text-[#17212B] focus:ring-2 focus:ring-[#315B52]"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-[#17212B] mb-1">
                  URL da Imagem de Exemplo
                </label>
                <input
                  type="url"
                  value={catSampleUrl}
                  onChange={(e) => setCatSampleUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-3 rounded-xl border border-[#D9D1C2] bg-[#F6F4EF] text-[#17212B] focus:ring-2 focus:ring-[#315B52]"
                />
              </div>

              <div className="pt-4 flex items-center gap-3">
                {editingCategory && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCategory(null);
                      resetCategoryForm();
                    }}
                    className="w-1/3 py-3 rounded-xl border border-[#D9D1C2] uppercase font-semibold text-[#5E6973] hover:bg-[#ECE7DF]"
                  >
                    Cancelar
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-3 rounded-xl bg-[#17212B] hover:bg-[#315B52] text-[#FFFDF9] uppercase font-semibold tracking-wider transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSaving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isSaving ? 'Salvando...' : editingCategory ? 'Salvar Alterações' : 'Criar Categoria'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: ESTILOS */}
      {activeTab === 'styles' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Lista de Estilos por Categoria */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-3 bg-[#FFFDF9] p-3 rounded-2xl border border-[#E6E1D8]">
              <span className="text-xs font-semibold text-[#5E6973] uppercase tracking-wider">Filtrar por Categoria:</span>
              <select
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                className="flex-1 p-2 rounded-xl border border-[#D9D1C2] bg-[#F6F4EF] text-xs font-medium text-[#17212B]"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {styles
                .filter((s) => s.category_id === selectedCategoryId)
                .map((style) => (
                  <div
                    key={style.id}
                    className="bg-[#FFFDF9] border border-[#E6E1D8] rounded-3xl p-5 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="font-serif text-xl font-bold text-[#17212B] mb-1">
                        {style.name}
                      </h3>
                      <p className="text-xs text-[#5E6973] line-clamp-2 mb-3">
                        {style.description || 'Iluminação e atmosfera personalizada de estúdio.'}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#E6E1D8] flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => startEditStyle(style)}
                        className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#17212B] hover:text-[#315B52]"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Editar</span>
                      </button>

                      <span className="text-[10px] font-mono text-[#5E6973]">
                        slug: {style.slug}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Formulário de Estilo */}
          <div className="lg:col-span-5 bg-[#FFFDF9] border border-[#E6E1D8] rounded-3xl p-6 sm:p-8 shadow-sm">
            <h3 className="font-serif text-2xl font-bold text-[#17212B] mb-4 pb-3 border-b border-[#E6E1D8]">
              {editingStyle ? 'Editar Estilo' : 'Novo Estilo'}
            </h3>

            <form onSubmit={handleSaveStyle} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-[#17212B] mb-1">
                  Categoria Pertencente
                </label>
                <select
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#D9D1C2] bg-[#F6F4EF] text-[#17212B] font-medium"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-[#17212B] mb-1">
                  Nome do Estilo
                </label>
                <input
                  type="text"
                  required
                  value={styleName}
                  onChange={(e) => setStyleName(e.target.value)}
                  placeholder="Ex: Golden Hour & Por do Sol"
                  className="w-full p-3 rounded-xl border border-[#D9D1C2] bg-[#F6F4EF] text-[#17212B] focus:ring-2 focus:ring-[#315B52]"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-[#17212B] mb-1">
                  Descrição do Estilo
                </label>
                <textarea
                  rows={3}
                  value={styleDescription}
                  onChange={(e) => setStyleDescription(e.target.value)}
                  placeholder="Ex: Iluminação quente e suave com bokeh natural..."
                  className="w-full p-3 rounded-xl border border-[#D9D1C2] bg-[#F6F4EF] text-[#17212B] focus:ring-2 focus:ring-[#315B52]"
                />
              </div>

              <div className="pt-4 flex items-center gap-3">
                {editingStyle && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingStyle(null);
                      resetStyleForm();
                    }}
                    className="w-1/3 py-3 rounded-xl border border-[#D9D1C2] uppercase font-semibold text-[#5E6973] hover:bg-[#ECE7DF]"
                  >
                    Cancelar
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-3 rounded-xl bg-[#17212B] hover:bg-[#315B52] text-[#FFFDF9] uppercase font-semibold tracking-wider transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSaving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isSaving ? 'Salvando...' : editingStyle ? 'Salvar Alterações' : 'Criar Estilo'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
