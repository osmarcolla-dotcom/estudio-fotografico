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

  const [feedback, setFeedback] = useState<string | null>(null);

  // Salvar Pacote
  const handleSavePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPackage) {
      setPackages((prev) =>
        prev.map((p) =>
          p.id === editingPackage.id
            ? {
                ...p,
                name: pkgName,
                slug: pkgSlug,
                price_cents: pkgPriceCents,
                photo_count: pkgPhotoCount,
                description: pkgDescription,
                is_popular: pkgIsPopular,
              }
            : p
        )
      );
      setFeedback('Pacote atualizado com sucesso!');
    } else {
      const newPkg: Package = {
        id: `pkg-${Date.now()}`,
        name: pkgName,
        slug: pkgSlug || pkgName.toLowerCase().replace(/\s+/g, '-'),
        price_cents: pkgPriceCents,
        photo_count: pkgPhotoCount,
        description: pkgDescription,
        is_popular: pkgIsPopular,
        is_active: true,
        display_order: packages.length + 1,
      };
      setPackages((prev) => [...prev, newPkg]);
      setFeedback('Novo pacote adicionado com sucesso!');
    }
    setEditingPackage(null);
    resetPackageForm();
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

  // Salvar Categoria
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingCategory.id
            ? {
                ...c,
                name: catName,
                slug: catSlug,
                description: catDescription,
                sample_image_url: catSampleUrl || null,
              }
            : c
        )
      );
      setFeedback('Categoria atualizada com sucesso!');
    } else {
      const newCat: Category = {
        id: `cat-${Date.now()}`,
        name: catName,
        slug: catSlug || catName.toLowerCase().replace(/\s+/g, '-'),
        description: catDescription,
        sample_image_url: catSampleUrl || null,
        display_order: categories.length + 1,
        is_active: true,
      };
      setCategories((prev) => [...prev, newCat]);
      setFeedback('Nova categoria criada com sucesso!');
    }
    setEditingCategory(null);
    resetCategoryForm();
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

  // Salvar Estilo
  const handleSaveStyle = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStyle) {
      setStyles((prev) =>
        prev.map((s) =>
          s.id === editingStyle.id
            ? {
                ...s,
                category_id: selectedCategoryId,
                name: styleName,
                slug: styleSlug,
                description: styleDescription,
              }
            : s
        )
      );
      setFeedback('Estilo atualizado com sucesso!');
    } else {
      const newStyle: Style = {
        id: `style-${Date.now()}`,
        category_id: selectedCategoryId,
        name: styleName,
        slug: styleSlug || styleName.toLowerCase().replace(/\s+/g, '-'),
        description: styleDescription,
        display_order: styles.length + 1,
        is_active: true,
      };
      setStyles((prev) => [...prev, newStyle]);
      setFeedback('Novo estilo criado com sucesso!');
    }
    setEditingStyle(null);
    resetStyleForm();
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
                      onClick={() =>
                        setPackages((prev) =>
                          prev.map((p) =>
                            p.id === pkg.id ? { ...p, is_active: !p.is_active } : p
                          )
                        )
                      }
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                        pkg.is_active
                          ? 'bg-emerald-50 text-emerald-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {pkg.is_active ? 'Ativo' : 'Inativo'}
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
                  placeholder="Ex: Pacote Luxo"
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
                    {formatCurrencyBRL(pkgPriceCents)}
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
                  className="flex-1 py-3 rounded-xl bg-[#17212B] hover:bg-[#315B52] text-[#FFFDF9] uppercase font-semibold tracking-wider transition-colors"
                >
                  {editingPackage ? 'Salvar Alterações' : 'Criar Pacote'}
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
                  className="flex-1 py-3 rounded-xl bg-[#17212B] hover:bg-[#315B52] text-[#FFFDF9] uppercase font-semibold tracking-wider transition-colors"
                >
                  {editingCategory ? 'Salvar Alterações' : 'Criar Categoria'}
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
                  className="flex-1 py-3 rounded-xl bg-[#17212B] hover:bg-[#315B52] text-[#FFFDF9] uppercase font-semibold tracking-wider transition-colors"
                >
                  {editingStyle ? 'Salvar Alterações' : 'Criar Estilo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
