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

async function updateOrderWithBirthdayPhotos() {
  const orderId = '4e7a803b-6490-4058-b551-4e3fcda02878';

  // Fotos reais geradas no Flux PuLID com bolo, velas e elementos temáticos
  const photos = [
    {
      order_id: orderId,
      photo_index: 1,
      preview_storage_path: 'https://replicate.delivery/yhqm/AtTP7GVxwobwBRpln4buC1KLvtxn2uTgUdBi9Vb9eSAfTLJXA/output_1.webp',
      final_storage_path: 'https://replicate.delivery/yhqm/AtTP7GVxwobwBRpln4buC1KLvtxn2uTgUdBi9Vb9eSAfTLJXA/output_1.webp',
      variation_description: 'Ensaio de Aniversário — Retrato segurando velas douradas numeradas com brilho',
      is_approved: true,
    },
    {
      order_id: orderId,
      photo_index: 2,
      preview_storage_path: 'https://replicate.delivery/yhqm/eJnAFVJ8Oc2LUi1mm1ilNSe6AuYErOZKsL5aWrFSOXXMULJXA/output_1.webp',
      final_storage_path: 'https://replicate.delivery/yhqm/eJnAFVJ8Oc2LUi1mm1ilNSe6AuYErOZKsL5aWrFSOXXMULJXA/output_1.webp',
      variation_description: 'Ensaio de Aniversário — Sentada ao lado de bolo branco com velas acesas e taça de champanhe',
      is_approved: true,
    }
  ];

  await supabase.from('produced_photos').delete().eq('order_id', orderId);
  await supabase.from('produced_photos').insert(photos);

  const { data: link } = await supabase.from('approval_links').select('token').eq('order_id', orderId).single();
  console.log('UPDATED DELIVERY LINK:', `https://estudio-fotografico-app.vercel.app/ensaio/${link.token}`);
}

updateOrderWithBirthdayPhotos();
