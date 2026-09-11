import { describe, expect, it } from 'vitest'
import { journeyKey, journeysFor } from '../../src/lib/use-journeys.js'

const sam = { id: 'm0', lat: 51.4741, lng: -0.0691, mode: 'walk' }
const ali = { id: 'm1', lat: 51.545, lng: -0.0553, mode: 'transit' }
const pitch = { id: 'p1', lat: 51.5, lng: -0.06 }
const estimate = () => 30

describe('journeysFor', () => {
  it('uses the route where there is one and the estimate otherwise, and is routed only when all are', () => {
    const routed = new Map([
      [journeyKey(sam, pitch), { minutes: 23, source: 'osrm', mode: 'walk' }],
    ])
    const mixed = journeysFor([sam, ali], pitch, routed, estimate)
    expect(mixed.routed).toBe(false)
    expect(mixed.rows.map((r) => [r.minutes, r.source])).toEqual([
      [23, 'osrm'],
      [30, 'estimate'],
    ])
    const all = journeysFor([sam], pitch, routed, estimate)
    expect(all.routed).toBe(true)
    expect(journeysFor([], pitch, routed, estimate).routed).toBe(false)
  })
  it('keys a journey by where the person is and how they travel, not by who they are', () => {
    expect(journeyKey({ ...sam, id: 'other', name: 'X' }, pitch)).toBe(journeyKey(sam, pitch))
    expect(journeyKey({ ...sam, mode: 'cycle' }, pitch)).not.toBe(journeyKey(sam, pitch))
    expect(journeyKey({ lat: 51.4741, lng: -0.0691 }, pitch)).toContain('transit')
  })
})
