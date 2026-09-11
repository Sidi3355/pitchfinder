// Reverse geocoding for the pipeline, with a committed file cache so weekly
// runs only ask about new places.
//
// - postcodes.io: bulk reverse (100 points per request, no key) for the
//   nearest postcode, borough and ward.
// - Nominatim: reverse at street zoom for the road name, at most one request
//   per second and a per-run cap, with a User-Agent that identifies the bot.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'

export const UA = 'PitchFinderBot/1.0 (+https://github.com/Sidi3355/pitchfinder; data refresh)'
const sleepDefault = (ms) => new Promise((r) => setTimeout(r, ms))

export function keyFor(lat, lng) {
  return `${Number(lat).toFixed(4)},${Number(lng).toFixed(4)}`
}

export function loadCache(file) {
  try {
    return existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : {}
  } catch {
    return {}
  }
}

export function saveCache(file, cache) {
  mkdirSync(dirname(file), { recursive: true })
  const sorted = Object.fromEntries(
    Object.keys(cache)
      .sort()
      .map((k) => [k, cache[k]]),
  )
  writeFileSync(file, JSON.stringify(sorted, null, 1))
}

/**
 * Nearest postcode for each point. Returns the cache (key -> entry).
 * Entry: { postcode, district, ward, at } or { postcode: null, at } when
 * nothing is within `radius` metres.
 */
export async function reversePostcodes(
  points,
  {
    cache = {},
    fetchImpl = globalThis.fetch,
    log = () => {},
    sleep = sleepDefault,
    radius = 800,
    batch = 100,
  } = {},
) {
  const todo = []
  const seen = new Set()
  for (const p of points) {
    const k = keyFor(p.lat, p.lng)
    if (seen.has(k)) continue
    const hit = cache[k]
    // A miss is only final for the radius it was tried at; a wider search retries it.
    if (hit && (hit.postcode || (hit.radius ?? 800) >= radius)) continue
    seen.add(k)
    todo.push({ key: k, lat: p.lat, lng: p.lng })
  }
  log(`postcodes.io: ${todo.length} points to look up (${points.length - todo.length} cached)`)
  for (let i = 0; i < todo.length; i += batch) {
    const slice = todo.slice(i, i + batch)
    const res = await fetchImpl('https://api.postcodes.io/postcodes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'User-Agent': UA },
      body: JSON.stringify({
        geolocations: slice.map((p) => ({ longitude: p.lng, latitude: p.lat, limit: 1, radius })),
      }),
    })
    if (!res.ok) throw new Error(`postcodes.io HTTP ${res.status}`)
    const json = await res.json()
    const results = json.result || []
    slice.forEach((p, j) => {
      const hit = results[j]?.result?.[0]
      cache[p.key] = hit
        ? {
            postcode: hit.postcode,
            district: hit.admin_district || null,
            ward: hit.admin_ward || null,
            distanceM: hit.distance != null ? Math.round(hit.distance) : null,
            at: new Date().toISOString().slice(0, 10),
          }
        : { postcode: null, radius, at: new Date().toISOString().slice(0, 10) }
    })
    if (i + batch < todo.length) await sleep(250)
  }
  return cache
}

/** Postcode lookup (forward): returns { lat, lng, district } or null. */
export async function lookupPostcode(postcode, { fetchImpl = globalThis.fetch } = {}) {
  const res = await fetchImpl(
    `https://api.postcodes.io/postcodes/${encodeURIComponent(postcode.trim())}`,
    {
      headers: { 'User-Agent': UA },
    },
  )
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`postcodes.io HTTP ${res.status}`)
  const { result } = await res.json()
  return result
    ? { lat: result.latitude, lng: result.longitude, district: result.admin_district }
    : null
}

/**
 * Road (and suburb) at each point from Nominatim, one request per second,
 * at most `max` new requests per run. Returns the cache (key -> entry).
 */
export async function reverseRoads(
  points,
  {
    cache = {},
    fetchImpl = globalThis.fetch,
    log = () => {},
    sleep = sleepDefault,
    max = 1000,
    email = 'pitchfinder@users.noreply.github.com',
  } = {},
) {
  const todo = []
  const seen = new Set()
  for (const p of points) {
    const k = keyFor(p.lat, p.lng)
    if (cache[k] || seen.has(k)) continue
    seen.add(k)
    todo.push({ key: k, lat: p.lat, lng: p.lng })
  }
  const run = todo.slice(0, max)
  log(
    `nominatim: ${run.length} of ${todo.length} points this run (${points.length - todo.length} cached)`,
  )
  for (let i = 0; i < run.length; i++) {
    const p = run[i]
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${p.lat}&lon=${p.lng}&zoom=17&email=${encodeURIComponent(email)}`
    try {
      const res = await fetchImpl(url, {
        headers: { 'User-Agent': UA, Accept: 'application/json' },
      })
      if (res.status === 429 || res.status === 503) {
        log(`nominatim: HTTP ${res.status}, stopping this run`)
        break
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      const a = json.address || {}
      cache[p.key] = {
        road: a.road || a.pedestrian || a.footway || a.path || null,
        suburb: a.suburb || a.neighbourhood || a.quarter || null,
        at: new Date().toISOString().slice(0, 10),
      }
    } catch (err) {
      log(`nominatim: ${p.key} failed (${err.message})`)
      cache[p.key] = {
        road: null,
        suburb: null,
        at: new Date().toISOString().slice(0, 10),
        error: true,
      }
    }
    if (i < run.length - 1) await sleep(1100)
  }
  return cache
}
