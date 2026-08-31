'use client';

import { useId } from 'react';
import { CustomerDataInput } from '@/lib/validation';
import { User, Phone, Mail, ShieldCheck, Sparkles, Lock } from 'lucide-react';

interface CustomerStepProps {
  data: CustomerDataInput;
  onChange: (data: Partial<CustomerDataInput>) => void;
  errors: Record<string, string>;
}

export function CustomerStep({ data, onChange, errors }: CustomerStepProps) {
  const nameId = useId();
  const whatsappId = useId();
  const emailId = useId();

  return (
    <div className="space-y-6">
      <div className="text-center sm:text-left space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECE7DF] text-[#315B52] text-[11px] font-bold uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5 text-[#C98576]" />
          <span>Etapa 1 de 6</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#17212B]">
          Seus dados para entrega do ensaio
        </h2>
        <p className="text-xs sm:text-sm text-[#5E6973]">
          Utilizaremos seu WhatsApp para enviar o link com suas fotos prontas em alta resolução.
        </p>
      </div>

      <div className="space-y-4 pt-2">
        {/* Nome Completo */}
        <div>
          <label htmlFor={nameId} className="block text-[11px] font-bold uppercase tracking-wider text-[#17212B] mb-2">
            Seu Nome Completo
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#5E6973]">
              <User className="w-4 h-4" />
            </div>
            <input
              id={nameId}
              type="text"
              value={data.name || ''}
              onChange={(e) => onChange({ name: e.target.value })}
              placeholder="Ex: Maria Clara Silva"
              className={`w-full pl-11 pr-4 py-3.5 rounded-2xl border bg-[#FFFDF9] text-sm text-[#17212B] placeholder-[#5E6973]/40 focus:outline-none focus:ring-2 focus:ring-[#315B52] transition-all shadow-sm ${
                errors.name ? 'border-red-500 bg-red-50/20' : 'border-[#D9D1C2]'
              }`}
            />
          </div>
          {errors.name && <p className="text-xs text-red-600 font-semibold mt-1.5">{errors.name}</p>}
        </div>

        {/* WhatsApp */}
        <div>
          <label htmlFor={whatsappId} className="block text-[11px] font-bold uppercase tracking-wider text-[#17212B] mb-2">
            WhatsApp com DDD (onde você receberá as fotos)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#5E6973]">
              <Phone className="w-4 h-4" />
            </div>
            <input
              id={whatsappId}
              type="tel"
              value={data.whatsapp || ''}
              onChange={(e) => onChange({ whatsapp: e.target.value })}
              placeholder="Ex: (11) 99999-9999"
              className={`w-full pl-11 pr-4 py-3.5 rounded-2xl border bg-[#FFFDF9] text-sm text-[#17212B] placeholder-[#5E6973]/40 focus:outline-none focus:ring-2 focus:ring-[#315B52] transition-all shadow-sm ${
                errors.whatsapp ? 'border-red-500 bg-red-50/20' : 'border-[#D9D1C2]'
              }`}
            />
          </div>
          {errors.whatsapp && <p className="text-xs text-red-600 font-semibold mt-1.5">{errors.whatsapp}</p>}
        </div>

        {/* E-mail */}
        <div>
          <label htmlFor={emailId} className="block text-[11px] font-bold uppercase tracking-wider text-[#17212B] mb-2">
            E-mail para backup dos arquivos
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#5E6973]">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id={emailId}
              type="email"
              value={data.email || ''}
              onChange={(e) => onChange({ email: e.target.value })}
              placeholder="Ex: maria.clara@email.com"
              className={`w-full pl-11 pr-4 py-3.5 rounded-2xl border bg-[#FFFDF9] text-sm text-[#17212B] placeholder-[#5E6973]/40 focus:outline-none focus:ring-2 focus:ring-[#315B52] transition-all shadow-sm ${
                errors.email ? 'border-red-500 bg-red-50/20' : 'border-[#D9D1C2]'
              }`}
            />
          </div>
          {errors.email && <p className="text-xs text-red-600 font-semibold mt-1.5">{errors.email}</p>}
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-[#ECE7DF]/70 border border-[#D9D1C2] flex items-center gap-3 text-xs text-[#5E6973]">
        <Lock className="w-4 h-4 text-[#315B52] shrink-0" />
        <span>Garantia de privacidade: seus dados e fotografias são 100% confidenciais e protegidos.</span>
      </div>
    </div>
  );
}
