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
