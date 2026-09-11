// Small helpers for the game page: a calendar file, a message for the group
// chat, and the cost split. Pure functions, unit tested.

function pad(n) {
  return String(n).padStart(2, '0')
}

function icsDate(d) {
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`
}

function icsEscape(s) {
  return String(s ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
}

/** An iCalendar event (RFC 5545) for the game, one hour long by default. */
export function buildIcs({ uid, title, startsAt, durationMin = 60, location, description, url }) {
  const start = new Date(startsAt)
  const end = new Date(start.getTime() + durationMin * 60e3)
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//PitchFinder//EN',
    'BEGIN:VEVENT',
    `UID:${icsEscape(uid || `${start.getTime()}@pitchfinder`)}`,
    `DTSTAMP:${icsDate(new Date())}`,
    `DTSTART:${icsDate(start)}`,
    `DTEND:${icsDate(end)}`,
    `SUMMARY:${icsEscape(title)}`,
  ]
  if (location) lines.push(`LOCATION:${icsEscape(location)}`)
  if (description) lines.push(`DESCRIPTION:${icsEscape(description)}`)
  if (url) lines.push(`URL:${icsEscape(url)}`)
  lines.push('END:VEVENT', 'END:VCALENDAR')
  return lines.join('\r\n') + '\r\n'
}

export function icsDataUrl(ics) {
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`
}

/** £ per person when a whole-pitch price is split between those who are in. */
export function splitCost(pricePerHour, inCount) {
  if (pricePerHour == null || pricePerHour <= 0 || !inCount) return null
  return Math.ceil((pricePerHour / inCount) * 100) / 100
}

export function formatMoney(n) {
  return Number.isInteger(n) ? `£${n}` : `£${n.toFixed(2)}`
}

/** Plain-text message for the group chat. */
export function buildSummary({ pitchName, when, postcode, pricePerHour, inCount, url, notes }) {
  const lines = [`Football: ${pitchName}, ${when}`]
  if (postcode) lines.push(`Nearest postcode ${postcode}`)
  if (pricePerHour === 0) lines.push('Free to play')
  else if (pricePerHour > 0) {
    const each = splitCost(pricePerHour, inCount)
    lines.push(
      each
        ? `${formatMoney(pricePerHour)} for the pitch, ${formatMoney(each)} each with ${inCount} in`
        : `${formatMoney(pricePerHour)} for the pitch, split between whoever is in`,
    )
  }
  if (notes) lines.push(notes)
  lines.push(`In or out? ${url}`)
  return lines.join('\n')
}
