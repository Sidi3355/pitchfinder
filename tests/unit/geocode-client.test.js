import { describe, expect, it, vi } from 'vitest'
import {
  geocodePlace,
  geocodePostcode,
  isOutcode,
  isPostcode,
  looksLikePostcode,
  normalisePostcode,
  resolveLocation,
  searchGazetteer,
} from '../../src/lib/geocode-client.js'

const AREAS = [
  { name: 'Peckham', lat: 51.4741, lng: -0.0691 },
  { name: 'Peckham Rye', lat: 51.46, lng: -0.065 },
  { name: 'Hackney', lat: 51.545, lng: -0.0553 },
  { name: 'Hackney Wick', lat: 51.543, lng: -0.025 },
  { name: 'Elephant & Castle', lat: 51.4943, lng: -0.1005 },
  { name: 'West Hampstead', lat: 51.547, lng: -0.191 },
]

const json = (body, status = 200) => ({ ok: status < 400, status, json: async () => body })

describe('postcode detection', () => {
  it('recognises full postcodes in any spacing or case and normalises them', () => {
    expect(isPostcode('e8 3dl')).toBe(true)
    expect(isPostcode('SW1A1AA')).toBe(true)
    expect(normalisePostcode('sw1a1aa')).toBe('SW1A 1AA')
    expect(isPostcode('Peckham')).toBe(false)
  })
  it('recognises outward codes and partial postcodes', () => {
    expect(isOutcode('E8')).toBe(true)
    expect(isOutcode('SE15')).toBe(true)
    expect(isOutcode('E8 3DL')).toBe(false)
    expect(looksLikePostcode('SE15 4')).toBe(true)
    expect(looksLikePostcode('Hackney')).toBe(false)
  })
})

describe('searchGazetteer', () => {
  it('ranks prefix matches before word matches before substrings', () => {
    expect(searchGazetteer('hack', AREAS).map((r) => r.label)).toEqual(['Hackney', 'Hackney Wick'])
    expect(searchGazetteer('castle', AREAS).map((r) => r.label)).toEqual(['Elephant & Castle'])
    expect(searchGazetteer('hamp', AREAS).map((r) => r.label)).toEqual(['West Hampstead'])
    expect(searchGazetteer('', AREAS)).toEqual([])
  })
})

describe('resolveLocation', () => {
  it('sends a postcode to postcodes.io and labels the result', async () => {
    const fetchImpl = vi.fn(async () =>
      json({
        result: {
          postcode: 'E8 3DL',
          latitude: 51.54,
          longitude: -0.06,
          admin_ward: 'Dalston',
          admin_district: 'Hackney',
        },
      }),
    )
    const { results, source } = await resolveLocation('e83dl', { areas: AREAS, fetchImpl })
    expect(source).toBe('postcodes.io')
    expect(results[0]).toMatchObject({
      label: 'E8 3DL',
      sub: 'Dalston, Hackney',
      lat: 51.54,
      lng: -0.06,
    })
    expect(fetchImpl.mock.calls[0][0]).toContain('/postcodes/E8%203DL')
  })
  it('returns nothing for an unknown postcode rather than a guess', async () => {
    const fetchImpl = vi.fn(async () => json({}, 404))
    expect(await geocodePostcode('ZZ9 9ZZ', { fetchImpl })).toBeNull()
    expect((await resolveLocation('ZZ9 9ZZ', { areas: AREAS, fetchImpl })).results).toEqual([])
  })
  it('merges gazetteer and Nominatim results for a place name, London-bounded', async () => {
    const fetchImpl = vi.fn(async () =>
      json([
        {
          lat: '51.474',
          lon: '-0.069',
          display_name:
            'Peckham, London Borough of Southwark, London, Greater London, England, United Kingdom',
          type: 'suburb',
        },
        {
          lat: '51.47',
          lon: '-0.07',
          display_name: 'Peckham Rye Station, Rye Lane, Peckham, London',
          type: 'station',
        },
      ]),
    )
    const { results, source } = await resolveLocation('Peckham', { areas: AREAS, fetchImpl })
    expect(source).toBe('nominatim')
    expect(results.map((r) => r.label)).toEqual([
      'Peckham',
      'Peckham Rye',
      'Peckham Rye Station, Rye Lane',
    ])
    expect(results[0].source).toBe('gazetteer')
    expect(results[2].source).toBe('nominatim')
    const url = fetchImpl.mock.calls[0][0]
    expect(url).toContain('bounded=1')
    expect(url).toContain('countrycodes=gb')
  })
  it('falls back to the gazetteer when the network fails', async () => {
    const fetchImpl = vi.fn(async () => {
      throw new TypeError('Failed to fetch')
    })
    const { results, source, offline } = await resolveLocation('Hackney', {
      areas: AREAS,
      fetchImpl,
    })
    expect(source).toBe('gazetteer')
    expect(offline).toBe(true)
    expect(results.map((r) => r.label)).toEqual(['Hackney', 'Hackney Wick'])
  })
  it('geocodePlace shortens display names to something a chat can read', async () => {
    const fetchImpl = vi.fn(async () =>
      json([
        {
          lat: '51.5',
          lon: '-0.1',
          display_name:
            'Brockwell Park, Herne Hill, London Borough of Lambeth, London, Greater London, England, SE24 0PA, United Kingdom',
          type: 'park',
        },
      ]),
    )
    const [r] = await geocodePlace('Brockwell Park', { fetchImpl })
    expect(r.label).toBe('Brockwell Park, Herne Hill')
    expect(r.sub).toBe('park')
  })
})
