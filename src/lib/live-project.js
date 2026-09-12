// The live Supabase project, used when a production build or the game
// function has no keys set. Both values are public by design: the URL is in
// every request the browser makes, and the anon key can only do what Row
// Level Security lets the anon role do (agent/SUPABASE.md). The service role
// key is never here. VITE_SUPABASE_*, NEXT_PUBLIC_SUPABASE_* and SUPABASE_*
// override these, so a rotated key or another project is an environment
// change, not a code change.
export const LIVE_SUPABASE_URL = 'https://uencvdgxvzqeshisclya.supabase.co'
export const LIVE_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlbmN2ZGd4dnpxZXNoaXNjbHlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkyMTYyOTgsImV4cCI6MjEwNDc5MjI5OH0.Ti707Awq9iL80QuCpCg4hDOS-arfmQJotDFObIgD8as'
