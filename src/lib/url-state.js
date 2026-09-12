// URL state. The address bar is the single source of truth for the group,
// the filters and the selected pitch, so every screen is shareable and
// reload-safe by construction. Nothing here touches the DOM.
//
// Group encoding (param `g`): members separated by `;`, fields by `~`:
//   name~label~lat~lng~mode   e.g. g=Sam~E8 3DL~51.5475~-0.0553~t;Ali~Peckham~51.4741~-0.0691~c
// Names and labels are percent-encoded so they can contain any character.
// Coordinates keep 4 decimal places (about 10 m), plenty for a home location.

import { DEFAULT_FILTERS } from './score.js'

export const MODE_CODES = { walk: 'w', cycle: 'c', transit: 't', drive: 'd' }
const CODE_MODES = Object.fromEntries(Object.entries(MODE_CODES).map(([k, v]) => [v, k]))
const TYPES = ['commercial', 'astro', 'park', 'cage']
const FORMATS = [5, 7, 11]

// Characters that are safe in a query value and read well in a shared link.
const READABLE = { '%2C': ',', '%3A': ':', '%40': '@', '%2F': '/', '%20': '+' }

function encodeValue(s) {
  let out = encodeURIComponent(String(s ?? ''))
  for (const [enc, ch] of Object.entries(READABLE)) out = out.split(enc).join(ch)
  return out
}

function encodeField(s) {
  // Inside a group member, `~` and `;` are separators, `+` is a space.
  return encodeValue(s).replace(/~/g, '%7E').replace(/;/g, '%3B').replace(/\+/g, '%20')
}

function decodeValue(s) {
  try {
    return decodeURIComponent(String(s).replace(/\+/g, ' '))
  } catch {
    return String(s)
  }
}

function round4(n) {
  return Math.round(n * 1e4) / 1e4
}

function isUkLatLng(lat, lng) {
  return Number.isFinite(lat) && Number.isFinite(lng) && lat > 49 && lat < 61 && lng > -9 && lng < 2
}

export function encodeGroup(members) {
  return members
    .filter((m) => isUkLatLng(Number(m.lat), Number(m.lng)))
    .map((m) =>
      [
        encodeField(m.name || ''),
        encodeField(m.label || ''),
        round4(Number(m.lat)),
        round4(Number(m.lng)),
        MODE_CODES[m.mode] || 't',
      ].join('~'),
    )
    .join(';')
}

export function decodeGroup(value) {
  if (!value) return []
  const out = []
  for (const raw of String(value).split(';')) {
    if (!raw) continue
    const fields = raw.split('~')
    if (fields.length < 5) continue
    const [name, label, latS, lngS, modeCode] = fields
    const lat = Number(latS)
    const lng = Number(lngS)
    if (!isUkLatLng(lat, lng)) continue
    out.push({
      id: `m${out.length}`,
      name: decodeValue(name).slice(0, 40) || `Player ${out.length + 1}`,
      label: decodeValue(label).slice(0, 60),
      lat,
      lng,
      mode: CODE_MODES[modeCode] || 'transit',
    })
  }
  return out
}

function parseRawQuery(search) {
  const params = new Map()
  const q = String(search || '').replace(/^\?/, '')
  if (!q) return params
  for (const part of q.split('&')) {
    if (!part) continue
    const i = part.indexOf('=')
    const key = decodeValue(i < 0 ? part : part.slice(0, i))
    const value = i < 0 ? '' : part.slice(i + 1)
    if (!params.has(key)) params.set(key, value)
  }
  return params
}

function intInRange(value, min, max) {
  if (value == null || value === '') return null
  const n = Number(value)
  if (!Number.isInteger(n) || n < min || n > max) return null
  return n
}

export function decodeFilters(params) {
  const f = { ...DEFAULT_FILTERS }
  const get = (k) => (params.has(k) ? decodeValue(params.get(k)) : null)
  const types = get('t')
  if (types) f.types = [...new Set(types.split(',').filter((t) => TYPES.includes(t)))]
  const enc = get('enc')
  if (enc === 'bounded' || enc === 'open') f.enclosure = enc
  const fmt = intInRange(get('fmt'), 5, 11)
  if (FORMATS.includes(fmt)) f.format = fmt
  const budget = intInRange(get('budget'), 0, 14)
  if (budget != null) f.maxPricePerHead = budget
  const eta = intInRange(get('eta'), 5, 120)
  if (eta != null) f.maxEta = eta
  if (get('lit') === '1') f.needsFloodlights = true
  if (get('free') === '1') f.freeOnly = true
  if (get('book') === '1') f.bookableOnly = true
  return f
}

export function encodeFilters(filters) {
  const f = { ...DEFAULT_FILTERS, ...filters }
  const out = []
  if (f.types?.length) out.push(['t', f.types.filter((t) => TYPES.includes(t)).join(',')])
  if (f.enclosure && f.enclosure !== 'any') out.push(['enc', f.enclosure])
  if (f.format != null) out.push(['fmt', String(f.format)])
  if (f.maxPricePerHead != null) out.push(['budget', String(f.maxPricePerHead)])
  if (f.maxEta != null) out.push(['eta', String(f.maxEta)])
  if (f.needsFloodlights) out.push(['lit', '1'])
  if (f.freeOnly) out.push(['free', '1'])
  if (f.bookableOnly) out.push(['book', '1'])
  return out
}

const SLUG_RE = /^[0-9a-f]{20}$/

/**
 * @returns {{ group: Array, sharedGroup: string|null, filters: object, pitch: string|null }}
 * `sharedGroup` is the link slug of a group whose members live in Supabase;
 * when present it replaces the inline `g=` group.
 */
export function parseSearch(search) {
  const params = parseRawQuery(search)
  const pitchRaw = params.has('p') ? decodeValue(params.get('p')) : ''
  const pitch = /^[a-z0-9-]{1,40}$/i.test(pitchRaw) ? pitchRaw : null
  const grpRaw = params.has('grp') ? decodeValue(params.get('grp')) : ''
  return {
    group: decodeGroup(params.get('g') || ''),
    sharedGroup: SLUG_RE.test(grpRaw) ? grpRaw : null,
    filters: decodeFilters(params),
    pitch,
  }
}

/** Deterministic query string ('' when everything is default). */
export function buildSearch({
  group = [],
  sharedGroup = null,
  filters = DEFAULT_FILTERS,
  pitch = null,
} = {}) {
  const parts = []
  if (sharedGroup && SLUG_RE.test(sharedGroup)) parts.push(`grp=${sharedGroup}`)
  else {
    const g = encodeGroup(group)
    if (g) parts.push(`g=${g}`)
  }
  for (const [k, v] of encodeFilters(filters)) parts.push(`${k}=${encodeValue(v)}`)
  if (pitch) parts.push(`p=${encodeValue(pitch)}`)
  return parts.length ? `?${parts.join('&')}` : ''
}

/** Path plus the query string for the given state. */
export function buildHref(path, state) {
  return `${path}${buildSearch(state)}`
}
