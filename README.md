# spotify-top-song

Displays Aiden's most played Spotify song today.

## How it works

A GitHub Actions cron job runs hourly, fetches the last 50 recently played tracks via the Spotify API, counts plays since midnight, and writes the top track to `data.json`. A static `index.html` reads that file and renders the result. Hosted on GitHub Pages at [spotify.aidencullo.com](https://spotify.aidencullo.com).
