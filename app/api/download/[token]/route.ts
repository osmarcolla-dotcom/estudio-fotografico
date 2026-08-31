import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { SupabaseStorageService } from '@/lib/domain/storage/service';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const supabase = createAdminClient();

    // Se Supabase não estiver configurado, entrega resposta de demonstração
    if (!supabase) {
      return NextResponse.json({
        success: true,
        message: 'Em ambiente de produção com Supabase configurado, este endpoint gera um pacote ZIP ou URLs assinadas temporárias das fotos em alta resolução.',
        demo_download_urls: [
          'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=2400&q=100',
          'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2400&q=100',
        ],
      });
    }

    // 1. Obter link de aprovação e verificar se o ensaio está realmente aprovado
    const { data: linkData, error: linkErr } = await supabase
      .from('approval_links')
      .select('*, order:orders(*, produced_photos(*))')
      .eq('token', token)
      .single();

    if (linkErr || !linkData) {
      return NextResponse.json(
        { success: false, message: 'Link de download inválido ou expirado.' },
        { status: 404 }
      );
    }

    const order = linkData.order;

    // 2. Segurança rigorosa: O download só é liberado após a aprovação
    if (order.status !== 'APPROVED' && order.status !== 'COMPLETED') {
      return NextResponse.json(
        {
          success: false,
          message: 'O download das fotos em alta resolução só fica disponível após a aprovação do ensaio.',
        },
        { status: 403 }
      );
    }

    // 3. Gerar URLs assinadas e seguras para cada foto final em resolução máxima
    const storage = new SupabaseStorageService();
    const signedUrls: Array<{ photoIndex: number; downloadUrl: string }> = [];

    if (order.produced_photos && order.produced_photos.length > 0) {
      for (const photo of order.produced_photos) {
        const url = await storage.getSignedDownloadUrl({
          bucket: 'final-images',
          path: photo.final_storage_path,
          expiresInSeconds: 7200, // 2 horas de validade segura
        });

        if (url) {
          signedUrls.push({
            photoIndex: photo.photo_index,
            downloadUrl: url,
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      orderNumber: order.order_number,
      totalPhotos: signedUrls.length,
      downloads: signedUrls,
    });
  } catch (error: any) {
    console.error('Erro na rota de download:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Erro ao gerar downloads.' },
      { status: 500 }
    );
  }
}
