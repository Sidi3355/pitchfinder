// Supabase client, loaded on demand. Most visitors never sign in, so the
// library (about 40 KB gzipped) is only fetched when there is a session to
// restore or the user taps an action that needs an account. Every function
// here returns plain data or throws an Error with a message fit to show.

const URL_ = import.meta.env.VITE_SUPABASE_URL
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

/** True when the build has Supabase credentials. */
export const configured = !!(URL_ && ANON_KEY)

let clientPromise = null

export function hasStoredSession() {
  try {
    return Object.keys(localStorage).some((k) => k.startsWith('sb-') && k.endsWith('-auth-token'))
  } catch {
    return false
  }
}

async function client() {
  if (!configured) throw new Error('Sign in is not available on this build.')
  if (!clientPromise) {
    clientPromise = import('@supabase/supabase-js').then(({ createClient }) =>
      createClient(URL_, ANON_KEY, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          flowType: 'implicit',
        },
      }),
    )
  }
  return clientPromise
}

function fail(error, fallback) {
  const msg = error?.message || fallback || 'Something went wrong.'
  if (/fetch|network|Failed to fetch|Load failed/i.test(msg)) {
    throw new Error('Could not reach the server. Check your connection and try again.')
  }
  throw new Error(msg)
}

function toUser(sessionUser, profile) {
  if (!sessionUser) return null
  const meta = sessionUser.user_metadata || {}
  return {
    id: sessionUser.id,
    email: sessionUser.email || null,
    displayName:
      profile?.display_name ||
      meta.full_name ||
      meta.name ||
      sessionUser.email?.split('@')[0] ||
      'You',
  }
}

// ── Auth ─────────────────────────────────────────────────────────────────────

/** Current user with profile, or null. Loads the client only if a session is stored. */
export async function currentUser({ force = false } = {}) {
  if (!configured) return null
  if (!force && !hasStoredSession()) return null
  const sb = await client()
  const { data, error } = await sb.auth.getSession()
  if (error) fail(error)
  const u = data.session?.user
  if (!u) return null
  return toUser(u, await ensureProfile(u))
}

export async function onAuthChange(callback) {
  const sb = await client()
  const { data } = sb.auth.onAuthStateChange(async (_event, session) => {
    const u = session?.user
    callback(u ? toUser(u, await ensureProfile(u)) : null)
  })
  return () => data.subscription.unsubscribe()
}

export async function signInWithEmail(email, redirectTo) {
  const sb = await client()
  const { error } = await sb.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo } })
  if (error) fail(error)
}

export async function signInWithGoogle(redirectTo) {
  const sb = await client()
  const { error } = await sb.auth.signInWithOAuth({ provider: 'google', options: { redirectTo } })
  if (error) fail(error)
}

export async function signOut() {
  const sb = await client()
  const { error } = await sb.auth.signOut()
  if (error) fail(error)
}

async function ensureProfile(sessionUser) {
  const sb = await client()
  const { data: existing } = await sb
    .from('profiles')
    .select('display_name')
    .eq('id', sessionUser.id)
    .maybeSingle()
  if (existing) return existing
  const draft = toUser(sessionUser, null)
  const { data, error } = await sb
    .from('profiles')
    .insert({ id: sessionUser.id, display_name: draft.displayName.slice(0, 40) })
    .select('display_name')
    .single()
  if (error) return { display_name: draft.displayName }
  return data
}

export async function updateDisplayName(userId, displayName) {
  const sb = await client()
  const { error } = await sb.from('profiles').update({ display_name: displayName }).eq('id', userId)
  if (error) fail(error)
}

// ── Saved pitches ────────────────────────────────────────────────────────────

export async function listSaved() {
  const sb = await client()
  const { data, error } = await sb.from('saved_pitches').select('pitch_id').order('created_at')
  if (error) fail(error)
  return data.map((r) => r.pitch_id)
}

export async function savePitch(userId, pitchId) {
  const sb = await client()
  const { error } = await sb.from('saved_pitches').upsert({ user_id: userId, pitch_id: pitchId })
  if (error) fail(error)
}

export async function unsavePitch(pitchId) {
  const sb = await client()
  const { error } = await sb.from('saved_pitches').delete().eq('pitch_id', pitchId)
  if (error) fail(error)
}

// ── Groups ───────────────────────────────────────────────────────────────────

export async function listGroups() {
  const sb = await client()
  const { data, error } = await sb
    .from('groups')
    .select('id, name, members, updated_at')
    .order('updated_at', { ascending: false })
  if (error) fail(error)
  return data
}

export async function saveGroup(userId, { id, name, members }) {
  const sb = await client()
  const row = { owner_id: userId, name, members }
  const query = id ? sb.from('groups').update(row).eq('id', id) : sb.from('groups').insert(row)
  const { data, error } = await query.select('id, name, members, updated_at').single()
  if (error) fail(error)
  return data
}

export async function deleteGroup(id) {
  const sb = await client()
  const { error } = await sb.from('groups').delete().eq('id', id)
  if (error) fail(error)
}

// ── Games and RSVPs ──────────────────────────────────────────────────────────

const GAME_COLUMNS =
  'id, pitch_id, pitch_name, sport, starts_at, notes, status, share_slug, created_at'

export async function listGames() {
  const sb = await client()
  const { data, error } = await sb.from('games').select(GAME_COLUMNS).order('starts_at')
  if (error) fail(error)
  return data
}

export async function createGame(userId, { pitchId, pitchName, startsAt, notes }) {
  const sb = await client()
  const { data, error } = await sb
    .from('games')
    .insert({
      creator_id: userId,
      pitch_id: pitchId,
      pitch_name: pitchName,
      starts_at: startsAt,
      notes: notes || null,
    })
    .select(GAME_COLUMNS)
    .single()
  if (error) fail(error)
  return data
}

export async function updateGame(id, patch) {
  const sb = await client()
  const { data, error } = await sb
    .from('games')
    .update(patch)
    .eq('id', id)
    .select(GAME_COLUMNS)
    .single()
  if (error) fail(error)
  return data
}

export async function gameBySlug(slug, guestKey) {
  const sb = await client()
  const { data, error } = await sb.rpc('game_by_slug', {
    p_slug: slug,
    p_guest_key: guestKey || null,
  })
  if (error) fail(error)
  return data // { game, rsvps } or null
}

export async function rsvpAsUser(slug, status) {
  const sb = await client()
  const { error } = await sb.rpc('rsvp_user', { p_slug: slug, p_status: status })
  if (error) fail(error)
}

export async function rsvpAsGuest(slug, name, guestKey, status) {
  const sb = await client()
  const { error } = await sb.rpc('rsvp_guest', {
    p_slug: slug,
    p_name: name,
    p_guest_key: guestKey,
    p_status: status,
  })
  if (error) fail(error)
}

export async function deleteRsvp(id) {
  const sb = await client()
  const { error } = await sb.from('rsvps').delete().eq('id', id)
  if (error) fail(error)
}

// ── Reports ──────────────────────────────────────────────────────────────────

export async function reportProblem({
  pitchId,
  field,
  suggestedValue,
  message,
  email,
  userId,
  pageUrl,
}) {
  const sb = await client()
  const { error } = await sb.from('reports').insert({
    pitch_id: pitchId,
    field,
    suggested_value: suggestedValue || null,
    message: message || null,
    email: email || null,
    user_id: userId || null,
    page_url: pageUrl || null,
  })
  if (error) fail(error)
}

/** The caller's own games with RSVP counts (profile page). */
export async function myGames() {
  const sb = await client()
  const { data, error } = await sb.rpc('my_games')
  if (error) fail(error)
  return data || []
}
