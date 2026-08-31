import { MercadoPagoGateway } from '../lib/domain/payments/providers/mercadopago.ts';
import fs from 'fs';

const envFile = fs.readFileSync('.env', 'utf-8');
const envVars = {};
envFile.split('\n').forEach((line) => {
  const [key, ...vals] = line.split('=');
  if (key && vals.length > 0) {
    envVars[key.trim()] = vals.join('=').trim();
  }
});

process.env.MERCADOPAGO_ACCESS_TOKEN = envVars['MERCADOPAGO_ACCESS_TOKEN'];
process.env.NEXT_PUBLIC_APP_URL = envVars['NEXT_PUBLIC_APP_URL'] || 'http://localhost:3000';

const mp = new MercadoPagoGateway();

async function test() {
  const fakeOrder = {
    id: '6de825be-c54b-4fac-ad86-30f74bf83a94',
    order_number: 'ENS-2608-5224',
    customer_id: '8c520a00-1feb-4a18-8343-a82c3e2003dd',
    category_name: 'Aniversário',
    style_name: 'Celebration Glam',
    package_name: 'Pacote Básico',
    package_photo_count: 6,
    package_price_cents: 1990,
    customer: {
      name: 'osmar',
      email: '49998141617@cliente.estudio',
      whatsapp: '49998141617',
    },
  };

  const res = await mp.createCheckout(fakeOrder);
  console.log('RESULT:', res);
}

test();
