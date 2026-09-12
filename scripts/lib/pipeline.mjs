// Pure pipeline steps: classify OpenStreetMap pitches, collapse duplicates
// into venues, derive names for unnamed venues, merge the curated list.
// No network, no file system: build-data.mjs feeds this and the unit tests
// feed it fixtures.

// ── Classification ───────────────────────────────────────────────────────────

import { parseOsmHours } from '../../src/lib/hours.js'
import { cheapestBand, linesFromBands, perHour } from './slots.mjs'

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

// ── Bookable venues and the operators' own pages ─────────────────────────────

/** The app is about places you can book: football centres and astro pitches. */
export const BOOKABLE_TYPES = new Set(['commercial', 'astro'])

export function normaliseName(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

/** Operator brand for filtering and colour: goals | powerleague | other. */
export function brandOf(operator, name) {
  const s = `${operator || ''} ${name || ''}`.toLowerCase()
  if (/\bgoals\b/.test(s)) return 'goals'
  if (/powerleague/.test(s)) return 'powerleague'
  return 'other'
}

/** Copy only the facts the source states; null and undefined never overwrite. */
function assignKnown(target, facts) {
  for (const [k, v] of Object.entries(facts)) {
    if (v === null || v === undefined) continue
    if (Array.isArray(v) && v.length === 0) continue
    target[k] = v
  }
  return target
}

function liveFacts(club) {
  const hourly = (club.prices || []).filter((p) => p.unit === 'hour').map((p) => p.amount)
  return {
    name: club.name,
    nameSource: 'operator',
    operator: club.operator,
    brand: brandOf(club.operator, club.name),
    type: 'commercial',
    sport: 'football',
    surface: club.surface,
    formats: club.formats,
    pricePerHour: club.priceFrom,
    priceMax:
      hourly.length > 1 && Math.max(...hourly) !== Math.min(...hourly) ? Math.max(...hourly) : null,
    prices: club.prices,
    priceSource: club.priceFrom != null ? 'operator-site' : null,
    priceSourceUrl: club.priceFrom != null ? club.url : null,
    priceCheckedAt: club.priceFrom != null ? club.fetchedAt : null,
    bookingUrl: club.bookingUrl || club.url,
    website: club.url,
    lit: club.lit,
    changingRooms: club.changingRooms,
    showers: club.showers,
    parking: club.parking,
    bar: club.bar,
    cafe: club.cafe,
    covered: club.covered,
    hours: club.openingHours,
    hoursSource: club.openingHours ? 'operator-site' : null,
    hoursSourceUrl: club.openingHours ? club.url : null,
    hoursCheckedAt: club.openingHours ? club.fetchedAt : null,
    hoursQuotes: club.hoursQuotes,
    postcode: club.postcode,
    postcodeSource: club.postcode ? 'operator' : null,
    address: club.address,
    phone: club.phone,
    pitchCount: club.pitchCount,
    bounded: true,
    curated: true,
    source: 'operator-site',
    sourceUrl: club.url,
    verifiedAt: club.fetchedAt ? club.fetchedAt.slice(0, 10) : null,
  }
}

/**
 * The operators' own pages (data/venues-live.json) on top of the merged list.
 * A club matches a venue by id, then by brand and name, then by distance
 * (300 m, football centres only); a London club that matches nothing is
 * added. A fact the page states wins; a fact it does not state keeps the
 * baseline's value. Coordinates from the page's own schema.org data replace
 * the baseline's; a postcode centroid does not.
 */
export function applyLive(venues, live, { areas = [], radius = 300 } = {}) {
  const out = venues.map((v) => ({ ...v }))
  const clubs = (live?.operators || []).flatMap((op) => op.venues || [])
  for (const club of clubs) {
    if (!club.inLondon || club.lat == null || club.lng == null) continue
    const brand = brandOf(club.operator, club.name)
    let target = out.find((v) => v.id === club.id)
    if (!target) {
      target = out.find(
        (v) =>
          brandOf(v.operator, v.name) === brand &&
          normaliseName(v.name) === normaliseName(club.name),
      )
    }
    if (!target) {
      let bestD = Infinity
      for (const v of out) {
        if (v.type !== 'commercial' || brandOf(v.operator, v.name) !== brand) continue
        const d = distM(v, club)
        if (d < radius && d < bestD) {
          bestD = d
          target = v
        }
      }
    }
    const facts = liveFacts(club)
    if (target) {
      assignKnown(target, facts)
      if (club.geoSource === 'page') {
        target.lat = club.lat
        target.lng = club.lng
      }
      target.liveId = club.id
    } else {
      out.push(
        assignKnown(
          {
            id: club.id,
            lat: club.lat,
            lng: club.lng,
            area: nearestArea(areas, club.lat, club.lng),
            pitchCount: 1,
            liveId: club.id,
          },
          facts,
        ),
      )
    }
  }
  return out
}

/** Structured hours from OpenStreetMap's opening_hours when nothing better is known. */
export function withHours(venue) {
  const v = { ...venue }
  if (!v.brand) v.brand = brandOf(v.operator, v.name)
  if (!v.hours && v.openingHours) {
    const week = parseOsmHours(v.openingHours)
    if (week) {
      v.hours = week
      v.hoursSource = 'osm'
    }
  }
  return v
}

export function onlyBookable(venues) {
  return venues.filter((v) => BOOKABLE_TYPES.has(v.type))
}

// ── Slot calendars: prices, hours and pitches from the booking sites ──────

const NAME_STOP_WORDS = new Set([
  'the',
  'and',
  'of',
  'at',
  'in',
  'on',
  'a',
  'an',
  'pitch',
  'pitches',
  'football',
  'fc',
  'formerly',
  'centre',
  'center',
  'sports',
  'sport',
  'ground',
  'grounds',
  'hub',
  'to',
  'off',
])

/** The words that identify a venue name: lower case, no punctuation, no filler. */
export function nameTokens(s) {
  return new Set(
    String(s || '')
      .toLowerCase()
      .replace(/\(.*?\)/g, ' ')
      .replace(/[^a-z0-9]+/g, ' ')
      .split(' ')
      .filter((w) => w && !NAME_STOP_WORDS.has(w)),
  )
}

/** 0..1: the share of identifying words two names have in common. */
export function nameSimilarity(a, b) {
  const ta = nameTokens(a)
  const tb = nameTokens(b)
  if (!ta.size || !tb.size) return 0
  let shared = 0
  for (const w of ta) if (tb.has(w)) shared++
  return shared / (ta.size + tb.size - shared)
}

function unionFormats(a, b) {
  return [...new Set([...(a || []), ...(b || [])].filter((n) => n > 0))].sort((x, y) => x - y)
}

/** Price lines and the headline figures from one source's bands. */
function assignBands(target, bands, { source, sourceUrl, checkedAt }) {
  if (!bands?.length) return
  const cheapest = cheapestBand(bands)
  const rates = bands.map((b) => perHour(b.amount, b.minutes)).filter((r) => r != null)
  const kept = (target.prices || []).filter((l) => l.unit !== 'slot')
  target.prices = [...kept, ...linesFromBands(bands, { source, sourceUrl, checkedAt })]
  target.pricePerHour = perHour(cheapest.amount, cheapest.minutes)
  const top = Math.max(...rates)
  target.priceMax = top > target.pricePerHour ? top : null
  target.priceSlot = { amount: cheapest.amount, minutes: cheapest.minutes }
  target.priceSource = source
  target.priceSourceUrl = sourceUrl
  target.priceCheckedAt = checkedAt
  target.priceContext = null
  target.formats = unionFormats(
    target.formats,
    bands.map((b) => b.format),
  )
}

const FACILITY_KEYS = ['lit', 'changingRooms', 'parking', 'showers', 'bar', 'cafe', 'covered']

/** Which operator a Playfinder venue belongs to, from its slug and name. */
function playfinderBrand(venue) {
  if (/^powerleague/.test(venue.slug || '')) return 'powerleague'
  return brandOf(null, venue.name)
}

/** 'Powerleague Finchley pitch' -> 'powerleague finchley': the map's derived suffixes do not count. */
function coreName(name) {
  return normaliseName(name).replace(/\s+(pitch|pitches|centre|center)$/, '')
}

function assignPlayfinderVenue(target, venue) {
  const brand = playfinderBrand(venue)
  if (brand !== 'other') {
    // An operator's club, whatever the map called it: a football centre run by them.
    target.type = 'commercial'
    target.brand = brand
    if (!target.operator) target.operator = brand === 'goals' ? 'Goals' : 'Powerleague'
    if (['park', 'road', 'area', 'osm'].includes(target.nameSource) || !target.name) {
      target.name = venue.name
      target.nameSource = 'playfinder'
    }
  }
  if (venue.hours && target.hoursSource !== 'operator-site') {
    target.hours = venue.hours
    target.hoursSource = 'playfinder'
    target.hoursSourceUrl = venue.url
    target.hoursCheckedAt = venue.fetchedAt
    target.hoursQuotes = venue.hoursQuotes || []
  }
  for (const k of FACILITY_KEYS)
    if (target[k] == null && venue.facilities?.[k] === true) target[k] = true
  const artificial = (venue.pitches || []).filter(
    (p) => p.format && (p.surface === '3g' || p.surface === 'astro'),
  )
  if (!target.surface && artificial.length)
    target.surface = artificial.some((p) => p.surface === '3g') ? '3g' : 'astro'
  target.formats = unionFormats(
    target.formats,
    artificial.map((p) => p.format),
  )
  if (!target.address && venue.address) target.address = venue.address
  if (!target.postcode && venue.postcode) {
    target.postcode = venue.postcode
    target.postcodeSource = 'operator'
  }
  // The operator's own booking site (Goals on Pitchbooking) outranks a reseller.
  const ownSite = target.priceSource === 'pitchbooking'
  if (!ownSite)
    assignBands(target, venue.bands, {
      source: 'playfinder',
      sourceUrl: venue.url,
      checkedAt: venue.fetchedAt,
    })
  target.playfinderUrl = venue.url
  if (!ownSite && (!target.bookingUrl || brand === 'powerleague')) target.bookingUrl = venue.url
  if (!target.verifiedAt || target.verifiedAt < venue.fetchedAt.slice(0, 10))
    target.verifiedAt = venue.fetchedAt.slice(0, 10)
}

/**
 * Which venue on the map a Playfinder venue is, or null. Powerleague by
 * name; anything else by a shared distinctive word within 300 m, or the
 * only astro within 120 m, or a near-identical name within 800 m.
 */
export function matchPlayfinderVenue(venue, venues, { radius = 300 } = {}) {
  const brand = playfinderBrand(venue)
  if (brand !== 'other') {
    // An operator's club: the same club by name (their own entry before the
    // map's copy of it), else the nearest of theirs within a kilometre.
    const exact = venues
      .filter(
        (v) => brandOf(v.operator, v.name) === brand && coreName(v.name) === coreName(venue.name),
      )
      .sort((a, b) => (b.type === 'commercial') - (a.type === 'commercial'))[0]
    if (exact) return exact
    if (venue.lat == null) return null
    let best = null
    for (const v of venues) {
      if (brandOf(v.operator, v.name) !== brand) continue
      const d = distM(v, venue)
      if (d < 1000 && (!best || d < best.d)) best = { v, d }
    }
    return best ? best.v : null
  }
  if (venue.lat == null || venue.lng == null) return null
  let best = null
  let near = []
  for (const v of venues) {
    if (v.type !== 'astro') continue
    const d = distM(v, venue)
    if (d <= 120) near.push(v)
    const sim = nameSimilarity(v.name, venue.name)
    const ok = (d <= radius && sim >= 0.34) || (d <= 800 && sim >= 0.6)
    if (ok && (!best || sim > best.sim || (sim === best.sim && d < best.d))) best = { v, sim, d }
  }
  if (best) return best.v
  return near.length === 1 ? near[0] : null
}

function newPlayfinderVenue(venue, areas) {
  const artificial = (venue.pitches || []).filter(
    (p) => p.format && (p.surface === '3g' || p.surface === 'astro'),
  )
  const brand = playfinderBrand(venue)
  const slug = venue.slug.replace(/[^a-z0-9-]/g, '')
  const v = {
    id:
      brand === 'powerleague'
        ? `pl-${slug.replace(/^powerleague-?/, '').replace(/-/g, '')}`
        : brand === 'goals'
          ? `go-${slug.replace(/^goals-?|-?goals$/g, '').replace(/-/g, '')}`
          : `pf-${slug}`,
    name: venue.name,
    nameSource: 'playfinder',
    type: brand === 'other' ? 'astro' : 'commercial',
    sport: 'football',
    brand,
    operator: brand === 'goals' ? 'Goals' : brand === 'powerleague' ? 'Powerleague' : undefined,
    lat: venue.lat,
    lng: venue.lng,
    geoSource: 'postcode',
    area: nearestArea(areas, venue.lat, venue.lng),
    borough: venue.district || null,
    pitchCount: Math.max(artificial.length, 1),
    bounded: null,
    fee: true,
    source: 'playfinder',
    sourceUrl: venue.url,
    bookingUrl: venue.url,
  }
  assignPlayfinderVenue(v, venue)
  return v
}

/**
 * The slot calendars (data/slots-live.json) on top of the venues: Goals
 * prices from Pitchbooking, Goals' own booking site; Powerleague and astro
 * prices, hours, facilities and pitches from Playfinder. A Playfinder venue
 * in London with an artificial football pitch that matches nothing on the
 * map is added, pinned at its postcode.
 */
export function applySlots(venues, slots, { areas = [] } = {}) {
  const out = venues.map((v) => ({ ...v }))
  for (const club of slots?.pitchbooking?.clubs || []) {
    if (!club.bands?.length) continue
    const target =
      out.find((v) => v.id === club.id) ||
      out.find(
        (v) =>
          brandOf(v.operator, v.name) === 'goals' &&
          normaliseName(v.name) === normaliseName(club.name),
      )
    if (!target) continue
    assignBands(target, club.bands, {
      source: 'pitchbooking',
      sourceUrl: club.url,
      checkedAt: club.fetchedAt,
    })
    target.bookingUrl = club.url
  }
  for (const venue of slots?.playfinder?.venues || []) {
    if (venue.skipped || !venue.inLondon || !venue.name) continue
    const artificial = (venue.pitches || []).some(
      (p) => p.format && (p.surface === '3g' || p.surface === 'astro'),
    )
    const target = matchPlayfinderVenue(venue, out)
    if (target) assignPlayfinderVenue(target, venue)
    else if (artificial && venue.lat != null && venue.lng != null)
      out.push(newPlayfinderVenue(venue, areas))
  }
  return dropOperatorTwins(out)
}

/**
 * The map often holds an operator's club twice: their own entry and the
 * pitch someone drew for it. Once the club has its prices, the map's copy
 * within 300 m (same operator, no prices of its own) is the same place.
 */
function dropOperatorTwins(venues) {
  const clubs = venues.filter(
    (v) => v.type === 'commercial' && brandOf(v.operator, v.name) !== 'other',
  )
  return venues.filter((v) => {
    if (v.type === 'commercial' || v.source !== 'osm' || v.pricePerHour != null) return true
    const brand = brandOf(v.operator, v.name)
    if (brand === 'other') return true
    return !clubs.some((c) => brandOf(c.operator, c.name) === brand && distM(c, v) < 300)
  })
}
