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
const customerPhotoSignedUrl = 'https://jsqsozvuigihvwakkwij.supabase.co/storage/v1/object/sign/customer-uploads/7e4761be-070f-4ff0-b91a-b1c08f2e495d/foto_referencia_1.png?token=eyJraWQiOiIxZTdhNmEyZi0xNDIwLTQ5MjgtODM4NC02OWQzOWU5ZjEyZDUiLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJjdXN0b21lci11cGxvYWRzLzdlNDc2MWJlLTA3MGYtNGZmMC1iOTFhLWIxYzA4ZjJlNDk1ZC9mb3RvX3JlZmVyZW5jaWFfMS5wbmciLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg4MjMyMjA5LCJleHAiOjE3ODg4MzcwMDl9.owO4l4BwB0P6YzAgZPHtv4oOm8BEMiCxdTWR2ZjIGBqX2ff6TnUr7umqIRE4O8YaKW0QyDcq4m1NqdsuZV_S1w';

async function testBirthdayPrompts() {
  console.log('Testando prompts de aniversário ultra-realistas com elementos visíveis (bolo, velas, taça)...');

  // Prompt 1: Segurando velas douradas numeradas com brilho (como na referência)
  const prompt1 = 'Studio photography of the exact same subject with natural dark hair, celebrating 30th birthday photoshoot, close-up portrait holding two golden number 30 candle sparklers in front of camera with subtle smoke, wearing elegant luxury brown one-shoulder dress, warm studio lighting with soft bokeh background, photorealistic skin texture, natural eye reflections, shot on 85mm f/1.4 lens, 8k commercial photography';

  console.log('Gerando foto 1 (Velas douradas 30 anos)...');
  const res1 = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${replicateToken}`,
      Prefer: 'wait=60',
    },
    body: JSON.stringify({
      version: modelVersion,
      input: {
        main_face_image: customerPhotoSignedUrl,
        prompt: prompt1,
        width: 896,
        height: 1152,
        num_steps: 20,
        guidance_scale: 4.0,
      },
    }),
  });

  const data1 = await res1.json();
  console.log('Foto 1 URL:', data1.output?.[0]);

  // Prompt 2: Sentada com bolo de aniversário branco e velas acesas (como na referência)
  const prompt2 = 'Commercial studio photoshoot of the exact same subject with natural dark hair, birthday photoshoot celebration, sitting next to a white round birthday cake with lit burning candles on a podium, holding champagne glass, wearing glamorous party dress, luxury studio backdrop with golden balloons on floor, warm studio lighting, 8k resolution, photorealistic';

  console.log('Gerando foto 2 (Bolo de aniversário e champanhe)...');
  const res2 = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${replicateToken}`,
      Prefer: 'wait=60',
    },
    body: JSON.stringify({
      version: modelVersion,
      input: {
        main_face_image: customerPhotoSignedUrl,
        prompt: prompt2,
        width: 896,
        height: 1152,
        num_steps: 20,
        guidance_scale: 4.0,
      },
    }),
  });

  const data2 = await res2.json();
  console.log('Foto 2 URL:', data2.output?.[0]);
}

testBirthdayPrompts();
