// Run once to get your refresh token:
//   node get-refresh-token.js <CLIENT_ID> <CLIENT_SECRET>
// Then add CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN as GitHub repo secrets.

const http = require('http');
const crypto = require('crypto');
const { execSync } = require('child_process');

const [, , CLIENT_ID, CLIENT_SECRET] = process.argv;
if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('Usage: node get-refresh-token.js <CLIENT_ID> <CLIENT_SECRET>');
  process.exit(1);
}

const REDIRECT_URI = 'http://localhost:8888/callback';
const SCOPE = 'user-read-recently-played';
const state = crypto.randomBytes(8).toString('hex');

const authUrl = `https://accounts.spotify.com/authorize?` +
  new URLSearchParams({ client_id: CLIENT_ID, response_type: 'code', redirect_uri: REDIRECT_URI, scope: SCOPE, state });

console.log('\nOpening Spotify login...\n');
execSync(`open "${authUrl}"`);

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost:8888');
  if (url.pathname !== '/callback') return;

  const code = url.searchParams.get('code');
  const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

  const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${credentials}`,
    },
    body: new URLSearchParams({ grant_type: 'authorization_code', code, redirect_uri: REDIRECT_URI }),
  });

  const data = await tokenRes.json();
  res.end('Done! Check your terminal.');
  server.close();

  console.log('\n=== Add these as GitHub repo secrets ===\n');
  console.log(`CLIENT_ID:      ${CLIENT_ID}`);
  console.log(`CLIENT_SECRET:  ${CLIENT_SECRET}`);
  console.log(`REFRESH_TOKEN:  ${data.refresh_token}`);
  console.log('\ngh secret set CLIENT_ID --body "' + CLIENT_ID + '"');
  console.log('gh secret set CLIENT_SECRET --body "' + CLIENT_SECRET + '"');
  console.log('gh secret set REFRESH_TOKEN --body "' + data.refresh_token + '"');
});

server.listen(8888);
