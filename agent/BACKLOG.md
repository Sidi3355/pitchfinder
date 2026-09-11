# Backlog

Ranked by user impact per unit of effort, with the mandated order for items 1 to 9 kept.
Status: todo | doing | done | blocked. Found items are folded under the item they belong to.

| #   | Item                                                                                                                                              | Status | Notes                                                                                                                                                 |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | URL state and routing; pitch pages at `/p/{id}` with OG meta                                                                                      | todo   | Found: Vite `base: './'` must become `/`; no router exists; prerender pitch pages for OG                                                              |
| 2   | Supabase auth, saved pitches, groups, games, RSVPs; delete fake auth                                                                              | todo   | Found: RSVPs currently typed by the creator; `.env.local` absent in sandbox, test RLS on local Postgres                                               |
| 3   | Mobile-first layout: one surface, bottom sheet on phones, split view on desktop                                                                   | todo   | Found: side panel stacks under a 42vh map on phones; three tabs hide the list                                                                         |
| 4   | Collapse duplicate park pitches into venues; derive names for unnamed                                                                             | todo   | Found: 2,949 unnamed; "Pitch 1..9" duplicates; curated merge can hijack unrelated OSM features; needs Overpass for parks and roads, so run in Actions |
| 5   | Postcode and free-text geocoding via postcodes.io and Nominatim, gazetteer fallback, recent locations                                             | todo   | Found: gazetteer has 108 entries and exact-match only                                                                                                 |
| 6   | Reasons only, no numeric fit score; audit every reason for truth                                                                                  | todo   | Found: "everyone within N min" states an estimate as fact; "fit NN" shown on every card                                                               |
| 7   | Code-split MapLibre; lazy dataset; bundle budget in CI                                                                                            | todo   | Baseline 324 KB gz initial JS incl. MapLibre; dataset 582 KB raw / 57 KB gz                                                                           |
| 8   | Fix `SCHOOL_RE` and the price scraper; find why `data/prices.json` stays empty                                                                    | todo   | Found: any £15 to £200 figure on the page is taken as a price                                                                                         |
| 9   | Design system pass: type and spacing scale, one accent, dark mode, focus, 44 px targets, designed states; rename package; remove `window.__pfMap` | todo   | Found: Google Fonts render-blocking; em dashes; 30 px icon buttons; hero copy on About                                                                |
| 10  | Real travel times: TfL if `VITE_TFL_APP_KEY`, else OSRM walk/cycle, estimate as labelled fallback                                                 | todo   | Only if budget remains                                                                                                                                |
| 11  | Filters with live counts; hide inapplicable filters                                                                                               | todo   | Only if budget remains                                                                                                                                |
| 12  | `sport` field in the data model                                                                                                                   | todo   | Only if budget remains; cheap, may ride with item 4                                                                                                   |
| 13  | Cookie-free analytics (Vercel Analytics free tier)                                                                                                | todo   | Escalation: new service, needs approval                                                                                                               |

## Accuracy track (runs alongside, owned by the data engineer)

| #   | Item                                                                                                          | Status | Notes                                                                            |
| --- | ------------------------------------------------------------------------------------------------------------- | ------ | -------------------------------------------------------------------------------- |
| A1  | `scripts/audit-data.mjs` in CI; `agent/DATA_QUALITY.md` each iteration                                        | todo   | Missing name/surface/lit, stale prices, dead booking URLs, coordinate mismatches |
| A2  | Provenance fields (`source`, `source_url`, `verified_at`) in dataset and Supabase; "Data:" line on pitch page | todo   |                                                                                  |
| A3  | Curated venue verification against operator sites with cached responses in `data/cache/`                      | todo   | Needs network: run via Actions                                                   |
| A4  | Coordinate cross-check via postcodes.io, flag > 150 m                                                         | todo   | Needs venue postcodes first                                                      |
| A5  | "Report a problem with this pitch" to Supabase `reports`                                                      | todo   | Part of item 2 schema                                                            |

## Found, small, folded into iterations

- Dead code in `geo.js` (projection, Thames) -> remove in item 7.
- `ResultsList` paging reset and `MapView` ref-in-render fixed during setup lint pass.
- No 404 route -> item 1.
- Console noise from map style failures -> item 7 (Q4).
- README rewrite -> final iteration.

## From the iteration 1 critique (11 Sep)

| #   | Item                                                                                              | Status | Notes                                     |
| --- | ------------------------------------------------------------------------------------------------- | ------ | ----------------------------------------- |
| C1  | Mobile header overflows 390 px, clipping drawer and dialog                                        | todo   | P0, fix before iteration 3                |
| C2  | Budget default read as £0                                                                         | done   | Unit test added                           |
| C3  | Directions links (Google Maps, Apple Maps, Citymapper) on pitch page; address for unnamed pitches | todo   | Links now; address via pipeline in item 4 |
| C4  | Share keeps the group                                                                             | todo   | P1                                        |
| C5  | Whole card opens the pitch                                                                        | todo   | P1                                        |
| C6  | Empty state gets a Reset; error state gets Try again and no raw exception                         | todo   | P1                                        |
| C7  | Group rows show where each player is from                                                         | todo   | P1, the label was never stored            |
| C8  | Em dashes in About and group copy; extend copy check to `src`                                     | todo   | P1                                        |
| C9  | "Top-rated pitches" is untrue; rank badges misalign titles; "Show more (N remaining)"             | todo   | P1/P2                                     |
| C10 | "Book at venue" on council pages should say what it is                                            | todo   | P1, label by link kind                    |
| C11 | Heart contrast 1.47:1; loading notice displaces tabs; modal focus trap                            | todo   | P1/P2                                     |
| C12 | Reasons repeat facts; unknown facts outrank known                                                 | todo   | Item 6                                    |
| C13 | Duplicate unnamed cages in top ten                                                                | todo   | Item 4                                    |
| C14 | Filters count; live counts                                                                        | todo   | Item 11                                   |

## From the iteration 2 critique (11 Sep)

| #   | Item                                                                               | Status | Notes                                   |
| --- | ---------------------------------------------------------------------------------- | ------ | --------------------------------------- |
| D1  | Game link unfurls with pitch, day, time (server-rendered OG for /g/{slug})         | todo   | P1, Vercel function + fake in serve.mjs |
| D2  | Game page shows postcode, address, directions and per-player journey estimates     | todo   | P1, group snapshot on games             |
| D3  | Sign in remembers the action (save, group, game draft) and finishes it             | todo   | P1                                      |
| D4  | Plan a game defaults to next Thursday 19:00, refuses the past                      | todo   | P1                                      |
| D5  | Ask for a name at sign-in                                                          | todo   | P1                                      |
| D6  | List-card heart reflects saves                                                     | todo   | P1, bug                                 |
| D7  | Time change notice for existing answers                                            | todo   | P1                                      |
| D8  | Organiser page refreshes itself; cancelled and past games lose their RSVP controls | todo   | P2                                      |
| D9  | Desktop drawer is modal                                                            | todo   | P1 (mobile now uses the sheet)          |
| D10 | Report form: no preselected category, curated copy                                 | todo   | P2                                      |
| D11 | Plan form visible labels, inline validation                                        | todo   | P2                                      |
| D12 | About page de-heroed, comma splices fixed                                          | todo   | P2                                      |
