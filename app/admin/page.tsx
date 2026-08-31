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
  Eye,
  Zap,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getDashboardData(): Promise<{ orders: any[]; metrics: any }> {
  const supabase = createAdminClient();

  if (!supabase) {
    return {
      orders: [],
      metrics: {
        total_orders: 0,
        pending_payments: 0,
        in_production: 0,
        approved_orders: 0,
        total_revenue_cents: 0,
      },
    };
  }

  try {
    const { data: ordersData, error } = await supabase
      .from('orders')
      .select(`
        *,
        customer:customers(*),
        payments(*),
        photo_sessions(*),
        produced_photos(*)
      `)
      .order('created_at', { ascending: false });

    if (error || !ordersData) {
      return {
        orders: [],
        metrics: {
          total_orders: 0,
          pending_payments: 0,
          in_production: 0,
          approved_orders: 0,
          total_revenue_cents: 0,
        },
      };
    }

    const orders = ordersData.map((o: any) => {
      const session = Array.isArray(o.photo_sessions) ? o.photo_sessions[0] : o.photo_sessions;
      const totalPhotos = o.package_photo_count || 6;
      const producedCount = Array.isArray(o.produced_photos) ? o.produced_photos.length : 0;
      const completedCount = session?.completed_photos || producedCount;
      const progressPercent = Math.min(100, Math.round((completedCount / totalPhotos) * 100));

      return {
        ...o,
        production_progress: progressPercent,
        completed_photos_count: completedCount,
      };
    });

    const metrics = {
      total_orders: orders.length,
      pending_payments: orders.filter((o: any) => o.status === 'PENDING_PAYMENT').length,
      in_production: orders.filter(
        (o: any) =>
          o.status === 'IN_PRODUCTION' ||
          o.status === 'PRODUCTION_QUEUED' ||
          o.status === 'READY_FOR_APPROVAL'
      ).length,
      approved_orders: orders.filter(
        (o: any) => o.status === 'APPROVED' || o.status === 'COMPLETED'
      ).length,
      total_revenue_cents: orders
        .filter((o: any) => o.status !== 'PENDING_PAYMENT' && o.status !== 'CANCELLED')
        .reduce((sum: number, o: any) => sum + (o.package_price_cents || 0), 0),
    };

    return { orders, metrics };
  } catch {
    return {
      orders: [],
      metrics: {
        total_orders: 0,
        pending_payments: 0,
        in_production: 0,
        approved_orders: 0,
        total_revenue_cents: 0,
      },
    };
  }
}

function getStatusBadge(status: string, progress: number) {
  switch (status) {
    case 'PENDING_PAYMENT':
      return { label: 'Aguardando Pgto', bg: 'bg-yellow-50 text-yellow-800 border-yellow-200' };
    case 'PAID':
      return { label: 'Pagamento Confirmado', bg: 'bg-blue-50 text-blue-800 border-blue-200' };
    case 'PRODUCTION_QUEUED':
      return { label: 'Fila de Produção', bg: 'bg-purple-50 text-purple-800 border-purple-200' };
    case 'IN_PRODUCTION':
      return { label: `Em Produção (${progress}%)`, bg: 'bg-indigo-50 text-indigo-800 border-indigo-200 animate-pulse' };
    case 'READY_FOR_APPROVAL':
    case 'APPROVED':
    case 'COMPLETED':
      return { label: 'Aprovado & Entregue', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold' };
    default:
      return { label: status, bg: 'bg-gray-50 text-gray-800 border-gray-200' };
  }
}

export default async function AdminDashboardPage() {
  const { orders, metrics } = await getDashboardData();

  return (
    <div className="min-h-screen bg-[#F6F4EF] flex flex-col text-[#17212B]">
      <AdminNav activeTab="dashboard" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* Título do Painel */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECE7DF] text-[#315B52] text-[11px] font-bold uppercase tracking-wider mb-2">
              <Zap className="w-3.5 h-3.5 text-[#C98576]" />
              <span>Painel Operacional</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#17212B]">
              Produção & Vendas do Estúdio
            </h1>
            <p className="text-xs sm:text-sm text-[#5E6973] mt-0.5">
              Acompanhe pedidos, progresso em % da esteira de produção e ensaios aprovados.
            </p>
          </div>

          <Link
            href="/admin/catalogo"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#17212B] text-[#FFFDF9] text-xs font-semibold uppercase tracking-wider hover:bg-[#315B52] transition-colors self-start sm:self-auto shadow-sm"
          >
            <Layers className="w-4 h-4 text-[#D9D1C2]" />
            <span>Gerenciar Catálogo</span>
          </Link>
        </div>

        {/* Grid de Métricas / KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          <div className="p-5 rounded-3xl bg-[#FFFDF9] border border-[#E6E1D8] shadow-sm">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#5E6973] block mb-1">
              Total de Pedidos
            </span>
            <span className="font-serif text-3xl sm:text-4xl font-bold text-[#17212B]">
              {metrics.total_orders}
            </span>
          </div>

          <div className="p-5 rounded-3xl bg-[#FFFDF9] border border-[#E6E1D8] shadow-sm">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#C98576] block mb-1">
              Aguardando Pagamento
            </span>
            <span className="font-serif text-3xl sm:text-4xl font-bold text-[#C98576]">
              {metrics.pending_payments}
            </span>
          </div>

          <div className="p-5 rounded-3xl bg-[#FFFDF9] border border-[#E6E1D8] shadow-sm">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#315B52] block mb-1">
              Em Produção
            </span>
            <span className="font-serif text-3xl sm:text-4xl font-bold text-[#315B52]">
              {metrics.in_production}
            </span>
          </div>

          <div className="p-5 rounded-3xl bg-[#17212B] text-[#FFFDF9] border border-[#17212B] shadow-sm">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#D9D1C2] block mb-1">
              Ensaios Aprovados
            </span>
            <span className="font-serif text-3xl sm:text-4xl font-bold text-[#FFFDF9]">
              {metrics.approved_orders}
            </span>
          </div>

        </div>

        {/* Tabela de Pedidos com Barra de Progresso Real */}
        <div id="pedidos" className="bg-[#FFFDF9] border border-[#E6E1D8] rounded-3xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-[#E6E1D8] flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#17212B]">
                Fila de Pedidos & Produção
              </h2>
              <p className="text-xs text-[#5E6973]">
                Monitore o status e a % concluída de cada ensaio.
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
                  <th className="px-6 py-4">Cliente / WhatsApp</th>
                  <th className="px-6 py-4">Ensaio & Estilo</th>
                  <th className="px-6 py-4">Pacote & Fotos</th>
                  <th className="px-6 py-4">Progresso Produção</th>
                  <th className="px-6 py-4">Valor</th>
                  <th className="px-6 py-4">Status</th>
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
                  orders.map((order: any) => {
                    const badge = getStatusBadge(order.status, order.production_progress);
                    const isInProd = order.status === 'IN_PRODUCTION' || order.status === 'PRODUCTION_QUEUED';

                    return (
                      <tr key={order.id} className="hover:bg-[#F6F4EF]/50 transition-colors">
                        <td className="px-6 py-4 font-mono font-bold text-[#17212B]">
                          {order.order_number}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-[#17212B]">
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
                        <td className="px-6 py-4 min-w-[160px]">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[10px] font-bold text-[#17212B]">
                              <span>{order.production_progress}%</span>
                              <span className="text-[#5E6973] font-normal">
                                {order.completed_photos_count}/{order.package_photo_count} fotos
                              </span>
                            </div>
                            <div className="w-full h-2 bg-[#E6E1D8] rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all duration-500 ${
                                  order.production_progress === 100
                                    ? 'bg-[#315B52]'
                                    : 'bg-[#C98576] animate-pulse'
                                }`}
                                style={{ width: `${order.production_progress}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-serif font-bold text-[#17212B]">
                          {formatCurrencyBRL(order.package_price_cents)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-semibold border ${badge.bg}`}>
                            {badge.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            href={`/admin/pedidos/${order.id}`}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#17212B] text-[#FFFDF9] text-xs font-semibold hover:bg-[#315B52] transition-colors"
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
