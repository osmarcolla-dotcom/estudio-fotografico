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

async function checkLatestProducedPhotos() {
  const orderId = '7e4761be-070f-4ff0-b91a-b1c08f2e495d';
  const { data: link } = await supabase.from('approval_links').select('*').eq('order_id', orderId);
  const { data: photos } = await supabase.from('produced_photos').select('*').eq('order_id', orderId);
  console.log('APPROVAL LINK TOKEN:', link?.[0]?.token);
  console.log('PHOTOS:', photos);
}

checkLatestProducedPhotos();
