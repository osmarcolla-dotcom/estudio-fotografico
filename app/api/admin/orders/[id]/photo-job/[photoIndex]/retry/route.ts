import { NextRequest, NextResponse } from 'next/server';
import { ProductionService } from '@/lib/domain/production/service';
import { OrderService } from '@/lib/domain/orders/service';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; photoIndex: string }> }
) {
  try {
    const { id: orderId, photoIndex: photoIndexStr } = await params;
    const photoIndex = parseInt(photoIndexStr, 10);

    if (isNaN(photoIndex) || photoIndex < 1) {
      return NextResponse.json(
        { success: false, message: 'Índice de fotografia inválido.' },
        { status: 400 }
      );
    }

    const order = await OrderService.getOrderById(orderId);
    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Pedido não encontrado.' },
        { status: 404 }
      );
    }

    const sourceImageUrl =
      order.customer_photos?.[0]?.storage_path ||
      'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=1200&q=85';

    const sessionId = `session-${orderId}`;
    const updatedJob = await ProductionService.retrySinglePhoto(
      sessionId,
      photoIndex,
      sourceImageUrl
    );

    if (!updatedJob) {
      return NextResponse.json(
        { success: false, message: 'Não foi possível reprocessar a foto solicitada.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      job: updatedJob,
      message: `Fotografia #${photoIndex} reenviada para produção com sucesso.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Erro ao refazer fotografia.' },
      { status: 500 }
    );
  }
}
