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
