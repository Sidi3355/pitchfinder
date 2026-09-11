-- A game remembers the group that picked the pitch, so the game page can show
-- each player's estimated journey without needing the finder link.

alter table public.games
  add column if not exists "group" jsonb not null default '[]'::jsonb
    check (jsonb_typeof("group") = 'array' and jsonb_array_length("group") <= 30);

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
