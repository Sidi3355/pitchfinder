// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { compactPitch, INDEX_FIELDS } from '../../src/lib/compact.js'

describe('compactPitch', () => {
  it('keeps only the first-screen fields and drops nulls', () => {
    const full = {
      id: 'x',
      name: 'X',
      type: 'park',
      lat: 1,
      lng: 2,
      postcode: null,
      memberIds: ['a', 'b'],
      sourceUrl: 'https://osm',
      verifiedAt: '2026-09-11',
      openingHours: 'Mo-Su',
      pricePerHour: 0,
      lit: false,
    }
    const c = compactPitch(full)
    expect(Object.keys(c).every((k) => INDEX_FIELDS.includes(k))).toBe(true)
    expect(c).not.toHaveProperty('memberIds')
    expect(c).not.toHaveProperty('sourceUrl')
    expect(c).not.toHaveProperty('postcode')
    expect(c.pricePerHour).toBe(0)
    expect(c.lit).toBe(false)
  })
})
