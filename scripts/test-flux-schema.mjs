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

async function testFluxPulid() {
  console.log('Testando zsxkib/flux-pulid prediction schema...');

  const res = await fetch('https://api.replicate.com/v1/models/zsxkib/flux-pulid', {
    headers: { Authorization: `Token ${replicateToken}` }
  });
  const modelData = await res.json();
  console.log('Model details:', modelData.name);
  console.log('Latest version ID:', modelData.latest_version?.id);
  console.log('OpenAPI schema input properties:', Object.keys(modelData.latest_version?.openapi_schema?.components?.schemas?.Input?.properties || {}));
}

testFluxPulid();
