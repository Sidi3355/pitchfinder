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

- 11 Sep: `data/prices.json` has never been populated. Hypotheses to check in CI logs: venue
  pages block the bot (403), pages are JS-rendered so no £ figures in HTML, or robots.txt
  disallows. Also the scraper takes any £15 to £200 figure, so even a "success" would be wrong.

## QA

- 11 Sep: Playwright uses the sandbox Chromium via `executablePath`; CI installs its own.
  Lighthouse uses the same binary through `CHROME_PATH` fallback.
