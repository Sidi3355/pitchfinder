// Builds public/data/pitches.json — the full directory of football pitches in
// Greater London — from OpenStreetMap (Overpass API), merged with the curated
// commercial-venue list (scripts/curated-venues.json) and any scraped prices
// (data/prices.json, written by scripts/scrape-prices.mjs).
//
// Run by .github/workflows/data-refresh.yml (weekly + on demand). Requires
// Node 18+ (built-in fetch). No npm dependencies.
//
// Data © OpenStreetMap contributors, ODbL — attribution is rendered in the app.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { AREAS } from '../src/data/areas.js'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

// Greater London bounding box (south, west, north, east).
const BBOX = '51.26,-0.53,51.71,0.36'

const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
]

const QUERY = `
[out:json][timeout:300];
(
  nwr["leisure"="pitch"]["sport"~"soccer",i](${BBOX});
  nwr["leisure"="pitch"]["sport"~"multi",i](${BBOX});
);
out center;
`

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function fetchOverpass() {
  let lastErr
  for (let attempt = 0; attempt < 3; attempt++) {
    for (const endpoint of OVERPASS_ENDPOINTS) {
      try {
        console.log(`Querying ${endpoint} (attempt ${attempt + 1}) …`)
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'PitchFinderBot/1.0 (+https://github.com/Sidi3355/pitchfinder)',
          },
          body: `data=${encodeURIComponent(QUERY)}`,
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        if (!Array.isArray(json.elements)) throw new Error('no elements array')
        console.log(`  ${json.elements.length} raw elements`)
        return json.elements
      } catch (err) {
        lastErr = err
        console.warn(`  failed: ${err.message}`)
      }
    }
    await sleep(30000 * (attempt + 1))
  }
  throw new Error(`All Overpass endpoints failed: ${lastErr?.message}`)
}

// ── Classification ───────────────────────────────────────────────────────────

const COMMERCIAL_RE = /powerleague|power league|goals\b|playfootball|play football|soccerdome|footballworx|futsal club/i
const SCHOOL_RE = /\bschool\b|\bacademy\b|\bcollege\b|sixth form|\bprep\b|\bprimary\b|\bsecondary\b|university/i
const CAGE_RE = /\bmuga\b|\bcage\b|ball ?court|games area|multi[- ]use/i
const HARD_SURFACE_RE = /tarmac|asphalt|concrete|paved|macadam/i
const ARTIFICIAL_RE = /artificial|astro|3g|4g|tartan|synthetic|acrylic/i

function normSurface(s = '') {
  const v = s.toLowerCase()
  if (/3g|4g/.test(v)) return '3g'
  if (ARTIFICIAL_RE.test(v)) return 'astro'
  if (/grass|turf|meadow/.test(v)) return 'grass'
  if (HARD_SURFACE_RE.test(v)) return 'hard'
  return v ? 'other' : null
}

function classify(tags) {
  const label = `${tags.name || ''} ${tags.operator || ''}`
  const sport = (tags.sport || '').toLowerCase()
  const surface = normSurface(tags.surface)
  if (COMMERCIAL_RE.test(label)) return 'commercial'
  if (sport.includes('multi') || CAGE_RE.test(label) || tags.hoops === 'yes' || surface === 'hard') return 'cage'
  if (surface === '3g' || surface === 'astro') return 'astro'
  return 'park'
}

function excluded(tags) {
  const access = (tags.access || '').toLowerCase()
  if (access === 'private' || access === 'no' || access === 'military') return true
  if (SCHOOL_RE.test(`${tags.name || ''} ${tags.operator || ''} ${tags['operator:type'] || ''}`)) return true
  return false
}

function nearestArea(lat, lng) {
  let best = null
  let bestD = Infinity
  for (const a of AREAS) {
    const d = (a.lat - lat) ** 2 + ((a.lng - lng) * 0.62) ** 2
    if (d < bestD) {
      bestD = d
      best = a
    }
  }
  return best?.name || null
}

function distM(a, b) {
  const dLat = (a.lat - b.lat) * 111320
  const dLng = (a.lng - b.lng) * 111320 * Math.cos((a.lat * Math.PI) / 180)
  return Math.hypot(dLat, dLng)
}

// ── Build ────────────────────────────────────────────────────────────────────

function transform(elements) {
  const pitches = []
  for (const el of elements) {
    const tags = el.tags || {}
    const lat = el.lat ?? el.center?.lat
    const lng = el.lon ?? el.center?.lon
    if (lat == null || lng == null) continue
    if (excluded(tags)) continue

    pitches.push({
      id: `osm-${el.type[0]}${el.id}`,
      name: tags.name || null,
      type: classify(tags),
      operator: tags.operator || null,
      lat: Math.round(lat * 1e5) / 1e5,
      lng: Math.round(lng * 1e5) / 1e5,
      area: nearestArea(lat, lng),
      surface: normSurface(tags.surface),
      lit: tags.lit === 'yes' ? true : tags.lit === 'no' ? false : null,
      access: tags.access || null,
      fee: tags.fee === 'yes' ? true : tags.fee === 'no' ? false : null,
      bounded: tags.barrier != null || null,
    })
  }
  return pitches
}

/** Collapse clusters of same-operator commercial pitches into one venue. */
function collapseCommercial(pitches) {
  const commercial = pitches.filter((p) => p.type === 'commercial')
  const rest = pitches.filter((p) => p.type !== 'commercial')
  const groups = []
  for (const p of commercial) {
    const g = groups.find(
      (grp) => distM(grp, p) < 250 && (grp.operator || '') === (p.operator || ''),
    )
    if (g) {
      g.members.push(p)
    } else {
      groups.push({ ...p, members: [p] })
    }
  }
  const collapsed = groups.map((g) => {
    const { members, ...first } = g
    return { ...first, pitchCount: members.length }
  })
  return [...rest, ...collapsed]
}

function mergeCurated(pitches, curated, prices) {
  const out = [...pitches]
  for (const venue of curated) {
    const scraped = prices[venue.id]
    const enrich = {
      name: venue.name,
      operator: venue.operator,
      type: venue.type,
      surface: venue.surface,
      formats: venue.formats,
      pricePerHour: scraped?.min ?? venue.pricePerHour,
      priceMax: scraped?.max ?? null,
      priceCheckedAt: scraped?.checkedAt ?? null,
      priceSource: scraped ? 'scraped' : 'published',
      bookingUrl: venue.bookingUrl,
      lit: venue.lit,
      changingRooms: venue.changingRooms,
      bounded: venue.type === 'commercial' || venue.type === 'cage' ? true : null,
      curated: true,
    }
    // Attach to the nearest matching OSM feature within 300 m, else add standalone.
    let best = null
    let bestD = Infinity
    for (const p of out) {
      const d = distM(p, venue)
      if (d < 300 && d < bestD) {
        bestD = d
        best = p
      }
    }
    if (best) {
      Object.assign(best, enrich, { id: venue.id, matchedOsmId: best.id })
    } else {
      out.push({ id: venue.id, lat: venue.lat, lng: venue.lng, area: nearestArea(venue.lat, venue.lng), ...enrich })
    }
  }
  return out
}

async function main() {
  const curated = JSON.parse(readFileSync(join(ROOT, 'scripts/curated-venues.json'), 'utf8')).venues
  const pricesPath = join(ROOT, 'data/prices.json')
  const prices = existsSync(pricesPath) ? JSON.parse(readFileSync(pricesPath, 'utf8')) : {}

  // FIXTURE=path/to/overpass.json runs the transform offline (dev/testing).
  const elements = process.env.FIXTURE
    ? JSON.parse(readFileSync(process.env.FIXTURE, 'utf8')).elements
    : await fetchOverpass()
  let pitches = transform(elements)
  pitches = collapseCommercial(pitches)
  pitches = mergeCurated(pitches, curated, prices)

  // Deterministic order keeps diffs small between refreshes.
  pitches.sort((a, b) => a.id.localeCompare(b.id))

  const byType = {}
  for (const p of pitches) byType[p.type] = (byType[p.type] || 0) + 1

  const payload = {
    generatedAt: new Date().toISOString(),
    source: 'OpenStreetMap (Overpass API) + curated venue list',
    attribution: '© OpenStreetMap contributors (ODbL)',
    count: pitches.length,
    byType,
    pitches,
  }

  mkdirSync(join(ROOT, 'public/data'), { recursive: true })
  writeFileSync(join(ROOT, 'public/data/pitches.json'), JSON.stringify(payload))
  console.log(`Wrote ${pitches.length} pitches`, byType)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
