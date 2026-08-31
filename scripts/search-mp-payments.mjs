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

async function searchPayments() {
  const orderId = '8f48b490-c8ef-403a-96b9-c2ad9b91ee27';
  console.log('Buscando pagamentos no Mercado Pago para o pedido:', orderId);

  const res = await fetch(`https://api.mercadopago.com/v1/payments/search?external_reference=${orderId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await res.json();
  console.log('RESULTADOS:', JSON.stringify(data, null, 2));
}

searchPayments();
