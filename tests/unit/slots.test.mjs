import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  bandsFromSlots,
  cheapestBand,
  compareSlots,
  describeDays,
  describeWindows,
  formatFromLabel,
  labelBand,
  linesFromBands,
  mergeWindows,
  parsePitchbookingSlots,
  parsePlayfinderSlots,
  perHour,
  slotTime,
  slotsFromColumns,
  surfaceFromLabel,
  weekStartFromHeading,
} from '../../scripts/lib/slots.mjs'

const fixture = (name) => readFileSync(join(process.cwd(), 'tests/fixtures', name), 'utf8')
const TODAY = new Date('2026-09-12T16:00:00Z')

describe('slot calendars', () => {
  it('reads the week Playfinder shows, day by day, with booked slots unpriced', () => {
    const { weekStart, slots } = parsePlayfinderSlots(
      fixture('playfinder-powerleague-shoreditch.txt'),
      { today: TODAY },
    )
    expect(weekStart).toBe('2026-09-12')
    expect(slots[0]).toEqual({
      date: '2026-09-12',
      day: 'sat',
      time: '17:00',
      minutes: 60,
      amount: null,
    })
    expect(slots[1]).toEqual({
      date: '2026-09-12',
      day: 'sat',
      time: '18:00',
      minutes: 60,
      amount: 75,
    })
    const sunday = slots.filter((s) => s.day === 'sun')
    expect(sunday[0].time).toBe('10:00')
    expect(sunday.every((s) => s.amount === 75 || s.amount === null)).toBe(true)
    const monday = slots.filter((s) => s.day === 'mon')
    expect(monday.find((s) => s.time === '09:00')).toMatchObject({ amount: 95, minutes: 40 })
    expect(monday.find((s) => s.time === '17:40')).toMatchObject({ amount: 110, minutes: 40 })
    expect(new Set(slots.map((s) => s.day)).size).toBe(7)
    expect(slots.filter((s) => s.day === 'fri').at(-1)).toMatchObject({ time: '21:00', amount: 95 })
  })

  it('folds a week of slots into bands with days, kick-off windows and a slot count', () => {
    const { slots } = parsePlayfinderSlots(fixture('playfinder-powerleague-shoreditch.txt'), {
      today: TODAY,
    })
    const bands = bandsFromSlots(slots, { format: 5, surface: '3g' })
    expect(bands.map((b) => [b.amount, b.minutes, describeDays(b.days)])).toEqual([
      [95, 40, 'Weekdays'],
      [110, 40, 'Weekdays'],
      [75, 60, 'Weekends'],
    ])
    const offPeak = bands[0]
    expect(offPeak.windows).toEqual([
      ['09:00', '17:00'],
      ['21:00', '21:00'],
    ])
    expect(labelBand(offPeak)).toBe('5-a-side, Weekdays, kick-off 09:00 to 17:00 and 21:00')
    expect(bands[1].windows).toEqual([['17:40', '20:20']])
    expect(offPeak.slotsSeen).toBeGreaterThan(50)
    expect(perHour(95, 40)).toBe(143)
    expect(cheapestBand(bands)).toMatchObject({ amount: 75, minutes: 60 })
  })

  it('keeps Friday and Sunday apart from the rest of the week when they differ', () => {
    const { slots } = parsePlayfinderSlots(fixture('playfinder-goals-beckenham.txt'), {
      today: TODAY,
    })
    const bands = bandsFromSlots(slots, { format: 5 })
    const labels = bands.map((b) => `${describeDays(b.days)} £${b.amount}`)
    expect(labels).toContain('Mon to Thu £88')
    expect(labels).toContain('Mon to Thu £111')
    expect(labels).toContain('Fri £72')
    expect(labels).toContain('Sun £67')
    expect(labels.some((l) => l.startsWith('Sat'))).toBe(false) // every Saturday slot was booked
    const evening = bands.find((b) => b.amount === 111)
    expect(evening.windows[0][0]).toBe('18:30')
  })

  it('reads a Pitchbooking day with its date, pitch types and per-slot pitches', () => {
    const { date, pitchTypes, slots } = parsePitchbookingSlots(
      fixture('pitchbooking-goals-beckenham.txt'),
    )
    expect(date).toBe('2026-09-13')
    expect(pitchTypes).toEqual(['5-A-Side', '8-A-side'])
    expect(slots).toHaveLength(26)
    expect(slots[0]).toMatchObject({
      day: 'sun',
      time: '09:00',
      minutes: 60,
      amount: 67,
      perPlayer: 6.7,
    })
    expect(slots[0].pitches).toEqual([
      'Pitch 1 - Wembley',
      'Pitch 2 - Estadio Azteca',
      'Pitch 3 - La Bombonera',
      'Pitch 4 - Stade de France',
    ])
    expect(slots.at(-1)).toMatchObject({ time: '22:00', amount: 67 })
    expect(formatFromLabel('5-A-Side')).toBe(5)
    expect(formatFromLabel('8-A-side')).toBe(8)
    expect(formatFromLabel('football-7-a-side-36030')).toBe(7)
    expect(formatFromLabel('11 a side junior')).toBe(11)
  })

  it('agrees with itself across two sites when the same slots carry the same price', () => {
    const pf = parsePlayfinderSlots(fixture('playfinder-goals-beckenham.txt'), { today: TODAY })
    const pb = parsePitchbookingSlots(fixture('pitchbooking-goals-beckenham.txt'))
    const { compared, agreed } = compareSlots(pb.slots, pf.slots)
    expect(compared).toBe(26)
    expect(agreed).toBe(26)
  })

  it('assigns days by column when the headers line up, else says so', () => {
    const headers = ['sat', 'sun', 'mon', 'tue', 'wed', 'thu', 'fri'].map((day, i) => ({
      day,
      cx: 100 + i * 150,
    }))
    const raw = [
      { text: '17:00 Booked 60 min', cx: 100 },
      { text: '10:00 £75.00 60 min', cx: 252 },
      { text: '09:00 £95.00 40 min', cx: 1000 },
    ]
    const slots = slotsFromColumns(raw, headers, '2026-09-12')
    expect(slots.map((s) => s.day)).toEqual(['sat', 'sun', 'fri'])
    expect(slots[1]).toMatchObject({ date: '2026-09-13', amount: 75 })
    expect(slotsFromColumns(raw, headers.slice(0, 6), '2026-09-12')).toBeNull()
    expect(
      slotsFromColumns([{ text: '10:00 £75.00 60 min', cx: 5000 }], headers, '2026-09-12'),
    ).toBeNull()
  })

  it('has small helpers that read like the page', () => {
    expect(slotTime('9:00AM')).toBe('09:00')
    expect(slotTime('10:30 PM')).toBe('22:30')
    expect(slotTime('17:00')).toBe('17:00')
    expect(weekStartFromHeading('Sat 12 September - Fri 18 September', TODAY)).toBe('2026-09-12')
    expect(weekStartFromHeading('Mon 28 December - Sun 3 January', new Date('2027-01-01'))).toBe(
      '2026-12-28',
    )
    expect(surfaceFromLabel('5 a side | 3G Astroturf')).toBe('3g')
    expect(surfaceFromLabel('7 a side | Astroturf')).toBe('astro')
    expect(surfaceFromLabel('11 a side | Grass')).toBe('grass')
    expect(mergeWindows(['10:00', '10:30', '11:00', '18:00', '18:30'], 60)).toEqual([
      ['10:00', '11:00'],
      ['18:00', '18:30'],
    ])
    expect(describeDays(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'])).toBe('Every day')
    expect(describeDays(['sat', 'sun'])).toBe('Weekends')
    expect(describeDays(['mon', 'wed', 'fri'])).toBe('Mon, Wed and Fri')
    expect(describeDays(['tue'])).toBe('Tue')
    expect(
      describeWindows([
        ['09:00', '17:00'],
        ['21:00', '21:00'],
      ]),
    ).toBe('kick-off 09:00 to 17:00 and 21:00')
    const lines = linesFromBands(
      [
        {
          format: 7,
          amount: 100,
          minutes: 60,
          days: ['sat', 'sun'],
          windows: [['10:00', '20:00']],
          slotsSeen: 12,
        },
      ],
      { source: 'playfinder', sourceUrl: 'https://www.playfinder.com/x', checkedAt: '2026-09-12' },
    )
    expect(lines[0]).toMatchObject({
      unit: 'slot',
      minutes: 60,
      label: '7-a-side, Weekends, kick-off 10:00 to 20:00',
      source: 'playfinder',
    })
  })
})
