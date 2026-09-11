// The last few places people were added from, kept in this browser.

const KEY = 'pf:recent-locations'
const MAX = 6

export function listRecent() {
  try {
    const list = JSON.parse(localStorage.getItem(KEY) || '[]')
    return Array.isArray(list) ? list.filter((r) => r && r.label && Number.isFinite(r.lat)) : []
  } catch {
    return []
  }
}

export function rememberLocation(loc) {
  try {
    const rest = listRecent().filter((r) => r.label.toLowerCase() !== loc.label.toLowerCase())
    const next = [
      { label: loc.label, sub: loc.sub || '', lat: loc.lat, lng: loc.lng, source: loc.source },
      ...rest,
    ].slice(0, MAX)
    localStorage.setItem(KEY, JSON.stringify(next))
    return next
  } catch {
    return []
  }
}
