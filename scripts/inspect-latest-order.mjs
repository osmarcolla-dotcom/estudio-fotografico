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

async function inspectOrder() {
  const orderId = '7e4761be-070f-4ff0-b91a-b1c08f2e495d';
  const { data: photos } = await supabase.from('customer_photos').select('*').eq('order_id', orderId);
  console.log('CUSTOMER PHOTOS:', photos);

  const { data: jobs } = await supabase.from('photo_jobs').select('*').like('session_id', `%${orderId}%`);
  console.log('PHOTO JOBS ERRORS:', jobs?.map(j => ({ idx: j.photo_index, status: j.status, last_error: j.last_error, provider: j.provider_name })));
}

inspectOrder();
