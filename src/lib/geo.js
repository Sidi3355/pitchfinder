// Geo helpers: distance, ETA estimation, and the map projection.
//
// ETAs are straight-line estimates with a circuity factor — good enough to
// rank pitches fairly for a group. To go production-grade, swap `estimateEta`
// for the TfL Journey Planner API (free key) and keep the same signature.

const EARTH_RADIUS_KM = 6371

export function haversineKm(a, b) {
  const toRad = (d) => (d * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h))
}

// Real journeys aren't straight lines — multiply by a circuity factor.
const CIRCUITY = 1.35

export const TRAVEL_MODES = {
  walk: { label: 'Walk', speedKmh: 4.8, overheadMin: 0 },
  cycle: { label: 'Cycle', speedKmh: 14, overheadMin: 4 },
  transit: { label: 'Public transport', speedKmh: 19, overheadMin: 9 },
  drive: { label: 'Drive', speedKmh: 21, overheadMin: 6 },
}

/** Estimated door-to-pitch minutes for one person. */
export function estimateEta(from, to, mode = 'transit') {
  const m = TRAVEL_MODES[mode] || TRAVEL_MODES.transit
  const km = haversineKm(from, to) * CIRCUITY
  return Math.round((km / m.speedKmh) * 60 + m.overheadMin)
}

/** Geographic centre of a set of points. */
export function centroid(points) {
  if (!points.length) return null
  const lat = points.reduce((s, p) => s + p.lat, 0) / points.length
  const lng = points.reduce((s, p) => s + p.lng, 0) / points.length
  return { lat, lng }
}

// ── Map projection ───────────────────────────────────────────────────────────
// Simple equirectangular projection over a Greater London bounding box,
// corrected for latitude so distances look right on screen.

export const LONDON_BOUNDS = { minLat: 51.32, maxLat: 51.68, minLng: -0.51, maxLng: 0.25 }

export function makeProjection(width, height, bounds = LONDON_BOUNDS) {
  const latMid = (bounds.minLat + bounds.maxLat) / 2
  const lngScale = Math.cos((latMid * Math.PI) / 180)
  const spanX = (bounds.maxLng - bounds.minLng) * lngScale
  const spanY = bounds.maxLat - bounds.minLat
  // Fit the bounds into width×height, preserving aspect.
  const scale = Math.min(width / spanX, height / spanY)
  const offsetX = (width - spanX * scale) / 2
  const offsetY = (height - spanY * scale) / 2
  return {
    toXY({ lat, lng }) {
      const x = offsetX + (lng - bounds.minLng) * lngScale * scale
      const y = offsetY + (bounds.maxLat - lat) * scale
      return { x, y }
    },
  }
}

// The Thames, as an approximate lat/lng polyline from Richmond to Dartford.
export const THAMES = [
  { lat: 51.4448, lng: -0.3300 },
  { lat: 51.4590, lng: -0.3080 },
  { lat: 51.4710, lng: -0.2680 },
  { lat: 51.4870, lng: -0.2460 },
  { lat: 51.4700, lng: -0.2210 },
  { lat: 51.4675, lng: -0.1920 },
  { lat: 51.4800, lng: -0.1750 },
  { lat: 51.4855, lng: -0.1490 },
  { lat: 51.4835, lng: -0.1330 },
  { lat: 51.4900, lng: -0.1220 },
  { lat: 51.5075, lng: -0.1180 },
  { lat: 51.5085, lng: -0.0990 },
  { lat: 51.5050, lng: -0.0750 },
  { lat: 51.5015, lng: -0.0600 },
  { lat: 51.4920, lng: -0.0450 },
  { lat: 51.4890, lng: -0.0280 },
  { lat: 51.5040, lng: -0.0230 },
  { lat: 51.5100, lng: -0.0080 },
  { lat: 51.5000, lng: 0.0020 },
  { lat: 51.4860, lng: 0.0100 },
  { lat: 51.4930, lng: 0.0350 },
  { lat: 51.4970, lng: 0.0530 },
  { lat: 51.4900, lng: 0.0750 },
  { lat: 51.4830, lng: 0.1050 },
  { lat: 51.4650, lng: 0.1500 },
  { lat: 51.4560, lng: 0.1900 },
]
