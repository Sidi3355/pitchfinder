import { describe, expect, it } from 'vitest'
import { collateFilters, membersToSquad, prefsSummary } from '../../src/lib/group-prefs.js'
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
    expect(prefsSummary({ budget: 10, lit: true })).toBe('up to £10 each, needs floodlights')
    expect(prefsSummary({ budget: 8 })).toBe('up to £8 each')
    expect(prefsSummary({})).toBe('')
    expect(prefsSummary(undefined)).toBe('')
  })
})
