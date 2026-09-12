-- Shared groups: a group has a link, and everyone with the link adds
-- themselves (name, where from, how they travel, a couple of preferences).
-- Nobody types the group in for everyone else. Members live in their own
-- table so two people joining at once never overwrite each other, and each
-- person can only touch their own row: signed in by user id, otherwise by
-- the random guest key their browser keeps (as RSVPs do). Everything goes
-- through security-definer functions; direct table access stays owner only.
-- Columns are added only; nothing is deleted.

alter table public.groups
  add column if not exists share_slug text unique not null
    default encode(gen_random_bytes(10), 'hex');

create table if not exists public.group_members (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups (id) on delete cascade,
  user_id uuid references auth.users (id) on delete cascade,
  guest_key text check (guest_key is null or char_length(guest_key) between 16 and 64),
  name text not null check (char_length(name) between 1 and 40),
  label text not null default '' check (char_length(label) <= 60),
  lat double precision not null check (lat between 49.5 and 61),
  lng double precision not null check (lng between -8.5 and 2),
  mode text not null default 'transit' check (mode in ('walk', 'cycle', 'transit', 'drive')),
  -- { budget: number | null (max £ per person), lit: boolean }
  prefs jsonb not null default '{}'::jsonb check (jsonb_typeof(prefs) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (user_id is not null or guest_key is not null)
);
create index if not exists group_members_group_idx on public.group_members (group_id);
create unique index if not exists group_members_user_idx
  on public.group_members (group_id, user_id) where user_id is not null;
create unique index if not exists group_members_guest_idx
  on public.group_members (group_id, guest_key) where guest_key is not null;
drop trigger if exists group_members_updated on public.group_members;
create trigger group_members_updated before update on public.group_members
  for each row execute function public.set_updated_at();

alter table public.group_members enable row level security;

-- The owner may read and remove members directly; nobody else touches the table.
drop policy if exists "owners see their group members" on public.group_members;
create policy "owners see their group members" on public.group_members
  for select using (
    exists (select 1 from public.groups g where g.id = group_id and g.owner_id = auth.uid())
  );
drop policy if exists "owners remove group members" on public.group_members;
create policy "owners remove group members" on public.group_members
  for delete using (
    exists (select 1 from public.groups g where g.id = group_id and g.owner_id = auth.uid())
  );

-- The whole group page in one call for anyone holding the link.
create or replace function public.group_by_slug(p_slug text, p_guest_key text default null)
returns jsonb
language sql
security definer
set search_path = public
stable
as $$
  select jsonb_build_object(
    'group', jsonb_build_object(
      'id', g.id,
      'name', g.name,
      'share_slug', g.share_slug,
      'created_at', g.created_at,
      'owner_name', coalesce(p.display_name, 'The organiser'),
      'is_owner', g.owner_id is not distinct from auth.uid()
    ),
    'members', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', m.id,
        'name', m.name,
        'label', m.label,
        'lat', m.lat,
        'lng', m.lng,
        'mode', m.mode,
        'prefs', m.prefs,
        'is_you', (m.user_id is not null and m.user_id = auth.uid())
                  or (p_guest_key is not null and m.guest_key = p_guest_key),
        'updated_at', m.updated_at
      ) order by m.created_at)
      from public.group_members m
      where m.group_id = g.id
    ), '[]'::jsonb)
  )
  from public.groups g
  left join public.profiles p on p.id = g.owner_id
  where g.share_slug = p_slug
$$;

-- Add or update yourself. Signed in: your row is keyed by your user id and the
-- guest key is ignored. Otherwise the guest key identifies you.
create or replace function public.group_join(
  p_slug text,
  p_name text,
  p_label text,
  p_lat double precision,
  p_lng double precision,
  p_mode text,
  p_prefs jsonb default '{}'::jsonb,
  p_guest_key text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_group public.groups%rowtype;
  v_id uuid;
  v_uid uuid := auth.uid();
  v_count int;
begin
  select * into v_group from public.groups where share_slug = p_slug;
  if not found then
    raise exception 'group not found' using errcode = 'P0002';
  end if;
  if v_uid is null and (p_guest_key is null or char_length(p_guest_key) < 16 or char_length(p_guest_key) > 64) then
    raise exception 'invalid guest key' using errcode = '22023';
  end if;
  if p_mode not in ('walk', 'cycle', 'transit', 'drive') then
    raise exception 'invalid mode' using errcode = '22023';
  end if;
  if p_lat is null or p_lng is null or p_lat not between 49.5 and 61 or p_lng not between -8.5 and 2 then
    raise exception 'location outside the UK' using errcode = '22023';
  end if;
  if jsonb_typeof(coalesce(p_prefs, '{}'::jsonb)) <> 'object' then
    raise exception 'invalid preferences' using errcode = '22023';
  end if;
  select count(*) into v_count from public.group_members where group_id = v_group.id;
  if v_count >= 30 and not exists (
    select 1 from public.group_members
    where group_id = v_group.id
      and ((v_uid is not null and user_id = v_uid) or (v_uid is null and guest_key = p_guest_key))
  ) then
    raise exception 'group is full' using errcode = 'P0003';
  end if;
  if v_uid is not null then
    insert into public.group_members (group_id, user_id, name, label, lat, lng, mode, prefs)
      values (v_group.id, v_uid, left(btrim(p_name), 40), left(coalesce(p_label, ''), 60), p_lat, p_lng, p_mode, coalesce(p_prefs, '{}'::jsonb))
    on conflict (group_id, user_id) where user_id is not null
      do update set name = excluded.name, label = excluded.label, lat = excluded.lat,
        lng = excluded.lng, mode = excluded.mode, prefs = excluded.prefs
    returning id into v_id;
  else
    insert into public.group_members (group_id, guest_key, name, label, lat, lng, mode, prefs)
      values (v_group.id, p_guest_key, left(btrim(p_name), 40), left(coalesce(p_label, ''), 60), p_lat, p_lng, p_mode, coalesce(p_prefs, '{}'::jsonb))
    on conflict (group_id, guest_key) where guest_key is not null
      do update set name = excluded.name, label = excluded.label, lat = excluded.lat,
        lng = excluded.lng, mode = excluded.mode, prefs = excluded.prefs
    returning id into v_id;
  end if;
  return v_id;
end $$;

-- Take yourself out of a group.
create or replace function public.group_leave(p_slug text, p_guest_key text default null)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
begin
  delete from public.group_members m
  using public.groups g
  where g.id = m.group_id and g.share_slug = p_slug
    and ((v_uid is not null and m.user_id = v_uid)
      or (v_uid is null and p_guest_key is not null and m.guest_key = p_guest_key));
end $$;

-- The owner's groups with member counts, for the profile page.
create or replace function public.my_groups()
returns jsonb
language sql
stable
as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', g.id,
    'name', g.name,
    'share_slug', g.share_slug,
    'updated_at', g.updated_at,
    'member_count', (select count(*)::int from public.group_members m where m.group_id = g.id),
    'members', (select coalesce(jsonb_agg(m.name order by m.created_at), '[]'::jsonb)
                from public.group_members m where m.group_id = g.id),
    'legacy_members', g.members
  ) order by g.updated_at desc), '[]'::jsonb)
  from public.groups g
  where g.owner_id = auth.uid()
$$;

-- Signed-in callers reach the table only through the owner policies above; anon
-- never touches it directly.
grant select, delete on public.group_members to authenticated;
grant execute on function public.group_by_slug(text, text) to anon, authenticated;
grant execute on function public.group_join(text, text, text, double precision, double precision, text, jsonb, text) to anon, authenticated;
grant execute on function public.group_leave(text, text) to anon, authenticated;
grant execute on function public.my_groups() to authenticated;
