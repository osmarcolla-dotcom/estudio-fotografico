import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { OrderService } from '@/lib/domain/orders/service';
import { NotificationService } from '@/lib/domain/notifications/service';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const supabase = createAdminClient();

    if (!supabase) {
      return NextResponse.json({
        success: true,
        message: 'Ensaio aprovado com sucesso (modo de demonstração).',
      });
    }

    // 1. Localizar link de aprovação pelo token
    const { data: linkData, error: linkErr } = await supabase
      .from('approval_links')
      .select('*, order:orders(*, customer:customers(*))')
      .eq('token', token)
      .single();

    if (linkErr || !linkData) {
      return NextResponse.json(
        { success: false, message: 'Link de aprovação inválido ou expirado.' },
        { status: 404 }
      );
    }

    const orderId = linkData.order_id;
    const now = new Date().toISOString();

    // 2. Atualizar status do link de aprovação e do pedido
    await supabase
      .from('approval_links')
      .update({ approved_at: now })
      .eq('id', linkData.id);

    await supabase
      .from('orders')
      .update({ status: 'APPROVED', updated_at: now })
      .eq('id', orderId);

    // 3. Notificar o cliente via WhatsApp (se configurado)
    if (linkData.order?.customer) {
      await NotificationService.notifyCustomer({
        toPhone: linkData.order.customer.whatsapp,
        template: 'APPROVED',
        params: {
          customerName: linkData.order.customer.name,
          orderNumber: linkData.order.order_number,
          downloadUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/ensaio/${token}`,
        },
      }).catch((err) => console.error('Erro ao enviar WhatsApp:', err));
    }

    return NextResponse.json({
      success: true,
      message: 'Ensaio aprovado com sucesso! Arquivos em alta resolução liberados.',
    });
  } catch (error: any) {
    console.error('Erro na aprovação do ensaio:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Erro ao processar aprovação.' },
      { status: 500 }
    );
  }
}
