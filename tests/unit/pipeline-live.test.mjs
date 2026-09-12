import { describe, expect, it } from 'vitest'
import { applyLive, brandOf, onlyBookable, withHours } from '../../scripts/lib/pipeline.mjs'

const baseline = [
  {
    id: 'go-beckenham',
    name: 'Goals Beckenham',
    operator: 'Goals',
    type: 'commercial',
    lat: 51.3987,
    lng: -0.0256,
    pricePerHour: 60,
    lit: true,
    curated: true,
  },
  {
    id: 'osm-1',
    name: 'Park astro',
    type: 'astro',
    lat: 51.5,
    lng: -0.1,
    openingHours: 'Mo-Fr 09:00-22:00; Sa,Su 09:00-18:00',
  },
  { id: 'osm-2', name: 'Park pitch', type: 'park', lat: 51.5, lng: -0.1 },
  { id: 'osm-3', name: 'Cage', type: 'cage', lat: 51.5, lng: -0.1 },
]

const live = {
  operators: [
    {
      key: 'goals',
      name: 'Goals',
      venues: [
        {
          id: 'go-beckenham',
          slug: 'beckenham',
          name: 'Goals Beckenham',
          operator: 'Goals',
          url: 'https://www.goalsfootball.co.uk/clubs/south-east/beckenham',
          bookingUrl: 'https://pitchbooking.com/book/goals/x',
          postcode: 'BR3 3LR',
          lat: 51.399,
          lng: -0.025,
          geoSource: 'postcode',
          inLondon: true,
          openingHours: {
            mon: [['09:00', '23:00']],
            tue: [['09:00', '23:00']],
            wed: [],
            thu: [],
            fri: [],
            sat: [],
            sun: [],
          },
          hoursSource: 'text',
          hoursQuotes: ['Monday - Tuesday 09:00 - 23:00'],
          prices: [{ amount: 42, unit: 'hour', label: 'off-peak, per hour', context: '' }],
          priceFrom: 42,
          formats: [5, 7],
          parking: true,
          changingRooms: null,
          fetchedAt: '2026-09-12T15:00:00.000Z',
        },
        {
          id: 'go-wembley',
          slug: 'wembley',
          name: 'Goals Wembley',
          operator: 'Goals',
          url: 'https://www.goalsfootball.co.uk/clubs/south-east/wembley',
          postcode: 'HA0 1JH',
          lat: 51.54,
          lng: -0.3,
          geoSource: 'page',
          inLondon: true,
          openingHours: null,
          prices: [],
          priceFrom: null,
          formats: [5],
          fetchedAt: '2026-09-12T15:00:00.000Z',
        },
        {
          id: 'go-manchester',
          slug: 'manchester',
          name: 'Goals Manchester',
          operator: 'Goals',
          url: 'x',
          lat: 53.4,
          lng: -2.2,
          inLondon: false,
          prices: [],
          fetchedAt: '2026-09-12T15:00:00.000Z',
        },
      ],
    },
  ],
}

describe("the operators' own pages on top of the baseline", () => {
  const out = applyLive(baseline, live)
  it('updates a matched venue with what the page states and keeps what it does not', () => {
    const b = out.find((v) => v.id === 'go-beckenham')
    expect(b.pricePerHour).toBe(42)
    expect(b.priceSource).toBe('operator-site')
    expect(b.hours.mon).toEqual([['09:00', '23:00']])
    expect(b.hoursSource).toBe('operator-site')
    expect(b.bookingUrl).toBe('https://pitchbooking.com/book/goals/x')
    expect(b.parking).toBe(true)
    expect(b.lit).toBe(true) // the page did not say; the baseline stands
    expect(b.changingRooms).toBeUndefined()
    expect(b.lat).toBe(51.3987) // a postcode centroid never moves a hand-set pin
    expect(b.verifiedAt).toBe('2026-09-12')
    expect(b.brand).toBe('goals')
  })
  it('adds a London club that matches nothing and leaves the rest of the country out', () => {
    expect(out.find((v) => v.id === 'go-wembley')).toMatchObject({
      type: 'commercial',
      operator: 'Goals',
      lat: 51.54,
    })
    expect(out.find((v) => v.id === 'go-manchester')).toBeUndefined()
    expect(out).toHaveLength(baseline.length + 1)
  })
  it('parses OpenStreetMap hours and keeps only bookable types', () => {
    const final = onlyBookable(out.map(withHours))
    expect(final.map((v) => v.type).sort()).toEqual(['astro', 'commercial', 'commercial'])
    const astro = final.find((v) => v.id === 'osm-1')
    expect(astro.hours.sat).toEqual([['09:00', '18:00']])
    expect(astro.hoursSource).toBe('osm')
    expect(astro.brand).toBe('other')
    expect(brandOf('Powerleague', 'Powerleague Barnet')).toBe('powerleague')
  })
})
