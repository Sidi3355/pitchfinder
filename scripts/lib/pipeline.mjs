// Pure pipeline steps: classify OpenStreetMap pitches, collapse duplicates
// into venues, derive names for unnamed venues, merge the curated list.
// No network, no file system: build-data.mjs feeds this and the unit tests
// feed it fixtures.

// ── Classification ───────────────────────────────────────────────────────────

export const COMMERCIAL_RE =
  /powerleague|power league|\bgoals\b|playfootball|play football|soccerdome|footballworx|futsal club|football centre/i
// "academy" is deliberately absent: real venues carry it (Powerleague Academy,
// the FA's football academies) and schools are caught by the words below.
export const SCHOOL_RE =
  /\bschool\b|\bcollege\b|sixth form|\bprep\b|\bpreparatory\b|\bprimary\b|\bsecondary\b|\buniversity\b|\bnursery\b/i
export const CAGE_RE = /\bmuga\b|\bcage\b|ball ?court|games area|multi[- ]use|kickabout/i
const HARD_SURFACE_RE = /tarmac|asphalt|concrete|paved|macadam|rubber/i
const ARTIFICIAL_RE = /artificial|astro|3g|4g|tartan|synthetic|acrylic/i
// Names like "Pitch 3" or "Court 2" carry no identity of their own.
export const GENERIC_NAME_RE = /^(pitch|court|field|cage|muga|area)\s*[a-z0-9]{0,3}$/i

export function normSurface(s = '') {
  const v = String(s || '').toLowerCase()
  if (!v) return null
  if (/3g|4g/.test(v)) return '3g'
  if (ARTIFICIAL_RE.test(v)) return 'astro'
  if (/grass|turf|meadow|lawn/.test(v)) return 'grass'
  if (HARD_SURFACE_RE.test(v)) return 'hard'
  return 'other'
}

export function classify(tags) {
  const label = `${tags.name || ''} ${tags.operator || ''}`
  const sport = (tags.sport || '').toLowerCase()
  const surface = normSurface(tags.surface)
  if (COMMERCIAL_RE.test(label)) return 'commercial'
  if (sport.includes('multi') || CAGE_RE.test(label) || tags.hoops === 'yes' || surface === 'hard')
    return 'cage'
  if (surface === '3g' || surface === 'astro') return 'astro'
  return 'park'
}

/** True when the public cannot use the pitch. */
export function excluded(tags) {
  const access = (tags.access || '').toLowerCase()
  if (access === 'private' || access === 'no' || access === 'military') return true
  const label = `${tags.name || ''} ${tags.operator || ''} ${tags['operator:type'] || ''}`
  if (SCHOOL_RE.test(label)) {
    // A school ground that says the public may book it stays in.
    return !['yes', 'permissive', 'customers'].includes(access) && tags.fee !== 'yes'
  }
  return false
}

// ── Geometry ─────────────────────────────────────────────────────────────────

export function distM(a, b) {
  const dLat = (a.lat - b.lat) * 111320
  const dLng = (a.lng - b.lng) * 111320 * Math.cos((a.lat * Math.PI) / 180)
  return Math.hypot(dLat, dLng)
}

export function nearestArea(areas, lat, lng) {
  let best = null
  let bestD = Infinity
  for (const a of areas) {
    const d = (a.lat - lat) ** 2 + ((a.lng - lng) * 0.62) ** 2
    if (d < bestD) {
      bestD = d
      best = a
    }
  }
  return best?.name || null
}

// ── Transform raw elements ───────────────────────────────────────────────────

const OSM_TYPES = { n: 'node', w: 'way', r: 'relation' }

export function transform(elements, { areas = [] } = {}) {
  const pitches = []
  for (const el of elements) {
    const tags = el.tags || {}
    const lat = el.lat ?? el.center?.lat
    const lng = el.lon ?? el.center?.lon
    if (lat == null || lng == null) continue
    if (excluded(tags)) continue
    const t = el.type[0]
    const name = tags.name?.trim() || null
    pitches.push({
      id: `osm-${t}${el.id}`,
      name: name && !GENERIC_NAME_RE.test(name) ? name : null,
      osmName: name,
      nameSource: name && !GENERIC_NAME_RE.test(name) ? 'osm' : null,
      type: classify(tags),
      sport: 'football',
      operator: tags.operator || null,
      lat: Math.round(lat * 1e5) / 1e5,
      lng: Math.round(lng * 1e5) / 1e5,
      area: nearestArea(areas, lat, lng),
      surface: normSurface(tags.surface),
      lit: tags.lit === 'yes' ? true : tags.lit === 'no' ? false : null,
      access: tags.access || null,
      fee: tags.fee === 'yes' ? true : tags.fee === 'no' ? false : null,
      bounded: tags.barrier != null ? true : null,
      openingHours: tags.opening_hours || null,
      source: 'osm',
      sourceUrl: `https://www.openstreetmap.org/${OSM_TYPES[t]}/${el.id}`,
    })
  }
  return pitches
}

// ── Collapse duplicates into venues ──────────────────────────────────────────

function mostCommon(values) {
  const counts = new Map()
  for (const v of values) if (v != null) counts.set(v, (counts.get(v) || 0) + 1)
  let best = null
  let bestN = 0
  for (const [v, n] of counts) {
    if (n > bestN) {
      best = v
      bestN = n
    }
  }
  return best
}

function tri(values) {
  if (values.some((v) => v === true)) return true
  if (values.some((v) => v === false)) return false
  return null
}

function mergeGroup(members) {
  const sorted = [...members].sort((a, b) => a.id.localeCompare(b.id))
  const first = sorted[0]
  if (sorted.length === 1) return { ...first, pitchCount: 1, memberIds: [first.id] }
  const lat = sorted.reduce((s, m) => s + m.lat, 0) / sorted.length
  const lng = sorted.reduce((s, m) => s + m.lng, 0) / sorted.length
  const named = sorted.find((m) => m.name)
  return {
    ...first,
    name: named?.name || null,
    nameSource: named ? 'osm' : null,
    lat: Math.round(lat * 1e5) / 1e5,
    lng: Math.round(lng * 1e5) / 1e5,
    operator: sorted.find((m) => m.operator)?.operator || null,
    surface: mostCommon(sorted.map((m) => m.surface)),
    lit: tri(sorted.map((m) => m.lit)),
    fee: tri(sorted.map((m) => m.fee)),
    bounded: sorted.some((m) => m.bounded) ? true : null,
    access: sorted.find((m) => m.access)?.access || null,
    openingHours: sorted.find((m) => m.openingHours)?.openingHours || null,
    pitchCount: sorted.length,
    memberIds: sorted.map((m) => m.id),
  }
}

function normName(name) {
  return String(name || '')
    .toLowerCase()
    .replace(/\b(pitch|pitches|football|ground|grounds|the)\b/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

/** Single-linkage clustering of items under a link predicate. */
function cluster(items, link) {
  const parent = items.map((_, i) => i)
  const find = (i) => (parent[i] === i ? i : (parent[i] = find(parent[i])))
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      if (link(items[i], items[j])) parent[find(i)] = find(j)
    }
  }
  const groups = new Map()
  items.forEach((item, i) => {
    const root = find(i)
    if (!groups.has(root)) groups.set(root, [])
    groups.get(root).push(item)
  })
  return [...groups.values()]
}

/**
 * Collapse pitches that are the same place to play:
 * - commercial: same operator (or name) within 250 m
 * - named: same normalised name within 600 m
 * - unnamed: same type within 120 m of each other (chained)
 */
export function collapse(
  pitches,
  { commercialRadius = 250, sameNameRadius = 600, clusterRadius = 120 } = {},
) {
  const commercial = pitches.filter((p) => p.type === 'commercial')
  const named = pitches.filter((p) => p.type !== 'commercial' && p.name)
  const unnamed = pitches.filter((p) => p.type !== 'commercial' && !p.name)

  const groups = [
    ...cluster(
      commercial,
      (a, b) =>
        distM(a, b) < commercialRadius &&
        ((a.operator && a.operator === b.operator) ||
          (a.name && normName(a.name) === normName(b.name))),
    ),
    ...cluster(
      named,
      (a, b) => normName(a.name) === normName(b.name) && distM(a, b) < sameNameRadius,
    ),
    ...cluster(unnamed, (a, b) => a.type === b.type && distM(a, b) < clusterRadius),
  ]
  return groups.map(mergeGroup)
}

// ── Names for the unnamed ────────────────────────────────────────────────────

function kindOf(venue) {
  if (venue.type === 'cage') return venue.pitchCount > 1 ? 'cages' : 'cage'
  if (venue.type === 'commercial') return 'pitches'
  return venue.pitchCount > 1 ? 'pitches' : 'pitch'
}

function inBounds(b, p) {
  return b && p.lat >= b.minlat && p.lat <= b.maxlat && p.lng >= b.minlon && p.lng <= b.maxlon
}

/**
 * @param venues collapsed venues
 * @param context.parks [{ name, lat, lng, bounds?: {minlat, minlon, maxlat, maxlon} }]
 * @param context.roadAt (venue) => road name | null  (from the reverse geocoder cache)
 * @param context.parkRadius metres, default 300
 */
export function deriveNames(venues, { parks = [], roadAt = () => null, parkRadius = 300 } = {}) {
  return venues.map((v) => {
    if (v.name) return v
    const kind = kindOf(v)
    let park = parks.find((p) => inBounds(p.bounds, v))
    if (!park) {
      let bestD = parkRadius
      for (const p of parks) {
        const d = distM(p, v)
        if (d < bestD) {
          bestD = d
          park = p
        }
      }
    }
    if (park)
      return { ...v, name: `${park.name} ${kind}`, nameSource: 'park', namedAfter: park.name }
    const road = roadAt(v)
    if (road) {
      const cap = kind.charAt(0).toUpperCase() + kind.slice(1)
      return { ...v, name: `${cap} off ${road}`, nameSource: 'road', namedAfter: road }
    }
    if (v.area) {
      const cap = kind.charAt(0).toUpperCase() + kind.slice(1)
      return { ...v, name: `${cap} in ${v.area}`, nameSource: 'area', namedAfter: v.area }
    }
    return v
  })
}

/**
 * After naming, separate clusters that ended up with the same derived name
 * inside one park are one venue to a user: merge them when within `radius`.
 */
export function collapseByName(venues, radius = 600) {
  const groups = cluster(
    venues,
    (a, b) => !!a.name && a.name.toLowerCase() === b.name.toLowerCase() && distM(a, b) < radius,
  )
  return groups.map((members) => {
    if (members.length === 1) return members[0]
    const sorted = [...members].sort((a, b) => a.id.localeCompare(b.id))
    const merged = mergeGroup(sorted)
    const memberIds = sorted.flatMap((m) => m.memberIds || [m.id])
    return {
      ...merged,
      name: sorted[0].name,
      nameSource: sorted[0].nameSource,
      namedAfter: sorted[0].namedAfter,
      pitchCount: sorted.reduce((n, m) => n + (m.pitchCount || 1), 0),
      memberIds,
    }
  })
}

// ── Curated venues ───────────────────────────────────────────────────────────

const COMPATIBLE = {
  commercial: new Set(['commercial', 'astro']),
  astro: new Set(['astro', 'park', 'cage']),
  park: new Set(['park', 'astro']),
  cage: new Set(['cage', 'astro']),
}

/**
 * Attach each curated venue to the nearest compatible OSM venue within
 * 300 m (so the map shows one marker), else add it standalone. Curated
 * facts win; provenance says which is which.
 */
export function mergeCurated(venues, curated, prices = {}, { radius = 300, areas = [] } = {}) {
  const out = venues.map((v) => ({ ...v }))
  for (const venue of curated) {
    const scraped = prices[venue.id]
    const price = scraped?.perHour ?? venue.pricePerHour ?? null
    const enrich = {
      name: venue.name,
      nameSource: 'curated',
      operator: venue.operator,
      type: venue.type,
      sport: venue.sport || 'football',
      surface: venue.surface ?? null,
      formats: venue.formats ?? null,
      pricePerHour: price,
      priceMax: scraped?.max ?? venue.priceMax ?? null,
      priceSource: scraped ? 'scraped' : price != null ? 'operator-site' : null,
      priceSourceUrl: scraped?.sourceUrl ?? venue.priceSourceUrl ?? null,
      priceCheckedAt: scraped?.checkedAt ?? venue.priceCheckedAt ?? null,
      priceContext: scraped?.context ?? venue.priceContext ?? null,
      bookingUrl: venue.bookingUrl ?? null,
      website: venue.website ?? null,
      lit: venue.lit ?? null,
      changingRooms: venue.changingRooms ?? null,
      bounded: venue.type === 'commercial' || venue.type === 'cage' ? true : null,
      postcode: venue.postcode ?? null,
      address: venue.address ?? null,
      curated: true,
      source: 'curated',
      sourceUrl: venue.website ?? venue.bookingUrl ?? null,
      verifiedAt: venue.verifiedAt ?? null,
    }
    let best = null
    let bestD = Infinity
    for (const p of out) {
      if (p.curated) continue
      if (!COMPATIBLE[venue.type]?.has(p.type)) continue
      const d = distM(p, venue)
      if (d < radius && d < bestD) {
        bestD = d
        best = p
      }
    }
    if (best) {
      Object.assign(best, enrich, {
        id: venue.id,
        matchedOsmId: best.id,
        osmDistanceM: Math.round(bestD),
        lat: venue.lat,
        lng: venue.lng,
      })
    } else {
      out.push({
        id: venue.id,
        lat: venue.lat,
        lng: venue.lng,
        area: nearestArea(areas, venue.lat, venue.lng),
        pitchCount: venue.pitchCount ?? 1,
        ...enrich,
      })
    }
  }
  return out
}

/** Summary counts for the payload and the audit. */
export function summarise(pitches) {
  const byType = {}
  const byNameSource = {}
  for (const p of pitches) {
    byType[p.type] = (byType[p.type] || 0) + 1
    const src = p.nameSource || 'none'
    byNameSource[src] = (byNameSource[src] || 0) + 1
  }
  return { byType, byNameSource }
}
