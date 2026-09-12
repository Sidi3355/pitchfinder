// Opening hours: parsed from OpenStreetMap's opening_hours syntax, from the
// schema.org data on an operator's page, or from the plain text of an
// "Opening times" block, and formatted for people. Plain ESM, shared by the
// data pipeline and the app. Times are 'HH:MM' strings; a day maps to a list
// of [open, close] ranges, an empty list meaning closed.

export const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
const LABEL = { mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun' }
const WORDS = {
  mon: ['mo', 'mon', 'monday', 'mondays'],
  tue: ['tu', 'tue', 'tues', 'tuesday', 'tuesdays'],
  wed: ['we', 'wed', 'weds', 'wednesday', 'wednesdays'],
  thu: ['th', 'thu', 'thur', 'thurs', 'thursday', 'thursdays'],
  fri: ['fr', 'fri', 'friday', 'fridays'],
  sat: ['sa', 'sat', 'saturday', 'saturdays'],
  sun: ['su', 'sun', 'sunday', 'sundays'],
}
const WORD_TO_DAY = Object.fromEntries(
  Object.entries(WORDS).flatMap(([day, words]) => words.map((w) => [w, day])),
)
const DAY_WORD = Object.values(WORDS)
  .flat()
  .sort((a, b) => b.length - a.length)
  .join('|')
const SPAN_WORD = 'weekdays|weekends|every day|everyday|daily|all week|7 days a week|7 days'
const TIME = String.raw`(?:\d{1,2}(?:[:.]\d{2})?\s*(?:am|pm|a\.m\.|p\.m\.)?|midnight|midday|noon)`
const SEP = String.raw`\s*(?:-|\u2013|\u2014|to|until|till|through)\s*`

function emptyWeek() {
  return Object.fromEntries(DAYS.map((d) => [d, []]))
}

/** 'HH:MM' -> minutes since midnight; '24:00' allowed. */
export function toMinutes(hhmm) {
  const [h, m] = String(hhmm).split(':').map(Number)
  return h * 60 + (m || 0)
}

function pad(n) {
  return String(n).padStart(2, '0')
}

function minutesToHHMM(mins) {
  return `${pad(Math.floor(mins / 60))}:${pad(mins % 60)}`
}

/**
 * A written time -> 'HH:MM', or null when it is ambiguous. '9am', '9.30pm',
 * '21:00', 'midnight' and 'noon' are fine; a bare '9' is not (it could be
 * either), unless it carries minutes with a 24-hour reading ('21.30').
 */
export function parseTime(raw) {
  const s = String(raw)
    .toLowerCase()
    .replace(/\./g, (m, i, str) => (/\d\.\d/.test(str.slice(i - 1, i + 2)) ? ':' : ''))
    .replace(/\s+/g, '')
  if (s === 'midnight') return '24:00'
  if (s === 'midday' || s === 'noon') return '12:00'
  const m = s.match(/^(\d{1,2})(?::(\d{2}))?(am|pm)?$/)
  if (!m) return null
  let h = Number(m[1])
  const min = Number(m[2] || 0)
  if (min > 59) return null
  if (m[3]) {
    if (h < 1 || h > 12) return null
    if (m[3] === 'am') h = h === 12 ? 0 : h
    else h = h === 12 ? 12 : h + 12
    return minutesToHHMM(h * 60 + min)
  }
  // No suffix: only a clear 24-hour clock is accepted.
  if (m[2] === undefined) return null
  if (h > 24 || (h === 24 && min > 0)) return null
  return minutesToHHMM(h * 60 + min)
}

function expandDays(from, to) {
  const a = DAYS.indexOf(from)
  const b = to ? DAYS.indexOf(to) : a
  if (a < 0 || b < 0) return []
  const out = []
  for (let i = a; ; i = (i + 1) % 7) {
    out.push(DAYS[i])
    if (i === b) break
  }
  return out
}

function daysFromSpec(spec) {
  const s = spec.toLowerCase().replace(/\./g, '').trim()
  if (/^(every ?day|daily|all week|7 days( a week)?)$/.test(s)) return [...DAYS]
  if (s === 'weekdays') return DAYS.slice(0, 5)
  if (s === 'weekends') return ['sat', 'sun']
  const days = new Set()
  for (const part of s.split(/\s*(?:,|&|and|\/)\s*/)) {
    const range = part.match(new RegExp(`^(${DAY_WORD})${SEP}(${DAY_WORD})$`))
    if (range) {
      for (const d of expandDays(WORD_TO_DAY[range[1]], WORD_TO_DAY[range[2]])) days.add(d)
      continue
    }
    const one = part.match(new RegExp(`^(${DAY_WORD})$`))
    if (one) days.add(WORD_TO_DAY[one[1]])
  }
  return [...days]
}

function addRange(week, day, open, close) {
  if (!open || !close) return
  const list = week[day]
  if (!list.some(([o, c]) => o === open && c === close)) list.push([open, close])
}

/**
 * OpenStreetMap opening_hours, the common subset: 'Mo-Fr 09:00-22:00;
 * Sa,Su 09:00-18:00', 'Mo-Su 08:00-22:00', '24/7', 'Su off'. Returns the
 * week, or null when nothing in the string is understood.
 */
export function parseOsmHours(value) {
  if (!value || typeof value !== 'string') return null
  const week = emptyWeek()
  let understood = false
  for (const rule of value.split(';')) {
    const r = rule.trim()
    if (!r) continue
    if (r === '24/7') {
      for (const d of DAYS) addRange(week, d, '00:00', '24:00')
      understood = true
      continue
    }
    const m = r.match(
      /^((?:(?:Mo|Tu|We|Th|Fr|Sa|Su|PH|SH)(?:-(?:Mo|Tu|We|Th|Fr|Sa|Su))?(?:,\s*)?)+)?\s*(off|closed|(?:\d{2}:\d{2}-\d{2}:\d{2}(?:,\s*)?)+)$/,
    )
    if (!m) continue
    const dayPart = (m[1] || 'Mo-Su').replace(/\s/g, '')
    if (/^(PH|SH)/.test(dayPart)) continue
    const days = new Set()
    for (const part of dayPart.split(',')) {
      if (!part) continue
      const [from, to] = part.split('-')
      for (const d of expandDays(
        WORD_TO_DAY[from.toLowerCase()],
        to && WORD_TO_DAY[to.toLowerCase()],
      ))
        days.add(d)
    }
    understood = true
    if (/^(off|closed)$/.test(m[2])) {
      for (const d of days) week[d] = []
      continue
    }
    for (const span of m[2].split(',')) {
      const [open, close] = span.trim().split('-')
      for (const d of days) addRange(week, d, open, close)
    }
  }
  return understood ? week : null
}

/**
 * schema.org openingHoursSpecification or openingHours strings -> week.
 */
export function parseSchemaHours(spec) {
  if (!spec) return null
  const list = Array.isArray(spec) ? spec : [spec]
  const week = emptyWeek()
  let understood = false
  for (const item of list) {
    if (typeof item === 'string') {
      const parsed = parseOsmHours(item.replace(/\s*,\s*/g, ','))
      if (parsed) {
        understood = true
        for (const d of DAYS) for (const [o, c] of parsed[d]) addRange(week, d, o, c)
      }
      continue
    }
    if (!item || typeof item !== 'object') continue
    const days = []
      .concat(item.dayOfWeek || [])
      .map((d) => WORD_TO_DAY[String(d).replace(/^.*\//, '').toLowerCase()])
      .filter(Boolean)
    const open = parseTime(String(item.opens || '').slice(0, 5))
    const close = parseTime(String(item.closes || '').slice(0, 5))
    if (!days.length || !open || !close) continue
    understood = true
    for (const d of days) addRange(week, d, open, close === '00:00' ? '24:00' : close)
  }
  return understood ? week : null
}

/**
 * Free text -> week, only from an "Opening times" block so a league's
 * kick-off list is never mistaken for the centre's hours. Both ends of a
 * range must be unambiguous (see parseTime). Returns { week, quotes } or null.
 */
export function parseHoursText(text) {
  if (!text) return null
  const src = String(text).replace(/\u00a0/g, ' ')
  const heading = src.match(
    /open(?:ing)?\s*(?:times?|hours)|hours\s*of\s*opening|we(?:'|’)?re\s*open/i,
  )
  if (!heading) return null
  const block = src.slice(heading.index, heading.index + 1200)
  const re = new RegExp(
    `((?:${SPAN_WORD})|(?:${DAY_WORD})(?:${SEP}(?:${DAY_WORD}))?(?:\\s*(?:,|&|and|/)\\s*(?:${DAY_WORD})(?:${SEP}(?:${DAY_WORD}))?)*)\\s*:?\\s*(${TIME})${SEP}(${TIME})`,
    'gi',
  )
  const week = emptyWeek()
  const quotes = []
  let understood = false
  for (const m of block.matchAll(re)) {
    const days = daysFromSpec(m[1])
    const open = parseTime(m[2])
    const close = parseTime(m[3])
    if (!days.length || !open || !close) continue
    understood = true
    quotes.push(m[0].replace(/\s+/g, ' ').trim())
    for (const d of days) addRange(week, d, open, close)
  }
  return understood ? { week, quotes } : null
}

/** '09:00' -> '9am', '21:30' -> '9:30pm', '24:00' -> 'midnight'. */
export function formatTime(hhmm) {
  const mins = toMinutes(hhmm)
  if (mins === 1440 || mins === 0) return 'midnight'
  if (mins === 720) return 'noon'
  const h24 = Math.floor(mins / 60)
  const m = mins % 60
  const suffix = h24 < 12 ? 'am' : 'pm'
  const h = h24 % 12 === 0 ? 12 : h24 % 12
  return m ? `${h}:${pad(m)}${suffix}` : `${h}${suffix}`
}

function rangesText(ranges) {
  if (!ranges.length) return 'Closed'
  return ranges.map(([o, c]) => `${formatTime(o)} to ${formatTime(c)}`).join(', ')
}

/**
 * The week as lines people read: consecutive days with the same hours are
 * grouped. [{ days: 'Mon to Fri', times: '9am to 11pm' }, ...]
 */
export function formatHours(week) {
  if (!week) return []
  const lines = []
  let start = 0
  while (start < 7) {
    const key = JSON.stringify(week[DAYS[start]] || [])
    let end = start
    while (end + 1 < 7 && JSON.stringify(week[DAYS[end + 1]] || []) === key) end++
    const days =
      start === end
        ? LABEL[DAYS[start]]
        : end === start + 1
          ? `${LABEL[DAYS[start]]} and ${LABEL[DAYS[end]]}`
          : `${LABEL[DAYS[start]]} to ${LABEL[DAYS[end]]}`
    lines.push({
      days: start === 0 && end === 6 ? 'Every day' : days,
      times: rangesText(week[DAYS[start]] || []),
    })
    start = end + 1
  }
  return lines
}

/** One line: 'Mon to Fri 9am to 11pm, Sat and Sun 9am to 9pm'. */
export function hoursSummary(week) {
  return formatHours(week)
    .map((l) => `${l.days} ${l.times.toLowerCase() === 'closed' ? 'closed' : l.times}`)
    .join(', ')
}

/**
 * Whether the place is open at `now`, with a short label for the card:
 * 'Open until 11pm', 'Opens at 9am', 'Opens Mon 9am', 'Closed today'.
 */
export function openState(week, now = new Date()) {
  if (!week) return null
  const dayIndex = (now.getDay() + 6) % 7
  const mins = now.getHours() * 60 + now.getMinutes()
  const today = week[DAYS[dayIndex]] || []
  // A range that ran past midnight from yesterday.
  const yesterday = week[DAYS[(dayIndex + 6) % 7]] || []
  for (const [o, c] of yesterday) {
    const close = toMinutes(c)
    const open = toMinutes(o)
    if (close < open && mins < close) return { open: true, label: `Open until ${formatTime(c)}` }
  }
  for (const [o, c] of today) {
    const open = toMinutes(o)
    let close = toMinutes(c)
    if (close < open) close += 1440
    if (mins >= open && mins < close) return { open: true, label: `Open until ${formatTime(c)}` }
  }
  const later = today.find(([o]) => toMinutes(o) > mins)
  if (later) return { open: false, label: `Opens at ${formatTime(later[0])}` }
  for (let i = 1; i <= 7; i++) {
    const d = DAYS[(dayIndex + i) % 7]
    const first = (week[d] || [])[0]
    if (first) {
      return {
        open: false,
        label:
          i === 1
            ? `Opens tomorrow ${formatTime(first[0])}`
            : `Opens ${LABEL[d]} ${formatTime(first[0])}`,
      }
    }
  }
  return { open: false, label: 'Closed' }
}
