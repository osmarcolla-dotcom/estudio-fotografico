'use client';

import { Suspense } from 'react';
import { DirectOrderFlow } from '@/components/order/DirectOrderFlow';

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F6F4EF] flex items-center justify-center text-xs text-[#5E6973]">Carregando estúdio...</div>}>
      <DirectOrderFlow />
    </Suspense>
  );
}
