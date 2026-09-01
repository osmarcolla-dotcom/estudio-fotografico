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

async function testWaitPrediction() {
  const predictionId = 'jcq92q4hmnrne0d0bb78dzdmx0';
  console.log('Checando status da predição:', predictionId);

  const res = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
    headers: { Authorization: `Token ${replicateToken}` }
  });
  const data = await res.json();
  console.log('Status:', data.status);
  console.log('Output:', data.output);
  if (data.error) console.log('Error:', data.error);
}

testWaitPrediction();
