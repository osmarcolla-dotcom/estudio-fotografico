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

async function testBoth() {
  const baseUrl = 'https://estudio-fotografico-app.vercel.app';
  const orderId = 'test-both-' + Date.now();

  console.log('Criando PIX e Preference simultaneamente...');

  const [pixRes, prefRes] = await Promise.all([
    // 1. PIX direto
    fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'X-Idempotency-Key': 'pix-' + orderId,
      },
      body: JSON.stringify({
        transaction_amount: 19.9,
        description: 'Ensaio Fotográfico - Aniversário (Celebration Glam)',
        payment_method_id: 'pix',
        payer: {
          email: 'cliente@estudiofotografico.com.br',
          first_name: 'Cliente',
          last_name: 'Estudio',
        },
        external_reference: orderId,
      }),
    }).then((r) => r.json()),

    // 2. Preference para Cartão
    fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
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
          name: 'Cliente Estúdio',
          email: 'cliente@estudiofotografico.com.br',
        },
        external_reference: orderId,
        back_urls: {
          success: `${baseUrl}/pedido/${orderId}?status=success`,
          pending: `${baseUrl}/pedido/${orderId}?status=pending`,
          failure: `${baseUrl}/pedido/${orderId}?status=failure`,
        },
        auto_return: 'approved',
      }),
    }).then((r) => r.json()),
  ]);

  console.log('PIX QR Code:', Boolean(pixRes.point_of_interaction?.transaction_data?.qr_code));
  console.log('PIX Base64:', Boolean(pixRes.point_of_interaction?.transaction_data?.qr_code_base64));
  console.log('Preference Card Link (init_point):', prefRes.init_point);
}

testBoth();
