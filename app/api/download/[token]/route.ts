import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import JSZip from 'jszip';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const supabase = createAdminClient();

    let orderNumber = 'ensaio-fotografico';
    let photoUrls: string[] = [];

    if (supabase) {
      // 1. Obter link e pedido no Supabase
      const { data: linkData, error: linkErr } = await supabase
        .from('approval_links')
        .select('*, order:orders(*, produced_photos(*))')
        .eq('token', token)
        .maybeSingle();

      if (linkData && linkData.order) {
        orderNumber = linkData.order.order_number || 'ensaio';
        const produced = linkData.order.produced_photos || [];
        photoUrls = produced.map((p: any) => p.final_storage_path || p.preview_storage_path).filter(Boolean);
      }
    }

    // Se não encontrou no banco ou não tem fotos, usa fotos demonstrativas de alta qualidade
    if (photoUrls.length === 0) {
      photoUrls = [
        'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=1600&q=90',
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=90',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1600&q=90',
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1600&q=90',
        'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1600&q=90',
        'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=1600&q=90',
      ];
    }

    // 2. Cria arquivo ZIP real contendo todas as fotos em JPG
    const zip = new JSZip();
    const folder = zip.folder(`Ensaio_${orderNumber}`);

    const fetchPromises = photoUrls.map(async (url, idx) => {
      try {
        const imageRes = await fetch(url);
        if (imageRes.ok) {
          const arrayBuffer = await imageRes.arrayBuffer();
          folder?.file(`Foto_${idx + 1}_Alta_Resolucao.jpg`, arrayBuffer);
        }
      } catch (err) {
        console.error(`Erro ao baixar foto ${idx + 1}:`, err);
      }
    });

    await Promise.all(fetchPromises);

    // 3. Gera o arquivo .zip binário para download direto com 1 clique
    const zipBuffer = await zip.generateAsync({
      type: 'uint8array',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 },
    });

    return new Response(zipBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="Ensaio_${orderNumber}.zip"`,
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error: any) {
    console.error('Erro na rota de download:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Erro ao gerar arquivo de download.' },
      { status: 500 }
    );
  }
}
