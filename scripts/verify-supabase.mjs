import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Ler variáveis do arquivo .env
const envFile = fs.readFileSync('.env', 'utf-8');
const envVars = {};
envFile.split('\n').forEach((line) => {
  const [key, ...vals] = line.split('=');
  if (key && vals.length > 0) {
    envVars[key.trim()] = vals.join('=').trim();
  }
});

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL'];
const serviceRoleKey = envVars['SUPABASE_SERVICE_ROLE_KEY'];

if (!supabaseUrl || !serviceRoleKey) {
  console.error('ERRO: Credenciais do Supabase ausentes no .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function verify() {
  console.log('=== RELATÓRIO DE CONEXÃO DO SUPABASE ===\n');

  // 1. Verificar Tabelas e Seed
  console.log('--- TABELAS DO BANCO DE DADOS ---');
  const tables = [
    'categories',
    'packages',
    'styles',
    'orders',
    'customers',
    'payments',
    'customer_photos',
    'approval_links',
    'produced_photos',
    'production_jobs',
    'revision_requests',
    'photo_sessions',
    'photo_jobs',
    'photo_versions',
    'production_logs',
  ];

  let missingTables = 0;
  for (const tableName of tables) {
    const { data, error } = await supabase.from(tableName).select('*').limit(10);

    if (error) {
      console.log(`❌ Tabela [${tableName}]: PENDENTE ou NÃO ENCONTRADA (${error.message})`);
      missingTables++;
    } else {
      console.log(`✅ Tabela [${tableName}]: OK! (${data.length} registros cadastrados)`);
    }
  }

  // 2. Verificar Storage Buckets
  console.log('\n--- STORAGE BUCKETS (PASTAS DE FOTOS) ---');
  const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();

  if (bucketError) {
    console.log(`❌ Erro ao consultar buckets: ${bucketError.message}`);
  } else {
    const expectedBuckets = ['customer-uploads', 'previews', 'final-images'];
    for (const bName of expectedBuckets) {
      const found = buckets?.find((b) => b.name === bName || b.id === bName);
      if (found) {
        console.log(`✅ Bucket [${bName}]: OK! (Privado: ${!found.public ? 'Sim' : 'Não'})`);
      } else {
        console.log(`❌ Bucket [${bName}]: PENDENTE / NÃO CRIADO`);
      }
    }
  }
}

verify();
