# PitchFinder

Pick a pitch for the group, on your phone, from where everyone is coming from. Live at
https://pitchfinder-pied.vercel.app/

PitchFinder is for the places you can book: Goals and Powerleague centres and the astro pitches
at leisure centres, sports hubs and clubs across Greater London, about 200 venues. Each shows
its prices and opening times where the operator publishes them, and says so where it does not.
One person makes a group link; everyone else adds where they are coming from and what they need
(budget, size, floodlights, days), and the venues are ranked for the whole group by journey
time, price and facilities. A game link lets everyone say in or out without an account.

## How it works

**Data pipeline** (`scripts/build-data.mjs`, weekly in
`.github/workflows/data-refresh.yml`). Overpass gives every `leisure=pitch` for football or
multi-use in Greater London. Each pitch is classified (football centre, astro, park pitch,
cage), private and school grounds are excluded, pitches on the same site are collapsed into one
venue, unnamed pitches are named after the park, playing field or road they sit on, postcodes.io
gives the nearest postcode and Nominatim the road, and the curated list of bookable venues
(`scripts/curated-venues.json`) is merged in. `scripts/fetch-venues.mjs` then reads the
operators' own club pages with a headless browser (identified in its user agent, robots.txt
honoured, one page every two seconds) and lays their facts on top: opening hours, every stated
price with what it is for, facilities, address, each with the words that back it and the date
it was read (`data/venues-live.json`, page text in `data/cache/pages/`). Only the bookable types
(football centres and astro pitches) are written out. Every record carries its provenance
(`source`, `sourceUrl`, `verifiedAt`). The build writes a compact `public/data/index.json`, one
JSON file per pitch, and a prerendered HTML page per pitch at `/p/{id}` with Open Graph meta so
a shared link unfurls.

**Prices** (`scripts/scrape-prices.mjs`). A polite re-check of curated venues' public pages:
identifies itself, honours robots.txt, one request every two seconds, page text cached in
`data/cache/pages/`. A price is written only when the page states it per hour or per session.
Otherwise the app says "price on booking" rather than guessing.

**Audit** (`scripts/audit-data.mjs`). Runs offline in CI and online in the weekly refresh:
missing facts, duplicate names, coordinates more than 150 m from their postcode, booking URLs
that do not answer 200, curated facts nobody has verified. The refresh publishes the result to
`agent/DATA_QUALITY.md`.

**Frontend** (Vite + React). `/` is the landing page, `/find` the finder, `/p/{id}` a pitch,
`/group/{slug}` a shared group, `/g/{slug}` a game, plus About, Privacy and My games. The group
and game pages are laid out like event pages: a cover with the name, host and link, then the
body. In the finder the URL is the only state: group (`g=` or `grp=`), filters (operator, size,
surface, needs, budget, journey, days and time of day), selected pitch.
Ranking runs on straight-line estimates so the list is instant and gives plain-language reasons
that are true by construction; there is no score on screen. Journey times on cards, pitch pages
and game pages are then routed by OSRM (walking, cycling, driving) and tagged "route"; public
transport uses the TfL Journey Planner when `VITE_TFL_APP_KEY` is set and is otherwise an
estimate tagged "est.". MapLibre and the dataset load on demand so the first screen stays under
the bundle budget. Light and dark themes follow the system.

**Groups, accounts and games** (Supabase). One person creates a group link (that needs a
sign-in, by magic link or Google); everyone else opens it and adds where they are coming from,
how they travel and what they need, with no account: budget, floodlights, cover, changing rooms,
parking, pitch size, surface, operator, longest journey, days and time of day. The group page
collates them (a need stated by anyone is a must; the tightest budget and shortest journey
apply; size, surface and operator apply when everyone who chose agrees; the days are the ones
everyone can do), shows who is in and the best pitches for everyone, and the finder ranks for
the shared group. Signed-in people also save
pitches and create games. A game has an unguessable link at `/g/{slug}`;
anyone with the link reads it through a security-definer function and answers as a guest with a
name their phone remembers. Row Level Security keeps everything else private; the policies are
SQL migrations in `supabase/migrations/` and are tested against a real Postgres. Browsing works
in full when Supabase is unreachable. `api/game.js` is a Vercel function that serves the game
page's Open Graph meta.

Pitch data © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors (ODbL); the
attribution is shown in the app. Fixing a pitch on OpenStreetMap fixes it here after the next
refresh. Nothing in the app is a guess presented as a fact: unknown facts say so.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # dist/ plus prerendered pitch pages
npm run check      # lint, unit and RLS tests, test build, bundle budget, Playwright, Lighthouse
```

Environment, in `.env.local` for development and in Vercel's project settings for production:

```
VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon key>          # the only key that ever reaches the browser
VITE_TFL_APP_KEY=<optional>                # public transport times from TfL; estimates without it
```

The Supabase to Vercel integration (Supabase dashboard, Integrations, Vercel) sets
`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` on the Vercel project; the app
accepts those names too. With neither pair set, a production build and the game function use
the live project's URL and anon key from `src/lib/live-project.js` (both public by design, and
the anon key can only do what the row-level policies allow), so the site works with no
variables at all; set them to point at another project or a rotated key.

Supabase setup: apply the migrations in order (`supabase db push`, the GitHub integration on
the production branch, or paste each file into the SQL editor), turn on the Email provider with
"Confirm email" off, and add the site URL plus `https://<site>/**` to the redirect URLs. Google
is optional. The live project has the migrations applied; details and the policy tests are in
`agent/SUPABASE.md`.

Tests: `npm test` runs the unit tests and, when `DATABASE_URL` points at a local Postgres, the
RLS tests. `npm run test:e2e` runs Playwright on an iPhone 13 profile and a desktop profile
against a test build that talks to a stand-in Supabase (`tests/e2e/fake-supabase.mjs`: the real
migrations on a real Postgres behind the subset of the Supabase HTTP API the app uses, plus an
OSRM stub). `npm run lighthouse` audits the home and a pitch route on a simulated slow 4G phone.

Rebuild the dataset (needs open internet; the sandbox this was built in did not have it, so the
data steps run as the `data-refresh` workflow on demand):

```bash
node scripts/scrape-prices.mjs        # optional, best-effort
node scripts/build-data.mjs           # writes public/data/, data/cache/
node scripts/audit-data.mjs --write   # writes agent/DATA_QUALITY.md
```

## Deployment

Vercel builds `main` on every push (`vercel.json`: clean URLs, `/g/:slug` to the game function,
everything else to the app). The Supabase variables are optional on Vercel: a build without
them uses the live project. The weekly refresh commits the dataset and Vercel redeploys.

## What it does not do

- Public transport times are estimates unless a TfL key is configured.
- Venues whose operator does not publish a price or opening times say so; the app links to the
  booking page rather than guess.
- Powerleague's site answers automated browsers with 403, so its facts come from the curated
  baseline and are marked unverified until the operator can be read.
- Live slot availability is not public API territory for the big operators.
- Park pitches and cages are built but not shown: the product is about places you can book.

## Project history

`agent/` holds the run that took this from prototype to product: `STATE.md` (plans and
reflections per iteration), `QA.md` (measurements), `CRITIQUE.md` and `critique/` (product and
design critic rounds), `BACKLOG.md`, `DEFINITION_OF_DONE.md`, `DATA_QUALITY.md`, `SUPABASE.md`
and `FINAL_REPORT.md`.
