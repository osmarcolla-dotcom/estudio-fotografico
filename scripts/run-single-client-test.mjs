import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envFile = fs.readFileSync('.env', 'utf-8');
const envVars = {};
envFile.split('\n').forEach((line) => {
  const [key, ...vals] = line.split('=');
  if (key && vals.length > 0) {
    envVars[key.trim()] = vals.join('=').trim();
  }
});

const supabase = createClient(
  envVars['NEXT_PUBLIC_SUPABASE_URL'],
  envVars['SUPABASE_SERVICE_ROLE_KEY']
);
const replicateToken = envVars['IMAGE_PROVIDER_API_KEY'];
const modelVersion = '8baa7ef2255075b46f4d91cd238c21d31181b3e6a864463f967960bb0112525b';

async function generateSingleTestPhoto() {
  console.log('1. Gerando Signed URL atualizada da foto da cliente...');
  const orderId = '7e4761be-070f-4ff0-b91a-b1c08f2e495d';
  const { data: signedData } = await supabase.storage
    .from('customer-uploads')
    .createSignedUrl(`${orderId}/foto_referencia_1.png`, 3600);

  const faceUrl = signedData?.signedUrl;
  console.log('Face URL:', faceUrl);

  console.log('2. Chamando Replicate Flux PuLID para tema de Aniversário (Celebration Glam)...');
  const prompt = 'Award-winning high-end studio portrait photograph of the exact same subject with beautiful natural dark hair, luxury 30th birthday photoshoot celebration, sitting elegantly beside a minimalist white birthday cake, holding golden number candle sparkler, wearing a glamorous elegant evening dress, warm studio lighting with soft bokeh background, high detail skin texture, realistic eye reflections, shot on 85mm f/1.4 lens, 8k ultra realistic commercial portrait';

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
        main_face_image: faceUrl,
        prompt: prompt,
        width: 896,
        height: 1152,
        num_steps: 20,
        guidance_scale: 4.0,
        id_weight: 0.95,
      },
    }),
  });

  let data = await response.json();
  console.log('Prediction status:', data.status);

  if (data.status !== 'succeeded' && data.status !== 'failed') {
    console.log('Aguardando conclusão...');
    for (let i = 0; i < 30; i++) {
      await new Promise((r) => setTimeout(r, 3000));
      const check = await fetch(`https://api.replicate.com/v1/predictions/${data.id}`, {
        headers: { Authorization: `Token ${replicateToken}` }
      });
      data = await check.json();
      console.log(`Tentativa ${i+1}: ${data.status}`);
      if (data.status === 'succeeded' || data.status === 'failed') break;
    }
  }

  console.log('OUTPUT FINAL:', data.output);
  if (data.error) console.log('ERROR:', data.error);
}

generateSingleTestPhoto();
