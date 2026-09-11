import { describe, expect, it } from 'vitest'
import {
  buildHref,
  buildSearch,
  decodeGroup,
  encodeGroup,
  parseSearch,
} from '../../src/lib/url-state.js'
import { DEFAULT_FILTERS } from '../../src/lib/score.js'

const sam = { name: 'Sam', label: 'E8 3DL', lat: 51.54751, lng: -0.05534, mode: 'transit' }
const ali = { name: 'Ali', label: 'Peckham', lat: 51.4741, lng: -0.0691, mode: 'cycle' }

describe('group encoding', () => {
  it('round-trips names, labels, coordinates and modes', () => {
    const decoded = decodeGroup(encodeGroup([sam, ali]))
    expect(decoded).toHaveLength(2)
    expect(decoded[0]).toMatchObject({
      name: 'Sam',
      label: 'E8 3DL',
      lat: 51.5475,
      lng: -0.0553,
      mode: 'transit',
    })
    expect(decoded[1]).toMatchObject({ name: 'Ali', label: 'Peckham', mode: 'cycle' })
    expect(decoded.map((m) => m.id)).toEqual(['m0', 'm1'])
  })

  it('reads well in a shared link', () => {
    expect(encodeGroup([sam])).toBe('Sam~E8%203DL~51.5475~-0.0553~t')
  })

  it('survives separators and unicode inside names', () => {
    const odd = { name: 'Zoë ~;& fan', label: 'Bermondsey', lat: 51.49, lng: -0.06, mode: 'walk' }
    const [m] = decodeGroup(encodeGroup([odd]))
    expect(m.name).toBe('Zoë ~;& fan')
    expect(m.mode).toBe('walk')
  })

  it('drops members with coordinates outside the UK or missing fields', () => {
    expect(decodeGroup('Bad~x~0~0~t;Ok~here~51.5~-0.1~d')).toHaveLength(1)
    expect(decodeGroup('short~fields')).toEqual([])
    expect(decodeGroup('')).toEqual([])
  })

  it('defaults an unknown mode to public transport and an empty name to Player N', () => {
    const [m] = decodeGroup('~~51.5~-0.1~zz')
    expect(m.mode).toBe('transit')
    expect(m.name).toBe('Player 1')
  })
})

describe('search string', () => {
  it('parses an empty query as the default filters, no group, no pitch', () => {
    expect(parseSearch('')).toEqual({ group: [], filters: DEFAULT_FILTERS, pitch: null })
    expect(parseSearch('?g=Sam~E8~51.5~-0.1~t').filters).toEqual(DEFAULT_FILTERS)
  })

  it('is empty for default state', () => {
    expect(buildSearch({ group: [], filters: DEFAULT_FILTERS, pitch: null })).toBe('')
  })

  it('round-trips every filter and the selected pitch', () => {
    const filters = {
      ...DEFAULT_FILTERS,
      types: ['park', 'cage'],
      enclosure: 'bounded',
      format: 7,
      maxPricePerHead: 6,
      maxEta: 30,
      needsFloodlights: true,
      freeOnly: true,
      bookableOnly: true,
    }
    const search = buildSearch({ group: [sam], filters, pitch: 'pl-shoreditch' })
    const parsed = parseSearch(search)
    expect(parsed.filters).toEqual(filters)
    expect(parsed.pitch).toBe('pl-shoreditch')
    expect(parsed.group).toHaveLength(1)
    expect(buildSearch(parsed)).toBe(search)
  })

  it('ignores junk values rather than crashing', () => {
    const parsed = parseSearch('?t=park,alien&fmt=9&budget=99&eta=abc&p=../../x&g=nope&lit=maybe')
    expect(parsed.filters.types).toEqual(['park'])
    expect(parsed.filters.format).toBeNull()
    expect(parsed.filters.maxPricePerHead).toBeNull()
    expect(parsed.filters.maxEta).toBeNull()
    expect(parsed.filters.needsFloodlights).toBe(false)
    expect(parsed.pitch).toBeNull()
    expect(parsed.group).toEqual([])
  })

  it('accepts a leading ? and a bare query', () => {
    expect(parseSearch('?lit=1').filters.needsFloodlights).toBe(true)
    expect(parseSearch('lit=1').filters.needsFloodlights).toBe(true)
  })

  it('builds a full href', () => {
    expect(buildHref('/', { filters: { ...DEFAULT_FILTERS, freeOnly: true } })).toBe('/?free=1')
    expect(buildHref('/p/abc', {})).toBe('/p/abc')
  })
})
