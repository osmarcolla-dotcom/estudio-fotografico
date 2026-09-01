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

async function testModelResolve() {
  console.log('Testando versão oficial do Flux PuLID...');
  const res = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${replicateToken}`,
      Prefer: 'wait=60',
    },
    body: JSON.stringify({
      version: '8baa7ef2255075b46f4d91cd238c21d31181b3e6a864463f967960bb0112525b',
      input: {
        main_face_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
        prompt: 'test prompt studio lighting',
        width: 896,
        height: 1152,
        num_steps: 20,
        guidance_scale: 4.0,
      }
    })
  });

  console.log('Status:', res.status);
  const data = await res.json();
  console.log('Response:', { id: data.id, status: data.status, error: data.error, output: data.output });
}

testModelResolve();
