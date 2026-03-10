# spotify-top-song

Displays Aiden's most played Spotify song today at https://spotify.aidencullo.com

## Stack

- Static site: `index.html` fetches `data.json` and renders the top song
- GitHub Actions workflow (`.github/workflows/update.yml`) runs hourly, calls Spotify API, writes `data.json`, commits and pushes
- Hosted on GitHub Pages with custom domain

## Secrets (GitHub repo secrets)

- `CLIENT_ID` — Spotify app client ID
- `CLIENT_SECRET` — Spotify app client secret
- `REFRESH_TOKEN` — Spotify OAuth refresh token (scope: `user-read-recently-played`)

## Setup

Run once to get a refresh token:
```
node get-refresh-token.js <CLIENT_ID> <CLIENT_SECRET>
```
Redirect URI must be registered in the Spotify Dashboard as `http://127.0.0.1:8888/callback`

Then set secrets:
```
gh secret set CLIENT_ID --body "..."
gh secret set CLIENT_SECRET --body "..."
gh secret set REFRESH_TOKEN --body "..."
```

## How it works

1. Workflow fetches last 50 recently played tracks
2. Filters to plays since midnight today
3. Counts plays per track, picks the top one
4. Writes `data.json` and commits it
5. `index.html` reads `data.json` and renders the result

## Domain

Custom domain `spotify.aidencullo.com` → CNAME to `aidencullo.github.io`
DNS managed via Namecheap. HTTPS enforced via GitHub Pages (Let's Encrypt cert).
