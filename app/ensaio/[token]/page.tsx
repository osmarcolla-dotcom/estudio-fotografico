import { notFound } from 'next/navigation';
import { DeliveryClient } from '@/components/order/DeliveryClient';
import { OrderService } from '@/lib/domain/orders/service';
import { ProducedPhoto } from '@/lib/types';

interface DeliveryPageProps {
  params: Promise<{ token: string }>;
}

export default async function DeliveryPage({ params }: DeliveryPageProps) {
  const { token } = await params;
  const order = await OrderService.getOrderByApprovalToken(token);

  // Amostras demonstrativas de alta definição para entrega
  const defaultPhotos: ProducedPhoto[] = Array.from(
    { length: order?.package_photo_count || 6 },
    (_, i) => ({
      id: `delivery-photo-${i + 1}`,
      order_id: order?.id || 'demo-order',
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
      }?auto=format&fit=crop&w=1200&q=90`,
      final_storage_path: `final-images/${order?.id || 'demo'}/photo_${i + 1}.jpg`,
      variation_description: `Fotografia ${i + 1} em alta resolução com acabamento profissional de estúdio.`,
      is_approved: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
  );

  const photos =
    order?.produced_photos && order.produced_photos.length > 0
      ? order.produced_photos
      : defaultPhotos;

  return (
    <DeliveryClient
      order={order || {
        id: 'demo-order',
        order_number: 'ENS-2608-8472',
        customer_id: 'cust-demo',
        category_id: 'cat-demo',
        style_id: 'style-demo',
        package_id: 'pkg-demo',
        package_name: 'Pacote Profissional',
        package_photo_count: 12,
        package_price_cents: 2990,
        category_name: 'Gravidez',
        style_name: 'Elegante',
        status: 'COMPLETED',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }}
      token={token}
      photos={photos}
    />
  );
}
