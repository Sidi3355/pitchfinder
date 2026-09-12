-- Two things the security advisor found on the live project after the first
-- five migrations, neither of which the tests had caught.
--
-- 1. A hosted Supabase project grants every privilege on each new table and
--    execute on each new function in public to anon and authenticated by
--    default, before the migration's own grants run. Row Level Security still
--    decided every row, so nothing was readable that should not be, but the
--    grants were wider than the model in agent/SUPABASE.md. This takes them
--    back to exactly what the migrations state: anon reads profiles and
--    files reports, signed-in users get their own tables, and everything else
--    goes through the functions. tests/rls/harness.mjs now mirrors the
--    hosted defaults so the policy tests prove this.
-- 2. Four functions ran with the caller's search_path. The security-definer
--    functions already pin it; now the two triggers and the two invoker
--    functions do too.
--
-- Nothing is deleted and no policy changes.

-- Tables: the API roles get what a migration says and nothing else.
revoke all on all tables in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;
grant select, insert, update, delete on public.profiles, public.saved_pitches,
  public.groups, public.games, public.rsvps to authenticated;
grant select, delete on public.group_members to authenticated;
grant select on public.profiles to anon;
grant insert on public.reports to anon, authenticated;

-- Functions: signed-in only means signed-in only. Postgres also grants
-- execute to public on every new function, so that goes too.
revoke execute on function public.rsvp_user(text, text) from public, anon;
revoke execute on function public.my_games() from public, anon;
revoke execute on function public.my_groups() from public, anon;
grant execute on function public.rsvp_user(text, text) to authenticated;
grant execute on function public.my_games() to authenticated;
grant execute on function public.my_groups() to authenticated;

-- Search path pinned on the functions that did not have it.
alter function public.set_updated_at() set search_path = public;
alter function public.record_time_change() set search_path = public;
alter function public.my_games() set search_path = public;
alter function public.my_groups() set search_path = public;
