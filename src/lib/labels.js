// Shared display labels. Kept free of React so the prerender script can use them.

export function surfaceLabel(surface) {
  return (
    {
      '3g': '3G',
      astro: 'Astroturf',
      grass: 'Grass',
      hard: 'Hard court',
      other: 'Other surface',
    }[surface] || surface
  )
}

/** What the venue link actually is, so the button never promises a booking it cannot make. */
export function bookingLabel(url) {
  if (!url) return null
  try {
    const host = new URL(url).hostname
    if (/\.gov\.uk$/.test(host)) return 'Council page'
    if (
      /powerleague|goalsfootball|playfootball|playfinder|pitchbooking|better\.org|everyoneactive/.test(
        host,
      )
    ) {
      return 'Book at venue'
    }
    return 'Venue website'
  } catch {
    return 'Venue website'
  }
}

export function isBookable(url) {
  return bookingLabel(url) === 'Book at venue'
}
