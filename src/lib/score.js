// The Squad Score™ — ranks every pitch in the directory for a specific
// friend group + preferences, and explains why.

import { PITCHES } from '../data/pitches.js'
import { estimateEta } from './geo.js'

export const DEFAULT_FILTERS = {
  types: [],            // [] = all pitch types
  enclosure: 'any',     // 'any' | 'bounded' | 'unbounded'
  maxPricePerHead: null, // £ per person per hour; null = any price
  format: null,         // 5 | 7 | 11 | null = any
  maxEta: null,         // minutes; null = any
  needsFloodlights: false,
  freeOnly: false,
}

/**
 * Ranks pitches for a squad.
 * @param squad   [{ id, name, lat, lng, mode }]
 * @param filters DEFAULT_FILTERS shape
 * @returns [{ pitch, etas, avgEta, maxEta, spreadEta, pricePerHead, score, reasons }]
 */
export function rankPitches(squad, filters = DEFAULT_FILTERS) {
  const headCount = Math.max(squad.length, 1)

  const rows = PITCHES.map((pitch) => {
    const etas = squad.map((f) => ({
      friend: f,
      minutes: estimateEta({ lat: f.lat, lng: f.lng }, pitch, f.mode),
    }))
    const mins = etas.map((e) => e.minutes)
    const avgEta = mins.length ? Math.round(mins.reduce((s, m) => s + m, 0) / mins.length) : 0
    const maxEta = mins.length ? Math.max(...mins) : 0
    const spreadEta = mins.length ? maxEta - Math.min(...mins) : 0
    const pricePerHead = pitch.pricePerHour / headCount
    return { pitch, etas, avgEta, maxEta, spreadEta, pricePerHead }
  })

  const filtered = rows.filter(({ pitch, maxEta, pricePerHead }) => {
    if (filters.types.length && !filters.types.includes(pitch.type)) return false
    if (filters.enclosure !== 'any' && pitch.enclosure !== filters.enclosure) return false
    if (filters.freeOnly && pitch.pricePerHour > 0) return false
    if (filters.maxPricePerHead != null && pricePerHead > filters.maxPricePerHead) return false
    if (filters.format != null && !pitch.formats.includes(filters.format)) return false
    if (filters.maxEta != null && squad.length && maxEta > filters.maxEta) return false
    if (filters.needsFloodlights && !pitch.floodlit) return false
    return true
  })

  const scored = filtered.map((row) => {
    const { pitch, avgEta, maxEta, spreadEta, pricePerHead } = row

    // Each component in [0, 1]; higher is better.
    const sAvg = clamp01(1 - avgEta / 60)          // everyone close on average
    const sWorst = clamp01(1 - maxEta / 75)        // nobody stranded
    const sFair = clamp01(1 - spreadEta / 45)      // similar journeys = fair
    const sPrice = filters.freeOnly || pitch.pricePerHour === 0
      ? 1
      : clamp01(1 - pricePerHead / 15)             // £/head vs a £15 ceiling
    const sQuality =
      (pitch.floodlit ? 0.35 : 0) +
      (pitch.changingRooms ? 0.25 : 0) +
      (pitch.bookable ? 0.25 : 0) +
      (pitch.surface.toLowerCase().includes('3g') ? 0.15 : 0)

    const squadWeight = row.etas.length ? 1 : 0 // solo browsing: skip ETA terms
    const score =
      squadWeight * (0.30 * sAvg + 0.25 * sWorst + 0.15 * sFair) +
      0.18 * sPrice +
      0.12 * sQuality +
      (squadWeight === 0 ? 0.7 * (0.5 * sPrice + 0.5 * sQuality) : 0)

    const reasons = []
    if (row.etas.length) {
      if (maxEta <= 25) reasons.push(`everyone inside ${maxEta} min`)
      else if (avgEta <= 30) reasons.push(`~${avgEta} min average journey`)
      if (spreadEta <= 10 && row.etas.length > 1) reasons.push('fair for the whole squad')
    }
    if (pitch.pricePerHour === 0) reasons.push('free to play')
    else if (pricePerHead <= 8) reasons.push(`~£${pricePerHead.toFixed(2)}/head`)
    if (pitch.floodlit) reasons.push('floodlit')
    if (pitch.enclosure === 'bounded') reasons.push('ball stays in play')
    if (pitch.surface.toLowerCase().includes('3g')) reasons.push('3G surface')

    return { ...row, score, reasons: reasons.slice(0, 4) }
  })

  return scored.sort((a, b) => b.score - a.score)
}

function clamp01(x) {
  return Math.max(0, Math.min(1, x))
}

/** 0–100 badge for the UI. */
export function scoreToRating(score) {
  return Math.round(clamp01(score) * 100)
}
