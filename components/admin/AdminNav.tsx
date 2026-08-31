import Link from 'next/link';
import { Camera, LayoutDashboard, ShoppingBag, Layers, LogOut, ExternalLink, Sparkles } from 'lucide-react';

export function AdminNav({ activeTab }: { activeTab?: 'dashboard' | 'pedidos' | 'catalogo' }) {
  return (
    <header className="bg-[#17212B] text-[#FFFDF9] border-b border-[#2C3844] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        <div className="flex items-center gap-8">
          {/* Logo Admin */}
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#315B52] text-[#FFFDF9] flex items-center justify-center">
              <Camera className="w-4 h-4 text-[#D9D1C2]" />
            </div>
            <div>
              <span className="font-serif text-lg font-bold tracking-tight">Estúdio</span>
              <span className="text-[10px] text-[#C98576] font-mono ml-1.5 uppercase tracking-wider font-semibold">Admin</span>
            </div>
          </Link>

          {/* Abas de Navegação */}
          <nav className="hidden md:flex items-center gap-1 text-xs uppercase tracking-wider font-semibold">
            <Link
              href="/admin"
              className={`px-3.5 py-2 rounded-xl transition-colors flex items-center gap-2 ${
                activeTab === 'dashboard'
                  ? 'bg-[#2C3844] text-[#FFFDF9]'
                  : 'text-[#D9D1C2]/70 hover:text-[#FFFDF9] hover:bg-[#2C3844]/50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-[#D9D1C2]" />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/admin#pedidos"
              className={`px-3.5 py-2 rounded-xl transition-colors flex items-center gap-2 ${
                activeTab === 'pedidos'
                  ? 'bg-[#2C3844] text-[#FFFDF9]'
                  : 'text-[#D9D1C2]/70 hover:text-[#FFFDF9] hover:bg-[#2C3844]/50'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-[#D9D1C2]" />
              <span>Pedidos</span>
            </Link>

            <Link
              href="/admin/catalogo"
              className={`px-3.5 py-2 rounded-xl transition-colors flex items-center gap-2 ${
                activeTab === 'catalogo'
                  ? 'bg-[#2C3844] text-[#FFFDF9]'
                  : 'text-[#D9D1C2]/70 hover:text-[#FFFDF9] hover:bg-[#2C3844]/50'
              }`}
            >
              <Layers className="w-4 h-4 text-[#D9D1C2]" />
              <span>Catálogo</span>
            </Link>
          </nav>
        </div>

        {/* Links Externos e Logout */}
        <div className="flex items-center gap-4 text-xs">
          <Link
            href="/"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 text-[#D9D1C2]/70 hover:text-[#FFFDF9] transition-colors"
          >
            <span>Ver Loja</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <Link
            href="/admin/login"
            className="p-2 rounded-xl bg-[#2C3844]/60 text-[#D9D1C2] hover:text-[#FFFDF9] hover:bg-[#2C3844] transition-colors"
            title="Sair"
          >
            <LogOut className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </header>
  );
}
