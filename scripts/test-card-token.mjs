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

async function testCardTokenCreation() {
  console.log('Testando criação de token de cartão direto...');

  // 1. Criação de token de teste
  const tokenRes = await fetch(`https://api.mercadopago.com/v1/card_tokens`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      card_number: '5031755734523456', // Cartão de teste Master
      cardholder: {
        name: 'APROVADO TESTE',
        identification: {
          type: 'CPF',
          number: '19119119100',
        },
      },
      security_code: '123',
      expiration_month: 12,
      expiration_year: 2028,
    }),
  });

  const tokenData = await tokenRes.json();
  console.log('Token Status:', tokenRes.status);
  console.log('Token Data:', tokenData);
}

testCardTokenCreation();
