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

async function checkIds() {
  const { data: cats } = await supabase.from('categories').select('id, name, slug');
  console.log('CATEGORIES:', cats);

  const { data: styles } = await supabase.from('styles').select('id, category_id, name, slug');
  console.log('STYLES:', styles);

  const { data: pkgs } = await supabase.from('packages').select('id, name, slug');
  console.log('PACKAGES:', pkgs);
}

checkIds();
