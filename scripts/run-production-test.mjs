import { createClient } from '@supabase/supabase-js';
import { ProductionService } from '../lib/domain/production/service.ts';
import { OrderService } from '../lib/domain/orders/service.ts';
import fs from 'fs';

const envFile = fs.readFileSync('.env', 'utf-8');
const envVars = {};
envFile.split('\n').forEach((line) => {
  const [key, ...vals] = line.split('=');
  if (key && vals.length > 0) {
    envVars[key.trim()] = vals.join('=').trim();
  }
});

for (const [k, v] of Object.entries(envVars)) {
  process.env[k] = v;
}

const supabase = createClient(
  envVars['NEXT_PUBLIC_SUPABASE_URL'],
  envVars['SUPABASE_SERVICE_ROLE_KEY']
);

async function runProductionManually() {
  const orderId = '8f48b490-c8ef-403a-96b9-c2ad9b91ee27';
  const order = await OrderService.getOrderById(orderId);
  console.log('ORDER FOUND:', order?.order_number, order?.status);

  const photoUrls = order?.customer_photos?.map((p) => p.storage_path) || [];
  console.log('PHOTO URLS:', photoUrls);

  console.log('STARTING PRODUCTION...');
  const session = await ProductionService.startProduction(order, photoUrls);
  console.log('SESSION RESULT:', session.status, 'COMPLETED PHOTOS:', session.completed_photos);

  const { data: updatedPhotos } = await supabase.from('produced_photos').select('*').eq('order_id', orderId);
  console.log('UPDATED PRODUCED PHOTOS IN SUPABASE:', updatedPhotos?.length);
}

runProductionManually();
