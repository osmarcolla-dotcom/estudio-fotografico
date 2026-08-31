import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envFile = fs.readFileSync('.env', 'utf-8');
const envVars = {};
envFile.split('\n').forEach((line) => {
  const [key, ...vals] = line.split('=');
  if (key && vals.length > 0) {
    envVars[key.trim()] = vals.join('=').trim();
  }
});

const supabase = createClient(
  envVars['NEXT_PUBLIC_SUPABASE_URL'],
  envVars['SUPABASE_SERVICE_ROLE_KEY']
);

async function testCheckPaymentRoute() {
  const orderId = '8f48b490-c8ef-403a-96b9-c2ad9b91ee27';
  console.log('Chamando endpoint de verificação de pagamento para o pedido:', orderId);

  const res = await fetch(`https://estudio-fotografico-app.vercel.app/api/orders/${orderId}/check-payment`);
  const data = await res.json();
  console.log('RESPOSTA CHECK-PAYMENT:', data);

  const { data: updatedOrder } = await supabase.from('orders').select('*, payments(*), produced_photos(*), approval_links(*)').eq('id', orderId).single();
  console.log('STATUS DO PEDIDO NO BANCO:', updatedOrder.status);
  console.log('LINK DE APROVAÇÃO / ENTREGA:', `https://estudio-fotografico-app.vercel.app/ensaio/${updatedOrder.approval_links?.[0]?.token}`);
}

testCheckPaymentRoute();
