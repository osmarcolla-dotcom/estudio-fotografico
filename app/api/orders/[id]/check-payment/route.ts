import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params;
    const supabase = createAdminClient();

    if (!supabase) {
      return NextResponse.json({ isPaid: false, status: 'PENDING_PAYMENT' });
    }

    const { data: order, error } = await supabase
      .from('orders')
      .select('status, payments(status)')
      .eq('id', orderId)
      .maybeSingle();

    if (error || !order) {
      return NextResponse.json({ isPaid: false, status: 'PENDING_PAYMENT' });
    }

    const isPaid =
      order.status === 'PAID' ||
      order.status === 'PRODUCTION_QUEUED' ||
      order.status === 'IN_PRODUCTION' ||
      order.status === 'READY_FOR_APPROVAL' ||
      order.status === 'APPROVED' ||
      order.status === 'COMPLETED' ||
      (Array.isArray(order.payments) && order.payments.some((p: any) => p.status === 'PAID'));

    return NextResponse.json({
      isPaid,
      status: order.status,
    });
  } catch (error: any) {
    return NextResponse.json({ isPaid: false, error: error.message }, { status: 500 });
  }
}
