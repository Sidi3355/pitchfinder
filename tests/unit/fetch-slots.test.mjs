import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  artificialFootball,
  goalsSlug,
  playfinderPitch,
  playfinderSlug,
  priorityOf,
  slotsFromPage,
  venueFacts,
} from '../../scripts/fetch-slots.mjs'
import { nameSimilarity } from '../../scripts/lib/pipeline.mjs'

const got = JSON.parse(
  readFileSync(
    join(process.cwd(), 'tests/fixtures/playfinder-powerleague-shoreditch.json'),
    'utf8',
  ),
)

describe('reading a Playfinder venue page', () => {
  const facts = venueFacts(got, 'powerleague-shoreditch')
  it('takes the name, area, address, postcode and the hours table', () => {
    expect(facts.name).toBe('Powerleague Shoreditch')
    expect(facts.area).toBe('Hackney')
    expect(facts.address).toBe('Braithwaite Street, Shoreditch, London, E1 6GJ')
    expect(facts.postcode).toBe('E1 6GJ')
    expect(facts.hours.mon).toEqual([['09:00', '22:30']])
    expect(facts.hours.sat).toEqual([['10:00', '18:00']])
    expect(facts.hours.sun).toEqual([['10:00', '22:30']])
    expect(facts.hoursQuotes[0]).toBe('Monday 09:00-22:30')
    expect(facts.priceSummary).toBe('From £35.97-£99.50/40 mins')
  })
  it('lists the football pitches with size and surface, and the facilities stated', () => {
    expect(facts.pitches).toEqual([
      {
        url: 'https://www.playfinder.com/london/venue/powerleague-shoreditch/football-5-a-side-34946',
        label: '5 a side | 3G Astroturf',
        format: 5,
        surface: '3g',
      },
      {
        url: 'https://www.playfinder.com/london/venue/powerleague-shoreditch/football-7-a-side-36030',
        label: '7 a side | 3G Astroturf',
        format: 7,
        surface: '3g',
      },
    ])
    expect(facts.facilities.lit).toBe(true)
    expect(facts.facilities.changingRooms).toBe(true)
    expect(artificialFootball(facts.pitches)).toHaveLength(2)
    expect(
      artificialFootball([
        { format: 11, surface: 'grass' },
        { format: 7, surface: 'astro' },
        { format: 7, surface: 'astro' },
        { format: null, surface: '3g' },
      ]),
    ).toEqual([{ format: 7, surface: 'astro' }])
  })
  it('reads the week of slots from the page text when no columns are available', () => {
    const { weekStart, slots, dayAssignment } = slotsFromPage(got, '2026-09-12')
    expect(weekStart).toBe('2026-09-12')
    expect(dayAssignment).toBe('sequence')
    expect(slots.length).toBeGreaterThan(100)
  })
})

describe('deciding what to read', () => {
  it('recognises venue and pitch links', () => {
    expect(playfinderSlug('https://www.playfinder.com/london/venue/markfield-park-')).toBe(
      'markfield-park-',
    )
    expect(
      playfinderSlug('https://www.playfinder.com/london/venue/x/football-5-a-side-1'),
    ).toBeNull()
    expect(
      playfinderPitch('https://www.playfinder.com/london/venue/x/football-5-a-side-1'),
    ).toEqual({
      slug: 'x',
      pitch: 'football-5-a-side-1',
    })
    expect(playfinderPitch('https://www.playfinder.com/london/venue/x/tennis-court-1')).toBeNull()
  })
  it('puts Powerleague first, then venues that look like ones on the map, and skips Goals', () => {
    const names = ['Westway Sports Centre', 'Paddington Recreation Ground']
    expect(priorityOf('powerleague-vauxhall', new Set(), false, names, null).score).toBe(4)
    expect(
      priorityOf('westway-sports-centre', new Set(), false, names, null).score,
    ).toBeGreaterThan(2)
    expect(priorityOf('some-school', new Set(), false, names, null).score).toBe(1)
    expect(priorityOf('goals-beckenham', new Set(), false, names, null)).toBeNull()
    expect(priorityOf('tennis-only', new Set(['tennis-court-1']), true, names, null)).toBeNull()
    expect(
      priorityOf('a', new Set(['football-5-a-side-1']), true, names, { fetchedAt: '2026-01-01' })
        .age,
    ).toBeGreaterThan(0)
    expect(nameSimilarity('paddington-recreation-ground', 'Paddington Recreation Ground')).toBe(1)
    expect(
      nameSimilarity('feel-good-too-sports-centre-ive-farm', 'Ive Farm Fields'),
    ).toBeGreaterThan(0.2)
  })
  it('turns a Pitchbooking club name into the id used on the map', () => {
    expect(goalsSlug('Goals Beckenham')).toBe('beckenham')
    expect(goalsSlug('Goals Gillette Corner')).toBe('gillette-corner')
  })
})
