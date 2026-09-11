// @vitest-environment node
import { describe, expect, it, vi } from 'vitest'
import {
  keyFor,
  lookupPostcode,
  reversePostcodes,
  reverseRoads,
} from '../../scripts/lib/geocode.mjs'

const noSleep = () => Promise.resolve()

function jsonResponse(body, status = 200) {
  return { ok: status < 400, status, json: async () => body }
}

describe('reversePostcodes', () => {
  it('batches 100 points per request, fills the cache and skips cached points', async () => {
    const points = Array.from({ length: 150 }, (_, i) => ({ lat: 51.5 + i * 0.001, lng: -0.1 }))
    const fetchImpl = vi.fn(async (_url, init) => {
      const n = JSON.parse(init.body).geolocations.length
      return jsonResponse({
        result: Array.from({ length: n }, (_, j) => ({
          result:
            j % 10 === 9
              ? []
              : [
                  {
                    postcode: `E8 ${j}AA`,
                    admin_district: 'Hackney',
                    admin_ward: 'Dalston',
                    distance: 40,
                  },
                ],
        })),
      })
    })
    const cache = await reversePostcodes(points, { fetchImpl, sleep: noSleep })
    expect(fetchImpl).toHaveBeenCalledTimes(2)
    expect(Object.keys(cache)).toHaveLength(150)
    expect(cache[keyFor(51.5, -0.1)]).toMatchObject({
      postcode: 'E8 0AA',
      district: 'Hackney',
      ward: 'Dalston',
    })
    expect(cache[keyFor(51.509, -0.1)].postcode).toBeNull()
    await reversePostcodes(points, { cache, fetchImpl, sleep: noSleep })
    expect(fetchImpl).toHaveBeenCalledTimes(2)
  })
  it('throws on a server error so the build does not write half a cache', async () => {
    const fetchImpl = vi.fn(async () => jsonResponse({}, 500))
    await expect(
      reversePostcodes([{ lat: 51.5, lng: 0 }], { fetchImpl, sleep: noSleep }),
    ).rejects.toThrow(/500/)
  })
})

describe('lookupPostcode', () => {
  it('returns coordinates for a valid postcode and null for an unknown one', async () => {
    const fetchImpl = vi.fn(async (url) =>
      url.includes('E8%203DL')
        ? jsonResponse({ result: { latitude: 51.54, longitude: -0.06, admin_district: 'Hackney' } })
        : jsonResponse({}, 404),
    )
    expect(await lookupPostcode('E8 3DL', { fetchImpl })).toEqual({
      lat: 51.54,
      lng: -0.06,
      district: 'Hackney',
    })
    expect(await lookupPostcode('ZZ1 1ZZ', { fetchImpl })).toBeNull()
    expect(fetchImpl.mock.calls[0][0]).toContain('E8%203DL')
  })
})

describe('reverseRoads', () => {
  it('asks once per point, respects the cap, and stops on 429', async () => {
    const points = [
      { lat: 51.5, lng: -0.1 },
      { lat: 51.6, lng: -0.1 },
      { lat: 51.7, lng: -0.1 },
    ]
    let calls = 0
    const fetchImpl = vi.fn(async () => {
      calls++
      if (calls === 2) return jsonResponse({}, 429)
      return jsonResponse({ address: { road: `Road ${calls}`, suburb: 'Somewhere' } })
    })
    const cache = await reverseRoads(points, { fetchImpl, sleep: noSleep, max: 2 })
    expect(fetchImpl).toHaveBeenCalledTimes(2)
    expect(cache[keyFor(51.5, -0.1)].road).toBe('Road 1')
    expect(cache[keyFor(51.6, -0.1)]).toBeUndefined()
    expect(fetchImpl.mock.calls[0][1].headers['User-Agent']).toMatch(/PitchFinderBot/)
  })
  it('records a failure so a broken point is not retried every run', async () => {
    const fetchImpl = vi.fn(async () => {
      throw new Error('boom')
    })
    const cache = await reverseRoads([{ lat: 51.5, lng: -0.1 }], { fetchImpl, sleep: noSleep })
    expect(cache[keyFor(51.5, -0.1)]).toMatchObject({ road: null, error: true })
  })
})
