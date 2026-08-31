import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const supabase = createAdminClient();
    const body = await req.json();
    const { id, name, slug, description, sample_image_url, is_active, display_order } = body;

    if (!name || !description) {
      return NextResponse.json(
        { success: false, message: 'Nome e descrição são obrigatórios.' },
        { status: 400 }
      );
    }

    const categorySlug = slug || name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    const categoryId = id && id.includes('-') && id.length === 36 ? id : crypto.randomUUID();

    if (supabase) {
      const { data, error } = await supabase
        .from('categories')
        .upsert({
          id: categoryId,
          name,
          slug: categorySlug,
          description,
          sample_image_url: sample_image_url || null,
          is_active: is_active !== undefined ? Boolean(is_active) : true,
          display_order: display_order || 0,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao salvar categoria no Supabase:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, category: data, message: 'Categoria salva com sucesso!' });
    }

    return NextResponse.json({
      success: true,
      category: { id: categoryId, name, slug: categorySlug, description, sample_image_url, is_active },
      message: 'Categoria salva com sucesso!',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
