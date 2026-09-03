// Group-fit ranking. Scores every pitch in the dataset for a specific squad
// and set of preferences, and explains each pick in plain language.

import { estimateEta } from './geo.js'
import { costOf, isBounded } from './data.js'

export const DEFAULT_FILTERS = {
  types: [],             // [] = all pitch types
  enclosure: 'any',      // 'any' | 'bounded' | 'open'
  maxPricePerHead: null,  // £ per person per hour; null = any
  format: null,           // 5 | 7 | 11 | null (only known for curated venues)
  maxEta: null,           // minutes; null = any
  needsFloodlights: false,
  freeOnly: false,
  bookableOnly: false,
}

/**
 * @param pitches dataset array
 * @param squad   [{ id, name, lat, lng, mode }]
 * @param filters DEFAULT_FILTERS shape
 * @returns sorted [{ pitch, etas, avgEta, maxEta, spreadEta, cost, pricePerHead, score, reasons }]
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
    if (filters.bookableOnly && !pitch.bookingUrl) continue
    if (filters.maxPricePerHead != null && cost.known && pricePerHead > filters.maxPricePerHead) continue
    if (filters.format != null && Array.isArray(pitch.formats) && !pitch.formats.includes(filters.format)) continue
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

    // ── Score components, each in [0, 1] ──
    const sAvg = clamp01(1 - avgEta / 60)
    const sWorst = clamp01(1 - maxEta / 75)
    const sFair = clamp01(1 - spreadEta / 45)
    const sPrice = !cost.known ? 0.55 : cost.perHour === 0 ? 1 : clamp01(1 - pricePerHead / 15)
    const sQuality =
      (pitch.lit === true ? 0.3 : 0) +
      (pitch.bookingUrl ? 0.25 : 0) +
      (pitch.surface === '3g' ? 0.2 : pitch.surface === 'astro' ? 0.12 : 0) +
      (pitch.changingRooms ? 0.15 : 0) +
      (pitch.curated ? 0.1 : 0)

    const score = squad.length
      ? 0.3 * sAvg + 0.25 * sWorst + 0.15 * sFair + 0.18 * sPrice + 0.12 * sQuality
      : 0.55 * sPrice + 0.45 * sQuality

    // ── Reasons ──
    const reasons = []
    if (squad.length) {
      if (maxEta <= 25) reasons.push(`everyone within ${maxEta} min`)
      else if (avgEta <= 30) reasons.push(`${avgEta} min average journey`)
      if (etas.length > 1 && spreadEta <= 10) reasons.push('similar journey for everyone')
    }
    if (cost.known && cost.perHour === 0) reasons.push('free to play')
    else if (pricePerHead != null && pricePerHead <= 8) reasons.push(`about £${pricePerHead.toFixed(2)} per person`)
    if (pitch.lit === true) reasons.push('floodlit')
    if (pitch.bookingUrl) reasons.push('bookable online')
    if (pitch.surface === '3g') reasons.push('3G surface')

    out.push({ pitch, etas, avgEta, maxEta, spreadEta, cost, pricePerHead, score, reasons: reasons.slice(0, 4) })
  }

  return out.sort((a, b) => b.score - a.score)
}

function clamp01(x) {
  return Math.max(0, Math.min(1, x))
}

export function scoreToRating(score) {
  return Math.round(clamp01(score) * 100)
}
