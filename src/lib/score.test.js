// @vitest-environment node
// Every reason the ranking gives must be true of the pitch it is given for.
// These run over the real dataset so a data change cannot make a reason lie.

import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import {
  DEFAULT_FILTERS,
  rankPitches,
  buildReasons,
  filterCounts,
  journeyReason,
  journeyStats,
  openMatches,
} from './score.js'
import { brandOf } from '../data/types.js'
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
    // Journey minutes live on the card's own line, never in the reasons.
    expect(reasons.some((r) => r.estimate || /min\b/.test(r.text))).toBe(false)
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
    const priced = rankPitches(data.pitches, squad, { ...DEFAULT_FILTERS, pricedOnly: true })
    expect(priced.every((r) => r.cost.known)).toBe(true)
    expect(priced.length).toBeLessThan(all.length)
    const near = rankPitches(data.pitches, squad, { ...DEFAULT_FILTERS, maxEta: 20 })
    expect(near.every((r) => r.maxEta <= 20)).toBe(true)
    const budget = rankPitches(data.pitches, squad, { ...DEFAULT_FILTERS, maxPricePerHead: 5 })
    expect(budget.every((r) => !r.cost.known || r.pricePerHead <= 5)).toBe(true)
    const commercial = rankPitches(data.pitches, squad, {
      ...DEFAULT_FILTERS,
      types: ['commercial'],
    })
    expect(commercial.every((r) => r.pitch.type === 'commercial')).toBe(true)
    const goals = rankPitches(data.pitches, squad, { ...DEFAULT_FILTERS, brands: ['goals'] })
    expect(goals.length).toBeGreaterThan(0)
    expect(goals.every((r) => brandOf(r.pitch) === 'goals')).toBe(true)
    const parking = rankPitches(data.pitches, squad, { ...DEFAULT_FILTERS, needsParking: true })
    expect(parking.every((r) => r.pitch.parking === true)).toBe(true)
  })
  it('keeps a venue whose hours are unknown and drops one closed at the time asked for', () => {
    const hours = {
      mon: [['09:00', '23:00']],
      tue: [],
      wed: [],
      thu: [],
      fri: [],
      sat: [],
      sun: [],
    }
    expect(openMatches({ hours: null }, { days: ['tue'], from: '19:00' })).toBe(true)
    expect(openMatches({ hours }, { days: ['mon'], from: '19:00' })).toBe(true)
    expect(openMatches({ hours }, { days: ['mon'], from: '22:30' })).toBe(false) // an hour would run past closing
    expect(openMatches({ hours }, { days: ['tue'], from: null })).toBe(false)
    expect(openMatches({ hours }, { days: null, from: '10:00' })).toBe(true)
    expect(openMatches({ hours }, null)).toBe(true)
  })
})

describe('filterCounts', () => {
  const pitches = [
    { id: 'a', type: 'astro', lit: true, lat: 51.5, lng: -0.1, covered: true },
    { id: 'b', type: 'astro', lit: false, lat: 51.5, lng: -0.1 },
    {
      id: 'c',
      type: 'commercial',
      operator: 'Goals',
      pricePerHour: 60,
      lit: true,
      lat: 51.5,
      lng: -0.1,
      formats: [5],
      parking: true,
    },
  ]
  it('counts what each option would leave with the other filters as they are', () => {
    const c = filterCounts(pitches, [], DEFAULT_FILTERS)
    expect(c.types).toEqual({ astro: 2, commercial: 1 })
    expect(c.brands).toEqual({ goals: 1, powerleague: 0, other: 2 })
    expect(c.needsFloodlights).toBe(2)
    expect(c.needsCovered).toBe(1)
    expect(c.needsParking).toBe(1)
    expect(c.pricedOnly).toBe(1)
    expect(c.format).toEqual({ any: 3, 5: 3, 7: 2, 11: 2 })
    const lit = filterCounts(pitches, [], { ...DEFAULT_FILTERS, needsFloodlights: true })
    expect(lit.types).toEqual({ astro: 1, commercial: 1 })
    expect(lit.brands.other).toBe(1)
  })
  it('agrees with the ranking for every option on the real dataset', () => {
    const squad = [{ id: 'm0', lat: 51.4741, lng: -0.0691, mode: 'transit' }]
    const filters = { ...DEFAULT_FILTERS, maxEta: 30 }
    const c = filterCounts(data.pitches, squad, filters)
    expect(c.needsFloodlights).toBe(
      rankPitches(data.pitches, squad, { ...filters, needsFloodlights: true }).length,
    )
    expect(c.types.astro).toBe(
      rankPitches(data.pitches, squad, { ...filters, types: ['astro'] }).length,
    )
    expect(c.brands.other).toBe(
      rankPitches(data.pitches, squad, { ...filters, brands: ['other'] }).length,
    )
    expect(c.format.any).toBe(rankPitches(data.pitches, squad, filters).length)
  })
})

describe('cost model', () => {
  it('treats parks and cages as free unless a fee is recorded, and everything else as unknown', () => {
    expect(costOf({ type: 'park' })).toMatchObject({ known: true, perHour: 0 })
    expect(costOf({ type: 'cage', fee: true })).toMatchObject({ known: false, perHour: null })
    expect(costOf({ type: 'astro' })).toMatchObject({ known: false, perHour: null })
    expect(costOf({ type: 'commercial', pricePerHour: 78 })).toEqual({
      known: true,
      perHour: 78,
      slot: { amount: 78, minutes: 60 },
    })
    expect(
      costOf({ type: 'commercial', pricePerHour: 143, priceSlot: { amount: 95, minutes: 40 } })
        .slot,
    ).toEqual({ amount: 95, minutes: 40 })
  })
  it('journeyReason says "about" and rounds to 5 for estimates, exact minutes for routes', () => {
    const est = journeyReason({ avgEta: 11, maxEta: 13, spreadEta: 4, etaCount: 2 })
    expect(est).toEqual({ text: 'everyone within about 15 min', estimate: true })
    const routed = journeyReason({
      avgEta: 11,
      maxEta: 13,
      spreadEta: 4,
      etaCount: 2,
      routed: true,
    })
    expect(routed).toEqual({ text: 'everyone within 13 min', estimate: false })
    expect(
      journeyReason({ avgEta: 28, maxEta: 40, spreadEta: 24, etaCount: 2, routed: true }),
    ).toEqual({
      text: '28 min on average',
      estimate: false,
    })
    expect(journeyReason({ avgEta: 40, maxEta: 50, spreadEta: 20, etaCount: 2 })).toBeNull()
    expect(journeyReason({ avgEta: 0, maxEta: 0, spreadEta: 0, etaCount: 0 })).toBeNull()
    expect(journeyStats([10, 20, 33])).toEqual({
      avgEta: 21,
      maxEta: 33,
      spreadEta: 23,
      etaCount: 3,
    })
  })
  it('buildReasons lists facts only, in priority order', () => {
    const r = buildReasons({
      pitch: {
        lit: true,
        surface: '3g',
        changingRooms: true,
        bookingUrl: 'https://x.example/book',
      },
      cost: { known: true, perHour: 60, slot: { amount: 60, minutes: 60 } },
      pricePerHead: 6,
      headCount: 10,
    })
    expect(r.map((x) => x.text)).toEqual([
      'about £6 each for 10',
      'floodlit',
      '3G',
      'changing rooms',
    ])
    expect(r.some((x) => x.estimate)).toBe(false)
  })
})
