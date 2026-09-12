// What an operator's club page says, as facts with the words that back them:
// opening hours, prices with what they are for, facilities, address. Every
// figure keeps the sentence it came from so it can be checked, and nothing is
// inferred from silence: an absent fact stays null.

import { PER_HOUR_RE, PER_SESSION_RE } from './prices.mjs'
import { parseHoursText, parseSchemaHours } from '../../src/lib/hours.js'

export const POSTCODE_RE = /\b([A-Z]{1,2}\d[A-Z\d]?)\s*(\d[A-Z]{2})\b/

export function extractPostcode(text) {
  const m = String(text).match(POSTCODE_RE)
  return m ? `${m[1]} ${m[2]}` : null
}

const PLAYER_RE =
  /\bper\s*(?:person|player|head)\b|\bpp\b|\beach\s+(?:person|player)\b|\ba\s+(?:person|player|head)\b/i
const NOT_A_PRICE_RE =
  /membership|deposit|voucher|gift|per\s*(?:month|week|season|team|year)\b|a\s*(?:month|week|season|year)\b|monthly|weekly|annual/i

const FORMAT_RE =
  /\b(5|6|7|8|9|11)\s*-?\s*a\s*-?\s*side\b|\b(5|6|7|8|9|11)s\b|\b(five|six|seven|eleven)\s*-?\s*a\s*-?\s*side/gi
const WORD_NUM = { five: 5, six: 6, seven: 7, eleven: 11 }

export function extractFormats(text) {
  const out = new Set()
  for (const m of String(text).matchAll(FORMAT_RE)) {
    const n = Number(m[1] || m[2]) || WORD_NUM[(m[3] || '').toLowerCase()]
    if (n) out.add(n)
  }
  return [...out].sort((a, b) => a - b)
}

export function extractPitchCount(text) {
  const m = String(text).match(
    /\b(\d{1,2})\s+(?:(?:floodlit|3g|4g|astro|outdoor|indoor|all-weather|new|brand new)\s+){0,3}pitches\b/i,
  )
  return m ? Number(m[1]) : null
}

/** Facilities the page states. Absence is null, never false. */
export function extractFacilities(text) {
  const t = String(text).toLowerCase()
  const has = (re) => (re.test(t) ? true : null)
  return {
    parking: has(/\b(free\s+)?(car\s+)?parking\b/),
    changingRooms: has(/changing\s+rooms?/),
    showers: has(/\bshowers?\b/),
    bar: has(/\b(licensed\s+)?bar\b|\bclubhouse\b/),
    cafe: has(/\bcaf[eé]\b|\bcoffee\b/),
    covered: has(/\b(covered|indoor|roofed|under\s+cover)\b/),
    lit: has(/\bfloodli(t|ghts?|ghting)\b/),
    surface: /\b[34]g\b/.test(t) ? '3g' : /\bastro/.test(t) ? 'astro' : null,
    formats: extractFormats(t),
    pitchCount: extractPitchCount(t),
  }
}

const LABEL_RULES = [
  [/off[-\s]?peak/i, 'off-peak'],
  [/\bpeak\b/i, 'peak'],
  [/weekend|saturday|sunday/i, 'weekend'],
  [/weekday|monday|tuesday|wednesday|thursday|friday/i, 'weekday'],
  [/daytime|before 5|before 6|morning|afternoon/i, 'daytime'],
  [/evening|after 5|after 6|night/i, 'evening'],
]

function qualifier(words) {
  for (const [re, label] of LABEL_RULES) if (re.test(words)) return label
  return null
}

/**
 * A short label for what a price is for: the words after the figure decide,
 * then the words before it (up to the previous figure or sentence).
 */
export function labelPrice(after, unit, before = '') {
  const parts = []
  const formats = extractFormats(after).length ? extractFormats(after) : extractFormats(before)
  if (formats.length === 1) parts.push(`${formats[0]}-a-side`)
  const q = qualifier(after) || qualifier(before)
  if (q) parts.push(q)
  if (unit === 'person') parts.push('per player')
  else if (unit === 'session') parts.push('per session')
  else parts.push('per hour')
  return parts.join(', ')
}

/**
 * Every stated price with its unit and a label. Only the words touching the
 * figure decide what it is for; memberships, deposits and monthly fees are
 * not prices for a game. Nothing is guessed.
 */
export function extractPriceLines(text) {
  const t = String(text).replace(/\s+/g, ' ')
  const lines = []
  for (const m of t.matchAll(/£\s?(\d{1,3}(?:\.\d{2})?)\b/g)) {
    const amount = Number(m[1])
    const start = m.index
    const end = start + m[0].length
    const afterAll = t.slice(end, end + 60)
    const nextPound = afterAll.indexOf('£')
    const after = nextPound >= 0 ? afterAll.slice(0, nextPound) : afterAll
    const beforeAll = t.slice(Math.max(0, start - 60), start)
    const prevPound = beforeAll.lastIndexOf('£')
    let before = prevPound >= 0 ? beforeAll.slice(prevPound + 1) : beforeAll
    const boundary = Math.max(
      before.lastIndexOf('. '),
      before.lastIndexOf('; '),
      before.lastIndexOf(': '),
    )
    if (boundary >= 0) before = before.slice(boundary + 2)
    const unitAfter = after.slice(0, 22)
    const unitBefore = before.slice(-25)
    if (NOT_A_PRICE_RE.test(unitAfter) || NOT_A_PRICE_RE.test(unitBefore)) continue
    let unit = null
    if (PLAYER_RE.test(unitAfter) || PLAYER_RE.test(unitBefore)) unit = 'person'
    else if (PER_HOUR_RE.test(unitAfter) || PER_HOUR_RE.test(unitBefore)) unit = 'hour'
    else if (PER_SESSION_RE.test(unitAfter) || PER_SESSION_RE.test(unitBefore)) unit = 'session'
    if (!unit) continue
    if (unit === 'person' ? !(amount >= 2 && amount <= 60) : !(amount >= 10 && amount <= 250))
      continue
    lines.push({
      amount,
      unit,
      label: labelPrice(after, unit, before),
      context: t.slice(Math.max(0, start - 60), Math.min(t.length, end + 60)).trim(),
    })
  }
  const seen = new Set()
  return lines.filter((l) => {
    const k = `${l.amount}|${l.unit}|${l.label}`
    if (seen.has(k)) return false
    seen.add(k)
    return true
  })
}

/** Lowest per-hour price, else null (per-player and per-session do not count as pitch hire). */
export function priceFrom(lines) {
  const hourly = lines.filter((l) => l.unit === 'hour').map((l) => l.amount)
  return hourly.length ? Math.min(...hourly) : null
}

/** schema.org blocks -> { name, address, postcode, lat, lng, hours } (only what is present). */
export function factsFromJsonLd(blocks) {
  const out = {}
  const items = []
  const walk = (node) => {
    if (!node || typeof node !== 'object') return
    if (Array.isArray(node)) return node.forEach(walk)
    if (node['@type']) items.push(node)
    if (node['@graph']) walk(node['@graph'])
  }
  walk(blocks)
  for (const item of items) {
    const type = String(item['@type']).toLowerCase()
    if (!/business|organization|place|sports|stadium|venue/.test(type)) continue
    if (item.name && !out.name) out.name = String(item.name)
    const addr = item.address
    if (addr && typeof addr === 'object') {
      const parts = [addr.streetAddress, addr.addressLocality, addr.postalCode].filter(Boolean)
      if (parts.length && !out.address) out.address = parts.join(', ')
      if (addr.postalCode && !out.postcode) out.postcode = String(addr.postalCode).toUpperCase()
    } else if (typeof addr === 'string' && !out.address) out.address = addr
    const geo = item.geo
    if (geo && Number(geo.latitude) && Number(geo.longitude) && out.lat == null) {
      out.lat = Number(geo.latitude)
      out.lng = Number(geo.longitude)
    }
    const hours = parseSchemaHours(item.openingHoursSpecification || item.openingHours)
    if (hours && !out.hours) out.hours = hours
    if (item.telephone && !out.phone) out.phone = String(item.telephone)
  }
  return out
}

/**
 * Everything the page supports, from its visible text and its schema.org
 * data. hoursSource says which one gave the hours.
 */
export function extractVenueFacts({ text, jsonld = [] }) {
  const ld = factsFromJsonLd(jsonld)
  const fromText = parseHoursText(text)
  const facilities = extractFacilities(text)
  const prices = extractPriceLines(text)
  return {
    name: ld.name || null,
    address: ld.address || null,
    postcode: ld.postcode || extractPostcode(text),
    lat: ld.lat ?? null,
    lng: ld.lng ?? null,
    phone: ld.phone || null,
    openingHours: ld.hours || fromText?.week || null,
    hoursSource: ld.hours ? 'schema' : fromText ? 'text' : null,
    hoursQuotes: fromText?.quotes || [],
    prices,
    priceFrom: priceFrom(prices),
    ...facilities,
  }
}
