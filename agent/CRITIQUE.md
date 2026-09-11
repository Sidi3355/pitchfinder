# Critique log

Dated section per iteration. Each finding: P0 (blocks real use), P1 (user would notice and be
annoyed), P2 (polish). Critics name what is wrong and why it matters. They do not propose fixes.

## Iteration 1 (11 Sep 2026)

Both critics reviewed the iteration 1 build (the one behind `agent/screenshots/iter1`). Full
texts: `agent/critique/iter1-product.md` and `agent/critique/iter1-design.md`. Summary:

**P0 (both critics agree)**

- The header needs 484 px on a 390 px phone: the page pans sideways, "Sign up" is off-screen,
  and every fixed layer (drawer, dialog) inherits the wider layout, so the pitch drawer's
  journey times and Close button are clipped. The core number cannot be read on a phone.
- The default budget of £0 per person silently removed every venue with a known price (3,124
  of 3,148 shown; "Commercial centre" returned 2). Root cause: the URL codec turned a missing
  `budget` parameter into 0. Fixed in the build that followed, with a unit test.
- Pitch pages for the 2,949 unnamed OpenStreetMap pitches have no address, postcode or
  directions link, so the link pasted into a chat cannot say which cage it is or how to get
  there.

**P1 (selected)**

- Share drops `?g=`, so the friend who opens the link sees no journey times.
- Only the 19 px title text opens a pitch; the 121 px card body is inert.
- Top ten for a Peckham + Hackney group is ten unnamed cages with three identical pairs.
- The number one pick shows surface and floodlights "Not known" yet outranks floodlit pitches.
- Reasons repeat the same facts on every card; "fit 66" is an unexplained number.
- Group rows never show where each player is from.
- Filters tab shows no count; empty state has no Reset; error state exposes "(Failed to fetch)"
  with no retry.
- Save asked for a username and password to write to this browser (replaced by Supabase).
- "Book at venue" on Market Road and Hackney Marshes opens generic council pages.
- Heart 15 x 17 px at 1.47:1; 38 of 39 mobile controls under 44 px; browser-default focus;
  six em dashes; eight type sizes on one screen; loading notice displaces the tabs.

**Verdicts**

- Product: No. The shared link lands on a nameless cage with no address and, because Share
  drops the group, no journey times.
- Design: On desktop the structure is calm and sound; on mobile the header overflow breaks
  every screen, so for the phone user this iteration is different rather than better.
