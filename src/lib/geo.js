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
  { lat: 51.4448, lng: -0.33 },
  { lat: 51.459, lng: -0.308 },
  { lat: 51.471, lng: -0.268 },
  { lat: 51.487, lng: -0.246 },
  { lat: 51.47, lng: -0.221 },
  { lat: 51.4675, lng: -0.192 },
  { lat: 51.48, lng: -0.175 },
  { lat: 51.4855, lng: -0.149 },
  { lat: 51.4835, lng: -0.133 },
  { lat: 51.49, lng: -0.122 },
  { lat: 51.5075, lng: -0.118 },
  { lat: 51.5085, lng: -0.099 },
  { lat: 51.505, lng: -0.075 },
  { lat: 51.5015, lng: -0.06 },
  { lat: 51.492, lng: -0.045 },
  { lat: 51.489, lng: -0.028 },
  { lat: 51.504, lng: -0.023 },
  { lat: 51.51, lng: -0.008 },
  { lat: 51.5, lng: 0.002 },
  { lat: 51.486, lng: 0.01 },
  { lat: 51.493, lng: 0.035 },
  { lat: 51.497, lng: 0.053 },
  { lat: 51.49, lng: 0.075 },
  { lat: 51.483, lng: 0.105 },
  { lat: 51.465, lng: 0.15 },
  { lat: 51.456, lng: 0.19 },
]
