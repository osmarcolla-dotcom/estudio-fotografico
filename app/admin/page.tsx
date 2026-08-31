import Link from 'next/link';
import { AdminNav } from '@/components/admin/AdminNav';
import { createAdminClient } from '@/lib/supabase/admin';
import { Order, DashboardMetrics } from '@/lib/types';
import { formatCurrencyBRL, formatDateBR, formatWhatsApp } from '@/lib/utils';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  Camera,
  Layers,
  Sparkles,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  Eye,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getDashboardData(): Promise<{ orders: Order[]; metrics: DashboardMetrics }> {
  const supabase = createAdminClient();

  if (!supabase) {
    // Dados para demonstração quando Supabase ainda não foi configurado
    const sampleOrders: Order[] = [
      {
        id: 'ord-demo-01',
        order_number: 'ENS-2608-1042',
        customer_id: 'cust-1',
        category_id: 'cat-1',
        style_id: 'style-1',
        package_id: 'pkg-2',
        package_name: 'Pacote Profissional',
        package_photo_count: 12,
        package_price_cents: 2990,
        category_name: 'Gravidez',
        style_name: 'Elegante',
        status: 'READY_FOR_APPROVAL',
        created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
        updated_at: new Date().toISOString(),
        customer: {
          id: 'cust-1',
          name: 'Carolina Mendes',
          whatsapp: '11988887777',
          email: 'carolina.mendes@exemplo.com',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      },
      {
        id: 'ord-demo-02',
        order_number: 'ENS-2608-2089',
        customer_id: 'cust-2',
        category_id: 'cat-2',
        style_id: 'style-2',
        package_id: 'pkg-3',
        package_name: 'Pacote Premium',
        package_photo_count: 30,
        package_price_cents: 4990,
        category_name: 'Casamento',
        style_name: 'Romântico Clássico',
        status: 'IN_PRODUCTION',
        created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
        updated_at: new Date().toISOString(),
        customer: {
          id: 'cust-2',
          name: 'Gabriel & Beatriz',
          whatsapp: '21977776666',
          email: 'gabriel.beatriz@exemplo.com',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      },
      {
        id: 'ord-demo-03',
        order_number: 'ENS-2608-3011',
        customer_id: 'cust-3',
        category_id: 'cat-7',
        style_id: 'style-7',
        package_id: 'pkg-1',
        package_name: 'Pacote Básico',
        package_photo_count: 6,
        package_price_cents: 1990,
        category_name: 'Sensual',
        style_name: 'Boudoir Elegance',
        status: 'APPROVED',
        created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
        updated_at: new Date().toISOString(),
        customer: {
          id: 'cust-3',
          name: 'Juliana Rossi',
          whatsapp: '41999998888',
          email: 'juliana.rossi@exemplo.com',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      },
    ];

    return {
      orders: sampleOrders,
      metrics: {
        total_orders: 3,
        pending_payments: 0,
        in_production: 1,
        ready_for_approval: 1,
        approved_orders: 1,
        revision_requests: 0,
        total_revenue_cents: 9970,
      },
    };
  }

  try {
    const { data: ordersData, error } = await supabase
      .from('orders')
      .select(`
        *,
        customer:customers(*),
        payment:payments(*)
      `)
      .order('created_at', { ascending: false });

    if (error || !ordersData) {
      return {
        orders: [],
        metrics: {
          total_orders: 0,
          pending_payments: 0,
          in_production: 0,
          ready_for_approval: 0,
          approved_orders: 0,
          revision_requests: 0,
          total_revenue_cents: 0,
        },
      };
    }

    const orders = ordersData as unknown as Order[];

    const metrics: DashboardMetrics = {
      total_orders: orders.length,
      pending_payments: orders.filter((o) => o.status === 'PENDING_PAYMENT').length,
      in_production: orders.filter((o) => o.status === 'IN_PRODUCTION' || o.status === 'PRODUCTION_QUEUED').length,
      ready_for_approval: orders.filter((o) => o.status === 'READY_FOR_APPROVAL').length,
      approved_orders: orders.filter((o) => o.status === 'APPROVED' || o.status === 'COMPLETED').length,
      revision_requests: orders.filter((o) => o.status === 'REVISION_REQUESTED').length,
      total_revenue_cents: orders
        .filter((o) => o.status !== 'PENDING_PAYMENT' && o.status !== 'CANCELLED')
        .reduce((sum, o) => sum + (o.package_price_cents || 0), 0),
    };

    return { orders, metrics };
  } catch {
    return {
      orders: [],
      metrics: {
        total_orders: 0,
        pending_payments: 0,
        in_production: 0,
        ready_for_approval: 0,
        approved_orders: 0,
        revision_requests: 0,
        total_revenue_cents: 0,
      },
    };
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'PENDING_PAYMENT':
      return { label: 'Aguardando Pagamento', bg: 'bg-yellow-50 text-yellow-800 border-yellow-200' };
    case 'PAID':
      return { label: 'Pagamento Confirmado', bg: 'bg-blue-50 text-blue-800 border-blue-200' };
    case 'PRODUCTION_QUEUED':
      return { label: 'Fila de Produção', bg: 'bg-purple-50 text-purple-800 border-purple-200' };
    case 'IN_PRODUCTION':
      return { label: 'Em Produção', bg: 'bg-indigo-50 text-indigo-800 border-indigo-200' };
    case 'READY_FOR_APPROVAL':
      return { label: 'Aguardando Aprovação', bg: 'bg-amber-50 text-amber-800 border-amber-200' };
    case 'REVISION_REQUESTED':
      return { label: 'Ajuste Solicitado', bg: 'bg-rose-50 text-rose-800 border-rose-200' };
    case 'APPROVED':
      return { label: 'Aprovado pelo Cliente', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
    case 'COMPLETED':
      return { label: 'Concluído & Entregue', bg: 'bg-teal-50 text-teal-800 border-teal-200' };
    default:
      return { label: status, bg: 'bg-gray-50 text-gray-800 border-gray-200' };
  }
}

export default async function AdminDashboardPage() {
  const { orders, metrics } = await getDashboardData();

  return (
    <div className="min-h-screen bg-[#F6F4EF] flex flex-col">
      <AdminNav activeTab="dashboard" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* Título do Painel */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#17212B]">
              Painel Operacional do Estúdio
            </h1>
            <p className="text-xs sm:text-sm text-[#5E6973] mt-1">
              Acompanhamento de pedidos, produção fotográfica, aprovações e faturamento em tempo real.
            </p>
          </div>

          <Link
            href="/admin/catalogo"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#17212B] text-[#FFFDF9] text-xs font-semibold uppercase tracking-wider hover:bg-[#315B52] transition-colors self-start sm:self-auto"
          >
            <Layers className="w-4 h-4 text-[#D9D1C2]" />
            <span>Gerenciar Catálogo</span>
          </Link>
        </div>

        {/* Grid de Métricas / KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">

          <div className="p-5 rounded-2xl bg-[#FFFDF9] border border-[#E6E1D8] shadow-sm">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#5E6973] block mb-1">
              Total de Pedidos
            </span>
            <span className="font-serif text-3xl font-bold text-[#17212B]">
              {metrics.total_orders}
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-[#FFFDF9] border border-[#E6E1D8] shadow-sm">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#C98576] block mb-1">
              Aguardando Pgto
            </span>
            <span className="font-serif text-3xl font-bold text-[#C98576]">
              {metrics.pending_payments}
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-[#FFFDF9] border border-[#E6E1D8] shadow-sm">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#315B52] block mb-1">
              Em Produção
            </span>
            <span className="font-serif text-3xl font-bold text-[#315B52]">
              {metrics.in_production}
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-[#FFFDF9] border border-[#E6E1D8] shadow-sm">
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-600 block mb-1">
              Prévia p/ Aprovar
            </span>
            <span className="font-serif text-3xl font-bold text-amber-600">
              {metrics.ready_for_approval}
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-[#FFFDF9] border border-[#E6E1D8] shadow-sm">
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 block mb-1">
              Ensaios Aprovados
            </span>
            <span className="font-serif text-3xl font-bold text-emerald-700">
              {metrics.approved_orders}
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-[#17212B] text-[#FFFDF9] border border-[#17212B] shadow-sm col-span-2 md:col-span-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#D9D1C2] block mb-1">
              Faturamento Total
            </span>
            <span className="font-serif text-2xl sm:text-3xl font-bold text-[#FFFDF9]">
              {formatCurrencyBRL(metrics.total_revenue_cents)}
            </span>
          </div>

        </div>

        {/* Tabela de Pedidos */}
        <div id="pedidos" className="bg-[#FFFDF9] border border-[#E6E1D8] rounded-3xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-[#E6E1D8] flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#17212B]">
                Pedidos de Ensaio
              </h2>
              <p className="text-xs text-[#5E6973]">
                Clique no pedido para visualizar fotos originais, prévias, link de aprovação e controles de produção.
              </p>
            </div>
            <span className="text-xs font-semibold text-[#5E6973] bg-[#ECE7DF] px-3 py-1 rounded-full">
              {orders.length} pedidos
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#F6F4EF] text-[#5E6973] text-[10px] sm:text-xs uppercase tracking-wider font-semibold border-b border-[#E6E1D8]">
                <tr>
                  <th className="px-6 py-4">Pedido</th>
                  <th className="px-6 py-4">Cliente / Contato</th>
                  <th className="px-6 py-4">Ensaio & Estilo</th>
                  <th className="px-6 py-4">Pacote</th>
                  <th className="px-6 py-4">Valor</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Data</th>
                  <th className="px-6 py-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E1D8]">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-[#5E6973] text-sm">
                      Nenhum pedido registrado até o momento.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => {
                    const badge = getStatusBadge(order.status);

                    return (
                      <tr key={order.id} className="hover:bg-[#F6F4EF]/50 transition-colors">
                        <td className="px-6 py-4 font-mono font-bold text-[#17212B]">
                          {order.order_number}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-[#17212B]">
                            {order.customer?.name || 'Cliente'}
                          </div>
                          <div className="text-[11px] text-[#5E6973]">
                            {order.customer?.whatsapp ? formatWhatsApp(order.customer.whatsapp) : ''}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-medium text-[#17212B] block">{order.category_name}</span>
                          <span className="text-[11px] text-[#5E6973]">{order.style_name}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-medium text-[#17212B] block">{order.package_name}</span>
                          <span className="text-[11px] text-[#315B52] font-semibold">{order.package_photo_count} fotos</span>
                        </td>
                        <td className="px-6 py-4 font-serif font-bold text-[#17212B]">
                          {formatCurrencyBRL(order.package_price_cents)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-semibold border ${badge.bg}`}>
                            {badge.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-[#5E6973]">
                          {formatDateBR(order.created_at)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            href={`/admin/pedidos/${order.id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#17212B] text-[#FFFDF9] text-xs font-semibold hover:bg-[#315B52] transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Abrir</span>
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}
