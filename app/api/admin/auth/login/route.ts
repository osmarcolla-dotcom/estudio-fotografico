import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Informe e-mail e senha.' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const cookieStore = await cookies();

    // 1. Verificação via Supabase Auth caso configurado
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error && data.user) {
        cookieStore.set('admin_session', data.session.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 7 dias
          path: '/',
        });

        return NextResponse.json({
          success: true,
          message: 'Autenticado com sucesso via Supabase Auth.',
        });
      }
    }

    // 2. Senha de Demonstração / Fallback Administrativo Seguro
    const demoPassword = process.env.ADMIN_DEMO_PASSWORD || 'estudio2026admin';
    const isDemoAdmin =
      email.toLowerCase().includes('admin') && password === demoPassword;

    if (isDemoAdmin) {
      cookieStore.set('admin_session', 'demo_admin_authenticated_session', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });

      return NextResponse.json({
        success: true,
        message: 'Acesso concedido ao painel administrativo.',
      });
    }

    return NextResponse.json(
      { success: false, message: 'E-mail ou senha incorretos.' },
      { status: 401 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Erro na autenticação.' },
      { status: 500 }
    );
  }
}
