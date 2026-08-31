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

async function testReplicateModel() {
  console.log('Testando chamada ao Replicate com token:', replicateToken?.slice(0, 10) + '...');

  // 1. Testa modelo Flux Pulid
  const response = await fetch('https://api.replicate.com/v1/models/lucataco/pulid-flux', {
    headers: {
      Authorization: `Token ${replicateToken}`,
    },
  });

  console.log('Model check status:', response.status);
  const data = await response.json();
  console.log('Model latest version:', data.latest_version?.id || data);
}

testReplicateModel();
