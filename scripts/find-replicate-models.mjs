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

async function findModels() {
  const candidateModels = [
    'yan-jobs/pulid-flux',
    'fofr/pulid-flux',
    'zsxkib/flux-pulid',
    'instantx/instantid',
    'black-forest-labs/flux-dev',
    'black-forest-labs/flux-schnell',
    'lucataco/instantid'
  ];

  for (const m of candidateModels) {
    const res = await fetch(`https://api.replicate.com/v1/models/${m}`, {
      headers: { Authorization: `Token ${replicateToken}` }
    });
    console.log(`Model [${m}] status:`, res.status);
    if (res.status === 200) {
      const data = await res.json();
      console.log(`  -> Latest Version ID:`, data.latest_version?.id);
    }
  }
}

findModels();
