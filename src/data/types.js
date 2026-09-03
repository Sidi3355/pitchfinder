// Pitch taxonomy. Colors are used for map markers and type indicators —
// muted, saturated tones chosen to stay legible on a light basemap.

export const PITCH_TYPES = {
  commercial: {
    label: 'Commercial centre',
    short: 'Commercial',
    color: '#1d4ed8',
    blurb: 'Powerleague, Goals and similar — caged, floodlit, bookable by the hour.',
  },
  astro: {
    label: 'Bookable astro',
    short: 'Astro',
    color: '#0f766e',
    blurb: 'Artificial pitches at leisure centres, sports hubs and clubs.',
  },
  park: {
    label: 'Park pitch',
    short: 'Park',
    color: '#15803d',
    blurb: 'Grass pitches in parks and playing fields. Usually free.',
  },
  cage: {
    label: 'Cage / MUGA',
    short: 'Cage',
    color: '#b45309',
    blurb: 'Free caged courts and multi-use games areas for small-sided games.',
  },
}

/** Display name for a pitch, with a sensible fallback for unnamed OSM pitches. */
export function pitchName(pitch) {
  if (pitch.name) return pitch.name
  const t = PITCH_TYPES[pitch.type]?.short || 'Pitch'
  return pitch.area ? `${t} pitch — ${pitch.area}` : `${t} pitch`
}
