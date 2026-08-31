import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const supabase = createAdminClient();
    const body = await req.json();
    const { id, category_id, name, slug, description, sample_image_url, prompt_preset, is_active, display_order } = body;

    if (!category_id || !name) {
      return NextResponse.json(
        { success: false, message: 'Categoria e nome do estilo são obrigatórios.' },
        { status: 400 }
      );
    }

    const styleSlug = slug || name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    const styleId = id && id.includes('-') && id.length === 36 ? id : crypto.randomUUID();

    if (supabase) {
      const { data, error } = await supabase
        .from('styles')
        .upsert({
          id: styleId,
          category_id,
          name,
          slug: styleSlug,
          description: description || null,
          sample_image_url: sample_image_url || null,
          prompt_preset: prompt_preset || null,
          is_active: is_active !== undefined ? Boolean(is_active) : true,
          display_order: display_order || 0,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao salvar estilo no Supabase:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, style: data, message: 'Estilo salvo com sucesso!' });
    }

    return NextResponse.json({
      success: true,
      style: { id: styleId, category_id, name, slug: styleSlug, description, is_active },
      message: 'Estilo salvo com sucesso!',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
