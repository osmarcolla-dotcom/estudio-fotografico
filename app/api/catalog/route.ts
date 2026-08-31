import { NextRequest, NextResponse } from 'next/server';
import { getCategories, getPackages, DEFAULT_STYLES } from '@/lib/data/catalog';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  try {
    const supabase = createAdminClient();

    if (supabase) {
      const [catsRes, pkgsRes, stylesRes] = await Promise.all([
        supabase.from('categories').select('*').eq('is_active', true).order('display_order'),
        supabase.from('packages').select('*').eq('is_active', true).order('display_order'),
        supabase.from('styles').select('*').eq('is_active', true).order('display_order'),
      ]);

      return NextResponse.json({
        categories: catsRes.data && catsRes.data.length > 0 ? catsRes.data : await getCategories(),
        packages: pkgsRes.data && pkgsRes.data.length > 0 ? pkgsRes.data : await getPackages(),
        styles: stylesRes.data && stylesRes.data.length > 0 ? stylesRes.data : DEFAULT_STYLES,
      });
    }

    const [categories, packages] = await Promise.all([
      getCategories(),
      getPackages(),
    ]);

    return NextResponse.json({
      categories,
      packages,
      styles: DEFAULT_STYLES,
    });
  } catch (error: any) {
    return NextResponse.json(
      { categories: [], packages: [], styles: [] },
      { status: 500 }
    );
  }
}
