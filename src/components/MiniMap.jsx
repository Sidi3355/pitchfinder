// Small non-interactive map for the pitch page. Same tiles as the main map,
// same plain fallback when the style cannot be fetched.

import React, { useEffect, useRef } from 'react'
import * as maplibregl from 'maplibre-gl'
import { PITCH_TYPES } from '../data/types.js'

const STYLE_URL = 'https://tiles.openfreemap.org/styles/positron'
const FALLBACK_STYLE = {
  version: 8,
  sources: {},
  layers: [{ id: 'bg', type: 'background', paint: { 'background-color': '#e9edea' } }],
}

export function MiniMap({ pitch }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return
    const map = new maplibregl.Map({
      container: ref.current,
      style: STYLE_URL,
      center: [pitch.lng, pitch.lat],
      zoom: 14.5,
      interactive: false,
      attributionControl: { compact: true },
    })
    let loaded = false
    map.on('load', () => (loaded = true))
    const fallBack = () => !loaded && map.setStyle(FALLBACK_STYLE)
    map.on('error', fallBack)
    const timer = setTimeout(fallBack, 8000)
    const el = document.createElement('div')
    el.className = 'pin-marker'
    el.style.setProperty('--pin', PITCH_TYPES[pitch.type]?.color || '#15803d')
    const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
      .setLngLat([pitch.lng, pitch.lat])
      .addTo(map)
    return () => {
      clearTimeout(timer)
      marker.remove()
      map.remove()
    }
  }, [pitch.id, pitch.lat, pitch.lng, pitch.type])

  return (
    <div className="mini-map-wrap">
      <div
        ref={ref}
        className="mini-map"
        role="img"
        aria-label={`Map showing the location of the pitch`}
      />
      <a
        className="mini-map-link"
        href={`https://www.openstreetmap.org/?mlat=${pitch.lat}&mlon=${pitch.lng}#map=17/${pitch.lat}/${pitch.lng}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Open in OpenStreetMap
      </a>
    </div>
  )
}
