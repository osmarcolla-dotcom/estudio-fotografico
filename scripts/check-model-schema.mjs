import fs from 'fs';

const envFile = fs.readFileSync('.env', 'utf-8');
const envVars = {};
envFile.split('\n').forEach((line) => {
  const [key, ...vals] = line.split('=');
  if (key && vals.length > 0) {
    envVars[key.trim()] = vals.join('=').trim();
  }
});

const replicateToken = envVars['IMAGE_PROVIDER_API_KEY'];
const versionId = '8baa7ef2255075b46f4d91cd238c21d31181b3e6a864463f967960bb0112525b';

async function checkSchema() {
  const res = await fetch(`https://api.replicate.com/v1/versions/${versionId}`, {
    headers: { Authorization: `Token ${replicateToken}` }
  });
  const data = await res.json();
  console.log('INPUT SCHEMA:', JSON.stringify(data.openapi_schema?.components?.schemas?.Input, null, 2));
}

checkSchema();
