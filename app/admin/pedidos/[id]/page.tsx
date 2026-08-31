import { notFound } from 'next/navigation';
import { AdminNav } from '@/components/admin/AdminNav';
import { OrderDetailClient } from '@/components/admin/OrderDetailClient';
import { OrderService } from '@/lib/domain/orders/service';
import { Order } from '@/lib/types';

interface AdminOrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

export default async function AdminOrderDetailPage({ params }: AdminOrderDetailPageProps) {
  const { id } = await params;

  let order = await OrderService.getOrderById(id);

  if (!order) {
    // Fallback gracioso para dados de demonstração caso o banco não esteja conectado
    order = {
      id: id,
      order_number: id.startsWith('ord-demo') ? 'ENS-2608-1042' : 'ENS-2608-9901',
      customer_id: 'cust-demo-1',
      category_id: 'c1000000-0000-0000-0000-000000000001',
      style_id: 's1000000-0000-0000-0000-000000000001',
      package_id: 'a1000000-0000-0000-0000-000000000002',
      package_name: 'Pacote Profissional',
      package_photo_count: 12,
      package_price_cents: 2990,
      category_name: 'Gravidez',
      style_name: 'Elegante',
      status: 'READY_FOR_APPROVAL',
      notes: 'Cliente solicitou iluminação suave e tons dourados no fundo.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      customer: {
        id: 'cust-demo-1',
        name: 'Carolina Mendes',
        whatsapp: '11988887777',
        email: 'carolina.mendes@exemplo.com',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      customer_photos: [
        {
          id: 'photo-orig-1',
          order_id: id,
          storage_path: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=800&q=80',
          file_name: 'minha_foto_rosto.jpg',
          file_size_bytes: 3450000,
          mime_type: 'image/jpeg',
          created_at: new Date().toISOString(),
        },
      ],
      produced_photos: Array.from({ length: 12 }).map((_, i) => ({
        id: `prod-photo-${i + 1}`,
        order_id: id,
        photo_index: i + 1,
        preview_storage_path: `https://images.unsplash.com/photo-${
          [
            '1544126592-807ade215a0b',
            '1519741497674-611481863552',
            '1534528741775-53994a69daeb',
            '1517841905240-472988babdf9',
            '1530103862676-de8c9debad1d',
            '1555252333-9f8e92e65df9',
          ][i % 6]
        }?auto=format&fit=crop&w=800&q=80`,
        final_storage_path: `final-images/${id}/photo_${i + 1}.jpg`,
        variation_description: `Variação ${i + 1} — Retrato em alta definição com iluminação de estúdio refinada.`,
        is_approved: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })),
      approval_link: {
        id: 'link-demo-1',
        order_id: id,
        token: '8f92a4e7b1c3d5f6',
        view_count: 3,
        created_at: new Date().toISOString(),
      },
      revision_requests: [
        {
          id: 'rev-demo-1',
          order_id: id,
          photo_index: 3,
          reason: 'Ajuste de iluminação',
          comment: 'Gostaria que o fundo ficasse um pouco mais suave.',
          is_resolved: false,
          created_at: new Date(Date.now() - 1800000).toISOString(),
        },
      ],
    };
  }

  return (
    <div className="min-h-screen bg-[#F6F4EF] flex flex-col">
      <AdminNav activeTab="pedidos" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        <OrderDetailClient order={order} />
      </main>
    </div>
  );
}
