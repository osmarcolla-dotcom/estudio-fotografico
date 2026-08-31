import { NextRequest, NextResponse } from 'next/server';
import { orderCreationSchema } from '@/lib/validation';
import { OrderService } from '@/lib/domain/orders/service';
import { PaymentService } from '@/lib/domain/payments/service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validationResult = orderCreationSchema.safeParse(body);

    if (!validationResult.success) {
      const errorDetails = validationResult.error.errors.map((e) => e.message).join(', ');
      return NextResponse.json(
        { success: false, message: `Dados inválidos: ${errorDetails}` },
        { status: 400 }
      );
    }

    // 1. Criação do pedido e do link exclusivo de aprovação
    const { orderId, orderNumber, token } = await OrderService.createOrder(validationResult.data);

    // 2. Obter dados completos do pedido para iniciar gateway de pagamento
    const fullOrder = await OrderService.getOrderById(orderId);
    let checkoutInfo = null;

    if (fullOrder) {
      checkoutInfo = await PaymentService.initiatePayment(fullOrder);
    }

    return NextResponse.json({
      success: true,
      orderId,
      orderNumber,
      token,
      checkoutInfo,
      message: 'Pedido criado com sucesso. Prossiga para a confirmação do pagamento.',
    });
  } catch (error: any) {
    console.error('Erro na rota POST /api/orders:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Ocorreu um erro interno ao processar seu pedido.',
      },
      { status: 500 }
    );
  }
}
