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

Reflection (after critique):

- What got better: the organiser loop works end to end and is proven by e2e against real RLS;
  no P0 findings this round; 10 round-1 findings confirmed fixed by both critics; the design
  critic's verdict is "better".
- What got worse or was discovered: the game link unfurls as the home page and the game page
  has no address, directions or journey times, so the product critic's verdict stays No;
  sign-in forgets the action that prompted it; the list-card heart read a field that no longer
  exists; past dates accepted; display names default to the email local part; the screenshot
  script captured signed-in screens signed out.
- Next: iteration 3 (layout, already built while the critics ran) and iteration 4 below.

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

Reflection on the layout half (built 11 Sep, before critique): one surface on phones, six-tap
core flow from postcodes, no tabs. Awaiting critique in round 3.

## Iteration 4: the game page is the destination (planned 11 Sep 2026)

Intended user-visible outcome: the link the group receives unfurls with the pitch, day and
kick-off; the game page shows the address and nearest postcode, one-tap directions, and each
player's estimated journey (from the group that picked the pitch), so nobody opens Google
Maps. Sign in remembers what you were doing and finishes it. Plan a game starts on next
Thursday at 19:00 and refuses the past. You are asked your name once. The list-card heart
shows a save. Cards give reasons once, in plain words, with no fit number. The dataset has
no duplicate venue names within a park and the audit probes candidate URLs for the dead
booking links so they can be fixed from the report.

Backlog items: 6, the accuracy track, and the product critique's P1s. Approach: a `group`
snapshot on games (migration 0003) and a Vercel function that serves per-game Open Graph
HTML from `game_by_slug` (the static server emulates it for tests); a pending-action store
in sessionStorage for sign-in; a name field on sign-in; reasons rebuilt in score.js with
unit tests asserting every reason's precondition.

## Iteration 5: design system pass (planned 11 Sep 2026)

Intended user-visible outcome: the app looks like one calm product on every screen and in
both light and dark modes (the map included), every tappable thing on a phone is at least
44 px, keyboard focus is always visible, type sits on one scale (12, 13, 14, 16, 20, 24) and
spacing on one grid (4, 8, 12, 16, 24), secondary text is readable in daylight, and every
loading, empty, error and no-results state is designed. The package is named pitchfinder.

Backlog item: 9. Approach: rewrite global.css around tokens (light and dark), a coarse-pointer
media query for target sizes, focus-visible rings, and skeletons for the game and pitch pages.
An e2e spec checks dark mode on the body and map, focus visibility after Tab, and measures
every visible control on the mobile home, group panel, pitch sheet and game page.

## Iteration 6: real journey times, live filter counts, honest time changes (planned 11 Sep 2026)

Intended user-visible outcome: the minutes on a card, a pitch page and a game page are routed
for walking, cycling and driving (OSRM over OpenStreetMap roads) and say so with a "route" tag;
public transport, and anything the router cannot answer, stays an estimate and says "est.".
Every filter option says how many pitches it would leave and switches off when the answer is
none; the travel-time filter appears once there is a group. When an organiser moves the
kick-off, the game page says "Moved from" the old time, flags answers given before the move and
asks those people to confirm.

Backlog items: 10, 11 and D7 from the round 2 critique. Approach: a small routing client with a
localStorage cache, one OSRM table request per person and mode for the cards on screen, never
for the whole list, so the public demo server sees a handful of requests per search; the ranking
keeps its estimates. The test build points OSRM at a stub inside the fake Supabase server so
Playwright and CI call no public router. Filter counts come from the ranking's own filter
function. The time change is a trigger in migration 0004, so the client cannot forge or clear it.

Written after the code, not before, because the round 3 critics were still browsing the built
site and the code changes could not be built or tested until they finished; recorded as a
process slip.

Reflection (12 Sep): the round 3 product critique landed while this iteration was being
built; all of its P1s except search are in this build, verified by the unit, RLS and e2e
suites against a scratch build (the critics were browsing dist). CI had been red on every push
because the home Lighthouse Performance score is 47 to 58 under headless software WebGL (a
CPU profile shows MapLibre's GL context setup at 1 to 2 s and our code under 40 ms); that
gate is now reported, not enforced, on the home route only, and is raised as the escalation.
Kept, nothing reverted.

## Iteration 7: a product site around the tool (12 Sep 2026, user-directed)

The user's call, after seeing the build: the site opened straight into the finder with nothing
to say what it was, and they want it to work like a commercial product site. That overrides
the brief's "first screen stays search box, map and list" and "no hero sections" lines for the
front door; the finder itself keeps that bar.

Intended user-visible outcome: `/` is a landing page that says what PitchFinder does in one
sentence, lets you start from your own postcode, shows the real numbers (places, floodlit,
priced, last refresh), explains the three steps, lets you browse by type, and lists what you
get, with a footer on every content page. A header menu on desktop and a Menu panel on phones
reach Home, Find a pitch, About, My games, Privacy and Sign in. The finder lives at `/find`;
every link shared before today (`/?g=...`) still opens it with its state. A privacy page says
plainly what is stored and where.

Approach: two routes and two pages, no new dependencies, the same tokens and components. The
quick start reuses the group form's geocoder and writes the first person into the URL. The
Lighthouse gate now covers the landing in full and measures with real throttling (the
simulation put the finder's first paint at 3.7 s while its own filmstrip showed the list at
2.3 s). The footer sits below the first screen so a page's data arriving never moves it.

Reflection: landing 97 / 100 / 100 / 100 with first paint at 2.1 s on throttled slow 4G; the
finder is unchanged in code and in numbers; 63 e2e tests pass including the quick start, the
legacy redirect, the menu on both form factors and the privacy page. Kept.

## Iteration 8: everyone adds themselves (12 Sep 2026, user-directed)

The user's call: the finder read as one manager typing the whole group in and the pitch panel
showed everything at once. The product is the other way round: one person makes a group link,
each person opens it and puts in where they are coming from and what they need, and the site
collates it. Also asked for: the selected pitch must be visibly highlighted, and less detail.

Intended user-visible outcome: "Create a group link" from the finder, the landing page or My
games gives `/group/{slug}`. Anyone with the link adds themselves (name, postcode or area, how
they travel, a budget per head, whether they need floodlights) without an account, changes or
removes their own entry later, and sees who else is in and the three best pitches for the whole
group, with the tightest budget and floodlights applied if anyone asked. "See all pitches on the
map" opens the finder for the shared group, where the chips are the people who added themselves
and every pitch link keeps the group. The organiser can rename the group and remove someone.
The pitch panel shows the answer first: journey times, one line of price, surface and lights,
the actions; everything else is behind one closed disclosure. The selected pitch is highlighted
in the list, scrolled into view, and ringed on the map.

Approach: migration 0005 (a members table keyed by account or guest key, security-definer
join, read and leave, owner-only direct access) tested against Postgres; `grp=` in the URL
supplies the squad from Supabase; the group page polls every 20 s like the game page. The
inline `g=` group remains for anyone who prefers to type people in, and for links without a
server.

Reflection: the shared-group round trip is proven end to end on both form factors (organiser
creates, guest joins with preferences, the map ranks for both, the organiser removes someone)
plus eight RLS tests; unit and e2e suites green. Kept.

## Live Supabase: migrations applied, grants tightened, keys built in (12 Sep 2026, user-directed)

The user connected the Supabase and Vercel connectors and asked for the setup to be done. The
live project had no schema at all: the GitHub integration had deployed nothing. Migrations 0001
to 0005 went on through the connector, in order. The project's security advisor then showed two
things the tests had not caught. A hosted project grants the API roles everything on every new
table and function by default, so anon held select, insert, update, delete and truncate on every
table (Row Level Security still decided every row, so nothing was readable, but the grants were
wider than SUPABASE.md said). And four functions ran with the caller's search_path. Migration
0006 fixes both; the test harness now sets the hosted defaults on its throwaway database, so
five existing tests fail without 0006, and three new tests cover the grants directly.

The deployed bundle carried no Supabase URL or key, so the live site had no backend. The
connectors cannot set Vercel variables, so a production build and the game function now fall
back to the live project's URL and anon key (`src/lib/live-project.js`, both public by design,
the environment still overrides them). Test builds and development never fall back.

Left for the dashboard, which no connector reaches: the auth URL configuration (site URL and
the redirect list) and "Confirm email" off. Until the first is set, a magic link lands on the
default site URL rather than the page the person was on.

## Iteration 9: bookable only, prices and times, preferences that add up, a new look (12 Sep 2026, user-directed)

The user's call, in full: only Goals, Powerleague and astro hire; every venue with prices and
timings in a clear, readable format; the UI to feel like Partiful and Luma (clear, full-screen,
fun, accessible, not boring); preferences beyond floodlights.

Intended user-visible outcome: the map and list hold about 200 bookable venues instead of 1,600
pitches. Every card says what an hour costs (and what that is each for the group), whether the
place is open now, and who runs it. Every pitch page has a Prices block (each stated price with
what it is for, per hour, per player, peak and off-peak, with the source and the date) and an
Opening times block (the week, today in bold, open or closed now), or an honest "not published
online" with the booking page. The landing page is a hero with one big way in. The group page
and the game page read like invites: a cover tile, the name, "Hosted by", the people as avatars,
one big share button, and the body in cards. Each person can pick a budget, floodlights, cover,
changing rooms, parking, pitch size, surface, operator, longest journey, days and time of day;
the group page shows what the group needs and who asked, and the ranking applies it.

Approach: Goals and Powerleague render their sites in the browser and answer plain fetches with
nothing or 403, which is why the price scraper had brought back nothing since the start. A
headless-browser fetch (honest user agent, robots honoured, two seconds between pages) reads
their club lists and club pages on GitHub, where the network is open, and writes every fact
with the words behind it. Powerleague answers even a real browser with 403; that is left alone
rather than worked around, and its baseline facts stay marked unverified. The build lays the
live facts over the curated baseline, parses OpenStreetMap hours for the astros, and writes out
only bookable types. Filters, URL state and the preference collation gained the new fields; the
design system gained a display face, a night-pitch palette, pill buttons, brand badges, avatars,
event-page layout and a confetti moment on "In", all off under reduced motion.

Reflection: the browser fetch read 13 Goals clubs in London from their own pages, five of them
new to the dataset (Eltham, Heathrow, Tolworth, Wembley, Wimbledon): opening hours for all 13
(each quoted, for example "Monday 10:00 - 23:00"), formats, parking, cover, addresses and
coordinates from the pages' schema.org data. Goals do not publish an hourly hire rate on those
pages; they publish per-player prices for casual games (£5 on 5-a-side, £7 on 7-a-side), which
now sit in the Prices block next to the baseline hire rate, each with its source. Their club
list page carries no club links in the DOM, so the fetch tries the clubs known so far at the
site's own URL pattern; nine slugs answered with the site's shell and are skipped. Powerleague
answers a real browser with 403, so its seven clubs keep the baseline and say so. The dataset is
214 bookable venues, 14 with structured hours, 23 with an hourly price. Lighthouse found the new
green at 4.0:1 under white text and a heavy hero glow on the first pass (90 / 96); fixed to 94 /
100 with the accent a shade darker, dark text on the bright green in dark mode, and two gradient
glows moved on the compositor. Kept.

## Iteration 10: the real prices, from the booking calendars (12 Sep 2026, user-directed)

The user's call: "scrape all Goals and Powerleague and astro in London accurately for prices
and timings, figure it out and add it properly."

Intended user-visible outcome: every Goals club, every Powerleague club and every astro that
sells its pitches online shows what a slot really costs, by pitch size, on which days and at
which kick-off times, with the slot length, the source, the date it was read and how many
slots backed it. The card shows the cheapest slot as it is sold and what that is each for the
group; budgets and "about £9 each" mean what the group pays for one game. Opening hours come
from the operator's page where it has one, else from the booking site's listing, and say
which. Astros that sell online but were not on the map are added.

Approach: a probe run on GitHub first, to see what each candidate source really serves rather
than guess. Pitchbooking (Goals' own booking site) shows a day of bookable slots per club and
pitch size with a price on each; Playfinder shows a week of slots per pitch for Powerleague
and for the council, club and leisure-centre astros, plus the venue's address, hours table,
facilities and pitch list, and its robots.txt allows the venue pages. Powerleague's own site
still answers 403 and is left alone. The readers were then written against the saved pages,
with those pages as test fixtures (the 26 Goals Beckenham slots agree between the two sites).
Slots fold into bands; nothing is extrapolated to days that were not read. The merge matches
Playfinder venues by name, by a shared distinctive word within 300 m, or by being the only
astro on the spot, and adds the rest pinned at their postcode. The run is polite (identified
browser, robots honoured, two seconds a page) and bounded (page budget, deadline, caches, an
offline rebuild), and both the venue-fetch and the weekly refresh workflows run it.

Reflection: three runs on GitHub. The first read every Playfinder venue in its sitemap (333
London venue pages, 507 pages in 52 minutes): all 15 London Powerleague clubs came back with a
week of real slot prices (weekday 40-minute slots at £95 off-peak and £110 peak, hour-long
weekend slots at £75, in Shoreditch's case), nine of them clubs the map did not have; 84
astros gained an hours table; 86 astros with an artificial pitch showed no calendar, and a
probe found why: those venues sell through a Bookteq widget in an iframe that shows
availability without prices until a slot is chosen, which is left for a later iteration. The
first run read no Goals club at all: Pitchbooking's sitemap does not list Goals' pages and
Goals' club picker is drawn by script, so the twelve London pages were found by web search
and seeded, each checked against its own title. The second run read eleven clubs for seven
days each (about 330 slots a club); it also showed that the pitch size in the URL does not
switch Pitchbooking's list, so the 7 and 8-a-side rows repeated the 5-a-side prices: the
reader now picks the size in the page's own select and keeps a slot only when its per-player
figure is the price over twice that many players; the third run read all twelve clubs
(Bexleyheath included, whose own site had answered with its shell that day) with the sizes
apart: Beckenham sells a 5-a-side hour at £88 and an 8-a-side hour at £124 off-peak. A band grouped by price alone had claimed
"every day 09:00 to 22:00" for a £86 hour that costs £106 on weekday evenings; days now fold
into a band only when its windows hide no other price that day. Tolworth is not on
Pitchbooking under any name searched and keeps its hours only; Powerleague Wembley and
Canary Wharf have no Playfinder page and keep the unverified baseline. The refresh wrote
274 venues: 12 Goals clubs and 15 Powerleague clubs with a week of real prices by pitch size,
59 venues added from Playfinder (nine of them Powerleague clubs the map lacked), 84 astros
with an hours table, and no astro with a slot price yet: that needs a Bookteq reader, which
is the next thing to build. Kept.

## Iteration 11: the UI, redone with the 21st.dev connector (12 Sep 2026, user-directed)

The user's call: "redo the UI properly using the new 21st.dev connector."

What the connector gives on the free tier: unlimited catalogue search and reranking, two
component-code retrievals a day, no hosted generation, and the sandbox cannot load the preview
images. The two retrievals went on the components with the most structure to borrow: "Hero
with Mockup" by serafimcloud (Launch UI) for the landing page and "Event Countdown Card" by
isaiahbjork for the game page. Both are Tailwind and shadcn; they were rewritten as plain CSS
on the existing tokens rather than adding a utility framework to a 64 KB app.

Intended user-visible outcome: the landing opens with a headline that fades from ink, the
copy, the actions and the quick start appearing in order, a soft glow behind, and the product
itself in a framed screenshot below the fold. Primary actions carry a brand gradient and a
tinted shadow and lift on hover; cards lift and the selected one wears a ring; filter counts
sit in badges; the header floats over the page. The game page counts down to kick-off in days,
hours and minutes, wears a "Starts soon" badge inside 24 hours, and the "In" answer glows.
Everything stays still under reduced motion; every gate from iteration 9 (44 px targets, focus
rings, contrast, Lighthouse) still passes.
