import { notFound } from 'next/navigation';
import { Header } from '@/components/marketing/Header';
import { Footer } from '@/components/marketing/Footer';
import { OrderService } from '@/lib/domain/orders/service';
import { PaymentService } from '@/lib/domain/payments/service';
import { PaymentCheckoutClient } from '@/components/order/PaymentCheckoutClient';

interface OrderPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ status?: string }>;
}

export default async function OrderPage({ params, searchParams }: OrderPageProps) {
  const { id } = await params;
  const { status: paymentStatusParam } = await searchParams;

  const order = await OrderService.getOrderById(id);

  if (!order) {
    notFound();
  }

  // Gera dados do pagamento (PIX com QR Code e Copia e Cola + link de Cartão)
  const checkout = await PaymentService.initiatePayment(order);

  return (
    <div className="flex flex-col min-h-screen bg-[#F6F4EF]">
      <main className="flex-1 py-8 sm:py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <PaymentCheckoutClient
            order={order}
            checkout={checkout}
          />
        </div>
      </main>

      <footer className="py-4 text-center text-xs text-[#5E6973] border-t border-[#E6E1D8]">
        <p>© {new Date().getFullYear()} Estúdio Fotográfico Digital. Ambiente seguro e criptografado.</p>
      </footer>
    </div>
  );
}
