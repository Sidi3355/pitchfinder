# ⚽ TopBins — London pitch finder

Find the perfect football pitch for your whole friend group, across London.
Every Powerleague, Goals, park pitch, cage and leisure-centre astro in the
directory gets a **Squad Score** — ranked by travel time for *everyone*,
price per head, and how you like to play.

## Features

- **Full pitch directory, split by type** — Powerleague, Goals, park pitches,
  free cages/MUGAs, leisure centres and community hubs, each with surface,
  formats (5s/7s/11s), price, floodlights and bounded (caged) vs unbounded (open).
- **Squad builder** — add each friend's home area (100+ London neighbourhoods)
  and how they travel (walk / cycle / tube / drive). ETAs are estimated per
  person, per pitch.
- **The vibe filters** — pitch types, caged vs open, game format, budget per
  head, max travel time, floodlights, free-only.
- **Best-pitch ranking** — the Squad Score balances average ETA, worst ETA
  (nobody stranded), fairness of journeys, price and pitch quality, and
  explains each pick ("everyone inside 20 min · free to play · floodlit").
- **A WebGL London** — three.js stadium-night hero (striped pitch shader,
  floodlights, floating ball, haze particles), an ambient shader backdrop,
  and a stylised tile-free SVG map of London (real coordinates, the Thames,
  drag to pan / zoom).
- **Accounts** — register/log in, save pitches, save your squad, and plan
  **kickabouts**: pick a pitch, date and kick-off time, then track RSVPs
  (in / maybe / out) per player.

**Live site:** https://sidi3355.github.io/pitchfinder/

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Deployment

Every push to `main` builds the site and publishes it to GitHub Pages via
`.github/workflows/deploy.yml`. No secrets or configuration needed — the
app is fully static.

## Swap points for going production

Everything demo-grade is isolated behind one module each:

| Concern | Module | Swap for |
| --- | --- | --- |
| Pitch data | `src/data/pitches.js` | Live venue DB / APIs. Names + coordinates are real venues; prices & amenities are indicative samples. |
| Geocoding | `src/data/areas.js` | A real geocoder, e.g. postcodes.io (free, keyless). |
| ETAs | `src/lib/geo.js` (`estimateEta`) | TfL Journey Planner API (free key) — same signature, real door-to-door times. |
| Accounts | `src/lib/auth.js` | Real auth backend (Supabase / Firebase / your API). Currently localStorage + salted SHA-256, browser-only, demo-grade. |

The rest of the app only consumes those modules' exports, so each swap is
contained.

## Stack

Vite · React 18 · three.js · no CSS framework (hand-rolled stadium-night
design system in `src/styles/global.css`).
