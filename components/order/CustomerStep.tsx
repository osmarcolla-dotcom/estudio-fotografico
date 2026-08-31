'use client';

import { useId } from 'react';
import { CustomerDataInput } from '@/lib/validation';
import { User, Phone, Mail, ShieldCheck } from 'lucide-react';

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
      <div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#17212B] mb-2">
          Seus dados de contato
        </h2>
        <p className="text-sm text-[#5E6973]">
          Utilizaremos seu WhatsApp e e-mail exclusivamente para enviar o link do seu ensaio e notificações de produção.
        </p>
      </div>

      <div className="space-y-4">
        {/* Nome Completo */}
        <div>
          <label htmlFor={nameId} className="block text-xs font-semibold uppercase tracking-wider text-[#17212B] mb-2">
            Nome Completo
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5E6973]">
              <User className="w-4 h-4" />
            </div>
            <input
              id={nameId}
              type="text"
              value={data.name || ''}
              onChange={(e) => onChange({ name: e.target.value })}
              placeholder="Ex: Maria Silva"
              className={`w-full pl-10 pr-4 py-3.5 rounded-xl border bg-[#FFFDF9] text-sm text-[#17212B] placeholder-[#5E6973]/50 focus:outline-none focus:ring-2 focus:ring-[#315B52] transition-all ${
                errors.name ? 'border-red-500 bg-red-50/30' : 'border-[#D9D1C2]'
              }`}
            />
          </div>
          {errors.name && <p className="text-xs text-red-600 mt-1.5">{errors.name}</p>}
        </div>

        {/* WhatsApp */}
        <div>
          <label htmlFor={whatsappId} className="block text-xs font-semibold uppercase tracking-wider text-[#17212B] mb-2">
            WhatsApp (com DDD)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5E6973]">
              <Phone className="w-4 h-4" />
            </div>
            <input
              id={whatsappId}
              type="tel"
              value={data.whatsapp || ''}
              onChange={(e) => onChange({ whatsapp: e.target.value })}
              placeholder="Ex: (11) 99999-9999"
              className={`w-full pl-10 pr-4 py-3.5 rounded-xl border bg-[#FFFDF9] text-sm text-[#17212B] placeholder-[#5E6973]/50 focus:outline-none focus:ring-2 focus:ring-[#315B52] transition-all ${
                errors.whatsapp ? 'border-red-500 bg-red-50/30' : 'border-[#D9D1C2]'
              }`}
            />
          </div>
          {errors.whatsapp && <p className="text-xs text-red-600 mt-1.5">{errors.whatsapp}</p>}
        </div>

        {/* E-mail */}
        <div>
          <label htmlFor={emailId} className="block text-xs font-semibold uppercase tracking-wider text-[#17212B] mb-2">
            E-mail
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5E6973]">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id={emailId}
              type="email"
              value={data.email || ''}
              onChange={(e) => onChange({ email: e.target.value })}
              placeholder="Ex: maria.silva@exemplo.com"
              className={`w-full pl-10 pr-4 py-3.5 rounded-xl border bg-[#FFFDF9] text-sm text-[#17212B] placeholder-[#5E6973]/50 focus:outline-none focus:ring-2 focus:ring-[#315B52] transition-all ${
                errors.email ? 'border-red-500 bg-red-50/30' : 'border-[#D9D1C2]'
              }`}
            />
          </div>
          {errors.email && <p className="text-xs text-red-600 mt-1.5">{errors.email}</p>}
        </div>
      </div>

      <div className="p-4 rounded-xl bg-[#ECE7DF]/60 border border-[#D9D1C2] flex items-start gap-3 text-xs text-[#5E6973]">
        <ShieldCheck className="w-5 h-5 text-[#315B52] shrink-0 mt-0.5" />
        <span>Seus dados são protegidos por criptografia e jamais serão compartilhados com terceiros.</span>
      </div>
    </div>
  );
}
