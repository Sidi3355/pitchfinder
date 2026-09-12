// The fields the first screen needs (list, map, ranking, cards). Everything
// else (provenance, opening hours, members, addresses) lives in the per-pitch
// detail file and loads when a pitch is opened. Plain ESM: used at build time.

export const INDEX_FIELDS = [
  'id',
  'name',
  'nameSource',
  'type',
  'sport',
  'lat',
  'lng',
  'area',
  'postcode',
  'postcodeSource',
  'surface',
  'lit',
  'fee',
  'bounded',
  'pricePerHour',
  'priceMax',
  'bookingUrl',
  'formats',
  'changingRooms',
  'curated',
  'pitchCount',
  'operator',
  'brand',
  'hours',
  'hoursSource',
  'prices',
  'priceSource',
  'parking',
  'covered',
  'showers',
]

export function compactPitch(pitch) {
  const out = {}
  for (const k of INDEX_FIELDS) if (pitch[k] !== undefined && pitch[k] !== null) out[k] = pitch[k]
  return out
}
