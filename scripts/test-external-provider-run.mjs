import { ExternalImageGenerationProvider } from '../lib/domain/production/providers/external-provider.ts';
import fs from 'fs';

const envFile = fs.readFileSync('.env', 'utf-8');
const envVars = {};
envFile.split('\n').forEach((line) => {
  const [key, ...vals] = line.split('=');
  if (key && vals.length > 0) {
    envVars[key.trim()] = vals.join('=').trim();
  }
});

for (const [k, v] of Object.entries(envVars)) {
  process.env[k] = v;
}

async function testExternalGen() {
  const provider = new ExternalImageGenerationProvider();
  console.log('Provider configured?', provider.isConfigured());

  const customerPhotoSignedUrl = 'https://jsqsozvuigihvwakkwij.supabase.co/storage/v1/object/sign/customer-uploads/7e4761be-070f-4ff0-b91a-b1c08f2e495d/foto_referencia_1.png?token=eyJraWQiOiIxZTdhNmEyZi0xNDIwLTQ5MjgtODM4NC02OWQzOWU5ZjEyZDUiLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJjdXN0b21lci11cGxvYWRzLzdlNDc2MWJlLTA3MGYtNGZmMC1iOTFhLWIxYzA4ZjJlNDk1ZC9mb3RvX3JlZmVyZW5jaWFfMS5wbmciLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg4MjMyMjA5LCJleHAiOjE3ODg4MzcwMDl9.owO4l4BwB0P6YzAgZPHtv4oOm8BEMiCxdTWR2ZjIGBqX2ff6TnUr7umqIRE4O8YaKW0QyDcq4m1NqdsuZV_S1w';

  const res = await provider.generateImage({
    sessionId: 'test-session',
    photoJobId: 'test-job-1',
    photoIndex: 1,
    prompt: 'Professional glamour studio portrait of the woman, birthday celebration glam with elegant lighting and champagne glass, 8k resolution, photorealistic, beautiful face, natural skin texture',
    sourceImageUrl: customerPhotoSignedUrl,
    identityProfile: {
      face_description: 'Harmonious face with dark hair',
      hair_description: 'Black hair',
      skin_description: 'Natural skin',
      body_description: 'Natural body',
      apparent_age: 'Adult',
      distinctive_features: [],
      source_image_reference: customerPhotoSignedUrl,
    },
    variation: {
      photo_index: 1,
      pose_description: 'Pose elegante de estúdio',
      framing: 'Plano Médio',
      setting_scene: 'Estúdio de aniversário com iluminação sofisticada',
      lighting_setup: 'Luz difusa de estúdio',
      composition_rule: 'Regra dos terços',
      wardrobe: 'Vestido de festa elegante',
      camera_angle: 'Nível dos olhos',
      mood: 'Celebration',
      aspect_ratio: '4:5',
      expression: 'Sorriso sutil e confiante',
    },
  });

  console.log('RESULT:', res);
}

testExternalGen();
