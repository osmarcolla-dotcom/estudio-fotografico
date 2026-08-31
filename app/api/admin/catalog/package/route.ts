import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const supabase = createAdminClient();
    const body = await req.json();
    const { id, name, slug, description, photo_count, price_cents, is_popular, is_active, display_order } = body;

    if (!name || !price_cents || !photo_count) {
      return NextResponse.json(
        { success: false, message: 'Nome, preço e quantidade de fotos são obrigatórios.' },
        { status: 400 }
      );
    }

    const packageSlug = slug || name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    const packageId = id && id.includes('-') && id.length === 36 ? id : crypto.randomUUID();

    if (supabase) {
      const { data, error } = await supabase
        .from('packages')
        .upsert({
          id: packageId,
          name,
          slug: packageSlug,
          description: description || null,
          photo_count: parseInt(photo_count, 10),
          price_cents: parseInt(price_cents, 10),
          is_popular: Boolean(is_popular),
          is_active: is_active !== undefined ? Boolean(is_active) : true,
          display_order: display_order || 0,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao salvar pacote no Supabase:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, package: data, message: 'Pacote salvo com sucesso no banco de dados!' });
    }

    return NextResponse.json({
      success: true,
      package: { id: packageId, name, slug: packageSlug, description, photo_count, price_cents, is_popular, is_active },
      message: 'Pacote salvo com sucesso!',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = createAdminClient();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID obrigatório.' }, { status: 400 });
    }

    if (supabase) {
      const { error } = await supabase.from('packages').delete().eq('id', id);
      if (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, message: 'Pacote removido com sucesso!' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
