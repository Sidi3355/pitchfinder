import { describe, expect, it } from 'vitest'
import {
  collateFilters,
  membersToSquad,
  prefsSummary,
  collateWhen,
  collateSummary,
} from '../../src/lib/group-prefs.js'
import { DEFAULT_FILTERS } from '../../src/lib/score.js'

const members = [
  { id: 'a', name: 'Sam', label: 'Peckham', lat: 51.47, lng: -0.07, mode: 'walk', is_you: true },
  { id: 'b', name: 'Ali', lat: 51.55, lng: -0.05, prefs: { budget: 10, lit: true } },
  { id: 'c', name: 'Jo', lat: 51.5, lng: -0.1, mode: 'cycle', prefs: { budget: 8 } },
]

describe('shared group preferences', () => {
  it('maps members to the squad shape with sensible defaults', () => {
    const squad = membersToSquad(members)
    expect(squad[0]).toEqual({
      id: 'a',
      name: 'Sam',
      label: 'Peckham',
      lat: 51.47,
      lng: -0.07,
      mode: 'walk',
      you: true,
    })
    expect(squad[1].mode).toBe('transit')
    expect(squad[1].label).toBe('')
    expect(squad[1].you).toBe(false)
  })
  it('collates the tightest budget and floodlights if anyone needs them', () => {
    expect(collateFilters(members)).toEqual({
      ...DEFAULT_FILTERS,
      maxPricePerHead: 8,
      needsFloodlights: true,
    })
    expect(collateFilters([members[0]])).toEqual(DEFAULT_FILTERS)
    expect(collateFilters([])).toEqual(DEFAULT_FILTERS)
  })
  it('summarises preferences in plain words', () => {
    expect(prefsSummary({ budget: 10, lit: true })).toBe('up to £10 each · floodlights')
    expect(
      prefsSummary({
        format: 5,
        surface: '3g',
        brand: 'goals',
        covered: true,
        parking: true,
        maxMinutes: 30,
        days: ['tue', 'thu'],
        daypart: 'evening',
      }),
    ).toBe('5-a-side · 3G · Goals · under cover · parking · 30 min max · Tue, Thu · evenings')
    expect(prefsSummary({ budget: 8 })).toBe('up to £8 each')
    expect(prefsSummary({})).toBe('')
    expect(prefsSummary(undefined)).toBe('')
  })
})

describe('richer preferences', () => {
  const m = (name, prefs) => ({ id: name, name, lat: 51.5, lng: -0.1, prefs })
  it('needs add up, sizes and operators apply only when everyone who chose agrees', () => {
    const f = collateFilters([
      m('Sam', { format: 5, brand: 'goals', covered: true, maxMinutes: 45 }),
      m('Priya', { format: 5, parking: true, maxMinutes: 30 }),
      m('Tom', {}),
    ])
    expect(f.format).toBe(5)
    expect(f.brands).toEqual(['goals'])
    expect(f.needsCovered).toBe(true)
    expect(f.needsParking).toBe(true)
    expect(f.needsChanging).toBe(false)
    expect(f.maxEta).toBe(30)
    const split = collateFilters([
      m('Sam', { format: 5, brand: 'goals' }),
      m('Priya', { format: 7, brand: 'powerleague' }),
    ])
    expect(split.format).toBeNull()
    expect(split.brands).toEqual([])
  })
  it('finds the days everyone can do and the time of day anyone needs', () => {
    const members = [
      m('Sam', { days: ['mon', 'tue', 'thu'], daypart: 'evening' }),
      m('Priya', { days: ['tue', 'thu', 'sat'] }),
      m('Tom', {}),
    ]
    expect(collateWhen(members)).toEqual({
      days: ['tue', 'thu'],
      from: '19:00',
      conflict: false,
      anyone: true,
    })
    expect(collateFilters(members).openOn).toEqual({ days: ['tue', 'thu'], from: '19:00' })
    const clash = collateWhen([m('Sam', { days: ['mon'] }), m('Priya', { days: ['sun'] })])
    expect(clash).toMatchObject({ days: null, conflict: true })
    expect(collateWhen([m('Tom', {})])).toEqual({
      days: null,
      from: null,
      conflict: false,
      anyone: false,
    })
  })
  it('summarises what the group asked for with who asked', () => {
    const lines = collateSummary([
      m('Sam', { budget: 8, lit: true, days: ['tue', 'thu'] }),
      m('Priya', { budget: 10, lit: true, days: ['thu'] }),
    ])
    expect(lines).toEqual(
      expect.arrayContaining([
        { text: 'Up to £8 each', who: 'Sam' },
        { text: 'Floodlights', who: 'Sam and Priya' },
        { text: 'Thu work for everyone', who: '' },
      ]),
    )
  })
})
