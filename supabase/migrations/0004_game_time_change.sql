-- A change of kick-off time is recorded on the game so the page can tell
-- everyone it moved and flag answers given for the old time. Columns are
-- added only; nothing is deleted. The trigger keeps the record honest: the
-- client cannot set or clear it.

alter table public.games
  add column if not exists previous_starts_at timestamptz,
  add column if not exists time_changed_at timestamptz;

create or replace function public.record_time_change()
returns trigger
language plpgsql
as $$
begin
  if new.starts_at is distinct from old.starts_at then
    new.previous_starts_at = old.starts_at;
    new.time_changed_at = now();
  else
    new.previous_starts_at = old.previous_starts_at;
    new.time_changed_at = old.time_changed_at;
  end if;
  return new;
end;
$$;

drop trigger if exists games_record_time_change on public.games;
create trigger games_record_time_change
  before update on public.games
  for each row execute function public.record_time_change();

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
      'previous_starts_at', g.previous_starts_at,
      'time_changed_at', g.time_changed_at,
      'notes', g.notes,
      'status', g.status,
      'share_slug', g.share_slug,
      'group', g."group",
      'created_at', g.created_at,
      'updated_at', g.updated_at,
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
        'updated_at', r.updated_at,
        'before_change', g.time_changed_at is not null and r.updated_at < g.time_changed_at
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
