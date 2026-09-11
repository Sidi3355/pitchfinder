# Codebase, as it actually is (read on 11 Sep 2026, commit fed0746)

## Shape

Vite 5 + React 18 single-page app, no router, no TypeScript, no tests, no lint. Deployed as a
static site on Vercel from `main`. One React context (`src/lib/store.jsx`) holds all state and
exposes actions. Data is a single static JSON file fetched at boot.

```
index.html                    Google Fonts (Inter) link, inline SVG favicon, #root
src/main.jsx                  StrictMode > StoreProvider > App
src/App.jsx                   view switch: find | about | profile, plus AuthModal and PitchDetail overlays
src/lib/store.jsx             useReducer store: view, data, user, squad, filters, selectedPitchId, authModal
src/lib/data.js               loadPitchData() fetch + cache, costOf(pitch), isBounded(pitch)
src/lib/geo.js                haversineKm, estimateEta (straight line x 1.35 circuity, mode speeds), centroid,
                              plus an unused equirectangular projection and Thames polyline from the pre-MapLibre map
src/lib/score.js              DEFAULT_FILTERS, rankPitches(pitches, squad, filters) -> rows with score + reasons
src/lib/auth.js               localStorage accounts (topbins:users, topbins:session), salted SHA-256 passwords
src/data/areas.js             108 London area centroids (the only geocoder)
src/data/types.js             PITCH_TYPES (commercial, astro, park, cage) colours and blurbs; pitchName()
src/components/Header.jsx     brand, pitch count, nav (Map / About / Profile), sign in / sign up
src/components/Finder.jsx     400 px side panel with tabs (Results / Your group / Filters) + map pane
src/components/MapView.jsx    MapLibre GL 6 over OpenFreeMap "positron" style, clustered GeoJSON source,
                              squad markers, centroid marker, hover popup, fallback blank style after 8 s
src/components/SquadBuilder.jsx  add player: name, area (gazetteer autocomplete), travel mode
src/components/Filters.jsx    type checkboxes, enclosure, format, budget slider, max ETA slider, requirements
src/components/ResultsList.jsx  paged list of PitchCard (10 at a time)
src/components/PitchCard.jsx  name, type, area, surface, price, max ETA, "fit NN" score, reasons, save heart
src/components/PitchDetail.jsx  right-hand drawer: facts grid, per-player ETAs, plan a game form, book link
src/components/Profile.jsx    upcoming games with RSVP toggles (creator's browser only), saved pitches
src/components/About.jsx      hero copy, type cards, data provenance paragraph
src/components/AuthModal.jsx  username / password modal
src/styles/global.css         536 lines, one green accent, light only, breakpoint at 860 px
scripts/build-data.mjs        Overpass -> classify -> collapse commercial -> merge curated -> pitches.json
scripts/scrape-prices.mjs     robots-aware fetch of booking pages, regex for any £15 to £200 figure
scripts/curated-venues.json   26 venues with baseline prices and booking URLs
data/prices.json              {} (has never been populated by CI)
public/data/pitches.json      582 KB, 3,148 pitches
.github/workflows/data-refresh.yml  Monday 04:17 UTC: scrape (continue-on-error) then build then commit
```

## State and navigation

- No URL state at all. `view`, filters, squad and selected pitch live only in memory. Reloading
  loses everything. There is nothing to share.
- `base: './'` in Vite config; asset URLs are relative, which breaks nested routes.
- Auth is `topbins:*` localStorage. Games and RSVPs are stored inside the creator's user record;
  RSVPs are typed by the creator on behalf of each name. Nobody else can see a game.

## Ranking

`rankPitches` filters, computes straight-line ETAs per player, then a weighted score:
0.3 avg ETA, 0.25 worst ETA, 0.15 fairness, 0.18 price, 0.12 "quality" (lit, bookable, 3G,
changing rooms, curated). Without a squad: 0.55 price + 0.45 quality. The score is shown to the
user as "fit NN". Reasons are derived from the same inputs and are mostly true, except
"everyone within N min" which is an estimate presented as fact.

## Dataset schema (`public/data/pitches.json`)

```
{ generatedAt, source, attribution, count, byType: {cage, astro, commercial, park}, pitches: [Pitch] }
Pitch {
  id            "osm-{n|w|r}{osmId}" or curated id like "pl-shoreditch"
  name          string | null
  type          "commercial" | "astro" | "park" | "cage"
  operator      string | null
  lat, lng      5 dp
  area          nearest gazetteer area name (always set)
  surface       "3g" | "astro" | "grass" | "hard" | "other" | null
  lit           true | false | null
  access        OSM access tag or null
  fee           true | false | null
  bounded       true | null  (OSM barrier tag present)
  // curated venues only:
  formats       [5, 7, 11]
  pricePerHour  number (0 = free)
  priceMax      number | null
  priceCheckedAt ISO | null
  priceSource   "scraped" | "published"
  bookingUrl    string
  changingRooms boolean
  curated       true
  matchedOsmId  OSM id the venue was attached to (11 of 26)
  pitchCount    number (only 2 records have > 1)
}
```

## Dataset statistics at the start of the run (generated 7 Sep 2026)

| Metric | Count | Share |
| --- | --- | --- |
| Pitches | 3,148 | |
| park | 2,441 | 78% |
| cage | 367 | 12% |
| astro | 323 | 10% |
| commercial | 17 | 0.5% |
| Named | 199 | 6% |
| With operator | 46 | 1.5% |
| Surface known | 1,678 | 53% |
| Lit known | 1,046 | 33% (302 lit) |
| Fee known | 5 | 0.2% |
| Price known | 26 | 0.8% (all curated baseline, none scraped) |
| Booking URL | 26 | 0.8% |
| Curated | 26 | |
| pitchCount > 1 | 1 | |
| Distinct names | 171 | 13 names duplicated ("Pitch 1" x4 etc.) |

Surfaces: grass 1,116, astro 339, hard 200, 3g 17, other 6, unknown 1,470.

## Things the read revealed (all go to the backlog)

- `collapseCommercial` only collapses commercial; park sites with "Pitch 1..9" remain separate.
- `mergeCurated` attaches a venue to the nearest OSM feature within 300 m regardless of type or
  name, so a curated venue can overwrite an unrelated park pitch (11 attachments, unverified).
- Curated coordinates are 4 dp hand entries with no source; prices have no source URL or date.
- `SCHOOL_RE` excludes anything containing "academy" (e.g. real "Academy" venues) and
  "university" sports grounds that are bookable.
- Price scraper takes any £ figure between 15 and 200 anywhere in the page as a pitch price.
- `data/prices.json` has never been populated (CI logs to be checked).
- Map style errors and the 8 s fallback timer log to the console; `window.__pfMap` is exposed.
- Google Fonts is a render-blocking third-party request.
- Em dashes throughout UI copy; `pitchName` joins type and area with an em dash.
- No 404, no loading skeleton, no designed empty state, no dark mode, no focus styles beyond
  the browser default on buttons, 30 px icon buttons.
- `geo.js` carries dead code (projection, Thames polyline) from the pre-MapLibre map.

## Environment notes for this run

- The agent sandbox has no outbound network except npm and the GitHub API. Overpass,
  postcodes.io, Nominatim, venue sites, Supabase and the Vercel deployment are unreachable
  from here. Network-dependent pipeline steps run in GitHub Actions instead (workflow_dispatch
  on the working branch), and their output is pulled back.
- `.env.local` is not present in the sandbox, so Supabase cannot be exercised live. RLS
  policies are tested against a local Postgres 16 with the migrations applied.
- Playwright 1.63 wants Chromium 1243; the sandbox ships 1194, so the config points at the
  installed binary when present. CI installs its own.
