// Local accounts — demo-grade, browser-only.
//
// Everything lives in localStorage so the app works with zero infrastructure.
// Passwords are salted + SHA-256 hashed so they're never stored in plain text,
// but this is NOT real security (anyone at the same browser can inspect it).
// When the app gets its own repo, replace this module with calls to a real
// auth backend (e.g. Supabase/Firebase/your API) — the store only uses the
// exported functions below, so the swap is contained here.

const USERS_KEY = 'topbins:users'
const SESSION_KEY = 'topbins:session'

function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || {}
  } catch {
    return {}
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

async function hashPassword(password, salt) {
  const data = new TextEncoder().encode(`${salt}:${password}`)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function randomSalt() {
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('')
}

function publicProfile(user) {
  const { passwordHash, salt, ...rest } = user
  return rest
}

export async function register({ username, displayName, password }) {
  const uname = String(username || '').trim().toLowerCase()
  if (!/^[a-z0-9_]{3,20}$/.test(uname)) {
    throw new Error('Username: 3–20 letters, numbers or underscores.')
  }
  if (String(password || '').length < 6) {
    throw new Error('Password needs at least 6 characters.')
  }
  const users = loadUsers()
  if (users[uname]) throw new Error('That username is taken — try another.')

  const salt = randomSalt()
  const user = {
    username: uname,
    displayName: String(displayName || '').trim() || uname,
    salt,
    passwordHash: await hashPassword(password, salt),
    createdAt: Date.now(),
    savedPitchIds: [],
    kickabouts: [],
    squads: [],
  }
  users[uname] = user
  saveUsers(users)
  localStorage.setItem(SESSION_KEY, uname)
  return publicProfile(user)
}

export async function login({ username, password }) {
  const uname = String(username || '').trim().toLowerCase()
  const users = loadUsers()
  const user = users[uname]
  if (!user) throw new Error('No account with that username.')
  const hash = await hashPassword(password, user.salt)
  if (hash !== user.passwordHash) throw new Error('Wrong password.')
  localStorage.setItem(SESSION_KEY, uname)
  return publicProfile(user)
}

export function logout() {
  localStorage.removeItem(SESSION_KEY)
}

export function currentUser() {
  const uname = localStorage.getItem(SESSION_KEY)
  if (!uname) return null
  const user = loadUsers()[uname]
  return user ? publicProfile(user) : null
}

/** Merge a partial update into the signed-in user's record. */
export function updateUser(username, patch) {
  const users = loadUsers()
  const user = users[username]
  if (!user) return null
  Object.assign(user, patch)
  saveUsers(users)
  return publicProfile(user)
}
