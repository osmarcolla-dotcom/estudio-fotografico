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
const modelVersion = '8baa7ef2255075b46f4d91cd238c21d31181b3e6a864463f967960bb0112525b';

// Foto real enviada pelo usuário
const customerPhotoSignedUrl = 'https://jsqsozvuigihvwakkwij.supabase.co/storage/v1/object/sign/customer-uploads/7e4761be-070f-4ff0-b91a-b1c08f2e495d/foto_referencia_1.png?token=eyJraWQiOiIxZTdhNmEyZi0xNDIwLTQ5MjgtODM4NC02OWQzOWU5ZjEyZDUiLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJjdXN0b21lci11cGxvYWRzLzdlNDc2MWJlLTA3MGYtNGZmMC1iOTFhLWIxYzA4ZjJlNDk1ZC9mb3RvX3JlZmVyZW5jaWFfMS5wbmciLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg4MjMyMjA5LCJleHAiOjE3ODg4MzcwMDl9.owO4l4BwB0P6YzAgZPHtv4oOm8BEMiCxdTWR2ZjIGBqX2ff6TnUr7umqIRE4O8YaKW0QyDcq4m1NqdsuZV_S1w';

async function testDirectFluxPulid() {
  console.log('Enviando foto da cliente para Replicate Flux PuLID...');

  const prompt = 'Masterpiece studio portrait of the exact same subject with harmonious facial structure and natural studio lighting, birthday celebration glam in an elegant studio, 8k resolution, photorealistic skin texture, natural eye reflection';

  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${replicateToken}`,
      Prefer: 'wait=60',
    },
    body: JSON.stringify({
      version: modelVersion,
      input: {
        prompt: prompt,
        negative_prompt: 'deformed face, bad anatomy, blurry, duplicate face, plastic skin, cartoon, 3d render',
        main_face_image: customerPhotoSignedUrl,
        width: 896,
        height: 1152,
        num_steps: 20,
        guidance_scale: 4.0,
        id_weight: 0.95,
        output_format: 'jpg',
        output_quality: 95,
      },
    }),
  });

  console.log('Status code:', response.status);
  let data = await response.json();
  console.log('Initial Prediction Data:', { id: data.id, status: data.status });

  if (data.status !== 'succeeded' && data.status !== 'failed') {
    console.log('Aguardando conclusão (polling)...');
    for (let i = 0; i < 30; i++) {
      await new Promise((r) => setTimeout(r, 3000));
      const check = await fetch(`https://api.replicate.com/v1/predictions/${data.id}`, {
        headers: { Authorization: `Token ${replicateToken}` }
      });
      data = await check.json();
      console.log(`Tentativa ${i + 1}: status = ${data.status}`);
      if (data.status === 'succeeded' || data.status === 'failed') break;
    }
  }

  console.log('FINAL RESULT:', data.status);
  console.log('OUTPUT IMAGE URL:', data.output);
  if (data.error) console.log('ERROR:', data.error);
}

testDirectFluxPulid();
