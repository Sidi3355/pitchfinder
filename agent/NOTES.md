# Role notes

Each role keeps its own section. Newest entries at the bottom of each section.

## Lead

- 11 Sep: Setup. Decided to keep gates enforced by `npm run check` from day one even though
  CI will be red until the quality items land. Red CI with a truthful gate beats a green CI
  with a soft one.
- 11 Sep: Decided that network-dependent pipeline steps (Overpass, geocoders, venue sites,
  booking URL audits) run via `workflow_dispatch` on GitHub Actions against the working branch,
  because the sandbox cannot reach them. Their commits are pulled back before the next
  iteration.

## Product critic

(Reviews go to CRITIQUE.md; ideas go to FEATURE_IDEAS.md.)

## Design critic

(Reviews go to CRITIQUE.md.)

## Frontend engineer

- 11 Sep: Lint pass touched `MapView` (no ref writes during render) and `ResultsList` (paging
  reset without setState in an effect). No behaviour change.

## Data engineer

- 11 Sep: `data/prices.json` has never been populated. CI log of the 7 Sep run
  (actions run 34105337293) shows why: Powerleague (7 venues), Everyone Active (2) return
  HTTP 403 to the bot; all 8 Goals URLs, Battersea Millennium Arena and Regent's Park Hub
  return 404 (dead links in the curated file); Better and Black Prince pages load but carry
  no price; Crystal Palace and Coram's Fields fail to fetch. So the curated list has 10 dead
  booking URLs today, and the scraper would have taken any £15 to £200 figure had a page
  loaded. Both go to item 8 and the accuracy track (A1).

## QA

- 11 Sep: Playwright uses the sandbox Chromium via `executablePath`; CI installs its own.
  Lighthouse uses the same binary through `CHROME_PATH` fallback.
