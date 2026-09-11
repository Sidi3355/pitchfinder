-- PitchFinder schema, first migration.
-- Every table has row-level security. The client only ever holds the anon
-- key, so these policies and the security-definer functions below are the
-- whole access model. See agent/SUPABASE.md for the reasoning.

create extension if not exists pgcrypto;

-- ── Helpers ──────────────────────────────────────────────────────────────────

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ── profiles ─────────────────────────────────────────────────────────────────

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 40),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger profiles_updated before update on public.profiles
  for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;

-- Display names are shown on games and RSVPs, so anyone may read them.
create policy "profiles are readable by everyone" on public.profiles
  for select using (true);
create policy "users insert their own profile" on public.profiles
  for insert with check (id = auth.uid());
create policy "users update their own profile" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

-- ── saved_pitches ────────────────────────────────────────────────────────────

create table public.saved_pitches (
  user_id uuid not null references auth.users (id) on delete cascade,
  pitch_id text not null check (pitch_id ~ '^[A-Za-z0-9-]{1,40}$'),
  created_at timestamptz not null default now(),
  primary key (user_id, pitch_id)
);

alter table public.saved_pitches enable row level security;

create policy "users see their own saved pitches" on public.saved_pitches
  for select using (user_id = auth.uid());
create policy "users save pitches for themselves" on public.saved_pitches
  for insert with check (user_id = auth.uid());
create policy "users remove their own saved pitches" on public.saved_pitches
  for delete using (user_id = auth.uid());

-- ── groups ───────────────────────────────────────────────────────────────────

create table public.groups (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 60),
  -- [{ name, lat, lng, mode, label }]
  members jsonb not null default '[]'::jsonb
    check (jsonb_typeof(members) = 'array' and jsonb_array_length(members) <= 30),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index groups_owner_idx on public.groups (owner_id);
create trigger groups_updated before update on public.groups
  for each row execute function public.set_updated_at();

alter table public.groups enable row level security;

create policy "owners see their groups" on public.groups
  for select using (owner_id = auth.uid());
create policy "owners create groups" on public.groups
  for insert with check (owner_id = auth.uid());
create policy "owners update their groups" on public.groups
  for update using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "owners delete their groups" on public.groups
  for delete using (owner_id = auth.uid());

-- ── games ────────────────────────────────────────────────────────────────────

create table public.games (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users (id) on delete cascade,
  pitch_id text not null check (pitch_id ~ '^[A-Za-z0-9-]{1,40}$'),
  pitch_name text not null check (char_length(pitch_name) between 1 and 120),
  sport text not null default 'football' check (char_length(sport) between 1 and 30),
  starts_at timestamptz not null,
  notes text check (notes is null or char_length(notes) <= 500),
  status text not null default 'scheduled' check (status in ('scheduled', 'cancelled')),
  -- 20 hex chars = 80 random bits: shareable, not guessable.
  share_slug text not null unique default encode(gen_random_bytes(10), 'hex'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index games_creator_idx on public.games (creator_id);
create trigger games_updated before update on public.games
  for each row execute function public.set_updated_at();

alter table public.games enable row level security;

-- Direct table access is creator-only. Everyone else reads a game through
-- game_by_slug(), so holding the link is the only way in.
create policy "creators see their games" on public.games
  for select using (creator_id = auth.uid());
create policy "signed-in users create games" on public.games
  for insert with check (creator_id = auth.uid());
create policy "creators update their games" on public.games
  for update using (creator_id = auth.uid()) with check (creator_id = auth.uid());
create policy "creators delete their games" on public.games
  for delete using (creator_id = auth.uid());

-- ── rsvps ────────────────────────────────────────────────────────────────────

create table public.rsvps (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games (id) on delete cascade,
  user_id uuid references auth.users (id) on delete cascade,
  guest_name text check (guest_name is null or char_length(guest_name) between 1 and 40),
  -- Random token kept in the guest's browser so they can change their answer.
  guest_key text check (guest_key is null or char_length(guest_key) between 16 and 64),
  status text not null check (status in ('in', 'maybe', 'out')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    (user_id is not null and guest_name is null and guest_key is null)
    or (user_id is null and guest_name is not null and guest_key is not null)
  )
);
create unique index rsvps_one_per_user on public.rsvps (game_id, user_id) where user_id is not null;
create unique index rsvps_one_per_guest on public.rsvps (game_id, guest_key) where guest_key is not null;
create index rsvps_game_idx on public.rsvps (game_id);
create trigger rsvps_updated before update on public.rsvps
  for each row execute function public.set_updated_at();

alter table public.rsvps enable row level security;

create policy "users and creators see rsvps" on public.rsvps
  for select using (
    user_id = auth.uid()
    or exists (select 1 from public.games g where g.id = rsvps.game_id and g.creator_id = auth.uid())
  );
create policy "users rsvp as themselves" on public.rsvps
  for insert with check (user_id = auth.uid());
create policy "users change their own rsvp" on public.rsvps
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "users and creators delete rsvps" on public.rsvps
  for delete using (
    user_id = auth.uid()
    or exists (select 1 from public.games g where g.id = rsvps.game_id and g.creator_id = auth.uid())
  );

-- ── reports ──────────────────────────────────────────────────────────────────

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  pitch_id text not null check (pitch_id ~ '^[A-Za-z0-9-]{1,40}$'),
  field text not null check (char_length(field) between 1 and 40),
  suggested_value text check (suggested_value is null or char_length(suggested_value) <= 200),
  message text check (message is null or char_length(message) <= 1000),
  email text check (email is null or email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  user_id uuid references auth.users (id) on delete set null,
  page_url text check (page_url is null or char_length(page_url) <= 500),
  created_at timestamptz not null default now()
);

alter table public.reports enable row level security;

-- Anyone can file a report; nobody reads them through the API (dashboard only).
create policy "anyone can report a problem" on public.reports
  for insert with check (user_id is null or user_id = auth.uid());

-- ── Functions used by the game page ──────────────────────────────────────────

-- The whole game page in one call: the game, its creator's name and the
-- RSVPs. Runs as definer so link holders can read a game the RLS hides.
create or replace function public.game_by_slug(p_slug text, p_guest_key text default null)
returns jsonb
language sql
security definer
set search_path = public
stable
as $$
  select jsonb_build_object(
    'game', jsonb_build_object(
      'id', g.id,
      'pitch_id', g.pitch_id,
      'pitch_name', g.pitch_name,
      'sport', g.sport,
      'starts_at', g.starts_at,
      'notes', g.notes,
      'status', g.status,
      'share_slug', g.share_slug,
      'created_at', g.created_at,
      'creator_name', coalesce(p.display_name, 'The organiser'),
      'is_creator', g.creator_id is not distinct from auth.uid()
    ),
    'rsvps', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id,
        'name', coalesce(pr.display_name, r.guest_name),
        'status', r.status,
        'is_you', (r.user_id is not null and r.user_id = auth.uid())
                  or (p_guest_key is not null and r.guest_key = p_guest_key),
        'updated_at', r.updated_at
      ) order by r.created_at)
      from public.rsvps r
      left join public.profiles pr on pr.id = r.user_id
      where r.game_id = g.id
    ), '[]'::jsonb)
  )
  from public.games g
  left join public.profiles p on p.id = g.creator_id
  where g.share_slug = p_slug
$$;

-- Guest RSVP: identified by the link plus a random key the browser keeps.
create or replace function public.rsvp_guest(p_slug text, p_name text, p_guest_key text, p_status text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_game public.games%rowtype;
  v_id uuid;
begin
  if p_status not in ('in', 'maybe', 'out') then
    raise exception 'invalid status' using errcode = '22023';
  end if;
  if p_guest_key is null or char_length(p_guest_key) < 16 or char_length(p_guest_key) > 64 then
    raise exception 'invalid guest key' using errcode = '22023';
  end if;
  select * into v_game from public.games where share_slug = p_slug;
  if not found then
    raise exception 'game not found' using errcode = 'P0002';
  end if;
  if v_game.status <> 'scheduled' then
    raise exception 'game is cancelled' using errcode = 'P0003';
  end if;
  insert into public.rsvps (game_id, guest_name, guest_key, status)
    values (v_game.id, left(btrim(p_name), 40), p_guest_key, p_status)
  on conflict (game_id, guest_key) where guest_key is not null
    do update set status = excluded.status, guest_name = excluded.guest_name
  returning id into v_id;
  return v_id;
end $$;

-- Signed-in RSVP, keyed by the link. Upserts the caller's own row.
create or replace function public.rsvp_user(p_slug text, p_status text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_game public.games%rowtype;
  v_id uuid;
begin
  if auth.uid() is null then
    raise exception 'sign in required' using errcode = '42501';
  end if;
  if p_status not in ('in', 'maybe', 'out') then
    raise exception 'invalid status' using errcode = '22023';
  end if;
  select * into v_game from public.games where share_slug = p_slug;
  if not found then
    raise exception 'game not found' using errcode = 'P0002';
  end if;
  if v_game.status <> 'scheduled' then
    raise exception 'game is cancelled' using errcode = 'P0003';
  end if;
  insert into public.rsvps (game_id, user_id, status)
    values (v_game.id, auth.uid(), p_status)
  on conflict (game_id, user_id) where user_id is not null
    do update set status = excluded.status
  returning id into v_id;
  return v_id;
end $$;

-- ── Grants (Supabase grants these by default; stated here so a fresh
-- database behaves the same) ─────────────────────────────────────────────────

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.profiles, public.saved_pitches, public.groups,
  public.games, public.rsvps to authenticated;
grant select on public.profiles to anon;
grant insert on public.reports to anon, authenticated;
grant execute on function public.game_by_slug(text, text) to anon, authenticated;
grant execute on function public.rsvp_guest(text, text, text, text) to anon, authenticated;
grant execute on function public.rsvp_user(text, text) to authenticated;
