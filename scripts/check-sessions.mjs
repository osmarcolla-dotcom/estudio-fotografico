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

async function checkSessionsAndLogs() {
  const { data: sessions } = await supabase.from('photo_sessions').select('*');
  console.log('SESSIONS:', sessions);
  const { data: logs } = await supabase.from('production_logs').select('*').order('created_at', { ascending: false }).limit(10);
  console.log('LOGS:', logs);
}

checkSessionsAndLogs();
