import { createClient } from '@supabase/supabase-js';
import { ProductionOrchestrator } from '../lib/domain/production/orchestrator.ts';
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

async function testFullRun() {
  const orderId = '8f48b490-c8ef-403a-96b9-c2ad9b91ee27';
  const order = await OrderService.getOrderById(orderId);
  console.log('ORDER:', order.order_number);

  try {
    const session = await ProductionOrchestrator.runFullProductionPipeline({
      orderId: order.id,
      customerId: order.customer_id,
      categorySlug: 'aniversario',
      styleSlug: 'celebration-glam',
      photoCount: 6,
      sourceImageUrl: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=1200&q=85',
    });

    console.log('SESSION FINISHED:', session.status);
    console.log('JOBS:', session.photo_jobs.map(j => ({ idx: j.photo_index, status: j.status, ver: j.active_version?.preview_image_url })));

    const { data: photos } = await supabase.from('produced_photos').select('*').eq('order_id', orderId);
    console.log('PHOTOS IN DB:', photos?.length);
  } catch (e) {
    console.error('ERROR IN PIPELINE:', e);
  }
}

testFullRun();
