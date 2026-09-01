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

async function testWaitHeader() {
  console.log('Testando Replicate com Prefer: wait...');

  const versionId = '8baa7ef2255075b46f4d91cd238c21d31181b3e6a864463f967960bb0112525b';
  const testFaceImage = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';

  const res = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${replicateToken}`,
      Prefer: 'wait=60',
    },
    body: JSON.stringify({
      version: versionId,
      input: {
        main_face_image: testFaceImage,
        prompt: 'Professional portrait of the subject in an elegant studio setting with soft lighting',
        width: 896,
        height: 1152,
        num_steps: 20,
      },
    }),
  });

  console.log('Status with wait:', res.status);
  const data = await res.json();
  console.log('Status in body:', data.status);
  console.log('Output in body:', data.output);
}

testWaitHeader();
