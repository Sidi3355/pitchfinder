// What the user was trying to do when sign-in interrupted them. Kept in
// sessionStorage across the magic-link round trip and finished on return.

const KEY = 'pf:pending-action'

export function setPending(action) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ ...action, at: Date.now() }))
  } catch {}
}

export function takePending() {
  try {
    const raw = sessionStorage.getItem(KEY)
    if (!raw) return null
    sessionStorage.removeItem(KEY)
    const action = JSON.parse(raw)
    // Older than an hour is stale: the person has moved on.
    if (!action || Date.now() - (action.at || 0) > 3600e3) return null
    return action
  } catch {
    return null
  }
}
