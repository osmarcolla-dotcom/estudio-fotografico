import { NextRequest, NextResponse } from 'next/server';
import { JobQueue } from '@/lib/domain/production/queue/job-queue';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-signature') || req.headers.get('webhook-signature');

    // Validação básica do corpo
    if (!rawBody || rawBody.trim().length === 0) {
      return NextResponse.json({ success: false, message: 'Payload vazio' }, { status: 400 });
    }

    let payload: any;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ success: false, message: 'JSON inválido' }, { status: 400 });
    }

    const { id: providerJobId, status, output, error, session_id: sessionId, photo_index: photoIndex } = payload;

    // Log estruturado do webhook recebido
    if (sessionId) {
      await JobQueue.logEvent(sessionId, 'GENERATE', status === 'succeeded' ? 'SUCCESS' : 'FAILED', {
        provider: 'webhook-callback',
        error: error || null,
        metadata: { providerJobId, status },
      });
    }

    // Se o webhook confirmou conclusão com imagem
    if (status === 'succeeded' && output && sessionId && photoIndex) {
      const supabase = createAdminClient();
      if (supabase) {
        const imageUrl = Array.isArray(output) ? output[0] : output;

        // Atualiza versão ativa da foto
        await supabase
          .from('produced_photos')
          .update({
            preview_storage_path: imageUrl,
            final_storage_path: imageUrl,
            updated_at: new Date().toISOString(),
          })
          .eq('order_id', sessionId.replace('session-', '').split('-')[0])
          .eq('photo_index', photoIndex);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Webhook do provedor de imagens processado com sucesso.',
    });
  } catch (error: any) {
    console.error('Erro no webhook de imagens:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Erro interno no webhook' },
      { status: 500 }
    );
  }
}
