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

async function testUpload() {
  const buffer = Buffer.from('fake image content for testing');
  const { data, error } = await supabase.storage
    .from('customer-uploads')
    .upload('test/test.txt', buffer, { contentType: 'text/plain', upsert: true });

  console.log('UPLOAD DATA:', data);
  console.log('UPLOAD ERROR:', error);

  if (!error) {
    const { data: signed } = await supabase.storage
      .from('customer-uploads')
      .createSignedUrl('test/test.txt', 3600);
    console.log('SIGNED URL:', signed?.signedUrl);
  }
}

testUpload();
