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

async function testCleanParams() {
  console.log('Testando predição com os parâmetros exatos aceitos pelo modelo...');

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
        prompt: 'Professional glamour studio portrait of the woman, birthday celebration glam in an elegant luxury studio with warm soft lighting, photorealistic skin texture, high detail 8k',
        width: 896,
        height: 1152,
        num_steps: 20,
        guidance_scale: 4.0,
      },
    }),
  });

  const data = await response.json();
  console.log('Status code:', response.status);
  console.log('Prediction status:', data.status);
  console.log('Output:', data.output);
  if (data.error) console.log('Error:', data.error);
}

testCleanParams();
