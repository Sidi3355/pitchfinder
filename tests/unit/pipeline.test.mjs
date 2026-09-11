// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import {
  classify,
  collapse,
  collapseByName,
  deriveNames,
  excluded,
  mergeCurated,
  normSurface,
  summarise,
  transform,
} from '../../scripts/lib/pipeline.mjs'

const fixture = JSON.parse(
  readFileSync(new URL('../fixtures/overpass-small.json', import.meta.url), 'utf8'),
)
const AREAS = [
  { name: 'Testtown', lat: 51.5, lng: -0.1 },
  { name: 'Eastside', lat: 51.52, lng: -0.05 },
  { name: 'Northfield', lat: 51.56, lng: -0.2 },
  { name: 'Westhill', lat: 51.57, lng: -0.3 },
  { name: 'Hilltop', lat: 51.54, lng: -0.12 },
]

function build() {
  const pitches = transform(fixture.elements, { areas: AREAS })
  const venues = collapse(pitches)
  return deriveNames(venues, {
    parks: fixture.parks,
    roadAt: (v) => fixture.roads[`${v.lat.toFixed(4)},${v.lng.toFixed(4)}`] || null,
  })
}

describe('classification', () => {
  it('normalises surfaces', () => {
    expect(normSurface('artificial_turf')).toBe('astro')
    expect(normSurface('3G')).toBe('3g')
    expect(normSurface('tarmac')).toBe('hard')
    expect(normSurface('grass')).toBe('grass')
    expect(normSurface('')).toBeNull()
    expect(normSurface('wood')).toBe('other')
  })
  it('classifies commercial, cage, astro and park', () => {
    expect(classify({ name: 'Goals Sutton' })).toBe('commercial')
    expect(classify({ sport: 'multi' })).toBe('cage')
    expect(classify({ hoops: 'yes' })).toBe('cage')
    expect(classify({ surface: '3g' })).toBe('astro')
    expect(classify({ surface: 'grass' })).toBe('park')
    expect(classify({})).toBe('park')
  })
  it('excludes private and school grounds but not academies or bookable school 3Gs', () => {
    expect(excluded({ access: 'private' })).toBe(true)
    expect(excluded({ name: "St Mary's School Field" })).toBe(true)
    expect(excluded({ name: 'Riverside Academy 3G' })).toBe(false)
    expect(excluded({ name: 'Hilltop School 3G', access: 'customers' })).toBe(false)
    expect(excluded({ name: 'Powerleague Academy' })).toBe(false)
    expect(excluded({ operator: 'University of Testtown' })).toBe(true)
  })
})

describe('transform', () => {
  it('drops excluded features, keeps provenance, treats generic names as unnamed', () => {
    const pitches = transform(fixture.elements, { areas: AREAS })
    const ids = pitches.map((p) => p.id)
    expect(ids).not.toContain('osm-w30') // school
    expect(ids).not.toContain('osm-w40') // private
    expect(ids).toContain('osm-w31') // academy
    expect(ids).toContain('osm-w32') // bookable school 3G
    const p1 = pitches.find((p) => p.id === 'osm-n1')
    expect(p1.name).toBeNull()
    expect(p1.osmName).toBe('Pitch 1')
    expect(p1.sourceUrl).toBe('https://www.openstreetmap.org/node/1')
    expect(p1.sport).toBe('football')
    expect(p1.source).toBe('osm')
  })
})

describe('collapse', () => {
  it('merges "Pitch 1, 2, 3" in one park into one venue with a count', () => {
    const venues = collapse(transform(fixture.elements, { areas: AREAS }))
    const meadow = venues.find((v) => v.memberIds.includes('osm-n1'))
    expect(meadow.pitchCount).toBe(3)
    expect(meadow.memberIds).toEqual(['osm-n1', 'osm-n2', 'osm-n3'])
    expect(meadow.lit).toBe(false) // one member says no, none say yes
    expect(meadow.surface).toBe('grass')
  })
  it('merges adjacent unnamed cages but not one 600 m away', () => {
    const venues = collapse(transform(fixture.elements, { areas: AREAS }))
    const cages = venues.filter((v) => v.type === 'cage')
    expect(cages).toHaveLength(2)
    const pair = cages.find((v) => v.pitchCount === 2)
    expect(pair.memberIds).toEqual(['osm-w10', 'osm-w11'])
    expect(pair.lit).toBe(true)
    expect(pair.bounded).toBe(true)
  })
  it('merges same-operator commercial pitches and same-name park pitches', () => {
    const venues = collapse(transform(fixture.elements, { areas: AREAS }))
    const pl = venues.find((v) => v.type === 'commercial')
    expect(pl.pitchCount).toBe(2)
    expect(pl.name).toBe('Powerleague Testtown')
    const fairview = venues.filter((v) => v.name === 'Fairview Playing Fields')
    expect(fairview).toHaveLength(1)
    expect(fairview[0].pitchCount).toBe(2)
  })
  it('uses the smallest member id as the venue id so ids are stable between refreshes', () => {
    const venues = collapse(transform(fixture.elements, { areas: AREAS }))
    expect(venues.find((v) => v.pitchCount === 3).id).toBe('osm-n1')
  })
})

describe('deriveNames', () => {
  it('names unnamed venues after the park that contains them, the nearest park, the road, or the area', () => {
    const venues = build()
    const byId = Object.fromEntries(venues.map((v) => [v.id, v]))
    expect(byId['osm-n1'].name).toBe('Meadow Park pitches')
    expect(byId['osm-n1'].nameSource).toBe('park')
    expect(byId['osm-w10'].name).toBe('Eastside Rec cages')
    expect(byId['osm-w12'].name).toBe('Cage off Cable Street')
    expect(byId['osm-w12'].nameSource).toBe('road')
    expect(byId['osm-w41'].name).toBe('Pitch off Elm Lane')
  })
  it('falls back to the area when nothing else is known', () => {
    const [v] = deriveNames([
      { id: 'x', type: 'park', pitchCount: 1, lat: 51, lng: 0, area: 'Nowhere' },
    ])
    expect(v.name).toBe('Pitch in Nowhere')
    expect(v.nameSource).toBe('area')
  })
  it('never renames a venue that has its own name', () => {
    const venues = build()
    expect(venues.find((v) => v.id === 'osm-w20').name).toBe('Powerleague Testtown')
    expect(venues.find((v) => v.id === 'osm-w20').nameSource).toBe('osm')
  })
})

describe('mergeCurated', () => {
  const curated = [
    {
      id: 'pl-testtown',
      name: 'Powerleague Testtown',
      operator: 'Powerleague',
      lat: 51.5301,
      lng: -0.0801,
      type: 'commercial',
      surface: '3g',
      formats: [5, 7],
      pricePerHour: 70,
      priceSourceUrl: 'https://example.com/testtown',
      priceCheckedAt: '2026-09-01',
      bookingUrl: 'https://example.com/testtown',
      lit: true,
      changingRooms: true,
      postcode: 'E1 1AA',
      verifiedAt: '2026-09-01',
    },
    {
      id: 'pk-nowhere',
      name: 'Nowhere Rec',
      operator: 'Council',
      lat: 51.7,
      lng: 0.2,
      type: 'park',
      pricePerHour: 0,
      bookingUrl: 'https://example.gov.uk/nowhere',
    },
  ]
  it('attaches to the nearest compatible OSM venue and records the distance', () => {
    const merged = mergeCurated(build(), curated, {}, { areas: AREAS })
    const pl = merged.find((v) => v.id === 'pl-testtown')
    expect(pl.matchedOsmId).toBe('osm-w20')
    expect(pl.osmDistanceM).toBeLessThan(50)
    expect(pl.pitchCount).toBe(2)
    expect(pl.priceSource).toBe('operator-site')
    expect(pl.priceSourceUrl).toBe('https://example.com/testtown')
    expect(pl.source).toBe('curated')
    expect(pl.nameSource).toBe('curated')
    expect(merged.filter((v) => v.type === 'commercial')).toHaveLength(1)
  })
  it('adds a standalone venue when nothing is near', () => {
    const merged = mergeCurated(build(), curated, {}, { areas: AREAS })
    const rec = merged.find((v) => v.id === 'pk-nowhere')
    expect(rec.matchedOsmId).toBeUndefined()
    expect(rec.pitchCount).toBe(1)
  })
  it('prefers a scraped price with its provenance', () => {
    const prices = {
      'pl-testtown': {
        perHour: 75,
        max: 90,
        sourceUrl: 'https://example.com/prices',
        checkedAt: '2026-09-10',
        context: '£75 per hour off peak',
      },
    }
    const merged = mergeCurated(build(), curated, prices, { areas: AREAS })
    const pl = merged.find((v) => v.id === 'pl-testtown')
    expect(pl.pricePerHour).toBe(75)
    expect(pl.priceMax).toBe(90)
    expect(pl.priceSource).toBe('scraped')
    expect(pl.priceContext).toBe('£75 per hour off peak')
  })
})

describe('summarise', () => {
  it('counts by type and by name source', () => {
    const s = summarise(build())
    expect(s.byType.commercial).toBe(1)
    expect(s.byNameSource.park).toBe(2)
    expect(s.byNameSource.road).toBe(2)
    expect(s.byNameSource.none).toBeUndefined()
  })
})

describe('collapseByName', () => {
  it('merges clusters that were given the same park name within 600 m and sums their counts', () => {
    const venues = [
      {
        id: 'osm-w1',
        name: 'Big Park pitches',
        nameSource: 'park',
        type: 'park',
        lat: 51.5,
        lng: -0.1,
        pitchCount: 2,
        memberIds: ['osm-w1', 'osm-w2'],
      },
      {
        id: 'osm-w3',
        name: 'Big Park pitches',
        nameSource: 'park',
        type: 'park',
        lat: 51.503,
        lng: -0.1,
        pitchCount: 1,
        memberIds: ['osm-w3'],
      },
      {
        id: 'osm-w9',
        name: 'Big Park pitches',
        nameSource: 'park',
        type: 'park',
        lat: 51.6,
        lng: -0.1,
        pitchCount: 1,
        memberIds: ['osm-w9'],
      },
      {
        id: 'osm-w4',
        name: 'Other',
        nameSource: 'osm',
        type: 'park',
        lat: 51.5,
        lng: -0.1,
        pitchCount: 1,
        memberIds: ['osm-w4'],
      },
    ]
    const out = collapseByName(venues)
    expect(out).toHaveLength(3)
    const big = out.find((v) => v.id === 'osm-w1')
    expect(big.pitchCount).toBe(3)
    expect(big.memberIds).toEqual(['osm-w1', 'osm-w2', 'osm-w3'])
    expect(big.name).toBe('Big Park pitches')
    expect(out.find((v) => v.id === 'osm-w9').pitchCount).toBe(1)
  })
})
