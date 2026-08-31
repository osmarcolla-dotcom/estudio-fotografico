import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { updateOrderStatusSchema } from '@/lib/validation';
import { OrderService } from '@/lib/domain/orders/service';
import { NotificationService } from '@/lib/domain/notifications/service';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params;
    const body = await req.json();
    const validation = updateOrderStatusSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: 'Status informado inválido.' },
        { status: 400 }
      );
    }

    const { status: newStatus, notes } = validation.data;
    const supabase = createAdminClient();

    if (!supabase) {
      return NextResponse.json({
        success: true,
        message: `Status atualizado para ${newStatus} (modo de demonstração).`,
      });
    }

    // 1. Atualizar status do pedido
    const success = await OrderService.updateStatus(orderId, newStatus, notes);
    if (!success) {
      throw new Error('Falha ao atualizar pedido no banco de dados.');
    }

    // 2. Se mudou para READY_FOR_APPROVAL, notificar cliente com o link
    if (newStatus === 'READY_FOR_APPROVAL') {
      const order = await OrderService.getOrderById(orderId);
      if (order?.customer && order.approval_link) {
        const approvalUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/ensaio/${order.approval_link.token}`;
        await NotificationService.notifyCustomer({
          toPhone: order.customer.whatsapp,
          template: 'READY_FOR_APPROVAL',
          params: {
            customerName: order.customer.name,
            orderNumber: order.order_number,
            approvalUrl,
          },
        }).catch((err) => console.error('Erro no disparo do WhatsApp:', err));
      }
    }

    return NextResponse.json({
      success: true,
      message: `Status do pedido atualizado para ${newStatus}.`,
    });
  } catch (error: any) {
    console.error('Erro na atualização de status:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Erro ao alterar status.' },
      { status: 500 }
    );
  }
}
