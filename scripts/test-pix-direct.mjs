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

async function testPixDirect() {
  console.log('Testando criação direta de PIX via Mercado Pago API /v1/payments...');

  const payload = {
    transaction_amount: 19.90,
    description: 'Ensaio Fotográfico Digital - Pacote Básico',
    payment_method_id: 'pix',
    payer: {
      email: 'cliente@estudiofotografico.com.br',
      first_name: 'Cliente',
      last_name: 'Estudio',
    },
    external_reference: 'teste-' + Date.now(),
  };

  const response = await fetch('https://api.mercadopago.com/v1/payments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      'X-Idempotency-Key': 'pix-test-' + Date.now(),
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  console.log('STATUS:', response.status);
  if (response.ok) {
    console.log('PIX ID:', data.id);
    console.log('STATUS:', data.status);
    console.log('QR CODE COPIA E COLA:', data.point_of_interaction?.transaction_data?.qr_code?.slice(0, 50) + '...');
    console.log('QR CODE BASE64 DISPONÍVEL:', Boolean(data.point_of_interaction?.transaction_data?.qr_code_base64));
    console.log('TICKET URL:', data.point_of_interaction?.transaction_data?.ticket_url);
  } else {
    console.log('ERROR:', JSON.stringify(data, null, 2));
  }
}

testPixDirect();
