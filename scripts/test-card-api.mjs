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

async function testCardToken() {
  console.log('Testando criação de token de cartão via Mercado Pago API...');

  // Teste de consulta de métodos de pagamento disponíveis
  const response = await fetch('https://api.mercadopago.com/v1/payment_methods', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();
  console.log('Payment methods status:', response.status);
  console.log('Total methods:', Array.isArray(data) ? data.length : data);
}

testCardToken();
