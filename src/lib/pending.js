// What the user was trying to do when sign-in interrupted them, and where
// they were. Kept in localStorage, not sessionStorage, because the emailed
// link opens in a new tab on a phone; finished on return within the hour.

const KEY = 'pf:pending-action'
const RETURN_KEY = 'pf:return-to'
const MAX_AGE_MS = 3600e3

function put(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify({ ...value, at: Date.now() }))
  } catch {}
}

function take(key) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    localStorage.removeItem(key)
    const value = JSON.parse(raw)
    // Older than an hour is stale: the person has moved on.
    if (!value || Date.now() - (value.at || 0) > MAX_AGE_MS) return null
    return value
  } catch {
    return null
  }
}

export function setPending(action) {
  put(KEY, action)
}

export function takePending() {
  return take(KEY)
}

/** The page (path and query) to come back to after sign-in. */
export function setReturnTo(path) {
  put(RETURN_KEY, { to: path })
}

export function takeReturnTo() {
  const v = take(RETURN_KEY)
  return v?.to && v.to.startsWith('/') ? v.to : null
}
