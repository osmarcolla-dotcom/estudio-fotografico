import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { revisionRequestSchema } from '@/lib/validation';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const body = await req.json();
    const validation = revisionRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: 'Dados da solicitação inválidos.' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    if (!supabase) {
      return NextResponse.json({
        success: true,
        message: 'Solicitação de ajuste registrada com sucesso (modo demonstração).',
      });
    }

    // 1. Obter pedido pelo token
    const { data: linkData, error: linkErr } = await supabase
      .from('approval_links')
      .select('order_id')
      .eq('token', token)
      .single();

    if (linkErr || !linkData) {
      return NextResponse.json(
        { success: false, message: 'Link de aprovação não encontrado.' },
        { status: 404 }
      );
    }

    // 2. Inserir solicitação de ajuste
    const { error: revErr } = await supabase.from('revision_requests').insert({
      order_id: linkData.order_id,
      produced_photo_id: validation.data.producedPhotoId || null,
      photo_index: validation.data.photoIndex || null,
      reason: validation.data.reason,
      comment: validation.data.comment || null,
    });

    if (revErr) {
      throw new Error(`Falha ao registrar ajuste: ${revErr.message}`);
    }

    // 3. Atualizar status do pedido para REVISION_REQUESTED
    await supabase
      .from('orders')
      .update({ status: 'REVISION_REQUESTED', updated_at: new Date().toISOString() })
      .eq('id', linkData.order_id);

    return NextResponse.json({
      success: true,
      message: 'Solicitação de ajuste enviada ao estúdio.',
    });
  } catch (error: any) {
    console.error('Erro na solicitação de ajuste:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Erro ao processar ajuste.' },
      { status: 500 }
    );
  }
}
