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

async function testWithModelName() {
  console.log('Testing with version: "lucataco/pulid-flux"...');
  const res = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${replicateToken}`,
    },
    body: JSON.stringify({
      version: 'lucataco/pulid-flux',
      input: {
        main_face_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
        prompt: 'test',
      }
    })
  });
  console.log('Status:', res.status);
  const data = await res.json();
  console.log('Response detail:', data.detail || data.message || data);
}

testWithModelName();
