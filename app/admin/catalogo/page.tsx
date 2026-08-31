import { AdminNav } from '@/components/admin/AdminNav';
import { CatalogManagementClient } from '@/components/admin/CatalogManagementClient';
import { getCategories, getPackages, DEFAULT_STYLES } from '@/lib/data/catalog';

export const dynamic = 'force-dynamic';

export default async function AdminCatalogPage() {
  const [categories, packages] = await Promise.all([
    getCategories(),
    getPackages(),
  ]);

  return (
    <div className="min-h-screen bg-[#F6F4EF] flex flex-col">
      <AdminNav activeTab="catalogo" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        <CatalogManagementClient
          initialCategories={categories}
          initialPackages={packages}
          initialStyles={DEFAULT_STYLES}
        />
      </main>
    </div>
  );
}
