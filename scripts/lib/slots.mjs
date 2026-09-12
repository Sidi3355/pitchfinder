// Slot calendars on booking pages, turned into prices people can plan around.
// Playfinder shows a week of bookable slots per pitch; Pitchbooking (Goals'
// own booking site) shows one day per page. Both list a start time, a length
// and a price, or "Booked". This module reads that text and folds the priced
// slots into bands: what a pitch of a given size costs, for how many minutes,
// on which days and at which kick-off times. Every band keeps how many slots
// it was read from; nothing is extrapolated to days that were not read.

import { DAYS, parseTime, toMinutes } from '../../src/lib/hours.js'

const MONTHS = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
]
const WEEKDAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
const LABEL = { mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun' }

/** '9:00AM', '10:30 pm' or '17:00' -> 'HH:MM', else null. */
export function slotTime(raw) {
  return parseTime(String(raw).replace(/\s+/g, ''))
}

export function dayOfIso(iso) {
  const d = new Date(`${iso}T00:00:00Z`)
  return Number.isNaN(d.getTime()) ? null : WEEKDAYS[d.getUTCDay()]
}

export function addDays(iso, n) {
  const d = new Date(`${iso}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

/**
 * 'Sat 12 September - Fri 18 September' -> the ISO date of the first day,
 * taking the year that makes the weekday right and sits closest to today.
 */
export function weekStartFromHeading(text, today = new Date()) {
  if (!(today instanceof Date)) today = new Date(today)
  const m = String(text).match(
    /\b(Mon|Tue|Wed|Thu|Fri|Sat|Sun)\s+(\d{1,2})\s+([A-Z][a-z]+)\s*(?:-|–|to)\s*(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)\s+\d{1,2}\s+[A-Z][a-z]+/,
  )
  if (!m) return null
  const month = MONTHS.indexOf(m[3].toLowerCase())
  if (month < 0) return null
  const want = WEEKDAYS.indexOf(m[1].toLowerCase())
  let best = null
  for (const year of [
    today.getUTCFullYear() - 1,
    today.getUTCFullYear(),
    today.getUTCFullYear() + 1,
  ]) {
    const d = new Date(Date.UTC(year, month, Number(m[2])))
    if (d.getUTCDay() !== want) continue
    const diff = Math.abs(d.getTime() - today.getTime())
    if (!best || diff < best.diff) best = { d, diff }
  }
  return best ? best.d.toISOString().slice(0, 10) : null
}

/**
 * Playfinder's week view as visible text -> { weekStart, slots }. Each slot is
 * { date, day, time, minutes, amount } with amount null when booked. Days are
 * not marked in the text, so a slot that starts earlier than the one before it
 * begins the next day; the browser reader passes column positions instead when
 * it has them (see slotsFromColumns).
 */
export function parsePlayfinderSlots(text, { today } = {}) {
  const src = String(text)
  const weekStart = weekStartFromHeading(src, today)
  const re = /(\d{1,2}:\d{2})\s*\n\s*(Booked|£\s?(\d+(?:\.\d{1,2})?))\s*\n\s*(\d+)\s*mins?\b/g
  const slots = []
  let dayIndex = 0
  let prev = -1
  for (const m of src.matchAll(re)) {
    const time = slotTime(m[1])
    if (!time) continue
    const t = toMinutes(time)
    if (t < prev) dayIndex++
    prev = t
    if (dayIndex > 6) break
    const date = weekStart ? addDays(weekStart, dayIndex) : null
    slots.push({
      date,
      day: date ? dayOfIso(date) : null,
      time,
      minutes: Number(m[4]),
      amount: m[3] != null ? Number(m[3]) : null,
    })
  }
  return { weekStart, slots }
}

/**
 * Slots read from the page with their column position, plus the day headers
 * with theirs -> the same slot list with days assigned by column. Falls back
 * to null when the columns do not line up (the caller then uses the text order).
 */
export function slotsFromColumns(rawSlots, headers, weekStart) {
  if (!Array.isArray(headers) || headers.length !== 7 || !weekStart) return null
  const cols = [...headers].sort((a, b) => a.cx - b.cx)
  const gap = Math.min(...cols.slice(1).map((h, i) => h.cx - cols[i].cx))
  if (!(gap > 20)) return null
  const slots = []
  for (const raw of rawSlots) {
    const m = String(raw.text).match(
      /^(\d{1,2}:\d{2})\s+(Booked|£\s?(\d+(?:\.\d{1,2})?))\s+(\d+)\s*mins?\b/,
    )
    const time = m ? slotTime(m[1]) : null
    if (!time) continue
    let best = null
    for (let i = 0; i < cols.length; i++) {
      const d = Math.abs(cols[i].cx - raw.cx)
      if (!best || d < best.d) best = { i, d }
    }
    if (!best || best.d > gap / 2) return null
    const date = addDays(weekStart, best.i)
    slots.push({
      date,
      day: dayOfIso(date),
      time,
      minutes: Number(m[4]),
      amount: m[3] != null ? Number(m[3]) : null,
    })
  }
  return slots
}

/**
 * Pitchbooking's day view as visible text -> { date, pitchTypes, slots }.
 * A slot is { time, minutes, amount, perPlayer, pitches } (only bookable
 * slots are shown on the page, so there is no "booked" state).
 */
export function parsePitchbookingSlots(text) {
  const src = String(text)
  const dm = src.match(/\bDate\s*\n\s*(\d{1,2})-([A-Za-z]{3})-(\d{4})/)
  let date = null
  if (dm) {
    const month = MONTHS.findIndex((m) => m.startsWith(dm[2].toLowerCase()))
    if (month >= 0)
      date = `${dm[3]}-${String(month + 1).padStart(2, '0')}-${dm[1].padStart(2, '0')}`
  }
  const pitchTypes = []
  const tm = src.match(/Pitch Type\s*\n\s*Select an option\s*\n([\s\S]*?)\n\s*\n/)
  if (tm) {
    for (const line of tm[1].split('\n')) {
      const label = line.trim()
      if (label) pitchTypes.push(label)
    }
  }
  const re =
    /(\d{1,2}:\d{2}\s*(?:AM|PM))\s*\n\s*\n?\s*(\d+)\s*mins?\s*\n\s*\n?\s*~£\s?(\d+(?:\.\d+)?)\s*\n\s*PER PLAYER\s*\n\s*£\s?(\d+(?:\.\d{1,2})?)\s*\n((?:Select a pitch\n)?(?:Pitch[^\n]*\n)*)/g
  const slots = []
  for (const m of src.matchAll(re)) {
    const time = slotTime(m[1])
    if (!time) continue
    slots.push({
      date,
      day: date ? dayOfIso(date) : null,
      time,
      minutes: Number(m[2]),
      amount: Number(m[4]),
      perPlayer: Number(m[3]),
      pitches: m[5]
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => /^Pitch/.test(l)),
    })
  }
  return { date, pitchTypes, slots }
}

/** '5-A-Side', '7 a side | 3G Astroturf', 'football-7-a-side-36030' -> 5, 7, 7. */
export function formatFromLabel(label) {
  const m = String(label).match(/\b(\d{1,2})\s*-?\s*a\s*-?\s*side\b/i)
  return m ? Number(m[1]) : null
}

/** '5 a side | 3G Astroturf' -> '3g'; 'Astroturf' -> 'astro'; 'Grass' -> 'grass'; indoor -> 'indoor'. */
export function surfaceFromLabel(label) {
  const s = String(label).toLowerCase()
  if (/\b[34]g\b/.test(s)) return '3g'
  if (/astro|artificial|synthetic/.test(s)) return 'astro'
  if (/indoor|sports hall/.test(s)) return 'indoor'
  if (/grass/.test(s)) return 'grass'
  return null
}

/** Kick-off times -> merged windows [[first, last], ...], a gap over `gap` minutes starting a new one. */
export function mergeWindows(times, gap = 60) {
  const sorted = [...new Set(times.filter(Boolean))].sort((a, b) => toMinutes(a) - toMinutes(b))
  const out = []
  for (const t of sorted) {
    const last = out[out.length - 1]
    if (last && toMinutes(t) - toMinutes(last[1]) <= gap) last[1] = t
    else out.push([t, t])
  }
  return out
}

/** ['mon','tue','wed','thu'] -> 'Mon to Thu'; all -> 'Every day'; weekdays; weekends; else a list. */
export function describeDays(days) {
  const set = new Set(days)
  const list = DAYS.filter((d) => set.has(d))
  if (!list.length) return ''
  if (list.length === 7) return 'Every day'
  if (list.length === 5 && !set.has('sat') && !set.has('sun')) return 'Weekdays'
  if (list.length === 2 && set.has('sat') && set.has('sun')) return 'Weekends'
  const first = DAYS.indexOf(list[0])
  const contiguous = list.every((d, i) => DAYS[first + i] === d)
  if (contiguous && list.length >= 3) return `${LABEL[list[0]]} to ${LABEL[list[list.length - 1]]}`
  if (list.length === 1) return LABEL[list[0]]
  const labels = list.map((d) => LABEL[d])
  return `${labels.slice(0, -1).join(', ')} and ${labels[labels.length - 1]}`
}

/** 'kick-off 10:00 to 17:30 and 22:00' for the windows of a band. */
export function describeWindows(windows) {
  const parts = windows.map(([a, b]) => (a === b ? a : `${a} to ${b}`))
  if (!parts.length) return ''
  const joined =
    parts.length === 1
      ? parts[0]
      : `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}`
  return `kick-off ${joined}`
}

function inside(windows, time) {
  const m = toMinutes(time)
  return windows.some(([a, b]) => m >= toMinutes(a) && m <= toMinutes(b))
}

/**
 * Priced slots -> bands. A band is one price for one slot length, the days
 * it was seen on and the kick-off windows it was seen at. Days fold into a
 * band only when the band's windows do not cover a time at which that day
 * sold the pitch at another price (a booked slot is not another price), so
 * a weekday's evening peak never hides inside a weekend's all-day rate.
 * The band read from the most slots comes first, then the cheapest.
 */
export function bandsFromSlots(slots, { format = null, surface = null } = {}) {
  const perDay = new Map() // day -> { byKey: Map(amount|minutes -> times), all: [{ time, key }] }
  for (const s of slots) {
    if (s.amount == null || !s.day || !s.time || !(s.minutes > 0)) continue
    if (!perDay.has(s.day)) perDay.set(s.day, { byKey: new Map(), all: [] })
    const d = perDay.get(s.day)
    const key = `${s.amount}|${s.minutes}`
    if (!d.byKey.has(key)) d.byKey.set(key, [])
    d.byKey.get(key).push(s.time)
    d.all.push({ time: s.time, key })
  }
  const compatible = (windows, days, key) =>
    days.every((day) => {
      const d = perDay.get(day)
      const own = mergeWindows(d.byKey.get(key), 90)
      return !d.all.some((s) => s.key !== key && inside(windows, s.time) && !inside(own, s.time))
    })
  const keys = new Set()
  for (const d of perDay.values()) for (const k of d.byKey.keys()) keys.add(k)
  const bands = []
  for (const key of keys) {
    const [amount, minutes] = key.split('|').map(Number)
    const clusters = []
    for (const day of DAYS) {
      const times = perDay.get(day)?.byKey.get(key)
      if (!times) continue
      let placed = false
      for (const c of clusters) {
        const windows = mergeWindows([...c.times, ...times], 90)
        if (compatible(windows, [...c.days, day], key)) {
          c.days.push(day)
          c.times.push(...times)
          placed = true
          break
        }
      }
      if (!placed) clusters.push({ days: [day], times: [...times] })
    }
    for (const c of clusters)
      bands.push({
        format,
        surface,
        amount,
        minutes,
        days: c.days,
        windows: mergeWindows(c.times, 90),
        slotsSeen: c.times.length,
      })
  }
  // The band read from the most slots first: the price most of the week is sold at.
  bands.sort(
    (a, b) =>
      b.slotsSeen - a.slotsSeen ||
      a.amount - b.amount ||
      toMinutes(a.windows[0]?.[0] || '00:00') - toMinutes(b.windows[0]?.[0] || '00:00'),
  )
  return bands
}

/** What an hour would cost at this band's rate, rounded to the pound. */
export function perHour(amount, minutes) {
  if (!(amount >= 0) || !(minutes > 0)) return null
  return Math.round((amount * 60) / minutes)
}

/** The band with the lowest hourly rate (ties: more days), or null. */
export function cheapestBand(bands) {
  let best = null
  for (const b of bands || []) {
    const rate = perHour(b.amount, b.minutes)
    if (rate == null) continue
    if (!best || rate < best.rate || (rate === best.rate && b.days.length > best.band.days.length))
      best = { band: b, rate }
  }
  return best ? best.band : null
}

/** A one-line label for a band: '5-a-side, Mon to Thu, kick-off 10:00 to 17:30'. */
export function labelBand(band) {
  const parts = []
  if (band.format) parts.push(`${band.format}-a-side`)
  const days = describeDays(band.days)
  if (days) parts.push(days)
  const when = describeWindows(band.windows || [])
  if (when) parts.push(when)
  return parts.join(', ')
}

/**
 * Bands from one source -> price lines for the dataset: the shape the app
 * shows (amount, unit 'slot', minutes, label) plus where each came from.
 */
export function linesFromBands(bands, { source, sourceUrl, checkedAt }) {
  return (bands || []).map((b) => ({
    amount: b.amount,
    unit: 'slot',
    minutes: b.minutes,
    format: b.format,
    surface: b.surface,
    days: b.days,
    windows: b.windows,
    slotsSeen: b.slotsSeen,
    label: labelBand(b),
    source,
    sourceUrl,
    checkedAt,
  }))
}

/**
 * Two readings of the same day and size, from different sites, agree when
 * every slot one shows at a time the other also shows carries the same price.
 * Returns { compared, agreed }.
 */
export function compareSlots(a, b) {
  const byKey = new Map()
  for (const s of b) if (s.amount != null) byKey.set(`${s.date}|${s.time}`, s.amount)
  let compared = 0
  let agreed = 0
  for (const s of a) {
    if (s.amount == null) continue
    const other = byKey.get(`${s.date}|${s.time}`)
    if (other == null) continue
    compared++
    if (Math.abs(other - s.amount) < 0.005) agreed++
  }
  return { compared, agreed }
}
