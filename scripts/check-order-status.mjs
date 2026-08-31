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

async function checkOrderStatus() {
  const orderId = '8f48b490-c8ef-403a-96b9-c2ad9b91ee27';
  const { data: order } = await supabase
    .from('orders')
    .select('*, approval_links(*), produced_photos(*)')
    .eq('id', orderId)
    .single();

  console.log('STATUS:', order.status);
  console.log('PRODUCED PHOTOS COUNT:', order.produced_photos?.length);
  console.log('TOKEN:', order.approval_links?.[0]?.token);
}

checkOrderStatus();
