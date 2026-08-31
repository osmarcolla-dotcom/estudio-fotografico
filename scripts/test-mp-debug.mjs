import fs from 'fs';

const envFile = fs.readFileSync('.env', 'utf-8');
const envVars = {};
envFile.split('\n').forEach((line) => {
  const [key, ...vals] = line.split('=');
  if (key && vals.length > 0) {
    envVars[key.trim()] = vals.join('=').trim();
  }
});

const accessToken = envVars['MERCADOPAGO_ACCESS_TOKEN'];

async function testWithOrderData() {
  const baseUrl = 'https://estudio-fotografico-app.vercel.app';
  const orderId = '6de825be-c54b-4fac-ad86-30f74bf83a94';

  const payload = {
    items: [
      {
        id: orderId,
        title: 'Ensaio Fotográfico - Aniversário (Celebration Glam)',
        description: 'Pacote Básico - 6 fotos em alta resolução',
        quantity: 1,
        currency_id: 'BRL',
        unit_price: 19.9,
      },
    ],
    payer: {
      name: 'osmar',
      email: 'cliente@estudiofotografico.com.br',
      phone: {
        number: '49998141617',
      },
    },
    external_reference: orderId,
    back_urls: {
      success: `${baseUrl}/pedido/${orderId}?status=success`,
      pending: `${baseUrl}/pedido/${orderId}?status=pending`,
      failure: `${baseUrl}/pedido/${orderId}?status=failure`,
    },
    auto_return: 'approved',
  };

  const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  console.log('STATUS:', response.status);
  console.log('INIT_POINT:', data.init_point);
}

testWithOrderData();
