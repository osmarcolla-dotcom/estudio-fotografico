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

async function check422() {
  const prompt = 'Award-winning high-end studio photography of the exact same subject with natural dark hair and beautiful facial features, luxury birthday photoshoot celebration, sitting elegantly beside a minimalist white birthday cake, holding golden number candle sparkler, wearing a glamorous elegant evening dress, warm studio lighting with soft bokeh, high detail skin texture, natural eye reflections, shot on 85mm f/1.4 lens, 8k ultra realistic commercial portrait';

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
        main_face_image: customerPhotoSignedUrl,
        prompt: prompt,
        width: 896,
        height: 1152,
        num_steps: 25,
        guidance_scale: 4.5,
      },
    }),
  });

  const data = await response.json();
  console.log('Status code:', response.status);
  console.log('Error details:', JSON.stringify(data, null, 2));
}

check422();
