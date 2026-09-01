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

async function testReplicateWithSignedUrl() {
  console.log('1. Uploading test image to Supabase customer-uploads...');
  // Download test image buffer
  const sampleRes = await fetch('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80');
  const arrayBuffer = await sampleRes.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const testPath = `test-run/reference_${Date.now()}.jpg`;
  const { error: upErr } = await supabase.storage
    .from('customer-uploads')
    .upload(testPath, buffer, { contentType: 'image/jpeg', upsert: true });

  if (upErr) {
    console.error('Upload error:', upErr);
    return;
  }

  console.log('2. Creating signed URL...');
  const { data: signedData } = await supabase.storage
    .from('customer-uploads')
    .createSignedUrl(testPath, 3600);

  const signedUrl = signedData?.signedUrl;
  console.log('Signed URL:', signedUrl);

  console.log('3. Calling Replicate with signed URL as main_face_image...');
  const versionId = '8baa7ef2255075b46f4d91cd238c21d31181b3e6a864463f967960bb0112525b';

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
        main_face_image: signedUrl,
        prompt: 'Professional portrait photograph of the subject in elegant luxury studio lighting, high resolution, realistic skin texture',
        width: 896,
        height: 1152,
        num_steps: 20,
        guidance_scale: 4.0,
      },
    }),
  });

  const data = await res.json();
  console.log('Replicate status:', res.status, data.status);
  console.log('Replicate output:', data.output);
}

testReplicateWithSignedUrl();
