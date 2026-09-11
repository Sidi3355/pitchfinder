# Run state (Lead)

Branch: `agent/production`. Iteration cap: 24. Run started 11 Sep 2026.

## Iteration 0: setup (11 Sep 2026)

Intended outcome: the repo has lint, unit, e2e and Lighthouse gates runnable with one command,
CI runs them on push, and the run has its map (CODEBASE.md), its rules (DEFINITION_OF_DONE.md)
and its plan (BACKLOG.md).

Baseline measurements:

| Metric               | Value                                    |
| -------------------- | ---------------------------------------- |
| Initial JS (gzipped) | 324 KB, MapLibre inline                  |
| Dataset              | 582 KB raw, 57 KB gzipped, 3,148 pitches |
| Named pitches        | 199 (6%)                                 |
| Priced pitches       | 26 (0.8%), none scraped                  |
| Tests                | none                                     |
| Lint                 | 11 errors before setup, 0 after          |

What got better: tooling and gates exist; lint is clean.
What got worse or was discovered: sandbox has no network beyond npm and GitHub, so pipeline
runs must go through GitHub Actions; `.env.local` absent so Supabase is unverifiable here.
Next iteration targets: backlog item 1 (URL state, routing, pitch pages with OG meta).

## Iteration 1: URL state, routing, pitch pages (11 Sep 2026)

Intended user-visible outcome: someone builds a group and narrows the list, copies the address
bar, and a friend who opens it sees the same group, filters and ranked list. Every pitch has a
page at `/p/{id}` that shows its name, type, price, facilities, a map and the booking link,
and the link unfurls with a title, description and image in WhatsApp. Reloading never loses
state. Unknown addresses get a designed "not found" page.

Backlog items: 1. Approach: the URL is the single source of truth for group, filters and
selected pitch (no in-memory copy to drift). Pitch pages are prerendered at build time with
per-pitch meta so a static host serves the Open Graph tags without JavaScript.

Reflection (after critique):

- What got better: every screen is shareable and reload-safe; pitch pages exist with Open
  Graph meta and unfurl images; 20 e2e tests and 16 unit tests run in 16 s; Google Fonts
  removed (loads were hanging on it); a WebGL failure no longer blanks the app; Lighthouse
  accessibility 93 to 100, SEO 91 to 100.
- What got worse or was discovered: the URL codec shipped a P0 (missing budget read as £0,
  hiding every priced venue) that the critics caught and a unit test now covers; the mobile
  header overflows 390 px and clips the drawer (P0, not new, but now visible in screenshots);
  Share drops the group; unnamed pitch pages carry no address or directions; Lighthouse
  performance on the home route fell to 60 once the real map path was measured with software
  WebGL (MapLibre init under 4x CPU throttle), which item 7 must fix.
- Next: commit iteration 2 (accounts and games, already built and green), then fix the P0s
  and cheap P1s from this critique before iteration 3 restructures the mobile layout.

## Iteration 2: accounts and shared games on Supabase (planned 11 Sep 2026)

Intended user-visible outcome: the organiser signs in with a magic link or Google (only when
they want to save a pitch, save the group or create a game; browsing never asks). They pick a
pitch, set a time, and get a link `/g/{slug}`. Everyone in the chat opens it, sees the pitch,
the time, who is in, and says in, maybe or out with just a name. The organiser sees the answers
on the same page and can cancel. When Supabase is unreachable the map, list, filters and
pitch pages work as before and only the save and game actions show "sign in unavailable".

Backlog items: 2. Approach: schema and RLS first (done, tested on Postgres), then a client
module that loads supabase-js on demand, then the game page and profile, then an end-to-end
test that drives a fake Supabase (real Postgres and RLS behind a small PostgREST-compatible
server) so the share and RSVP loop is proven without network.

## Iteration 3: pipeline collapse and names, then the mobile layout (planned 11 Sep 2026)

Intended user-visible outcome (data half, items 4, 8 and 12 plus the accuracy track): the
ranked list never shows the same field twice; every pitch has a real name (its own, the park or
playing field it sits in, or the road it is off) and a nearest postcode, so a shared link says
which cage it is and directions work; every fact carries a source and a date; a weekly audit
report in `agent/DATA_QUALITY.md` counts what is still unknown. The word "academy" no longer
hides real venues. The price scraper writes structured prices with the exact context it saw,
or nothing.

Intended user-visible outcome (layout half, item 3): on a phone the first screen is a search
box, the map and a ranked list in one surface: the list is a bottom sheet over the map that
drags between a peek, half and full height; a pitch opens as a sheet too; the group and filter
controls live behind one obvious control each. On desktop it is a split view. No tabs.

Approach: pure pipeline functions in `scripts/lib/` with fixture tests, geocoding through
postcodes.io (bulk reverse) and Nominatim (reverse, 1 request per second, cached in
`data/cache/`), network steps run by the data-refresh workflow on GitHub Actions against this
branch. The layout is rebuilt with CSS only where possible; the bottom sheet is a small
component with pointer events, no library.
