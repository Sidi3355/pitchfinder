import React from 'react'

/** One-tap directions to a point in the apps people already use. */
export function Directions({ lat, lng, name }) {
  return (
    <p className="directions">
      <a
        href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Google Maps
      </a>
      <a
        href={`https://maps.apple.com/?daddr=${lat},${lng}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Apple Maps
      </a>
      <a
        href={`https://citymapper.com/directions?endcoord=${lat}%2C${lng}&endname=${encodeURIComponent(name || '')}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Citymapper
      </a>
    </p>
  )
}
