import { beforeEach, describe, expect, it, vi } from 'vitest'
import { journeyTimes, resetRouteCache, routingAvailability } from '../../src/lib/routing.js'

const from = { lat: 51.4741, lng: -0.0691 }
const pitches = [
  { id: 'a', lat: 51.48, lng: -0.07 },
  { id: 'b', lat: 51.5, lng: -0.1 },
]
const json = (body, status = 200) => ({ ok: status < 400, status, json: async () => body })

beforeEach(() => {
  localStorage.clear()
  resetRouteCache()
})

describe('journeyTimes', () => {
  it('uses one OSRM table request per mode and labels the source, with a door-to-door overhead', async () => {
    const fetchImpl = vi.fn(async () =>
      json({ code: 'Ok', durations: [[600, 1800]], distances: [[800, 2400]] }),
    )
    const times = await journeyTimes(from, pitches, 'walk', { fetchImpl })
    expect(fetchImpl).toHaveBeenCalledTimes(1)
    expect(fetchImpl.mock.calls[0][0]).toContain('/table/v1/foot/')
    expect(times.get('a')).toEqual({ minutes: 12, source: 'osrm', mode: 'walk', distanceM: 800 })
    expect(times.get('b').minutes).toBe(32)
  })
  it('falls back to the labelled estimate when the router fails or a pitch is unreachable', async () => {
    const fetchImpl = vi.fn(async () => json({ code: 'Ok', durations: [[null, 900]] }))
    const times = await journeyTimes(from, pitches, 'cycle', { fetchImpl })
    expect(times.get('a').source).toBe('estimate')
    expect(times.get('b')).toMatchObject({ minutes: 19, source: 'osrm' })
    const down = vi.fn(async () => json({}, 503))
    const t2 = await journeyTimes(from, pitches, 'drive', { fetchImpl: down })
    expect(t2.get('a').source).toBe('estimate')
    expect(t2.get('a').minutes).toBeGreaterThan(0)
  })
  it('caches routed results so a second call makes no request', async () => {
    const fetchImpl = vi.fn(async () => json({ code: 'Ok', durations: [[600, 1800]] }))
    await journeyTimes(from, pitches, 'walk', { fetchImpl })
    await journeyTimes(from, pitches, 'walk', { fetchImpl })
    expect(fetchImpl).toHaveBeenCalledTimes(1)
  })
  it('public transport is an estimate without a TfL key', async () => {
    const fetchImpl = vi.fn()
    const times = await journeyTimes(from, pitches, 'transit', { fetchImpl })
    expect(fetchImpl).not.toHaveBeenCalled()
    expect(times.get('a').source).toBe('estimate')
    expect(routingAvailability().transit).toBe('estimate')
    expect(routingAvailability().walk).toBe('osrm')
  })
})
