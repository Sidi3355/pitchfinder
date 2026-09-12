// Price extraction for venue pages. A price is only kept when the page says
// what it is for (an hour or a session) right next to the figure. Anything
// else (deposits, memberships, per-person fees, offers) is discarded rather
// than guessed at.

export const PER_HOUR_RE =
  /\b(per|an|a|each)\s*(hour|hr)\b|\/\s*(hour|hr)\b|\bhourly\b|\bp\/h\b|\bph\b/i
export const PER_SESSION_RE =
  /\b(per|a|each)\s*(session|game|match|booking|slot|block)\b|\/\s*(session|game|match)\b/i
const PER_PERSON_RE =
  /\bper\s*(person|player|head)\b|\bpp\b|\beach\s+player\b|\bmembership\b|\bdeposit\b|\bvoucher\b/i

export function pageText(html) {
  return String(html)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#160;/g, ' ')
    .replace(/&pound;|&#163;/g, '£')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Every £ figure on the page that is explicitly per hour or per session. */
export function extractPrices(html, { min = 10, max = 250 } = {}) {
  const text = pageText(html)
  const found = []
  for (const m of text.matchAll(/£\s?(\d{1,3}(?:\.\d{2})?)\b/g)) {
    const value = Number(m[1])
    if (!(value >= min && value <= max)) continue
    const start = m.index
    const end = start + m[0].length
    const before = text.slice(Math.max(0, start - 45), start)
    const after = text.slice(end, end + 45)
    const context = text.slice(Math.max(0, start - 60), Math.min(text.length, end + 60)).trim()
    // Only the words touching the figure decide what it is for.
    const afterShort = after.slice(0, 22)
    const beforeShort = before.slice(-25)
    if (PER_PERSON_RE.test(afterShort) || PER_PERSON_RE.test(beforeShort)) continue
    let unit = null
    if (PER_HOUR_RE.test(afterShort) || PER_HOUR_RE.test(beforeShort)) unit = 'hour'
    else if (PER_SESSION_RE.test(afterShort) || PER_SESSION_RE.test(beforeShort)) unit = 'session'
    if (!unit) continue
    found.push({ value, unit, context })
  }
  return found
}

/**
 * One structured price for the venue, or null. Hourly figures win over
 * session figures; the range is reported when the page shows several.
 */
export function summarisePrices(found, { sourceUrl, checkedAt } = {}) {
  if (!found.length) return null
  const unit = found.some((f) => f.unit === 'hour') ? 'hour' : 'session'
  const values = found.filter((f) => f.unit === unit).map((f) => f.value)
  const lowest = Math.min(...values)
  const highest = Math.max(...values)
  const first = found.find((f) => f.unit === unit && f.value === lowest)
  return {
    perHour: unit === 'hour' ? lowest : null,
    perSession: unit === 'session' ? lowest : null,
    max: highest !== lowest ? highest : null,
    unit,
    currency: 'GBP',
    context: first.context,
    sourceUrl: sourceUrl || null,
    checkedAt: checkedAt || null,
  }
}
