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

async function checkLogs() {
  const { data: logs } = await supabase
    .from('production_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);
  console.log('PRODUCTION LOGS:', JSON.stringify(logs, null, 2));

  const { data: sessions } = await supabase
    .from('photo_sessions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3);
  console.log('PHOTO SESSIONS:', JSON.stringify(sessions, null, 2));

  const { data: jobs } = await supabase
    .from('photo_jobs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(6);
  console.log('PHOTO JOBS:', JSON.stringify(jobs, null, 2));
}

checkLogs();
