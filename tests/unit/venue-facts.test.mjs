import { describe, expect, it } from 'vitest'
import {
  extractFacilities,
  extractFormats,
  extractPostcode,
  extractPriceLines,
  extractVenueFacts,
  factsFromJsonLd,
  labelPrice,
  priceFrom,
} from '../../scripts/lib/venue-facts.mjs'

const PAGE = `Goals Dagenham | 5-a-side football
Home of 5-a-side and 7-a-side football in Dagenham. 12 floodlit 3G pitches, free parking, changing rooms and showers, licensed bar.
Pitch hire from £42 per hour off-peak and £60 per hour peak. Social games £6 per player.
Membership £5 per month. Deposit £20.
Opening Times
Monday - Friday 09:00 - 23:00
Saturday - Sunday 9am - 9pm
Address: Goals Dagenham, Ballards Road, Dagenham RM10 9AB`

describe('venue facts', () => {
  it('finds the postcode, formats and facilities the page states', () => {
    expect(extractPostcode(PAGE)).toBe('RM10 9AB')
    expect(extractFormats(PAGE)).toEqual([5, 7])
    const f = extractFacilities(PAGE)
    expect(f).toMatchObject({
      parking: true,
      changingRooms: true,
      showers: true,
      bar: true,
      lit: true,
      pitchCount: 12,
    })
    expect(f.covered).toBeNull()
    expect(f.cafe).toBeNull()
  })
  it('keeps every stated price with its unit and label, and ignores deposits and memberships', () => {
    const lines = extractPriceLines(PAGE)
    expect(lines).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ amount: 42, unit: 'hour', label: 'off-peak, per hour' }),
        expect.objectContaining({ amount: 60, unit: 'hour', label: 'peak, per hour' }),
        expect.objectContaining({ amount: 6, unit: 'person', label: 'per player' }),
      ]),
    )
    expect(lines.some((l) => l.amount === 20 || l.amount === 5)).toBe(false)
    expect(priceFrom(lines)).toBe(42)
    expect(priceFrom(lines.filter((l) => l.unit === 'person'))).toBeNull()
    expect(labelPrice('7-a-side pitch on a weekend evening', 'hour')).toBe(
      '7-a-side, weekend, per hour',
    )
  })
  it('reads schema.org data for the address, coordinates and hours', () => {
    const ld = factsFromJsonLd([
      {
        '@context': 'https://schema.org',
        '@type': 'SportsActivityLocation',
        name: 'Powerleague Shoreditch',
        address: {
          streetAddress: 'Braithwaite Street',
          addressLocality: 'London',
          postalCode: 'E1 6GJ',
        },
        geo: { latitude: '51.5262', longitude: '-0.0817' },
        openingHoursSpecification: [
          { dayOfWeek: ['Monday', 'Sunday'], opens: '09:00', closes: '23:00' },
        ],
        telephone: '020 0000 0000',
      },
    ])
    expect(ld).toMatchObject({
      name: 'Powerleague Shoreditch',
      postcode: 'E1 6GJ',
      lat: 51.5262,
      lng: -0.0817,
    })
    expect(ld.address).toBe('Braithwaite Street, London, E1 6GJ')
    expect(ld.hours.mon).toEqual([['09:00', '23:00']])
    expect(ld.hours.tue).toEqual([])
  })
  it('puts it together with the source of the hours', () => {
    const facts = extractVenueFacts({ text: PAGE, jsonld: [] })
    expect(facts.hoursSource).toBe('text')
    expect(facts.openingHours.mon).toEqual([['09:00', '23:00']])
    expect(facts.openingHours.sun).toEqual([['09:00', '21:00']])
    expect(facts.hoursQuotes[0]).toMatch(/Monday - Friday 09:00 - 23:00/)
    expect(facts.priceFrom).toBe(42)
    expect(facts.postcode).toBe('RM10 9AB')
    const empty = extractVenueFacts({ text: 'Book a pitch. See you soon.', jsonld: [] })
    expect(empty.openingHours).toBeNull()
    expect(empty.prices).toEqual([])
    expect(empty.priceFrom).toBeNull()
    expect(empty.parking).toBeNull()
  })
})
