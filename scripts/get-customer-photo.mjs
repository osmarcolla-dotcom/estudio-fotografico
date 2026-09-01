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

async function getPhotoUrl() {
  const orderId = '8f48b490-c8ef-403a-96b9-c2ad9b91ee27';
  const { data: photos } = await supabase.from('customer_photos').select('*').eq('order_id', orderId);
  console.log('PHOTOS:', photos);

  // Check if file exists in bucket
  const { data: files } = await supabase.storage.from('customer-uploads').list(orderId);
  console.log('FILES IN BUCKET:', files);
}

getPhotoUrl();
