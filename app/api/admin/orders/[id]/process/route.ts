import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { OrderService } from '@/lib/domain/orders/service';
import { ProductionService } from '@/lib/domain/production/service';
import { NotificationService } from '@/lib/domain/notifications/service';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params;
    const order = await OrderService.getOrderById(orderId);

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Pedido não encontrado.' },
        { status: 404 }
      );
    }

    const photoUrls = order.customer_photos?.map((p) => p.storage_path) || [];
    const supabase = createAdminClient();

    // 1. Atualizar status para IN_PRODUCTION
    if (supabase) {
      await supabase
        .from('orders')
        .update({
          status: 'IN_PRODUCTION',
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId);
    }

    // 2. Disparar notificação via WhatsApp avisando que a produção começou
    if (order.customer) {
      await NotificationService.notifyCustomer({
        toPhone: order.customer.whatsapp,
        template: 'PRODUCTION_STARTED',
        params: {
          customerName: order.customer.name,
          orderNumber: order.order_number,
          photoCount: order.package_photo_count,
        },
      }).catch((err) => console.error('Erro no disparo do WhatsApp:', err));
    }

    // 3. Iniciar processamento através do ProductionService (pipeline completo desacoplado)
    const session = await ProductionService.startProduction(order, photoUrls);

    return NextResponse.json({
      success: session.status !== 'FAILED',
      sessionId: session.id,
      status: session.status,
      completedPhotos: session.completed_photos,
      totalPhotos: session.total_photos,
      message: session.status === 'READY_FOR_REVIEW'
        ? 'Produção fotográfica concluída e fotos geradas com sucesso!'
        : session.status === 'FAILED'
        ? `Falha na produção: ${session.error_message || 'Erro desconhecido'}`
        : 'Esteira de produção fotográfica em andamento.',
    });
  } catch (error: any) {
    console.error('Erro ao disparar produção:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Erro ao processar produção.' },
      { status: 500 }
    );
  }
}
