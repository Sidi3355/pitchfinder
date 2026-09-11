# Backlog

Ranked by user impact per unit of effort, with the mandated order for items 1 to 9 kept.
Status: todo | doing | done | blocked. Found items are folded under the item they belong to.

| # | Item | Status | Notes |
| --- | --- | --- | --- |
| 1 | URL state and routing; pitch pages at `/p/{id}` with OG meta | todo | Found: Vite `base: './'` must become `/`; no router exists; prerender pitch pages for OG |
| 2 | Supabase auth, saved pitches, groups, games, RSVPs; delete fake auth | todo | Found: RSVPs currently typed by the creator; `.env.local` absent in sandbox, test RLS on local Postgres |
| 3 | Mobile-first layout: one surface, bottom sheet on phones, split view on desktop | todo | Found: side panel stacks under a 42vh map on phones; three tabs hide the list |
| 4 | Collapse duplicate park pitches into venues; derive names for unnamed | todo | Found: 2,949 unnamed; "Pitch 1..9" duplicates; curated merge can hijack unrelated OSM features; needs Overpass for parks and roads, so run in Actions |
| 5 | Postcode and free-text geocoding via postcodes.io and Nominatim, gazetteer fallback, recent locations | todo | Found: gazetteer has 108 entries and exact-match only |
| 6 | Reasons only, no numeric fit score; audit every reason for truth | todo | Found: "everyone within N min" states an estimate as fact; "fit NN" shown on every card |
| 7 | Code-split MapLibre; lazy dataset; bundle budget in CI | todo | Baseline 324 KB gz initial JS incl. MapLibre; dataset 582 KB raw / 57 KB gz |
| 8 | Fix `SCHOOL_RE` and the price scraper; find why `data/prices.json` stays empty | todo | Found: any £15 to £200 figure on the page is taken as a price |
| 9 | Design system pass: type and spacing scale, one accent, dark mode, focus, 44 px targets, designed states; rename package; remove `window.__pfMap` | todo | Found: Google Fonts render-blocking; em dashes; 30 px icon buttons; hero copy on About |
| 10 | Real travel times: TfL if `VITE_TFL_APP_KEY`, else OSRM walk/cycle, estimate as labelled fallback | todo | Only if budget remains |
| 11 | Filters with live counts; hide inapplicable filters | todo | Only if budget remains |
| 12 | `sport` field in the data model | todo | Only if budget remains; cheap, may ride with item 4 |
| 13 | Cookie-free analytics (Vercel Analytics free tier) | todo | Escalation: new service, needs approval |

## Accuracy track (runs alongside, owned by the data engineer)

| # | Item | Status | Notes |
| --- | --- | --- | --- |
| A1 | `scripts/audit-data.mjs` in CI; `agent/DATA_QUALITY.md` each iteration | todo | Missing name/surface/lit, stale prices, dead booking URLs, coordinate mismatches |
| A2 | Provenance fields (`source`, `source_url`, `verified_at`) in dataset and Supabase; "Data:" line on pitch page | todo | |
| A3 | Curated venue verification against operator sites with cached responses in `data/cache/` | todo | Needs network: run via Actions |
| A4 | Coordinate cross-check via postcodes.io, flag > 150 m | todo | Needs venue postcodes first |
| A5 | "Report a problem with this pitch" to Supabase `reports` | todo | Part of item 2 schema |

## Found, small, folded into iterations

- Dead code in `geo.js` (projection, Thames) -> remove in item 7.
- `ResultsList` paging reset and `MapView` ref-in-render fixed during setup lint pass.
- No 404 route -> item 1.
- Console noise from map style failures -> item 7 (Q4).
- README rewrite -> final iteration.
