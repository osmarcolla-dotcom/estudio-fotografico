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

async function testQuery() {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      customer:customers(*),
      category:categories(*),
      style:styles(*),
      package:packages(*),
      payment:payments(*),
      customer_photos(*),
      produced_photos(*),
      approval_link:approval_links(*),
      revision_requests(*)
    `)
    .limit(1);

  console.log('QUERY ERROR:', error);
  console.log('DATA:', data);
}

testQuery();
