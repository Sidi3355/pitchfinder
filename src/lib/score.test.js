// @vitest-environment node
// Every reason the ranking gives must be true of the pitch it is given for.
// These run over the real dataset so a data change cannot make a reason lie.

import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { DEFAULT_FILTERS, rankPitches, buildReasons } from './score.js'
import { costOf } from './data.js'
import { displayMinutes } from './geo.js'
import { isBookable } from './labels.js'

const data = JSON.parse(
  readFileSync(new URL('../../public/data/pitches.json', import.meta.url), 'utf8'),
)
const squad = [
  { id: 'm0', name: 'Sam', lat: 51.4741, lng: -0.0691, mode: 'transit' },
  { id: 'm1', name: 'Ali', lat: 51.545, lng: -0.0553, mode: 'cycle' },
]

function checkReasons(rows) {
  for (const row of rows) {
    const { pitch, cost, reasons } = row
    expect(reasons.length).toBeLessThanOrEqual(4)
    expect(row).not.toHaveProperty('rating')
    for (const r of reasons) {
      const text = r.text
      expect(text).not.toMatch(/fit|score|rating|top.rated/i)
      const within = text.match(/^everyone within about (\d+) min$/)
      if (within) {
        expect(row.maxEta).toBeLessThanOrEqual(25)
        expect(Number(within[1])).toBe(displayMinutes(row.maxEta))
        expect(r.estimate).toBe(true)
      }
      const avg = text.match(/^about (\d+) min on average$/)
      if (avg) {
        expect(row.avgEta).toBeLessThanOrEqual(30)
        expect(Number(avg[1])).toBe(displayMinutes(row.avgEta))
      }
      if (text === 'a similar journey for everyone') expect(row.spreadEta).toBeLessThanOrEqual(10)
      if (text === 'free') expect(cost.known && cost.perHour === 0).toBe(true)
      const each = text.match(/^about £(\d+) each for (\d+)$/)
      if (each) {
        expect(cost.known).toBe(true)
        expect(Number(each[1])).toBe(Math.round(row.pricePerHead))
        expect(row.pricePerHead).toBeLessThanOrEqual(8)
      }
      if (text === 'floodlit') expect(pitch.lit).toBe(true)
      if (text === '3G') expect(pitch.surface).toBe('3g')
      if (text === 'astro') expect(pitch.surface).toBe('astro')
      if (text === 'changing rooms') expect(pitch.changingRooms).toBe(true)
      if (text === 'book online') expect(isBookable(pitch.bookingUrl)).toBe(true)
      const count = text.match(/^(\d+) pitches$/)
      if (count) expect(pitch.pitchCount).toBe(Number(count[1]))
    }
    // Journey reasons never appear without a group; at most one of them.
    const journey = reasons.filter((r) => r.estimate)
    expect(journey.length).toBeLessThanOrEqual(1)
    if (row.etas.length === 0) expect(journey).toHaveLength(0)
  }
}

describe('rankPitches reasons', () => {
  it('are true for every pitch with a group', () => {
    checkReasons(rankPitches(data.pitches, squad))
  })
  it('are true for every pitch without a group', () => {
    checkReasons(rankPitches(data.pitches, []))
  })
  it('never claims a price or facility that is unknown', () => {
    const unknown = { id: 'x', type: 'park', lat: 51.5, lng: -0.1, lit: null, surface: null }
    const [row] = rankPitches([unknown], [])
    expect(row.reasons.map((r) => r.text)).toEqual(['free'].filter(() => costOf(unknown).known))
  })
})

describe('ranking order and filters', () => {
  it('is sorted by score, deterministic on ties', () => {
    const rows = rankPitches(data.pitches, squad)
    for (let i = 1; i < rows.length; i++) {
      expect(rows[i - 1].score >= rows[i].score).toBe(true)
    }
    const again = rankPitches(data.pitches, squad)
    expect(again.map((r) => r.pitch.id).slice(0, 50)).toEqual(
      rows.map((r) => r.pitch.id).slice(0, 50),
    )
  })
  it('prefers a known-lit pitch over an unknown one over a known-unlit one, all else equal', () => {
    const base = { type: 'park', lat: 51.5, lng: -0.1, surface: 'grass' }
    const rows = rankPitches(
      [
        { ...base, id: 'unlit', lit: false },
        { ...base, id: 'unknown', lit: null },
        { ...base, id: 'lit', lit: true },
      ],
      [],
    )
    expect(rows.map((r) => r.pitch.id)).toEqual(['lit', 'unknown', 'unlit'])
  })
  it('applies each filter', () => {
    const all = rankPitches(data.pitches, squad)
    const lit = rankPitches(data.pitches, squad, { ...DEFAULT_FILTERS, needsFloodlights: true })
    expect(lit.every((r) => r.pitch.lit === true)).toBe(true)
    expect(lit.length).toBeLessThan(all.length)
    const free = rankPitches(data.pitches, squad, { ...DEFAULT_FILTERS, freeOnly: true })
    expect(free.every((r) => r.cost.known && r.cost.perHour === 0)).toBe(true)
    const near = rankPitches(data.pitches, squad, { ...DEFAULT_FILTERS, maxEta: 20 })
    expect(near.every((r) => r.maxEta <= 20)).toBe(true)
    const budget = rankPitches(data.pitches, squad, { ...DEFAULT_FILTERS, maxPricePerHead: 5 })
    expect(budget.every((r) => !r.cost.known || r.pricePerHead <= 5)).toBe(true)
    const commercial = rankPitches(data.pitches, squad, {
      ...DEFAULT_FILTERS,
      types: ['commercial'],
    })
    expect(commercial.every((r) => r.pitch.type === 'commercial')).toBe(true)
    const bookable = rankPitches(data.pitches, squad, { ...DEFAULT_FILTERS, bookableOnly: true })
    expect(bookable.every((r) => isBookable(r.pitch.bookingUrl))).toBe(true)
  })
})

describe('cost model', () => {
  it('treats parks and cages as free unless a fee is recorded, and everything else as unknown', () => {
    expect(costOf({ type: 'park' })).toEqual({ known: true, perHour: 0 })
    expect(costOf({ type: 'cage', fee: true })).toEqual({ known: false, perHour: null })
    expect(costOf({ type: 'astro' })).toEqual({ known: false, perHour: null })
    expect(costOf({ type: 'commercial', pricePerHour: 78 })).toEqual({ known: true, perHour: 78 })
  })
  it('buildReasons gives at most one journey reason and labels it an estimate', () => {
    const r = buildReasons({
      pitch: {},
      cost: { known: false },
      pricePerHead: null,
      headCount: 2,
      avgEta: 10,
      maxEta: 12,
      spreadEta: 4,
      etaCount: 2,
    })
    expect(r.filter((x) => x.estimate)).toHaveLength(1)
    expect(r[0].text).toBe('everyone within about 10 min')
  })
})
