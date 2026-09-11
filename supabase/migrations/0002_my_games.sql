-- The organiser's own games with RSVP counts, for the profile page.
-- Security invoker: RLS on games and rsvps applies, so it lists only the
-- caller's games and counts only RSVPs the caller may see (all of them, as
-- the creator).

create or replace function public.my_games()
returns table (
  id uuid,
  pitch_id text,
  pitch_name text,
  sport text,
  starts_at timestamptz,
  notes text,
  status text,
  share_slug text,
  in_count int,
  maybe_count int,
  out_count int
)
language sql
stable
as $$
  select g.id, g.pitch_id, g.pitch_name, g.sport, g.starts_at, g.notes, g.status, g.share_slug,
    (select count(*)::int from public.rsvps r where r.game_id = g.id and r.status = 'in'),
    (select count(*)::int from public.rsvps r where r.game_id = g.id and r.status = 'maybe'),
    (select count(*)::int from public.rsvps r where r.game_id = g.id and r.status = 'out')
  from public.games g
  where g.creator_id = auth.uid()
  order by g.starts_at
$$;

grant execute on function public.my_games() to authenticated;
