import { NextRequest, NextResponse } from 'next/server';
import { JobQueue } from '@/lib/domain/production/queue/job-queue';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();

    if (!rawBody || rawBody.trim().length === 0) {
      return NextResponse.json({ success: false, message: 'Payload vazio' }, { status: 400 });
    }

    let payload: any;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ success: false, message: 'JSON inválido' }, { status: 400 });
    }

    const { id: providerJobId, status, output, error } = payload;

    // Log estruturado do retorno do webhook oficial
    await JobQueue.logEvent('webhook-global', 'GENERATE', status === 'succeeded' ? 'SUCCESS' : 'FAILED', {
      provider: 'replicate-webhook',
      error: error || null,
      metadata: { providerJobId, status },
    });

    if (status === 'succeeded' && output) {
      const imageUrl = Array.isArray(output) ? output[0] : output;
      const supabase = createAdminClient();

      if (supabase) {
        // Atualiza a foto produzida correspondente pelo provider_job_id
        await supabase
          .from('photo_jobs')
          .update({
            status: 'COMPLETED',
            updated_at: new Date().toISOString(),
          })
          .eq('provider_job_id', providerJobId);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Notificação do provedor de geração recebida com sucesso.',
    });
  } catch (error: any) {
    console.error('Erro no webhook de geração de imagens:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Erro interno no webhook' },
      { status: 500 }
    );
  }
}
