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

async function checkOrderFull() {
  const orderId = '8f48b490-c8ef-403a-96b9-c2ad9b91ee27';
  const { data: link } = await supabase.from('approval_links').select('*').eq('order_id', orderId);
  console.log('APPROVAL LINK:', link);
  const { data: photos } = await supabase.from('produced_photos').select('*').eq('order_id', orderId);
  console.log('PRODUCED PHOTOS:', photos);
}

checkOrderFull();
