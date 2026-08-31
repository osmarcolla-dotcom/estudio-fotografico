'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Camera, Lock, Mail, ShieldAlert, ArrowRight } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Credenciais inválidas.');
      }

      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Falha ao autenticar.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#17212B] flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-[#F6F4EF]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-[#315B52] text-[#FFFDF9] flex items-center justify-center mx-auto shadow-md">
          <Camera className="w-6 h-6 text-[#D9D1C2]" />
        </div>
        <h1 className="font-serif text-3xl font-bold tracking-tight text-[#FFFDF9]">
          Painel do Estúdio
        </h1>
        <p className="text-xs text-[#D9D1C2]/70 uppercase tracking-widest">
          Acesso Administrativo & Operacional
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#1C2834] py-8 px-6 shadow-2xl rounded-3xl sm:px-10 border border-[#2C3844] space-y-6">

          {error && (
            <div className="p-3.5 rounded-xl bg-red-900/40 border border-red-500/50 text-xs text-red-200 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#D9D1C2] mb-1.5">
                E-mail Administrativo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#D9D1C2]/50">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@estudio.com"
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-[#17212B] border border-[#2C3844] text-[#FFFDF9] text-xs focus:outline-none focus:ring-2 focus:ring-[#315B52] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#D9D1C2] mb-1.5">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#D9D1C2]/50">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-[#17212B] border border-[#2C3844] text-[#FFFDF9] text-xs focus:outline-none focus:ring-2 focus:ring-[#315B52] transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-full bg-[#315B52] hover:bg-[#3d6d63] text-[#FFFDF9] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <span>Autenticando...</span>
              ) : (
                <>
                  <span>ACESSAR PAINEL</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-[#2C3844] text-center">
            <Link
              href="/"
              className="text-xs text-[#D9D1C2]/50 hover:text-[#D9D1C2] transition-colors"
            >
              ← Voltar para a Loja Pública
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
