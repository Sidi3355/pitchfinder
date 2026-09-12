import { describe, expect, it } from 'vitest'
import {
  formatHours,
  formatTime,
  hoursSummary,
  openState,
  parseHoursText,
  parseOsmHours,
  parseSchemaHours,
  parseTime,
} from '../../src/lib/hours.js'

describe('parseTime', () => {
  it('reads 12-hour and 24-hour clocks and refuses ambiguous ones', () => {
    expect(parseTime('9am')).toBe('09:00')
    expect(parseTime('9.30pm')).toBe('21:30')
    expect(parseTime('12pm')).toBe('12:00')
    expect(parseTime('12am')).toBe('00:00')
    expect(parseTime('23:00')).toBe('23:00')
    expect(parseTime('21.30')).toBe('21:30')
    expect(parseTime('midnight')).toBe('24:00')
    expect(parseTime('noon')).toBe('12:00')
    expect(parseTime('9')).toBeNull()
    expect(parseTime('13pm')).toBeNull()
  })
})

describe('parseOsmHours', () => {
  it('reads the common OpenStreetMap forms', () => {
    const w = parseOsmHours('Mo-Fr 09:00-22:00; Sa,Su 09:00-18:00')
    expect(w.mon).toEqual([['09:00', '22:00']])
    expect(w.fri).toEqual([['09:00', '22:00']])
    expect(w.sat).toEqual([['09:00', '18:00']])
    expect(w.sun).toEqual([['09:00', '18:00']])
    expect(parseOsmHours('24/7').wed).toEqual([['00:00', '24:00']])
    const off = parseOsmHours('Mo-Sa 08:00-20:00; Su off')
    expect(off.sun).toEqual([])
    expect(parseOsmHours('Mo-Su 07:00-22:00; PH off').sun).toEqual([['07:00', '22:00']])
    expect(parseOsmHours('sunrise-sunset')).toBeNull()
    expect(parseOsmHours('')).toBeNull()
  })
})

describe('parseSchemaHours', () => {
  it('reads openingHoursSpecification and openingHours strings', () => {
    const w = parseSchemaHours([
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday'],
        opens: '09:00',
        closes: '23:00',
      },
      { dayOfWeek: 'https://schema.org/Sunday', opens: '10:00:00', closes: '00:00' },
    ])
    expect(w.mon).toEqual([['09:00', '23:00']])
    expect(w.tue).toEqual([['09:00', '23:00']])
    expect(w.sun).toEqual([['10:00', '24:00']])
    expect(w.wed).toEqual([])
    expect(parseSchemaHours(['Mo-Fr 09:00-22:00']).thu).toEqual([['09:00', '22:00']])
  })
})

describe('parseHoursText', () => {
  it('reads an opening times block from a page and quotes it', () => {
    const text = `Leagues every Monday 7pm-9pm.\nOpening Times\nMonday - Friday\n09:00 - 23:00\nSaturday & Sunday: 9am to 9pm\nContact us`
    const r = parseHoursText(text)
    expect(r.week.mon).toEqual([['09:00', '23:00']])
    expect(r.week.fri).toEqual([['09:00', '23:00']])
    expect(r.week.sat).toEqual([['09:00', '21:00']])
    expect(r.week.sun).toEqual([['09:00', '21:00']])
    expect(r.quotes).toHaveLength(2)
  })
  it('does not read kick-off times as opening hours, and needs a heading', () => {
    expect(parseHoursText('Leagues every Monday 7pm-9pm. Book now.')).toBeNull()
    const r = parseHoursText('Opening hours: Weekdays 9am - 11pm, Weekends 9 - 11pm')
    expect(r.week.mon).toEqual([['09:00', '23:00']])
    expect(r.week.sat).toEqual([]) // '9 - 11pm' is ambiguous, so it is left out
  })
})

describe('formatting', () => {
  it('formats times and groups days', () => {
    expect(formatTime('09:00')).toBe('9am')
    expect(formatTime('21:30')).toBe('9:30pm')
    expect(formatTime('24:00')).toBe('midnight')
    const w = parseOsmHours('Mo-Fr 09:00-23:00; Sa,Su 09:00-21:00')
    expect(formatHours(w)).toEqual([
      { days: 'Mon to Fri', times: '9am to 11pm' },
      { days: 'Sat and Sun', times: '9am to 9pm' },
    ])
    expect(hoursSummary(w)).toBe('Mon to Fri 9am to 11pm, Sat and Sun 9am to 9pm')
    expect(formatHours(parseOsmHours('Mo-Su 08:00-22:00'))).toEqual([
      { days: 'Every day', times: '8am to 10pm' },
    ])
    expect(formatHours(parseOsmHours('Mo-Sa 08:00-20:00; Su off'))[1]).toEqual({
      days: 'Sun',
      times: 'Closed',
    })
  })
  it('says whether a place is open now', () => {
    const w = parseOsmHours('Mo-Fr 09:00-23:00; Sa,Su 09:00-21:00')
    const wed8pm = new Date(2026, 8, 16, 20, 0)
    expect(openState(w, wed8pm)).toEqual({ open: true, label: 'Open until 11pm' })
    const wed7am = new Date(2026, 8, 16, 7, 0)
    expect(openState(w, wed7am)).toEqual({ open: false, label: 'Opens at 9am' })
    const sat10pm = new Date(2026, 8, 19, 22, 0)
    expect(openState(w, sat10pm)).toEqual({ open: false, label: 'Opens tomorrow 9am' })
    const closedSun = parseOsmHours('Mo-Fr 09:00-23:00; Sa,Su off')
    expect(openState(closedSun, new Date(2026, 8, 19, 12, 0))).toEqual({
      open: false,
      label: 'Opens Mon 9am',
    })
    expect(openState(null)).toBeNull()
  })
})
