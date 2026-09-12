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

import { applySlots, matchPlayfinderVenue, nameSimilarity } from '../../scripts/lib/pipeline.mjs'

const slots = {
  fetchedAt: '2026-09-13T04:00:00.000Z',
  pitchbooking: {
    clubs: [
      {
        id: 'go-beckenham',
        name: 'Goals Beckenham',
        url: 'https://pitchbooking.com/book/goals/bbcbb80a',
        fetchedAt: '2026-09-13T03:10:00.000Z',
        bands: [
          {
            format: 5,
            surface: '3g',
            amount: 88,
            minutes: 60,
            days: ['mon', 'tue', 'wed', 'thu'],
            windows: [['10:00', '17:30']],
            slotsSeen: 64,
          },
          {
            format: 5,
            surface: '3g',
            amount: 111,
            minutes: 60,
            days: ['mon', 'tue', 'wed', 'thu'],
            windows: [['18:30', '21:30']],
            slotsSeen: 20,
          },
          {
            format: 5,
            surface: '3g',
            amount: 67,
            minutes: 60,
            days: ['sun'],
            windows: [['09:00', '22:00']],
            slotsSeen: 26,
          },
          {
            format: 8,
            surface: '3g',
            amount: 120,
            minutes: 60,
            days: ['sat', 'sun'],
            windows: [['09:00', '20:00']],
            slotsSeen: 40,
          },
        ],
      },
    ],
  },
  playfinder: {
    venues: [
      {
        slug: 'powerleague-shoreditch',
        url: 'https://www.playfinder.com/london/venue/powerleague-shoreditch',
        name: 'Powerleague Shoreditch',
        address: 'Braithwaite Street, Shoreditch, London, E1 6GJ',
        postcode: 'E1 6GJ',
        lat: 51.5235,
        lng: -0.0755,
        region: 'London',
        district: 'Hackney',
        inLondon: true,
        hours: {
          mon: [['09:00', '22:30']],
          tue: [['09:00', '22:30']],
          wed: [],
          thu: [],
          fri: [],
          sat: [['10:00', '18:00']],
          sun: [],
        },
        hoursQuotes: ['Monday 09:00-22:30'],
        facilities: { lit: true, changingRooms: true, parking: null },
        pitches: [
          {
            url: 'https://www.playfinder.com/london/venue/powerleague-shoreditch/football-5-a-side-34946',
            format: 5,
            surface: '3g',
          },
          {
            url: 'https://www.playfinder.com/london/venue/powerleague-shoreditch/football-7-a-side-36030',
            format: 7,
            surface: '3g',
          },
        ],
        bands: [
          {
            format: 5,
            surface: '3g',
            amount: 95,
            minutes: 40,
            days: ['mon', 'tue', 'wed', 'thu', 'fri'],
            windows: [
              ['09:00', '17:00'],
              ['21:00', '21:00'],
            ],
            slotsSeen: 70,
          },
          {
            format: 5,
            surface: '3g',
            amount: 110,
            minutes: 40,
            days: ['mon', 'tue', 'wed', 'thu', 'fri'],
            windows: [['17:40', '20:20']],
            slotsSeen: 12,
          },
          {
            format: 5,
            surface: '3g',
            amount: 75,
            minutes: 60,
            days: ['sat', 'sun'],
            windows: [['10:00', '20:00']],
            slotsSeen: 14,
          },
        ],
        fetchedAt: '2026-09-13T03:30:00.000Z',
      },
      {
        slug: 'westway-sports-centre',
        url: 'https://www.playfinder.com/london/venue/westway-sports-centre',
        name: 'Westway Sports Centre',
        postcode: 'W10 6RP',
        lat: 51.5205,
        lng: -0.2185,
        region: 'London',
        inLondon: true,
        hours: null,
        facilities: { lit: true },
        pitches: [{ url: 'x/football-5-a-side-1', format: 5, surface: '3g' }],
        bands: [
          {
            format: 5,
            surface: '3g',
            amount: 60,
            minutes: 60,
            days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
            windows: [['09:00', '21:00']],
            slotsSeen: 80,
          },
        ],
        fetchedAt: '2026-09-13T03:40:00.000Z',
      },
      {
        slug: 'three-corners-adventure-playground',
        url: 'https://www.playfinder.com/london/venue/three-corners-adventure-playground',
        name: 'Three Corners Adventure Playground',
        postcode: 'EC1V 4EE',
        lat: 51.53,
        lng: -0.1,
        region: 'London',
        district: 'Islington',
        inLondon: true,
        hours: { mon: [['09:00', '21:00']], tue: [], wed: [], thu: [], fri: [], sat: [], sun: [] },
        facilities: { lit: true, changingRooms: true },
        pitches: [{ url: 'x/football-5-a-side-2', format: 5, surface: '3g' }],
        bands: [
          {
            format: 5,
            surface: '3g',
            amount: 48,
            minutes: 60,
            days: ['mon'],
            windows: [['18:00', '21:00']],
            slotsSeen: 4,
          },
        ],
        fetchedAt: '2026-09-13T03:45:00.000Z',
      },
      {
        slug: 'grass-only-park',
        url: 'https://www.playfinder.com/london/venue/grass-only-park',
        name: 'Grass Only Park',
        postcode: 'N1 1AA',
        lat: 51.54,
        lng: -0.11,
        inLondon: true,
        pitches: [{ url: 'x/football-11-a-side-3', format: 11, surface: 'grass' }],
        bands: [],
        skipped: 'no artificial football pitch',
        fetchedAt: '2026-09-13T03:50:00.000Z',
      },
      {
        slug: 'crayford-academy',
        url: 'https://www.playfinder.com/london/venue/crayford-academy',
        name: 'Crayford Academy',
        postcode: 'DA1 4EE',
        lat: 51.45,
        lng: 0.18,
        region: 'South East',
        inLondon: false,
        pitches: [{ url: 'x/football-5-a-side-4', format: 5, surface: '3g' }],
        bands: [
          {
            format: 5,
            surface: '3g',
            amount: 40,
            minutes: 60,
            days: ['sat'],
            windows: [['10:00', '12:00']],
            slotsSeen: 3,
          },
        ],
        fetchedAt: '2026-09-13T03:55:00.000Z',
      },
    ],
  },
}

const slotBaseline = [
  {
    id: 'go-beckenham',
    name: 'Goals Beckenham',
    operator: 'Goals',
    type: 'commercial',
    lat: 51.3987,
    lng: -0.0256,
    pricePerHour: 60,
    hours: { mon: [['10:00', '23:00']] },
    hoursSource: 'operator-site',
    hoursSourceUrl: 'https://www.goalsfootball.co.uk/clubs/south-east/beckenham',
    bookingUrl: 'https://www.goalsfootball.co.uk/play/book-a-game',
    prices: [{ amount: 6, unit: 'person', label: '5-a-side, per player' }],
    formats: [5, 7, 8],
  },
  {
    id: 'pl-shoreditch',
    name: 'Powerleague Shoreditch',
    operator: 'Powerleague',
    type: 'commercial',
    lat: 51.5262,
    lng: -0.0817,
    pricePerHour: 78,
    bookingUrl: 'https://www.powerleague.com/location/shoreditch',
    lit: true,
    changingRooms: true,
    formats: [5, 7],
  },
  {
    id: 'lc-westway',
    name: 'Westway Sports Centre',
    type: 'astro',
    lat: 51.5199,
    lng: -0.2178,
    pricePerHour: 50,
    bookingUrl: 'https://www.everyoneactive.com/centre/westway-sports-fitness-centre/',
    openingHours: 'Mo-Su 07:00-22:00',
    surface: '3g',
  },
  { id: 'osm-9', name: 'Park astro', type: 'astro', lat: 51.6, lng: -0.3 },
]

describe('slot calendars on top of the venues', () => {
  const out = applySlots(slotBaseline, slots, {
    areas: [{ name: 'Islington', lat: 51.53, lng: -0.1 }],
  })
  it("gives a Goals club its prices from Goals' own booking site, by size, and links to it", () => {
    const b = out.find((v) => v.id === 'go-beckenham')
    expect(b.pricePerHour).toBe(67)
    expect(b.priceMax).toBe(120)
    expect(b.priceSlot).toEqual({ amount: 67, minutes: 60 })
    expect(b.priceSource).toBe('pitchbooking')
    expect(b.bookingUrl).toBe('https://pitchbooking.com/book/goals/bbcbb80a')
    const slotLines = b.prices.filter((l) => l.unit === 'slot')
    expect(slotLines).toHaveLength(4)
    expect(slotLines[0].label).toBe('5-a-side, Mon to Thu, kick-off 10:00 to 17:30')
    expect(slotLines[0].source).toBe('pitchbooking')
    expect(b.prices.find((l) => l.unit === 'person')).toBeTruthy() // the operator's own words stay
    expect(b.hoursSource).toBe('operator-site') // Goals' hours come from Goals
    expect(b.formats).toEqual([5, 7, 8])
  })
  it('gives Powerleague its week of prices, hours and a booking page that answers', () => {
    const p = out.find((v) => v.id === 'pl-shoreditch')
    expect(p.pricePerHour).toBe(75) // the weekend hour is the cheapest hour
    expect(p.priceSlot).toEqual({ amount: 75, minutes: 60 })
    expect(p.priceMax).toBe(165) // £110 for 40 minutes
    expect(p.priceSource).toBe('playfinder')
    expect(p.hours.sat).toEqual([['10:00', '18:00']])
    expect(p.hoursSource).toBe('playfinder')
    expect(p.bookingUrl).toBe('https://www.playfinder.com/london/venue/powerleague-shoreditch')
    expect(p.address).toBe('Braithwaite Street, Shoreditch, London, E1 6GJ')
    expect(p.postcode).toBe('E1 6GJ')
    const weekday = p.prices.find((l) => l.amount === 95)
    expect(weekday.minutes).toBe(40)
    expect(weekday.label).toBe('5-a-side, Weekdays, kick-off 09:00 to 17:00 and 21:00')
  })
  it('matches a leisure-centre astro by name and distance and keeps its own booking link', () => {
    const w = out.find((v) => v.id === 'lc-westway')
    expect(w.pricePerHour).toBe(60)
    expect(w.priceSource).toBe('playfinder')
    expect(w.bookingUrl).toBe(
      'https://www.everyoneactive.com/centre/westway-sports-fitness-centre/',
    )
    expect(w.playfinderUrl).toBe('https://www.playfinder.com/london/venue/westway-sports-centre')
    expect(w.lit).toBe(true)
  })
  it('adds an artificial pitch it cannot match, pinned at its postcode, and leaves grass and out-of-London venues out', () => {
    const added = out.find((v) => v.id === 'pf-three-corners-adventure-playground')
    expect(added).toMatchObject({
      type: 'astro',
      nameSource: 'playfinder',
      source: 'playfinder',
      geoSource: 'postcode',
      area: 'Islington',
      borough: 'Islington',
      surface: '3g',
      formats: [5],
      lit: true,
      pricePerHour: 48,
      bookingUrl: 'https://www.playfinder.com/london/venue/three-corners-adventure-playground',
      verifiedAt: '2026-09-13',
    })
    expect(added.hours.mon).toEqual([['09:00', '21:00']])
    expect(out.find((v) => v.id === 'pf-grass-only-park')).toBeUndefined()
    expect(out.find((v) => v.id === 'pf-crayford-academy')).toBeUndefined()
    expect(out).toHaveLength(slotBaseline.length + 1)
  })
  it('matches by shared words nearby, by being the only astro on the spot, or not at all', () => {
    const venues = [
      {
        id: 'a',
        name: 'Paddington Recreation Ground pitches',
        type: 'astro',
        lat: 51.53,
        lng: -0.18,
      },
      { id: 'b', name: 'Pitch off Carlton Vale', type: 'astro', lat: 51.535, lng: -0.19 },
    ]
    expect(
      matchPlayfinderVenue(
        { slug: 'paddington-rec', name: 'Paddington Rec', lat: 51.5305, lng: -0.1805 },
        venues,
      )?.id,
    ).toBe('a')
    expect(
      matchPlayfinderVenue({ slug: 'x', name: 'Something Else', lat: 51.5351, lng: -0.19 }, venues)
        ?.id,
    ).toBe('b')
    expect(
      matchPlayfinderVenue({ slug: 'y', name: 'Far Away Park', lat: 51.6, lng: -0.3 }, venues),
    ).toBeNull()
    expect(nameSimilarity('Paddington Recreation Ground', 'paddington-recreation-ground')).toBe(1)
  })
})
