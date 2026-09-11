// Tiny history-based router. One external store over window.location, read
// with useSyncExternalStore, so components re-render when the address changes
// whether by navigate(), a Link click or the back button.

import { useSyncExternalStore } from 'react'

const listeners = new Set()

function snapshot() {
  return window.location.pathname + window.location.search
}

function emit() {
  for (const l of listeners) l()
}

function subscribe(listener) {
  listeners.add(listener)
  window.addEventListener('popstate', listener)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('popstate', listener)
  }
}

/** Navigate to a same-origin path (with optional query). */
export function navigate(to, { replace = false } = {}) {
  const url = new URL(to, window.location.origin)
  const next = url.pathname + url.search
  if (next === snapshot()) return
  window.history[replace ? 'replaceState' : 'pushState'](null, '', next)
  emit()
}

export function useLocation() {
  const href = useSyncExternalStore(subscribe, snapshot, () => '/')
  const i = href.indexOf('?')
  const path = i < 0 ? href : href.slice(0, i)
  const search = i < 0 ? '' : href.slice(i)
  return { path, search, href }
}

/** Route table. Order matters: first match wins. */
const ROUTES = [
  { name: 'find', pattern: /^\/$/ },
  { name: 'pitch', pattern: /^\/p\/([a-z0-9-]{1,40})\/?$/i, params: ['id'] },
  { name: 'game', pattern: /^\/g\/([a-z0-9-]{1,64})\/?$/i, params: ['slug'] },
  { name: 'about', pattern: /^\/about\/?$/ },
  { name: 'profile', pattern: /^\/me\/?$/ },
]

export function matchRoute(path) {
  for (const r of ROUTES) {
    const m = path.match(r.pattern)
    if (m) {
      const params = {}
      ;(r.params || []).forEach((k, i) => (params[k] = decodeURIComponent(m[i + 1])))
      return { name: r.name, params }
    }
  }
  return { name: 'notFound', params: {} }
}
