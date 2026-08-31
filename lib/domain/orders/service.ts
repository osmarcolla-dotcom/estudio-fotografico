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

    // Valores padrão de fallback
    let categoryName = 'Ensaio Personalizado';
    let packageName = 'Pacote Selecionado';
    let packagePhotoCount = 6;
    let packagePriceCents = 1990;
    let styleName = 'Estúdio Elegante';

    if (supabase) {
      try {
        // 1. Busca os dados REAIS e dinâmicos do pacote, categoria e estilo no Supabase
        const [pkgRes, catRes, styRes] = await Promise.all([
          supabase.from('packages').select('*').eq('id', input.packageId).maybeSingle(),
          supabase.from('categories').select('*').eq('id', input.categoryId).maybeSingle(),
          supabase.from('styles').select('*').eq('id', input.styleId).maybeSingle(),
        ]);

        if (pkgRes.data) {
          packageName = pkgRes.data.name;
          packagePhotoCount = pkgRes.data.photo_count;
          packagePriceCents = pkgRes.data.price_cents;
        } else {
          const fallbackPkg = DEFAULT_PACKAGES.find((p) => p.id === input.packageId);
          if (fallbackPkg) {
            packageName = fallbackPkg.name;
            packagePhotoCount = fallbackPkg.photo_count;
            packagePriceCents = fallbackPkg.price_cents;
          }
        }

        if (catRes.data) {
          categoryName = catRes.data.name;
        } else {
          const fallbackCat = DEFAULT_CATEGORIES.find((c) => c.id === input.categoryId);
          if (fallbackCat) categoryName = fallbackCat.name;
        }

        if (styRes.data) {
          styleName = styRes.data.name;
        } else {
          const fallbackSty = DEFAULT_STYLES.find((s) => s.id === input.styleId);
          if (fallbackSty) styleName = fallbackSty.name;
        }

        // 2. Criar ou atualizar cliente (por WhatsApp ou E-mail)
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

        // 3. Criar Pedido com os valores REAIS congelados
        const { error: orderErr } = await supabase.from('orders').insert({
          id: orderId,
          order_number: orderNumber,
          customer_id: customerId,
          category_id: input.categoryId,
          style_id: input.styleId,
          package_id: input.packageId,
          package_name: packageName,
          package_photo_count: packagePhotoCount,
          package_price_cents: packagePriceCents,
          category_name: categoryName,
          style_name: styleName,
          status: 'PENDING_PAYMENT',
          notes: input.notes || null,
        });

        if (orderErr) throw new Error(`Falha ao criar pedido: ${orderErr.message}`);

        // 4. Registrar pagamento pendente com o valor exato
        await supabase.from('payments').insert({
          order_id: orderId,
          amount_cents: packagePriceCents,
          status: 'PENDING',
          provider: process.env.PAYMENT_PROVIDER || 'mercadopago',
        });

        // 5. Registrar fotos enviadas pelo cliente
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

        // 6. Criar link exclusivo de aprovação
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

    return { orderId, orderNumber, token };
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
