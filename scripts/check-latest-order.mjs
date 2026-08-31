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

async function checkLatestOrder() {
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*, payments(*)')
    .order('created_at', { ascending: false })
    .limit(3);

  console.log('LATEST ORDERS:', JSON.stringify(orders, null, 2));
}

checkLatestOrder();
