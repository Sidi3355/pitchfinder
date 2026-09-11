import { describe, expect, it } from 'vitest'
import {
  buildIcs,
  buildSummary,
  formatMoney,
  icsDataUrl,
  splitCost,
} from '../../src/lib/game-extras.js'

describe('buildIcs', () => {
  it('writes a valid one-hour event in UTC with escaped text and CRLF lines', () => {
    const ics = buildIcs({
      uid: 'abc@pitchfinder',
      title: 'Football, Powerleague Shoreditch',
      startsAt: '2026-10-01T18:30:00Z',
      location: 'Powerleague Shoreditch; E2 8DP',
      description: 'Bring bibs\nand a ball',
      url: 'https://example.com/g/abc',
    })
    expect(ics).toContain('BEGIN:VCALENDAR\r\n')
    expect(ics).toContain('DTSTART:20261001T183000Z')
    expect(ics).toContain('DTEND:20261001T193000Z')
    expect(ics).toContain('SUMMARY:Football\\, Powerleague Shoreditch')
    expect(ics).toContain('LOCATION:Powerleague Shoreditch\; E2 8DP')
    expect(ics).toContain('DESCRIPTION:Bring bibs\\nand a ball')
    expect(ics.endsWith('END:VCALENDAR\r\n')).toBe(true)
    expect(icsDataUrl(ics).startsWith('data:text/calendar;charset=utf-8,BEGIN')).toBe(true)
  })
})

describe('splitCost and formatMoney', () => {
  it('splits a whole-pitch price between those who are in, rounding up to the penny', () => {
    expect(splitCost(78, 10)).toBe(7.8)
    expect(splitCost(50, 7)).toBe(7.15)
    expect(splitCost(0, 5)).toBeNull()
    expect(splitCost(78, 0)).toBeNull()
    expect(splitCost(null, 5)).toBeNull()
    expect(formatMoney(7.8)).toBe('£7.80')
    expect(formatMoney(8)).toBe('£8')
  })
})

describe('buildSummary', () => {
  it('reads like a message a person would paste into the chat', () => {
    const text = buildSummary({
      pitchName: 'Powerleague Shoreditch',
      when: 'Thu 1 Oct, 19:30',
      postcode: 'E2 8DP',
      pricePerHour: 78,
      inCount: 10,
      url: 'https://example.com/g/abc',
      notes: 'Bring bibs',
    })
    expect(text.split('\n')).toEqual([
      'Football: Powerleague Shoreditch, Thu 1 Oct, 19:30',
      'Nearest postcode E2 8DP',
      '£78 for the pitch, £7.80 each with 10 in',
      'Bring bibs',
      'In or out? https://example.com/g/abc',
    ])
  })
  it('says free when the pitch is free and leaves the split open when nobody is in yet', () => {
    expect(
      buildSummary({ pitchName: 'X', when: 'w', pricePerHour: 0, inCount: 0, url: 'u' }),
    ).toContain('Free to play')
    expect(
      buildSummary({ pitchName: 'X', when: 'w', pricePerHour: 40, inCount: 0, url: 'u' }),
    ).toContain('split between whoever is in')
  })
})
