# QA log

Nothing merges without a sign-off entry here. Numbers per iteration.

## Iteration 0: setup (11 Sep 2026)

| Check                  | Result                                                                                                                  |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `npm run lint`         | pass (0 errors, 4 warnings in code slated for removal)                                                                  |
| `npm test`             | pass, 6 unit tests (geo helpers)                                                                                        |
| `npm run build`        | pass in 4.8 s                                                                                                           |
| `npm run check:bundle` | 324 KB gz initial JS, under the 350 KB budget; MapLibre still inline (fails the split assertion, expected until item 7) |
| `npm run test:e2e`     | pass, smoke test on mobile (iPhone 13 emulation) and desktop                                                            |
| `npm run lighthouse`   | FAIL: home Perf 78, A11y 93, BP 96, SEO 91, FCP 2.9 s; pitch route identical (no route yet, same SPA)                   |

Sign-off: setup commit approved. Gates that fail are recorded as the baseline, not hidden.

## Iteration 1: URL state, routing, pitch pages (11 Sep 2026)

| Check                  | Result                                                                                                                                                         |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run lint`         | pass                                                                                                                                                           |
| `npm test`             | pass, 16 unit tests (geo, URL state)                                                                                                                           |
| `npm run build`        | pass, prerenders 3,148 pitch pages                                                                                                                             |
| `npm run check:bundle` | 324 KB gz initial; MapLibre still inline (warning)                                                                                                             |
| `npm run test:e2e`     | pass, 20 tests on mobile and desktop (share round trip, pitch page and OG HTML, not found, no results, data failure, core flow tap budget: 6 taps, under 20 s) |
| `npm run lighthouse`   | FAIL on performance: home Perf 60 / A11y 100 / BP 96 / SEO 100, FCP 2.8 s, TBT 1.1 s; pitch route Perf 89 / 100 / 96 / 100                                     |

Sign-off: approved with the performance gate recorded as failing (map initialisation under
CPU throttle; item 7). Screenshots in `agent/screenshots/iter1/`.

## Iteration 2: accounts and shared games (11 Sep 2026)

| Check                  | Result                                                                                                                                                                                                                                                                             |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run lint`         | pass                                                                                                                                                                                                                                                                               |
| `npm test`             | pass, 17 unit + 20 RLS tests against Postgres 16                                                                                                                                                                                                                                   |
| `npm run build:test`   | pass                                                                                                                                                                                                                                                                               |
| `npm run check:bundle` | 325 KB gz initial (Supabase loads on demand, not in the initial bundle); MapLibre warning                                                                                                                                                                                          |
| `npm run test:e2e`     | pass, 32 tests: adds organiser creates game, guest RSVPs from the link and changes answer, organiser sees it and cancels; unknown game link; save requires sign-in then persists; save and reuse a group; report a problem writes a row; server unreachable shows an inline notice |
| `npm run lighthouse`   | FAIL on performance: home 61, pitch route 80 (both A11y 100, BP 96, SEO 100)                                                                                                                                                                                                       |

Sign-off: approved. The performance gate remains the known failure for item 7.

## Iteration 3: mobile layout, geocoding, code-split (11 Sep 2026)

| Check                                   | Result                                                                                                                                                                                    |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run lint`                          | pass                                                                                                                                                                                      |
| `npm test`                              | pass, 60 unit + 20 RLS tests (pipeline, geocoding, prices, URL state, geo)                                                                                                                |
| `npm run build:test`                    | pass                                                                                                                                                                                      |
| `npm run check:bundle`                  | 69 KB gz initial JS; MapLibre (259 KB) and Supabase (58 KB) lazy; split now enforced                                                                                                      |
| `npm run test:e2e`                      | pass, 32 tests; core flow from two postcodes in 6 taps                                                                                                                                    |
| `npm run lighthouse`                    | home Perf 62 / A11y 100 / BP 96 / SEO 100, FCP 2.1 s, TBT 1.2 s (software WebGL: MapLibre GL setup dominates, profile attached in NOTES); pitch route Perf 99 / A11y 98 / BP 96 / SEO 100 |
| `node scripts/audit-data.mjs --offline` | baseline on the old dataset: 2,949 unnamed, 104 unverified curated facts                                                                                                                  |
| Data refresh (Actions run 4)            | pipeline succeeded: 3,139 pitches to 1,746 venues, 0 unnamed, 0 without postcode, 515 collapsed; commit lost to a push race, workflow fixed to rebase, re-run queued                      |

Sign-off: approved. Open gates: home performance under software WebGL; A1 curated facts (152
unverified with online checks: 10 dead booking URLs, no postcodes or addresses recorded).
