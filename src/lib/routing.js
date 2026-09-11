// Real journey times where a keyless router is available, with the
// straight-line estimate as the labelled fallback.
//
// - walk, cycle, drive: the OSRM demo server's table service, one request
//   per (person, mode) for the visible pitches. Public demo, no key, polite
//   use only: small batches, cached, never on every keystroke.
// - public transport: TfL Journey Planner when VITE_TFL_APP_KEY is present,
//   one request per (person, pitch); otherwise the estimate.
// Every result says its mode and source so the UI can label it.

import { estimateEta } from './geo.js'

const OSRM = 'https://router.project-osrm.org'
const PROFILES = { walk: 'foot', cycle: 'bike', drive: 'car' }
const TFL_KEY = import.meta.env?.VITE_TFL_APP_KEY || ''
const CACHE_KEY = 'pf:routes'
const MAX_CACHE = 600

let mem = null

/** Forget in-memory routes (tests, and after the user signs out). */
export function resetRouteCache() {
  mem = null
}

function loadCache() {
  if (mem) return mem
  try {
    mem = new Map(Object.entries(JSON.parse(localStorage.getItem(CACHE_KEY) || '{}')))
  } catch {
    mem = new Map()
  }
  return mem
}

function saveCache() {
  try {
    const entries = [...mem.entries()].slice(-MAX_CACHE)
    localStorage.setItem(CACHE_KEY, JSON.stringify(Object.fromEntries(entries)))
  } catch {}
}

const r4 = (n) => Math.round(n * 1e4) / 1e4
const keyFor = (from, to, mode) =>
  `${mode}:${r4(from.lat)},${r4(from.lng)}>${r4(to.lat)},${r4(to.lng)}`

/** What the app can do right now, for labels and tests. */
export function routingAvailability() {
  return { walk: 'osrm', cycle: 'osrm', drive: 'osrm', transit: TFL_KEY ? 'tfl' : 'estimate' }
}

/**
 * Journey minutes from one person to many pitches for one mode.
 * @returns Map<pitchId, { minutes, source: 'osrm'|'tfl'|'estimate', mode, distanceM? }>
 */
export async function journeyTimes(
  from,
  pitches,
  mode,
  { fetchImpl = globalThis.fetch, signal } = {},
) {
  const cache = loadCache()
  const out = new Map()
  const todo = []
  for (const p of pitches) {
    const k = keyFor(from, p, mode)
    if (cache.has(k)) out.set(p.id, cache.get(k))
    else todo.push(p)
  }
  if (todo.length) {
    let fetched = new Map()
    try {
      if (PROFILES[mode]) fetched = await osrmTable(from, todo, mode, fetchImpl, signal)
      else if (mode === 'transit' && TFL_KEY)
        fetched = await tflJourneys(from, todo, fetchImpl, signal)
    } catch (err) {
      if (err?.name === 'AbortError') throw err
      fetched = new Map()
    }
    for (const p of todo) {
      const hit = fetched.get(p.id)
      const value = hit || { minutes: estimateEta(from, p, mode), source: 'estimate', mode }
      out.set(p.id, value)
      if (hit) cache.set(keyFor(from, p, mode), hit)
    }
    if (fetched.size) saveCache()
  }
  return out
}

async function osrmTable(from, pitches, mode, fetchImpl, signal) {
  const coords = [from, ...pitches].map((p) => `${p.lng},${p.lat}`).join(';')
  const destinations = pitches.map((_, i) => i + 1).join(';')
  const url = `${OSRM}/table/v1/${PROFILES[mode]}/${coords}?sources=0&destinations=${destinations}&annotations=duration,distance`
  const res = await fetchImpl(url, { signal, headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error(`OSRM HTTP ${res.status}`)
  const json = await res.json()
  if (json.code !== 'Ok' || !json.durations?.[0])
    throw new Error(`OSRM ${json.code || 'no result'}`)
  const out = new Map()
  json.durations[0].forEach((seconds, i) => {
    if (seconds == null) return
    // OSRM's foot and bike profiles are optimistic about speed; door to door adds
    // a little for lights, crossings and finding the gate.
    const overhead = mode === 'walk' ? 2 : mode === 'cycle' ? 4 : 6
    out.set(pitches[i].id, {
      minutes: Math.max(1, Math.round(seconds / 60) + overhead),
      source: 'osrm',
      mode,
      distanceM: json.distances?.[0]?.[i] != null ? Math.round(json.distances[0][i]) : undefined,
    })
  })
  return out
}

async function tflJourneys(from, pitches, fetchImpl, signal) {
  const out = new Map()
  // One request per pitch; the caller keeps the batch small (visible cards).
  for (const p of pitches.slice(0, 10)) {
    const url = `https://api.tfl.gov.uk/Journey/JourneyResults/${from.lat},${from.lng}/to/${p.lat},${p.lng}?app_key=${encodeURIComponent(TFL_KEY)}&mode=tube,bus,overground,dlr,elizabeth-line,national-rail,walking&timeIs=Departing`
    const res = await fetchImpl(url, { signal })
    if (!res.ok) continue
    const json = await res.json()
    const best = (json.journeys || [])
      .map((j) => j.duration)
      .filter((d) => Number.isFinite(d))
      .sort((a, b) => a - b)[0]
    if (best != null) out.set(p.id, { minutes: best, source: 'tfl', mode: 'transit' })
  }
  return out
}

export const SOURCE_LABELS = {
  osrm: 'OSRM route',
  tfl: 'TfL Journey Planner',
  estimate: 'estimate',
}
