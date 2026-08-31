import { createAdminClient } from '@/lib/supabase/admin';
import { generateOrderNumber } from '@/lib/utils';
import { Order, OrderStatus } from '@/lib/types';
import { OrderCreationInput } from '@/lib/validation';
import { DEFAULT_CATEGORIES, DEFAULT_PACKAGES, DEFAULT_STYLES } from '@/lib/data/catalog';
import crypto from 'crypto';

export class OrderService {
  static async createOrder(input: OrderCreationInput): Promise<{ orderId: string; orderNumber: string; token: string }> {
    const supabase = createAdminClient();
    const orderNumber = generateOrderNumber();
    const token = crypto.randomBytes(24).toString('hex');
    const orderId = crypto.randomUUID();

    // 1. Obter informações de pacote, categoria e estilo
    const category = DEFAULT_CATEGORIES.find((c) => c.id === input.categoryId) || {
      name: 'Ensaio Personalizado',
      slug: 'personalizado',
    };
    const packageItem = DEFAULT_PACKAGES.find((p) => p.id === input.packageId) || {
      name: 'Pacote Profissional',
      photo_count: 12,
      price_cents: 2990,
    };
    const style = DEFAULT_STYLES.find((s) => s.id === input.styleId) || {
      name: 'Estúdio Elegante',
      slug: 'elegante',
    };

    if (!supabase) {
      // Retorna em modo local sem Supabase configurado
      return { orderId, orderNumber, token };
    }

    try {
      // Criar ou atualizar cliente (por WhatsApp ou E-mail)
      let customerId: string;
      const cleanPhone = input.customer.whatsapp.replace(/\D/g, '');
      const customerEmail = input.customer.email || `${cleanPhone}@cliente.estudio`;

      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('id')
        .eq('whatsapp', input.customer.whatsapp)
        .maybeSingle();

      if (existingCustomer) {
        customerId = existingCustomer.id;
        await supabase
          .from('customers')
          .update({
            name: input.customer.name,
            email: customerEmail,
          })
          .eq('id', customerId);
      } else {
        const { data: newCustomer, error: custErr } = await supabase
          .from('customers')
          .insert({
            name: input.customer.name,
            email: customerEmail,
            whatsapp: input.customer.whatsapp,
          })
          .select('id')
          .single();

        if (custErr || !newCustomer) throw new Error('Falha ao cadastrar cliente');
        customerId = newCustomer.id;
      }

      // Criar Pedido com valores congelados
      const { error: orderErr } = await supabase.from('orders').insert({
        id: orderId,
        order_number: orderNumber,
        customer_id: customerId,
        category_id: input.categoryId,
        style_id: input.styleId,
        package_id: input.packageId,
        package_name: packageItem.name,
        package_photo_count: packageItem.photo_count,
        package_price_cents: packageItem.price_cents,
        category_name: category.name,
        style_name: style.name,
        status: 'PENDING_PAYMENT',
        notes: input.notes || null,
      });

      if (orderErr) throw new Error(`Falha ao criar pedido: ${orderErr.message}`);

      // Registrar pagamento pendente
      await supabase.from('payments').insert({
        order_id: orderId,
        amount_cents: packageItem.price_cents,
        status: 'PENDING',
        provider: process.env.PAYMENT_PROVIDER || 'unconfigured',
      });

      // Registrar fotos enviadas pelo cliente
      if (input.uploadedPhotos && input.uploadedPhotos.length > 0) {
        const photoInserts = input.uploadedPhotos.map((p, idx) => ({
          order_id: orderId,
          storage_path: p.storagePath || `customer-uploads/${orderId}/photo_${idx + 1}.jpg`,
          file_name: p.fileName,
          file_size_bytes: p.fileSize,
          mime_type: p.mimeType,
          width: p.width || null,
          height: p.height || null,
        }));
        await supabase.from('customer_photos').insert(photoInserts);
      }

      // Criar link exclusivo de aprovação
      await supabase.from('approval_links').insert({
        order_id: orderId,
        token: token,
      });

      return { orderId, orderNumber, token };
    } catch (err: any) {
      console.error('Erro no OrderService.createOrder:', err);
      return { orderId, orderNumber, token };
    }
  }

  static async getOrderById(orderId: string): Promise<Order | null> {
    const supabase = createAdminClient();
    if (!supabase) return null;

    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          customer:customers(*),
          category:categories(*),
          style:styles(*),
          package:packages(*),
          payment:payments(*),
          customer_photos(*),
          produced_photos(*),
          approval_link:approval_links(*),
          revision_requests(*)
        `)
        .eq('id', orderId)
        .single();

      if (error || !data) return null;
      return data as unknown as Order;
    } catch {
      return null;
    }
  }

  static async getOrderByApprovalToken(token: string): Promise<Order | null> {
    const supabase = createAdminClient();
    if (!supabase) return null;

    try {
      const { data: linkData, error: linkErr } = await supabase
        .from('approval_links')
        .select('order_id')
        .eq('token', token)
        .single();

      if (linkErr || !linkData) return null;

      // Incrementar contador de visualizações
      try {
        await supabase.rpc('increment_view_count', { link_token: token });
      } catch {
        // Silencioso se a RPC não existir
      }

      return this.getOrderById(linkData.order_id);
    } catch {
      return null;
    }
  }

  static async updateStatus(orderId: string, newStatus: OrderStatus, notes?: string): Promise<boolean> {
    const supabase = createAdminClient();
    if (!supabase) return true;

    try {
      const updateData: Record<string, unknown> = { status: newStatus };
      if (notes) updateData.notes = notes;

      const { error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId);

      return !error;
    } catch {
      return false;
    }
  }
}
