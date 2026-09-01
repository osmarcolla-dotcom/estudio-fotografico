import fs from 'fs';

const envFile = fs.readFileSync('.env', 'utf-8');
const envVars = {};
envFile.split('\n').forEach((line) => {
  const [key, ...vals] = line.split('=');
  if (key && vals.length > 0) {
    envVars[key.trim()] = vals.join('=').trim();
  }
});

async function testDownloadRoute() {
  const token = '50f19adb1b860f4b75ff6502e6d446508abfd947b48e2b62';
  const res = await fetch(`https://estudio-fotografico-app.vercel.app/api/download/${token}`);
  console.log('STATUS:', res.status);
  console.log('CONTENT-TYPE:', res.headers.get('content-type'));
  const buf = await res.arrayBuffer();
  console.log('ZIP SIZE BYTES:', buf.byteLength);
}

testDownloadRoute();
