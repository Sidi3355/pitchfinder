# Supabase: schema, policies and how they are tested

The client only ever holds the project URL and the anon key: from `VITE_SUPABASE_URL` and
`VITE_SUPABASE_ANON_KEY`, from the `NEXT_PUBLIC_` names, or, in a production build with neither,
from `src/lib/live-project.js`. Every rule that protects data is a row-level security policy or
a security-definer function in `supabase/migrations/`. Nothing in the browser is trusted.

## Applying migrations

```
supabase db push            # with the Supabase CLI linked to the project
# or paste each file from supabase/migrations/ into the SQL editor, in order
```

Auth providers to enable in the dashboard: Email (magic link, "Confirm email" off so the link
signs in directly) and Google. Add the site URL and `https://<site>/**` to the redirect
allow-list. `supabase/config.toml` carries the same settings for the CLI and preview branches.

Keys reach the site as `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (typed into Vercel or
`.env.local`), as the `NEXT_PUBLIC_` names the Supabase to Vercel integration sets, or, when a
production build and the game function have neither, from `src/lib/live-project.js`, which holds
the live project's URL and anon key. Both values are public by design (the anon key can only do
what these policies let the anon role do); the service role key is never in the repository or
the browser. Test builds and development never fall back to the live project.

A hosted project grants the API roles every privilege on each new table, sequence and function
in `public` by default, before a migration's own grants run. Row Level Security still decided
every row, but the door was wider than this document said. Migration 0006 takes the grants back
to exactly what the migrations state, and `tests/rls/harness.mjs` sets the same defaults on the
throwaway database so the suite proves it (five tests fail without 0006). A migration that adds
a table or a function states its grants and revokes the rest.

## The live project

Project `uencvdgxvzqeshisclya` (eu-west-1, Postgres 17) at
`https://uencvdgxvzqeshisclya.supabase.co`. Migrations 0001 to 0006 were applied to it in order
on 12 Sep 2026 through the Supabase connector; the dashboard's migration history lists them by
name. Its security advisor then reports only the intended warnings: the five link-holder
functions (`game_by_slug`, `rsvp_guest`, `group_by_slug`, `group_join`, `group_leave`) are
security definer and callable by anon, which is the design (see "Why functions" below), and the
signed-in ones by authenticated.

Still to set in the dashboard, which no connector reaches:

- Authentication, URL configuration: Site URL `https://pitchfinder-pied.vercel.app`, and
  `https://pitchfinder-pied.vercel.app/**` in the redirect list. Until then a magic link lands
  on the default site URL (localhost) instead of the page the person was on.
- Authentication, Providers, Email: "Confirm email" off. The app signs in by magic link only, so
  there is nothing to confirm.
- Google: off until a client id and secret are added.

## Tables

| Table           | Purpose                                                                                                                                                                 | Who can do what                                                                                                                                                                                    |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `profiles`      | `id` (= `auth.users.id`), `display_name`                                                                                                                                | Anyone can read display names (they appear on games and RSVPs). A user inserts and updates only their own row.                                                                                     |
| `saved_pitches` | `(user_id, pitch_id)`                                                                                                                                                   | Owner only: select, insert, delete.                                                                                                                                                                |
| `groups`        | `owner_id`, `name`, `members` jsonb `[{name, lat, lng, mode, label}]` (max 30)                                                                                          | Owner only: select, insert, update, delete.                                                                                                                                                        |
| `games`         | `creator_id`, `pitch_id`, `pitch_name`, `sport` (default football), `starts_at`, `notes`, `status` (scheduled / cancelled), `share_slug` (20 hex chars, 80 random bits) | Direct table access is creator only. Everyone else reads through `game_by_slug()`, so holding the link is the only way in.                                                                         |
| `rsvps`         | `game_id`, either `user_id` or (`guest_name` + `guest_key`), `status` in / maybe / out                                                                                  | A user sees and edits their own rows; the game's creator sees and can delete any row on their game. Guests only act through `rsvp_guest()`. One row per user per game, one per guest key per game. |
| `reports`       | `pitch_id`, `field`, `suggested_value`, `message`, `email`, `user_id`, `page_url`                                                                                       | Anyone (anon or signed in) can insert. Nobody can read through the API; read them in the dashboard or with the service key.                                                                        |

## Functions (security definer, `search_path = public`)

- Every function pins `search_path = public`, the two triggers and the two invoker functions
  (`my_games`, `my_groups`) since migration 0006. `rsvp_user`, `my_games` and `my_groups` are
  executable by authenticated only; Postgres grants execute to everyone on a new function, and
  0006 revokes that.
- `games.previous_starts_at` and `games.time_changed_at` (migration 0004) are set by a trigger
  whenever `starts_at` changes; the client cannot set or clear them. `game_by_slug` returns both,
  and marks each RSVP `before_change` when it was last updated before the time moved, so the page
  can ask those people to confirm.
- Shared groups (migration 0005): `groups.share_slug` (20 hex chars) and a `group_members` table
  (name, label, lat, lng, mode, prefs jsonb, keyed by `user_id` or a 16 to 64 character
  `guest_key`). Direct table access is owner only (select and delete). Everyone else goes through
  `group_by_slug(slug, guest_key)` (`{ group, members }` with `is_you`), `group_join(...)` (upsert
  your own row, UK bounds and mode checked, 30 members at most), `group_leave(slug, guest_key)`
  and `my_groups()` (the owner's groups with member counts). The old `members` jsonb column stays
  for groups saved before shared links existed.
- `game_by_slug(slug, guest_key default null)` returns `{ game, rsvps }`. The game object never
  includes `creator_id`; it includes `creator_name`, `is_creator` (for the caller) and each RSVP
  carries `is_you` (matched by `auth.uid()` for users or by `guest_key` for guests). Returns
  `null` for an unknown slug. Callable by anon and authenticated.
- `rsvp_guest(slug, name, guest_key, status)`: upserts the guest's RSVP on the game with that
  slug. Refuses weak keys (under 16 characters), bad statuses, unknown slugs and cancelled games.
  The key is random, generated in the browser once per game and kept in localStorage so the
  guest can change their answer from the same phone.
- `rsvp_user(slug, status)`: upserts the caller's own RSVP; requires a signed-in user.

Why functions rather than open policies: a policy cannot see the query's `where` clause, so a
"select where share_slug = X" policy would let the anon key list every game. The function is
the gate: you must present the slug.

## Testing the policies

`tests/rls/rls.test.mjs` runs against a real Postgres with the migrations applied. The harness
(`tests/rls/harness.mjs`) creates a throwaway database, adds the bits a Supabase project already
has (`auth.users`, `auth.uid()`, the `anon` and `authenticated` roles), and runs each query the
way PostgREST does: `set local role` plus `request.jwt.claims`, with the hosted project's
default privileges in place so the grants are tested as well as the policies. Thirty-three tests
cover: profile ownership, saved pitches private to the user, groups private to the owner, shared
groups (keying by account or guest key, isolation between groups, the closed members table, owner
removal, leaving), games invisible to other users and to anon, slug-based reads, guest and user
RSVPs, RSVP edit and delete rules, time changes, cancellation, reports being write-only, and the
grants (anon has no direct table access beyond profiles and reports, signed-in-only functions
refuse anon, nobody can truncate).

Run locally:

```
DATABASE_URL=postgres://postgres@127.0.0.1:5432/postgres npm test
```

Without `DATABASE_URL` the RLS suite is skipped, and `npm test` still runs the unit tests. CI
starts a Postgres 16 service so the suite runs on every push.

## Not stored anywhere

Passwords (Supabase Auth handles them, and the app only offers magic link and Google), pitch
data (it is a static file), journey times.
