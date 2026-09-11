# Definition of done

All gates hold on `agent/production`, measured by scripts in the repo. Each gate names the
script that measures it. "Refined" notes come from the codebase read.

## Core flow

- [ ] **CF1** A new user on a phone goes from landing to a ranked list for a 2-person group,
  starting from postcodes, in under 60 s and under 8 taps. `tests/e2e/core-flow.spec.js`
  (mobile project) counts taps and elapsed time.
- [ ] **CF2** Every meaningful state is in the URL: view, filters, group (encoded), selected
  pitch. Reload and share reproduce the state. `tests/e2e/share-url.spec.js` plus unit tests for
  encode/decode in `src/lib/url-state.test.js`.
- [ ] **CF3** A pitch has a permanent URL `/p/{id}` that renders name, type, price, facilities,
  map and booking link, with Open Graph meta so links unfurl in WhatsApp and iMessage.
  `tests/e2e/pitch-page.spec.js` checks content; OG tags are checked on the served HTML.
  Refined: the site is static on Vercel, so OG meta must be served without JavaScript, which
  means prerendered HTML per pitch or a rewrite to a function. Prerendering 3,000+ pages at
  build is acceptable if build time stays under two minutes.

## Data

- [ ] **D1** Adjacent non-commercial pitches with the same name, or within a short distance and
  same operator, collapse into one venue with a pitch count. No result list shows the same field
  twice. Unit tests with fixtures in `scripts/pipeline.test.mjs`; `scripts/audit-data.mjs`
  reports residual duplicates.
- [ ] **D2** Unnamed pitches get a derived name from the nearest named park, playing field or
  road, computed in the pipeline. `audit-data.mjs` reports pitches with no name.
- [ ] **D3** Home locations accept any UK postcode or free-text place via postcodes.io and
  Nominatim with the gazetteer as fallback. Unit tests mock fetch for the fallback chain.
- [ ] **D4** Travel times are labelled as estimates wherever shown (until real routing lands,
  and after it, labelled with mode and source). E2E asserts the label on cards and the pitch
  page.
- [ ] **D5** The ranking never shows a numeric fit score. Reasons only, and each reason is true
  by construction. Unit tests in `src/lib/score.test.js` assert each reason's precondition.
- [ ] **D6** The price scraper writes structured, validated prices or nothing. Never a figure it
  cannot attribute to a per-hour or per-session context. Unit tests with HTML fixtures.

## Quality

- [ ] **Q1** Lighthouse mobile on `/` and `/p/{id}`: Performance >= 85, Accessibility >= 95,
  Best Practices >= 95, SEO >= 90. `scripts/lighthouse.mjs`.
- [ ] **Q2** Initial JS < 350 KB gzipped; MapLibre code-split and loaded only when the map is on
  screen; dataset loaded in a compact form. `scripts/check-bundle.mjs`. Refined: baseline is
  324 KB with MapLibre inline and a 57 KB gzipped dataset, so the budget must be met after
  adding Supabase (about 40 KB) and a router.
- [ ] **Q3** First contentful paint under 3 s on simulated slow 4G. `scripts/lighthouse.mjs`
  (FCP gate).
- [ ] **Q4** No console errors or warnings in the production build during the core flow. E2E
  collects console messages and fails on any error or warning. Refined: MapLibre style fetch
  failures must be handled without logging.
- [ ] **Q5** Unit tests cover ranking, cost model, pipeline classification and collapse (with
  fixtures), URL state encode/decode, geocoding fallback. `npm test`.
- [ ] **Q6** E2E covers the core flow on mobile and desktop, share URL round trip, pitch page,
  filters, empty state, data load failure state. `npm run test:e2e`.
- [ ] **Q7** Keyboard-only navigation works everywhere; visible focus; 44 px touch targets on
  mobile. E2E tabs through the core flow; a unit-level CSS check asserts minimum target sizes on
  the mobile project via bounding boxes.
- [ ] **Q8** Dark mode via `prefers-color-scheme`, applied to the map style too. E2E emulates
  the colour scheme and checks the body background and the map style name.

## Accuracy

- [ ] **A1** Every curated venue has a verified coordinate, a price with source URL and date,
  and a booking URL returning 200, checked by `scripts/audit-data.mjs` in CI. Coordinates are
  cross-checked against the venue postcode via postcodes.io; anything over 150 m off is flagged.
- [ ] **A2** Every user-facing number states or links its source; "estimate" and "approx."
  labels wherever applicable. Reviewed by the critics each round and asserted in E2E for ETAs,
  prices and distances.
- [ ] **A3** The problem-report path works end to end: pitch page action writes to the
  Supabase `reports` table. E2E against the local fake backend; RLS test for insert-only.

## Accounts and shared games

- [ ] **S1** Supabase Auth with magic link and Google. Sign-in optional for browsing and
  ranking; required to save pitches, save a group, or create a game.
- [ ] **S2** Tables `profiles`, `saved_pitches`, `groups`, `games`, `rsvps`, `reports` with RLS
  in `supabase/migrations/`, documented in `agent/SUPABASE.md`.
- [ ] **S3** `/g/{share_slug}` public game page; anyone with the link can view and RSVP; guests
  RSVP with a name remembered locally; creator can edit or cancel. E2E: user A creates a game,
  an unauthenticated browser RSVPs as a guest, user A sees it.
- [ ] **S4** RLS tests prove a user cannot read or modify another user's saved pitches or
  groups, and cannot edit a game they did not create. `tests/rls/*.test.mjs` against Postgres
  with the migrations applied.
- [ ] **S5** No `topbins:*` localStorage keys; `src/lib/auth.js` deleted.
- [ ] **S6** With Supabase unreachable, ranking, map, filters and pitch pages work; save and
  game features show an inline "sign in unavailable" notice. E2E blocks the Supabase origin.

## Product

- [ ] **P1** Two consecutive critic rounds with zero P0 and zero P1 findings
  (`agent/CRITIQUE.md`).
- [ ] **P2** At least four non-core features shipped to the critics' standard, each with tests
  and designed states.
- [ ] **P3** Empty, loading, error and no-results states exist and are designed.
- [ ] **P4** README rewritten to match reality; `agent/` holds the full run history.

## Copy and constraints (checked every iteration)

- British English. No em dashes in UI copy or docs (`scripts/check-copy.mjs` greps for them).
- OpenStreetMap attribution visible on the map and on pitch pages.
- No fabricated attributes, prices or times. "Not known" is acceptable.
- No paid or keyed service beyond Supabase, postcodes.io, Nominatim, OSRM, TfL without approval.
