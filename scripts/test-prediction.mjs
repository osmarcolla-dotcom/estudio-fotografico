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

async function testGeneratePrediction() {
  const versionId = '8baa7ef2255075b46f4d91cd238c21d31181b3e6a864463f967960bb0112525b';
  const testFaceImage = 'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=800&q=80';

  const res = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${replicateToken}`,
    },
    body: JSON.stringify({
      version: versionId,
      input: {
        main_face_image: testFaceImage,
        prompt: 'Professional studio portrait of the subject',
        width: 896,
        height: 1152,
      },
    }),
  });

  console.log('STATUS:', res.status);
  const data = await res.json();
  console.log('BODY:', data);
}

testGeneratePrediction();
