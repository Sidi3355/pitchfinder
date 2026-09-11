// Builds public/data/pitches.json: every public football pitch in Greater
// London from OpenStreetMap (Overpass), collapsed into venues, named after
// the park or road they sit on when OSM has no name, geocoded to a nearest
// postcode, merged with the curated bookable-venue list and any scraped
// prices, with a source and date on every record.
//
// Run by .github/workflows/data-refresh.yml (weekly + on demand). Node 18+.
// Offline: FIXTURE=tests/fixtures/overpass-small.json OFFLINE=1 node scripts/build-data.mjs
//
// Data © OpenStreetMap contributors, ODbL. Attribution is rendered in the app.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { AREAS } from '../src/data/areas.js'
import { collapse, deriveNames, mergeCurated, summarise, transform } from './lib/pipeline.mjs'
import { keyFor, loadCache, reversePostcodes, reverseRoads, saveCache, UA } from './lib/geocode.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'public/data/pitches.json')
const CACHE_DIR = join(ROOT, 'data/cache')
const OFFLINE = !!process.env.OFFLINE
const NOMINATIM_MAX = Number(process.env.NOMINATIM_MAX || 1200)

// Greater London bounding box (south, west, north, east).
const BBOX = '51.26,-0.53,51.71,0.36'

const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
]

const PITCH_QUERY = `
[out:json][timeout:300];
(
  nwr["leisure"="pitch"]["sport"~"soccer",i](${BBOX});
  nwr["leisure"="pitch"]["sport"~"multi",i](${BBOX});
);
out center;
`

// Named places a pitch can be named after. Bounds let the pipeline tell
// "inside this park" from "near this park".
const PARK_QUERY = `
[out:json][timeout:300];
(
  nwr["leisure"~"^(park|recreation_ground|playing_fields|sports_centre|stadium|common|garden|nature_reserve)$"]["name"](${BBOX});
  nwr["landuse"~"^(recreation_ground|grass|village_green)$"]["name"](${BBOX});
);
out bb;
`

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function fetchOverpass(query, label) {
  let lastErr
  for (let attempt = 0; attempt < 3; attempt++) {
    for (const endpoint of OVERPASS_ENDPOINTS) {
      try {
        console.log(`${label}: querying ${endpoint} (attempt ${attempt + 1})`)
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': UA },
          body: `data=${encodeURIComponent(query)}`,
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
  throw new Error(`All Overpass endpoints failed for ${label}: ${lastErr?.message}`)
}

/** Overpass park elements (out bb) -> { name, lat, lng, bounds }. Very large areas are dropped. */
export function parksFromElements(elements, maxSpanKm = 4) {
  const parks = []
  for (const el of elements) {
    const name = el.tags?.name?.trim()
    if (!name) continue
    let lat = el.lat
    let lng = el.lon
    let bounds = null
    if (el.bounds) {
      bounds = el.bounds
      lat = (bounds.minlat + bounds.maxlat) / 2
      lng = (bounds.minlon + bounds.maxlon) / 2
      const spanKm = Math.max(
        (bounds.maxlat - bounds.minlat) * 111,
        (bounds.maxlon - bounds.minlon) * 69,
      )
      if (spanKm > maxSpanKm) continue
    }
    if (lat == null || lng == null) continue
    parks.push({ name, lat, lng, bounds })
  }
  return parks
}

async function main() {
  const curated = JSON.parse(readFileSync(join(ROOT, 'scripts/curated-venues.json'), 'utf8')).venues
  const pricesPath = join(ROOT, 'data/prices.json')
  const prices = existsSync(pricesPath) ? JSON.parse(readFileSync(pricesPath, 'utf8')) : {}

  let elements
  let parks
  let fixtureRoads = null
  if (process.env.FIXTURE) {
    const fixture = JSON.parse(readFileSync(process.env.FIXTURE, 'utf8'))
    elements = fixture.elements
    parks = fixture.parks || []
    fixtureRoads = fixture.roads || {}
  } else {
    elements = await fetchOverpass(PITCH_QUERY, 'pitches')
    parks = parksFromElements(await fetchOverpass(PARK_QUERY, 'parks'))
    console.log(`  ${parks.length} named parks and playing fields`)
  }

  const pitches = transform(elements, { areas: AREAS })
  console.log(`${pitches.length} public pitches after exclusions`)
  let venues = collapse(pitches)
  console.log(`${venues.length} venues after collapsing duplicates`)

  // Geocoding: postcodes for everything, roads only for what parks cannot name.
  const postcodeCache = loadCache(join(CACHE_DIR, 'postcodes.json'))
  const roadCache = loadCache(join(CACHE_DIR, 'nominatim.json'))
  const points = [...venues, ...curated].map((v) => ({ lat: v.lat, lng: v.lng }))
  if (!OFFLINE) {
    await reversePostcodes(points, { cache: postcodeCache, log: console.log })
    saveCache(join(CACHE_DIR, 'postcodes.json'), postcodeCache)
  }
  const namedByPark = deriveNames(venues, { parks, roadAt: () => null })
  const needRoad = namedByPark.filter((v) => !v.name || v.nameSource === 'area')
  if (!OFFLINE) {
    await reverseRoads(needRoad, { cache: roadCache, log: console.log, max: NOMINATIM_MAX })
    saveCache(join(CACHE_DIR, 'nominatim.json'), roadCache)
  }
  const roadAt = (v) =>
    fixtureRoads?.[keyFor(v.lat, v.lng)] ?? roadCache[keyFor(v.lat, v.lng)]?.road ?? null
  venues = deriveNames(venues, { parks, roadAt })

  for (const v of venues) {
    const pc = postcodeCache[keyFor(v.lat, v.lng)]
    if (pc?.postcode) {
      v.postcode = pc.postcode
      v.postcodeSource = 'nearest'
      v.borough = pc.district || null
    }
  }

  let out = mergeCurated(venues, curated, prices, { areas: AREAS })
  for (const v of out) {
    if (v.curated && !v.postcode) {
      const pc = postcodeCache[keyFor(v.lat, v.lng)]
      if (pc?.postcode) {
        v.postcode = pc.postcode
        v.postcodeSource = 'nearest'
        v.borough = pc.district || null
      }
    } else if (v.curated && v.postcode) {
      v.postcodeSource = 'operator'
    }
  }

  // Deterministic order keeps diffs small between refreshes.
  out.sort((a, b) => a.id.localeCompare(b.id))
  const generatedAt = new Date().toISOString()
  for (const v of out) if (v.source === 'osm') v.verifiedAt = generatedAt.slice(0, 10)

  const { byType, byNameSource } = summarise(out)
  const payload = {
    schemaVersion: 2,
    generatedAt,
    source: 'OpenStreetMap (Overpass API) + curated venue list',
    attribution: '© OpenStreetMap contributors (ODbL)',
    sources: {
      osm: {
        name: 'OpenStreetMap',
        url: 'https://www.openstreetmap.org/copyright',
        licence: 'ODbL',
      },
      postcodes: { name: 'postcodes.io', url: 'https://postcodes.io', licence: 'OGL / ONS' },
      nominatim: {
        name: 'Nominatim (OpenStreetMap)',
        url: 'https://nominatim.org',
        licence: 'ODbL',
      },
      curated: {
        name: 'PitchFinder curated venue list',
        url: 'https://github.com/Sidi3355/pitchfinder/blob/main/scripts/curated-venues.json',
      },
    },
    count: out.length,
    byType,
    byNameSource,
    pitches: out,
  }

  mkdirSync(dirname(OUT), { recursive: true })
  writeFileSync(OUT, JSON.stringify(payload))
  console.log(`Wrote ${out.length} venues`, byType, byNameSource)
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
