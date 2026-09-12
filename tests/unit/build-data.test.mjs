// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { parksFromElements } from '../../scripts/build-data.mjs'

const el = (name, extra = {}, tags = {}) => ({
  type: 'way',
  id: 1,
  bounds: { minlat: 51.5, maxlat: 51.51, minlon: -0.1, maxlon: -0.09 },
  tags: { name, ...tags },
  ...extra,
})

describe('parksFromElements', () => {
  it('keeps public parks and playing fields as naming sources', () => {
    const parks = parksFromElements([el('Mile End Park'), el('Hackney Marshes')])
    expect(parks.map((p) => p.name)).toEqual(['Mile End Park', 'Hackney Marshes'])
  })
  it('never names a pitch after a private or residents-only facility', () => {
    const parks = parksFromElements([
      el('London Dock - Residents Spa & Gym'),
      el('Virgin Active Health Club'),
      el('Somewhere Sports Centre', {}, { access: 'private' }),
      el('Members Only Lawn', {}),
      el('Victoria Park'),
    ])
    expect(parks.map((p) => p.name)).toEqual(['Victoria Park'])
  })
  it('drops areas wider than the span limit', () => {
    const big = el('Epping Forest', {
      bounds: { minlat: 51.6, maxlat: 51.7, minlon: 0.0, maxlon: 0.1 },
    })
    expect(parksFromElements([big])).toEqual([])
  })
})
