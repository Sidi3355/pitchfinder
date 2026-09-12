// Turning a shared group's members into the finder's inputs: the squad, and
// the filters their stated preferences imply. Pure functions, unit tested.

import { DEFAULT_FILTERS } from './score.js'

export const BUDGETS = [
  [null, 'Any price'],
  [5, 'Up to £5 each'],
  [8, 'Up to £8 each'],
  [10, 'Up to £10 each'],
  [15, 'Up to £15 each'],
]

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

/**
 * Preferences collated the only fair way: a floodlit pitch if anyone needs
 * one, and the tightest budget anyone stated. Everything else stays open.
 */
export function collateFilters(members) {
  const f = { ...DEFAULT_FILTERS }
  const budgets = (members || [])
    .map((m) => m.prefs?.budget)
    .filter((b) => typeof b === 'number' && b > 0)
  if (budgets.length) f.maxPricePerHead = Math.min(...budgets)
  if ((members || []).some((m) => m.prefs?.lit === true)) f.needsFloodlights = true
  return f
}

/** One line that says what someone asked for, or '' when nothing. */
export function prefsSummary(prefs) {
  const parts = []
  if (typeof prefs?.budget === 'number' && prefs.budget > 0)
    parts.push(`up to £${prefs.budget} each`)
  if (prefs?.lit === true) parts.push('needs floodlights')
  return parts.join(', ')
}
