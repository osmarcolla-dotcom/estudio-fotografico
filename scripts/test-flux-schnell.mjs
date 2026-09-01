import fs from 'fs';

const envFile = fs.readFileSync('.env', 'utf-8');
const envVars = {};
envFile.split('\n').forEach((line) => {
  const [key, ...vals] = line.split('=');
  if (key && vals.length > 0) {
    envVars[key.trim()] = vals.join('=').trim();
  }
});

const replicateToken = envVars['IMAGE_PROVIDER_API_KEY'];

async function testWorkingModel() {
  console.log('Testando black-forest-labs/flux-schnell ou flux-dev...');

  // Teste de chamada no black-forest-labs/flux-schnell (muito rápido e barato)
  const res = await fetch('https://api.replicate.com/v1/models/black-forest-labs/flux-schnell', {
    headers: { Authorization: `Token ${replicateToken}` }
  });
  console.log('Status flux-schnell:', res.status);
  const data = await res.json();
  console.log('Latest Version:', data.latest_version?.id);
  console.log('Input Schema:', Object.keys(data.latest_version?.openapi_schema?.components?.schemas?.Input?.properties || {}));
}

testWorkingModel();
