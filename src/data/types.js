// Pitch taxonomy: what can be booked. Colours mark the map and the type
// indicators; muted, saturated tones that stay legible on a light basemap.

export const PITCH_TYPES = {
  commercial: {
    label: 'Football centre',
    short: 'Centre',
    color: '#1d4ed8',
    blurb: 'Goals, Powerleague and the like: caged, floodlit, bookable by the hour.',
  },
  astro: {
    label: 'Astro pitch',
    short: 'Astro',
    color: '#0f766e',
    blurb: 'Artificial pitches at leisure centres, sports hubs and clubs, booked by the hour.',
  },
}

/** Operators, for the filter chips and the card badge. */
export const BRANDS = {
  goals: { label: 'Goals', short: 'Goals', color: '#e11d48' },
  powerleague: { label: 'Powerleague', short: 'Powerleague', color: '#7c3aed' },
  other: { label: 'Astro hire', short: 'Astro', color: '#0f766e' },
}

export function brandOf(pitch) {
  if (pitch?.brand && BRANDS[pitch.brand]) return pitch.brand
  const s = `${pitch?.operator || ''} ${pitch?.name || ''}`.toLowerCase()
  if (/\bgoals\b/.test(s)) return 'goals'
  if (/powerleague/.test(s)) return 'powerleague'
  return 'other'
}

/** Display name for a pitch, with a sensible fallback for unnamed OSM pitches. */
export function pitchName(pitch) {
  if (pitch.name) return pitch.name
  const t = PITCH_TYPES[pitch.type]?.short || 'Pitch'
  return pitch.area ? `${t} pitch in ${pitch.area}` : `${t} pitch`
}
