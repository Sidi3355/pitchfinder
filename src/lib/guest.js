// Guest identity for RSVPs without an account: a display name and a random
// key kept in this browser so the guest can change their answer later.
// Exposed as an external store so components read it without impure calls
// during render.

import { useSyncExternalStore } from 'react'

const STORAGE_KEY = 'pf:guest'
const listeners = new Set()
let cached = null
const EMPTY = { name: '', key: '' }

function read() {
  if (cached) return cached
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
    if (saved?.key && String(saved.key).length >= 16) {
      cached = { name: String(saved.name || ''), key: String(saved.key) }
      return cached
    }
  } catch {}
  const key =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`
  cached = { name: '', key }
  return cached
}

export function getGuest() {
  return read()
}

export function setGuest(next) {
  cached = { name: String(next.name || '').slice(0, 40), key: read().key }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cached))
  } catch {}
  for (const l of listeners) l()
}

function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useGuest() {
  return useSyncExternalStore(subscribe, getGuest, () => EMPTY)
}
