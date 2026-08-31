import { NextRequest, NextResponse } from 'next/server';
import { ProductionService } from '@/lib/domain/production/service';
import { OrderService } from '@/lib/domain/orders/service';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params;
    const session = await ProductionService.getSession(`session-${orderId}`);

    return NextResponse.json({
      success: true,
      session,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Erro ao buscar sessão de produção.' },
      { status: 500 }
    );
  }
}

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

    const originalUrls = order.customer_photos?.map((p) => p.storage_path) || [];
    const session = await ProductionService.startProduction(order, originalUrls);

    return NextResponse.json({
      success: true,
      session,
      message: 'Esteira de produção do ensaio fotográfico iniciada.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Erro ao iniciar esteira de produção.' },
      { status: 500 }
    );
  }
}
