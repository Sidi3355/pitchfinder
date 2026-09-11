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
}) {
  const reasons = []
  if (etaCount > 0) {
    if (maxEta <= 25)
      reasons.push({ text: `everyone within about ${displayMinutes(maxEta)} min`, estimate: true })
    else if (etaCount > 1 && spreadEta <= 10)
      reasons.push({ text: 'a similar journey for everyone', estimate: true })
    else if (avgEta <= 30)
      reasons.push({ text: `about ${displayMinutes(avgEta)} min on average`, estimate: true })
  }
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

/**
 * @param pitches dataset array
 * @param squad   [{ id, name, lat, lng, mode }]
 * @param filters DEFAULT_FILTERS shape
 * @returns sorted [{ pitch, etas, avgEta, maxEta, spreadEta, cost, pricePerHead, reasons }]
 */
export function rankPitches(pitches, squad, filters = DEFAULT_FILTERS) {
  const headCount = Math.max(squad.length, 1)
  const out = []

  for (const pitch of pitches) {
    const cost = costOf(pitch)
    const pricePerHead = cost.known ? cost.perHour / headCount : null

    // ── Filters ──
    if (filters.types.length && !filters.types.includes(pitch.type)) continue
    if (filters.enclosure === 'bounded' && !isBounded(pitch)) continue
    if (filters.enclosure === 'open' && isBounded(pitch)) continue
    if (filters.freeOnly && !(cost.known && cost.perHour === 0)) continue
    if (filters.bookableOnly && !isBookable(pitch.bookingUrl)) continue
    if (filters.maxPricePerHead != null && cost.known && pricePerHead > filters.maxPricePerHead)
      continue
    if (
      filters.format != null &&
      Array.isArray(pitch.formats) &&
      !pitch.formats.includes(filters.format)
    )
      continue
    if (filters.needsFloodlights && pitch.lit !== true) continue

    // ── ETAs ──
    const etas = squad.map((f) => ({
      friend: f,
      minutes: estimateEta({ lat: f.lat, lng: f.lng }, pitch, f.mode),
    }))
    const mins = etas.map((e) => e.minutes)
    const avgEta = mins.length ? Math.round(mins.reduce((s, m) => s + m, 0) / mins.length) : 0
    const maxEta = mins.length ? Math.max(...mins) : 0
    const spreadEta = mins.length ? maxEta - Math.min(...mins) : 0
    if (filters.maxEta != null && squad.length && maxEta > filters.maxEta) continue

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
