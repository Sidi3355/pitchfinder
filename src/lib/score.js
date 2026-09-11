// Group-fit ranking. Orders every pitch for a specific group and set of
// preferences, and explains each pick with plain-language reasons that are
// true by construction (see buildReasons). The internal score is never shown.

import { displayMinutes, estimateEta } from './geo.js'
import { costOf, isBounded } from './data.js'
import { isBookable } from './labels.js'

export const DEFAULT_FILTERS = {
  types: [], // [] = all pitch types
  enclosure: 'any', // 'any' | 'bounded' | 'open'
  maxPricePerHead: null, // £ per person per hour; null = any
  format: null, // 5 | 7 | 11 | null (only known for curated venues)
  maxEta: null, // minutes; null = any
  needsFloodlights: false,
  freeOnly: false,
  bookableOnly: false,
}

/**
 * Reasons a pitch is worth considering, in priority order, each one a fact
 * the card does not already state. Journey reasons are estimates and the
 * card labels them as such. Never a claim about something unknown.
 */
export function buildReasons({
  pitch,
  cost,
  pricePerHead,
  headCount,
  avgEta,
  maxEta,
  spreadEta,
  etaCount,
  routed = false,
}) {
  const reasons = []
  const journey = journeyReason({ avgEta, maxEta, spreadEta, etaCount, routed })
  if (journey) reasons.push(journey)
  if (cost.known && cost.perHour === 0) reasons.push({ text: 'free' })
  else if (cost.known && headCount > 1 && pricePerHead <= 8) {
    reasons.push({ text: `about £${Math.round(pricePerHead)} each for ${headCount}` })
  }
  if (pitch.lit === true) reasons.push({ text: 'floodlit' })
  if (pitch.surface === '3g') reasons.push({ text: '3G' })
  else if (pitch.surface === 'astro') reasons.push({ text: 'astro' })
  if (pitch.changingRooms === true) reasons.push({ text: 'changing rooms' })
  if (isBookable(pitch.bookingUrl)) reasons.push({ text: 'book online' })
  if (pitch.pitchCount > 1) reasons.push({ text: `${pitch.pitchCount} pitches` })
  return reasons.slice(0, 4)
}

/** Average, worst and spread of a set of journey minutes. */
export function journeyStats(mins) {
  const avgEta = mins.length ? Math.round(mins.reduce((s, m) => s + m, 0) / mins.length) : 0
  const maxEta = mins.length ? Math.max(...mins) : 0
  const spreadEta = mins.length ? maxEta - Math.min(...mins) : 0
  return { avgEta, maxEta, spreadEta, etaCount: mins.length }
}

/**
 * The one journey reason, if any. Estimates are rounded to 5 and say "about";
 * routed minutes (OSRM or TfL) are shown as they came back.
 */
export function journeyReason({ avgEta, maxEta, spreadEta, etaCount, routed = false }) {
  if (!etaCount) return null
  const min = (m) => (routed ? `${m} min` : `about ${displayMinutes(m)} min`)
  const estimate = !routed
  if (maxEta <= 25) return { text: `everyone within ${min(maxEta)}`, estimate }
  if (etaCount > 1 && spreadEta <= 10) return { text: 'a similar journey for everyone', estimate }
  if (avgEta <= 30) return { text: `${min(avgEta)} on average`, estimate }
  return null
}

/**
 * @param pitches dataset array
 * @param squad   [{ id, name, lat, lng, mode }]
 * @param filters DEFAULT_FILTERS shape
 * @returns sorted [{ pitch, etas, avgEta, maxEta, spreadEta, cost, pricePerHead, reasons }]
 */
/** The filter half of the ranking: does this pitch pass for this group? */
export function passesFilters(pitch, squad, filters, headCount = Math.max(squad.length, 1)) {
  const cost = costOf(pitch)
  const pricePerHead = cost.known ? cost.perHour / headCount : null
  if (filters.types.length && !filters.types.includes(pitch.type)) return false
  if (filters.enclosure === 'bounded' && !isBounded(pitch)) return false
  if (filters.enclosure === 'open' && isBounded(pitch)) return false
  if (filters.freeOnly && !(cost.known && cost.perHour === 0)) return false
  if (filters.bookableOnly && !isBookable(pitch.bookingUrl)) return false
  if (filters.maxPricePerHead != null && cost.known && pricePerHead > filters.maxPricePerHead)
    return false
  if (
    filters.format != null &&
    Array.isArray(pitch.formats) &&
    !pitch.formats.includes(filters.format)
  )
    return false
  if (filters.needsFloodlights && pitch.lit !== true) return false
  if (filters.maxEta != null && squad.length) {
    for (const f of squad) {
      if (estimateEta({ lat: f.lat, lng: f.lng }, pitch, f.mode) > filters.maxEta) return false
    }
  }
  return true
}

/**
 * How many pitches each filter option would leave, with every other filter
 * as it is. Multi-select types count each type on its own.
 */
export function filterCounts(pitches, squad, filters = DEFAULT_FILTERS) {
  const count = (patch) => {
    const f = { ...filters, ...patch }
    let n = 0
    for (const p of pitches) if (passesFilters(p, squad, f)) n++
    return n
  }
  const types = {}
  for (const p of pitches) types[p.type] = 0
  for (const t of Object.keys(types)) types[t] = count({ types: [t] })
  return {
    types,
    enclosure: {
      any: count({ enclosure: 'any' }),
      bounded: count({ enclosure: 'bounded' }),
      open: count({ enclosure: 'open' }),
    },
    format: {
      any: count({ format: null }),
      5: count({ format: 5 }),
      7: count({ format: 7 }),
      11: count({ format: 11 }),
    },
    needsFloodlights: count({ needsFloodlights: true }),
    freeOnly: count({ freeOnly: true }),
    bookableOnly: count({ bookableOnly: true }),
  }
}

export function rankPitches(pitches, squad, filters = DEFAULT_FILTERS) {
  const headCount = Math.max(squad.length, 1)
  const out = []

  for (const pitch of pitches) {
    if (!passesFilters(pitch, squad, filters, headCount)) continue
    const cost = costOf(pitch)
    const pricePerHead = cost.known ? cost.perHour / headCount : null

    // ── ETAs ──
    const etas = squad.map((f) => ({
      friend: f,
      minutes: estimateEta({ lat: f.lat, lng: f.lng }, pitch, f.mode),
    }))
    const { avgEta, maxEta, spreadEta } = journeyStats(etas.map((e) => e.minutes))

    // ── Score components, each in [0, 1]; ordering only, never shown ──
    const sAvg = clamp01(1 - avgEta / 60)
    const sWorst = clamp01(1 - maxEta / 75)
    const sFair = clamp01(1 - spreadEta / 45)
    const sPrice = !cost.known ? 0.55 : cost.perHour === 0 ? 1 : clamp01(1 - pricePerHead / 15)
    // Known facts beat unknown ones: a pitch we know is lit outranks one we
    // know nothing about, which outranks one we know is unlit.
    const sQuality =
      (pitch.lit === true ? 0.3 : pitch.lit === null || pitch.lit === undefined ? 0.08 : 0) +
      (isBookable(pitch.bookingUrl) ? 0.25 : 0) +
      (pitch.surface === '3g' ? 0.2 : pitch.surface === 'astro' ? 0.12 : pitch.surface ? 0.04 : 0) +
      (pitch.changingRooms ? 0.15 : 0) +
      (pitch.curated ? 0.1 : 0)

    const score = squad.length
      ? 0.3 * sAvg + 0.25 * sWorst + 0.15 * sFair + 0.18 * sPrice + 0.12 * sQuality
      : 0.55 * sPrice + 0.45 * sQuality

    const reasons = buildReasons({
      pitch,
      cost,
      pricePerHead,
      headCount,
      avgEta,
      maxEta,
      spreadEta,
      etaCount: etas.length,
    })
    out.push({ pitch, etas, avgEta, maxEta, spreadEta, cost, pricePerHead, score, reasons })
  }

  return out.sort((a, b) => b.score - a.score || a.pitch.id.localeCompare(b.pitch.id))
}

function clamp01(x) {
  return Math.max(0, Math.min(1, x))
}
