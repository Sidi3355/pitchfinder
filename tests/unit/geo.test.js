import { describe, expect, it } from 'vitest'
import { haversineKm, estimateEta, centroid } from '../../src/lib/geo.js'

const peckham = { lat: 51.4741, lng: -0.0691 }
const hackney = { lat: 51.545, lng: -0.0553 }

describe('haversineKm', () => {
  it('is zero for the same point', () => {
    expect(haversineKm(peckham, peckham)).toBe(0)
  })
  it('measures Peckham to Hackney at roughly 8 km', () => {
    const km = haversineKm(peckham, hackney)
    expect(km).toBeGreaterThan(7.5)
    expect(km).toBeLessThan(8.5)
  })
})

describe('estimateEta', () => {
  it('is faster by bike than on foot', () => {
    expect(estimateEta(peckham, hackney, 'cycle')).toBeLessThan(
      estimateEta(peckham, hackney, 'walk'),
    )
  })
  it('falls back to public transport for an unknown mode', () => {
    expect(estimateEta(peckham, hackney, 'teleport')).toBe(estimateEta(peckham, hackney, 'transit'))
  })
})

describe('centroid', () => {
  it('returns null for no points', () => {
    expect(centroid([])).toBeNull()
  })
  it('averages coordinates', () => {
    const c = centroid([peckham, hackney])
    expect(c.lat).toBeCloseTo((peckham.lat + hackney.lat) / 2, 6)
    expect(c.lng).toBeCloseTo((peckham.lng + hackney.lng) / 2, 6)
  })
})
