// Turning a shared group's members into the finder's inputs: the squad, and
// the filters their stated preferences imply. Pure functions, unit tested.

import { DEFAULT_FILTERS } from './score.js'
import { DAYS } from './hours.js'

export const BUDGETS = [
  [null, 'Any price'],
  [5, 'Up to £5 each'],
  [8, 'Up to £8 each'],
  [10, 'Up to £10 each'],
  [15, 'Up to £15 each'],
]

/** Things a person can need. Any one person needing it makes it a must for the group. */
export const NEEDS = [
  ['lit', 'Floodlights', 'For evening games'],
  ['covered', 'Under cover', 'Rain or shine'],
  ['changing', 'Changing rooms', 'Showers after'],
  ['parking', 'Parking', 'Coming by car'],
]

export const FORMATS = [
  [null, 'Any size'],
  [5, '5-a-side'],
  [7, '7-a-side'],
  [11, '11-a-side'],
]

export const SURFACES = [
  [null, 'Any surface'],
  ['3g', '3G'],
  ['astro', 'Astro'],
]

export const BRAND_PREFS = [
  [null, 'Anywhere'],
  ['goals', 'Goals'],
  ['powerleague', 'Powerleague'],
  ['other', 'Astro hire'],
]

export const MAX_MINUTES = [
  [null, 'Any journey'],
  [20, '20 min max'],
  [30, '30 min max'],
  [45, '45 min max'],
]

export const DAYPARTS = [
  [null, 'Any time'],
  ['evening', 'Evenings'],
  ['daytime', 'Daytime'],
]

const DAY_LABEL = {
  mon: 'Mon',
  tue: 'Tue',
  wed: 'Wed',
  thu: 'Thu',
  fri: 'Fri',
  sat: 'Sat',
  sun: 'Sun',
}
const DAYPART_FROM = { evening: '19:00', daytime: '12:00' }

/** Members as the ranking's squad shape. */
export function membersToSquad(members) {
  return (members || []).map((m) => ({
    id: m.id,
    name: m.name,
    label: m.label || '',
    lat: m.lat,
    lng: m.lng,
    mode: m.mode || 'transit',
    you: !!m.is_you,
  }))
}

function stated(members, key) {
  return (members || [])
    .map((m) => m.prefs?.[key])
    .filter((v) => v !== null && v !== undefined && v !== '')
}

/** The one value everyone who stated one agrees on, else null. */
function agreed(values) {
  const set = new Set(values)
  return set.size === 1 ? values[0] : null
}

/**
 * Preferences collated the only fair way: a need stated by anyone becomes a
 * must; the tightest budget and the shortest journey anyone stated apply;
 * size, surface and operator apply only when everyone who chose one agrees;
 * the days are the ones everyone who picked days can do.
 */
export function collateFilters(members) {
  const f = { ...DEFAULT_FILTERS }
  const budgets = stated(members, 'budget').filter((b) => typeof b === 'number' && b > 0)
  if (budgets.length) f.maxPricePerHead = Math.min(...budgets)
  const minutes = stated(members, 'maxMinutes').filter((b) => typeof b === 'number' && b > 0)
  if (minutes.length) f.maxEta = Math.min(...minutes)
  if ((members || []).some((m) => m.prefs?.lit === true)) f.needsFloodlights = true
  if ((members || []).some((m) => m.prefs?.covered === true)) f.needsCovered = true
  if ((members || []).some((m) => m.prefs?.changing === true)) f.needsChanging = true
  if ((members || []).some((m) => m.prefs?.parking === true)) f.needsParking = true
  const format = agreed(stated(members, 'format').filter((n) => [5, 7, 11].includes(n)))
  if (format) f.format = format
  const surface = agreed(stated(members, 'surface').filter((s) => ['3g', 'astro'].includes(s)))
  if (surface) f.surface = surface
  const brand = agreed(
    stated(members, 'brand').filter((b) => ['goals', 'powerleague', 'other'].includes(b)),
  )
  if (brand) f.brands = [brand]
  const when = collateWhen(members)
  if (when.days || when.from) f.openOn = { days: when.days, from: when.from }
  return f
}

/** The days everyone who picked days can do, and the earliest time of day anyone needs. */
export function collateWhen(members) {
  const picks = (members || [])
    .map((m) => (Array.isArray(m.prefs?.days) ? m.prefs.days.filter((d) => DAYS.includes(d)) : []))
    .filter((d) => d.length)
  let days = null
  let conflict = false
  if (picks.length) {
    const common = DAYS.filter((d) => picks.every((p) => p.includes(d)))
    if (common.length) days = common
    else conflict = true
  }
  const parts = stated(members, 'daypart').filter((p) => DAYPART_FROM[p])
  const from = parts.includes('evening') ? '19:00' : parts.includes('daytime') ? '12:00' : null
  return { days, from, conflict, anyone: picks.length > 0 }
}

/** One line that says what someone asked for, or '' when nothing. */
export function prefsSummary(prefs) {
  const p = prefs || {}
  const parts = []
  if (typeof p.budget === 'number' && p.budget > 0) parts.push(`up to £${p.budget} each`)
  if ([5, 7, 11].includes(p.format)) parts.push(`${p.format}-a-side`)
  if (p.surface === '3g') parts.push('3G')
  if (p.surface === 'astro') parts.push('astro')
  if (p.brand === 'goals') parts.push('Goals')
  if (p.brand === 'powerleague') parts.push('Powerleague')
  if (p.brand === 'other') parts.push('astro hire')
  if (p.lit === true) parts.push('floodlights')
  if (p.covered === true) parts.push('under cover')
  if (p.changing === true) parts.push('changing rooms')
  if (p.parking === true) parts.push('parking')
  if (typeof p.maxMinutes === 'number' && p.maxMinutes > 0) parts.push(`${p.maxMinutes} min max`)
  if (Array.isArray(p.days) && p.days.length)
    parts.push(
      p.days
        .filter((d) => DAY_LABEL[d])
        .map((d) => DAY_LABEL[d])
        .join(', '),
    )
  if (p.daypart === 'evening') parts.push('evenings')
  if (p.daypart === 'daytime') parts.push('daytime')
  return parts.join(' · ')
}

/**
 * What the group as a whole asked for, as short lines for the page:
 * [{ text: 'Floodlights', who: 'Priya and Tom' }, ...].
 */
export function collateSummary(members) {
  const list = members || []
  const names = (pred) => list.filter(pred).map((m) => m.name)
  const who = (ns) => (ns.length <= 2 ? ns.join(' and ') : `${ns.length} people`)
  const out = []
  const f = collateFilters(list)
  if (f.maxPricePerHead != null)
    out.push({
      text: `Up to £${f.maxPricePerHead} each`,
      who: who(names((m) => m.prefs?.budget === f.maxPricePerHead)),
    })
  if (f.format)
    out.push({ text: `${f.format}-a-side`, who: who(names((m) => m.prefs?.format === f.format)) })
  if (f.surface)
    out.push({
      text: f.surface === '3g' ? '3G' : 'Astro',
      who: who(names((m) => m.prefs?.surface === f.surface)),
    })
  if (f.brands.length) {
    const label = { goals: 'Goals', powerleague: 'Powerleague', other: 'Astro hire' }[f.brands[0]]
    out.push({ text: `${label} only`, who: who(names((m) => m.prefs?.brand === f.brands[0])) })
  }
  if (f.needsFloodlights)
    out.push({ text: 'Floodlights', who: who(names((m) => m.prefs?.lit === true)) })
  if (f.needsCovered)
    out.push({ text: 'Under cover', who: who(names((m) => m.prefs?.covered === true)) })
  if (f.needsChanging)
    out.push({ text: 'Changing rooms', who: who(names((m) => m.prefs?.changing === true)) })
  if (f.needsParking)
    out.push({ text: 'Parking', who: who(names((m) => m.prefs?.parking === true)) })
  if (f.maxEta != null)
    out.push({
      text: `${f.maxEta} min max for everyone`,
      who: who(names((m) => m.prefs?.maxMinutes === f.maxEta)),
    })
  const when = collateWhen(list)
  if (when.days)
    out.push({
      text: `${when.days.map((d) => DAY_LABEL[d]).join(', ')} work for everyone`,
      who: '',
    })
  else if (when.conflict) out.push({ text: 'No day works for everyone yet', who: '', warn: true })
  if (when.from)
    out.push({
      text: when.from === '19:00' ? 'Evenings' : 'Daytime',
      who: who(names((m) => m.prefs?.daypart)),
    })
  return out
}
