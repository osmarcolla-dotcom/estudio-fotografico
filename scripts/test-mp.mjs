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

async function testMercadoPago() {
  console.log('Testando Mercado Pago com token:', accessToken?.slice(0, 15) + '...');

  const payload = {
    items: [
      {
        id: 'item-1',
        title: 'Ensaio Fotográfico - Gravidez (Elegante)',
        description: 'Pacote Profissional - 12 fotos em alta resolução',
        quantity: 1,
        currency_id: 'BRL',
        unit_price: 29.9,
      },
    ],
    payer: {
      name: 'Maria Silva',
      email: 'cliente@estudiofotografico.com',
    },
    external_reference: 'ord-test-123',
    back_urls: {
      success: 'https://estudio-fotografico-app.vercel.app/pedido/ord-test-123?status=success',
      pending: 'https://estudio-fotografico-app.vercel.app/pedido/ord-test-123?status=pending',
      failure: 'https://estudio-fotografico-app.vercel.app/pedido/ord-test-123?status=failure',
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
  console.log('DATA:', JSON.stringify(data, null, 2));
}

testMercadoPago();
