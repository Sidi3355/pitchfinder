// Resolving "where is this person coming from" in the browser:
//   - a full UK postcode or an outward code (E8, SW1A): postcodes.io, no key
//   - a place name: Nominatim, bounded to Greater London, only on an explicit
//     search (their usage policy forbids autocomplete)
//   - the gazetteer (src/data/areas.js): instant suggestions and the offline fallback
// Every result says where it came from.

export const POSTCODE_RE = /^([A-Z]{1,2}\d[A-Z\d]?)\s*(\d[A-Z]{2})$/i
export const OUTCODE_RE = /^[A-Z]{1,2}\d[A-Z\d]?$/i
export const PARTIAL_POSTCODE_RE = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d?[A-Z]{0,2}$/i

const LONDON_VIEWBOX = '-0.53,51.71,0.36,51.26' // left, top, right, bottom
const UA_NOTE = 'PitchFinder (https://pitchfinder-pied.vercel.app)'

export function normalisePostcode(q) {
  const m = String(q).trim().toUpperCase().match(POSTCODE_RE)
  return m ? `${m[1]} ${m[2]}` : null
}

export function isPostcode(q) {
  return POSTCODE_RE.test(String(q).trim())
}

export function isOutcode(q) {
  return OUTCODE_RE.test(String(q).trim())
}

export function looksLikePostcode(q) {
  return PARTIAL_POSTCODE_RE.test(String(q).trim()) && /\d/.test(q)
}

/** Gazetteer suggestions: names starting with the query first, then word starts, then contains. */
export function searchGazetteer(q, areas, limit = 6) {
  const needle = String(q).trim().toLowerCase()
  if (!needle) return []
  const starts = []
  const words = []
  const contains = []
  for (const a of areas) {
    const name = a.name.toLowerCase()
    if (name.startsWith(needle)) starts.push(a)
    else if (name.split(/[\s&]+/).some((w) => w.startsWith(needle))) words.push(a)
    else if (name.includes(needle)) contains.push(a)
  }
  return [...starts, ...words, ...contains]
    .slice(0, limit)
    .map((a) => ({ label: a.name, lat: a.lat, lng: a.lng, source: 'gazetteer' }))
}

export async function geocodePostcode(q, { fetchImpl = globalThis.fetch, signal } = {}) {
  const pc = normalisePostcode(q)
  if (!pc) return null
  const res = await fetchImpl(`https://api.postcodes.io/postcodes/${encodeURIComponent(pc)}`, {
    signal,
  })
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`postcodes.io HTTP ${res.status}`)
  const { result } = await res.json()
  if (!result) return null
  return {
    label: result.postcode,
    sub: [result.admin_ward, result.admin_district].filter(Boolean).join(', '),
    lat: result.latitude,
    lng: result.longitude,
    source: 'postcodes.io',
  }
}

export async function geocodeOutcode(q, { fetchImpl = globalThis.fetch, signal } = {}) {
  const oc = String(q).trim().toUpperCase()
  if (!OUTCODE_RE.test(oc)) return null
  const res = await fetchImpl(`https://api.postcodes.io/outcodes/${encodeURIComponent(oc)}`, {
    signal,
  })
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`postcodes.io HTTP ${res.status}`)
  const { result } = await res.json()
  if (!result || result.latitude == null) return null
  return {
    label: result.outcode,
    sub: (result.admin_district || []).slice(0, 2).join(', ') || 'postcode area',
    lat: result.latitude,
    lng: result.longitude,
    source: 'postcodes.io',
  }
}

/** Postcode autocomplete for a partial postcode: returns up to 6 candidates (strings). */
export async function suggestPostcodes(q, { fetchImpl = globalThis.fetch, signal } = {}) {
  const partial = String(q).trim().toUpperCase()
  if (partial.length < 2) return []
  const res = await fetchImpl(
    `https://api.postcodes.io/postcodes/${encodeURIComponent(partial)}/autocomplete?limit=6`,
    { signal },
  )
  if (!res.ok) return []
  const { result } = await res.json()
  return Array.isArray(result) ? result : []
}

function shortLabel(displayName) {
  const parts = String(displayName)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  const head = parts[0] || ''
  // "Peckham, London Borough of Southwark, London, ..." -> "Peckham, Southwark"
  const second = parts
    .slice(1)
    .find((p) => p !== head && !/^(Greater London|London|England|United Kingdom)$/i.test(p))
  return second ? `${head}, ${second.replace(/^London Borough of /i, '')}` : head
}

export async function geocodePlace(q, { fetchImpl = globalThis.fetch, signal, limit = 5 } = {}) {
  const query = String(q).trim()
  if (query.length < 2) return []
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=${limit}&countrycodes=gb&bounded=1&viewbox=${LONDON_VIEWBOX}&q=${encodeURIComponent(query)}`
  const res = await fetchImpl(url, {
    signal,
    headers: { Accept: 'application/json', 'Accept-Language': 'en-GB' },
  })
  if (!res.ok) throw new Error(`Nominatim HTTP ${res.status}`)
  const rows = await res.json()
  return rows
    .filter((r) => r.lat && r.lon)
    .map((r) => ({
      label: shortLabel(r.display_name),
      sub: r.type ? r.type.replace(/_/g, ' ') : '',
      lat: Number(r.lat),
      lng: Number(r.lon),
      source: 'nominatim',
    }))
}

/**
 * Explicit search. Postcodes and outcodes go to postcodes.io; anything else
 * tries Nominatim and falls back to the gazetteer when the network fails.
 * @returns {{ results: Array, source: string, offline?: boolean }}
 */
export async function resolveLocation(
  q,
  { areas = [], fetchImpl = globalThis.fetch, signal } = {},
) {
  const query = String(q).trim()
  if (!query) return { results: [], source: 'none' }
  const gazetteer = searchGazetteer(query, areas)
  try {
    if (isPostcode(query)) {
      const hit = await geocodePostcode(query, { fetchImpl, signal })
      return { results: hit ? [hit] : [], source: 'postcodes.io' }
    }
    if (isOutcode(query)) {
      const hit = await geocodeOutcode(query, { fetchImpl, signal })
      return {
        results: hit ? [hit, ...gazetteer] : gazetteer,
        source: hit ? 'postcodes.io' : 'gazetteer',
      }
    }
    const places = await geocodePlace(query, { fetchImpl, signal })
    const seen = new Set()
    const merged = [...gazetteer, ...places].filter((r) => {
      // The gazetteer's "Peckham" and Nominatim's "Peckham, Southwark" are one place.
      const k = r.label.split(',')[0].trim().toLowerCase()
      if (seen.has(k)) return false
      seen.add(k)
      return true
    })
    return { results: merged, source: places.length ? 'nominatim' : 'gazetteer' }
  } catch (err) {
    if (err?.name === 'AbortError') throw err
    return { results: gazetteer, source: 'gazetteer', offline: true }
  }
}

export const GEOCODER_NOTE = `${UA_NOTE}. Place search © OpenStreetMap contributors (Nominatim); postcodes via postcodes.io.`
