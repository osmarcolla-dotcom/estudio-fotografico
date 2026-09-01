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

async function checkFailedLogs() {
  const { data: logs } = await supabase
    .from('production_logs')
    .select('*')
    .eq('session_id', 'session-7e4761be-070f-4ff0-b91a-b1c08f2e495d-1788232330297')
    .order('created_at', { ascending: true });

  console.log('LOGS FOR 7e4761be:', logs);
}

checkFailedLogs();
