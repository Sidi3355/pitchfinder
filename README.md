# PitchFinder

**Every football pitch in London, on one map.** Live at
https://pitchfinder-pied.vercel.app/

PitchFinder maps 3,000+ places to play across Greater London: commercial
five-a-side centres, bookable astro, park grass and free cages : and ranks
them for a whole group of friends by travel time, price and facilities.

## How it works

| Layer                                           | What it does                                                                                                                                                                                                                                                                                                                                     |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Data pipeline** (`scripts/build-data.mjs`)    | Queries the Overpass API for every `leisure=pitch` (football/multi-use) in Greater London, classifies each one (commercial / astro / park / cage), excludes private and school grounds, collapses per-operator pitch clusters into venues, merges the curated bookable-venue list and any scraped prices, and writes `public/data/pitches.json`. |
| **Price refresh** (`scripts/scrape-prices.mjs`) | Best-effort re-check of curated venues' published prices from their public pages, honouring robots.txt. Never a hard dependency : when a venue prices dynamically the app says "price on booking" instead of guessing.                                                                                                                           |
| **CI** (`.github/workflows/data-refresh.yml`)   | Runs both scripts weekly (and on demand) and commits the dataset; Vercel redeploys automatically on push.                                                                                                                                                                                                                                        |
| **Frontend** (Vite + React)                     | MapLibre GL (WebGL) over OpenFreeMap vector tiles with clustered, type-colored markers; group builder with per-player travel-time estimates; fit ranking with plain-language reasons; filters; browser-local profiles with saved pitches and planned games (RSVPs).                                                                              |

Pitch data © [OpenStreetMap](https://www.openstreetmap.org/copyright)
contributors (ODbL) : attribution is rendered in the app. Fixing a pitch on
OpenStreetMap fixes it here after the next refresh.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

Rebuild the dataset locally (needs open internet):

```bash
node scripts/scrape-prices.mjs   # optional, best-effort
node scripts/build-data.mjs      # writes public/data/pitches.json
```

## Deployment

Vercel builds and deploys `main` on every push : no configuration or secrets
required; the site is fully static. The weekly data-refresh workflow's commit
triggers a redeploy, so pitch data stays current without touching the app.

## Honest limitations / roadmap

- **Travel times** are straight-line estimates with mode-typical speeds.
  Swap `estimateEta` in `src/lib/geo.js` for the TfL Journey Planner API
  (free key) for door-to-door times.
- **Live slot availability** isn't public API territory for Powerleague/Goals;
  the app deep-links to each venue's booking page instead.
- **Profiles** are browser-local (`src/lib/auth.js` is the single swap point
  for a real auth backend such as Supabase).
