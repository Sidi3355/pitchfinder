// Data quality audit. Reads public/data/pitches.json and the curated list,
// counts what is unknown or stale, checks curated booking URLs and
// coordinates against postcodes.io when online, and writes
// agent/DATA_QUALITY.md plus data/audit-history.json so the trend is visible.
//
// Usage: node scripts/audit-data.mjs [--offline] [--strict] [--write]
//   --offline  skip URL and coordinate checks (used in the check workflow)
//   --strict   exit 1 when a curated venue has a dead booking URL or a
//              coordinate more than 150 m from its postcode
//   --write    update agent/DATA_QUALITY.md and data/audit-history.json
//              (the data-refresh workflow does; local runs only print)

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { distM } from './lib/pipeline.mjs'
import { loadCache, lookupPostcode, saveCache, UA } from './lib/geocode.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const args = new Set(process.argv.slice(2))
const OFFLINE = args.has('--offline') || !!process.env.OFFLINE
const STRICT = args.has('--strict')
const WRITE = args.has('--write')
const STALE_DAYS = 60
const COORD_TOLERANCE_M = 150
const URL_RECHECK_DAYS = 7
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const data = JSON.parse(readFileSync(join(ROOT, 'public/data/pitches.json'), 'utf8'))
const curated = JSON.parse(readFileSync(join(ROOT, 'scripts/curated-venues.json'), 'utf8')).venues
const pitches = data.pitches

const count = (fn) => pitches.filter(fn).length
const days = (iso) => (iso ? (Date.now() - new Date(iso).getTime()) / 86400e3 : Infinity)

// ── Pitch-level counts ───────────────────────────────────────────────────────

const byNameSource = {}
for (const p of pitches)
  byNameSource[p.nameSource || 'none'] = (byNameSource[p.nameSource || 'none'] || 0) + 1

const duplicates = []
const byName = new Map()
for (const p of pitches) {
  if (!p.name) continue
  const key = p.name.toLowerCase()
  if (!byName.has(key)) byName.set(key, [])
  byName.get(key).push(p)
}
for (const [, list] of byName) {
  for (let i = 0; i < list.length; i++)
    for (let j = i + 1; j < list.length; j++)
      if (distM(list[i], list[j]) < 200) duplicates.push([list[i].id, list[j].id, list[i].name])
}

const pitchReport = {
  total: pitches.length,
  byType: data.byType,
  byNameSource,
  unnamed: count((p) => !p.name),
  noSurface: count((p) => !p.surface),
  noLit: count((p) => p.lit == null),
  noPostcode: count((p) => !p.postcode),
  collapsedVenues: count((p) => p.pitchCount > 1),
  duplicatesWithin200m: duplicates.length,
}

// ── Curated venues ───────────────────────────────────────────────────────────

const urlCacheFile = join(ROOT, 'data/cache/url-status.json')
const urlCache = loadCache(urlCacheFile)
const coordCacheFile = join(ROOT, 'data/cache/postcode-lookups.json')
const coordCache = loadCache(coordCacheFile)

async function checkUrl(url) {
  const cached = urlCache[url]
  if (cached && days(cached.checkedAt) < URL_RECHECK_DAYS) return cached
  let entry
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': UA, Accept: 'text/html' },
      redirect: 'follow',
      signal: AbortSignal.timeout(20000),
    })
    entry = { status: res.status, finalUrl: res.url, checkedAt: new Date().toISOString() }
  } catch (err) {
    entry = { status: 0, error: err.message, checkedAt: new Date().toISOString() }
  }
  urlCache[url] = entry
  await sleep(2000)
  return entry
}

async function checkCoordinate(venue) {
  if (!venue.postcode) return null
  const key = venue.postcode.toUpperCase().replace(/\s+/g, '')
  if (!coordCache[key]) {
    coordCache[key] = {
      ...(await lookupPostcode(venue.postcode)),
      checkedAt: new Date().toISOString(),
    }
    await sleep(300)
  }
  const pc = coordCache[key]
  if (!pc || pc.lat == null) return { postcode: venue.postcode, known: false }
  const d = Math.round(distM(venue, pc))
  return { postcode: venue.postcode, known: true, distanceM: d, mismatch: d > COORD_TOLERANCE_M }
}

const venueRows = []
let unverifiedFacts = 0
for (const v of curated) {
  const facts = {
    postcode: !!v.postcode,
    address: !!v.address,
    verifiedAt: !!v.verifiedAt && days(v.verifiedAt) <= STALE_DAYS * 3,
    priceSourceUrl: !!v.priceSourceUrl,
    priceDated: !!v.priceCheckedAt && days(v.priceCheckedAt) <= STALE_DAYS,
    bookingOk: null,
    coordinateOk: null,
  }
  let url = null
  let coord = null
  if (!OFFLINE) {
    if (v.bookingUrl) {
      url = await checkUrl(v.bookingUrl)
      facts.bookingOk = url.status === 200
    }
    coord = await checkCoordinate(v)
    facts.coordinateOk = coord ? coord.known && !coord.mismatch : false
  }
  const missing = Object.entries(facts)
    .filter(([, ok]) => ok === false)
    .map(([k]) => k)
  unverifiedFacts += missing.length
  venueRows.push({ id: v.id, name: v.name, missing, urlStatus: url?.status ?? null, coord })
}
if (!OFFLINE) {
  saveCache(urlCacheFile, urlCache)
  saveCache(coordCacheFile, coordCache)
}

// For dead booking links, try the venue's listed candidates so the report
// says which URL to switch to.
if (!OFFLINE) {
  for (const r of venueRows) {
    if (r.urlStatus == null || r.urlStatus === 200) continue
    const v = curated.find((c) => c.id === r.id)
    const candidates = [...(v.urlCandidates || []), v.website].filter(Boolean)
    for (const url of candidates) {
      const c = await checkUrl(url)
      if (c.status === 200) {
        r.candidateOk = c.finalUrl || url
        break
      }
    }
  }
  saveCache(urlCacheFile, urlCache)
}

const deadUrls = venueRows.filter((r) => r.urlStatus != null && r.urlStatus !== 200)
const mismatches = venueRows.filter((r) => r.coord?.mismatch)
const stalePrices = curated.filter(
  (v) => !v.priceCheckedAt || days(v.priceCheckedAt) > STALE_DAYS,
).length

// ── Report ───────────────────────────────────────────────────────────────────

const today = new Date().toISOString().slice(0, 10)
const summary = {
  date: today,
  datasetGeneratedAt: data.generatedAt,
  pitches: pitchReport.total,
  unnamed: pitchReport.unnamed,
  noSurface: pitchReport.noSurface,
  noLit: pitchReport.noLit,
  noPostcode: pitchReport.noPostcode,
  duplicates: pitchReport.duplicatesWithin200m,
  curated: curated.length,
  unverifiedCuratedFacts: unverifiedFacts,
  stalePrices,
  deadBookingUrls: OFFLINE ? null : deadUrls.length,
  coordinateMismatches: OFFLINE ? null : mismatches.length,
  offline: OFFLINE,
}

const historyFile = join(ROOT, 'data/audit-history.json')
const history = existsSync(historyFile) ? JSON.parse(readFileSync(historyFile, 'utf8')) : []
const idx = history.findIndex((h) => h.date === today)
if (idx >= 0) history[idx] = summary
else history.push(summary)
if (WRITE) {
  mkdirSync(dirname(historyFile), { recursive: true })
  writeFileSync(historyFile, JSON.stringify(history, null, 2) + '\n')
}

const pct = (n) => `${((100 * n) / pitchReport.total).toFixed(1)}%`
const lines = []
lines.push('# Data quality')
lines.push('')
lines.push(
  `Generated ${new Date().toISOString()} by \`scripts/audit-data.mjs\`${OFFLINE ? ' (offline: URL and coordinate checks skipped)' : ''}.`,
)
lines.push(`Dataset generated ${data.generatedAt}.`)
lines.push('')
lines.push('## Pitches')
lines.push('')
lines.push('| Metric | Count | Share |')
lines.push('| --- | --- | --- |')
lines.push(`| Venues | ${pitchReport.total} | |`)
for (const [t, n] of Object.entries(pitchReport.byType || {}))
  lines.push(`| ${t} | ${n} | ${pct(n)} |`)
lines.push(
  `| Collapsed venues (more than one pitch) | ${pitchReport.collapsedVenues} | ${pct(pitchReport.collapsedVenues)} |`,
)
for (const [s, n] of Object.entries(byNameSource))
  lines.push(`| Name from ${s} | ${n} | ${pct(n)} |`)
lines.push(`| No name at all | ${pitchReport.unnamed} | ${pct(pitchReport.unnamed)} |`)
lines.push(`| Surface not known | ${pitchReport.noSurface} | ${pct(pitchReport.noSurface)} |`)
lines.push(`| Floodlights not known | ${pitchReport.noLit} | ${pct(pitchReport.noLit)} |`)
lines.push(`| No postcode | ${pitchReport.noPostcode} | ${pct(pitchReport.noPostcode)} |`)
lines.push(`| Same name within 200 m | ${pitchReport.duplicatesWithin200m} | |`)
lines.push('')
lines.push('## Curated venues')
lines.push('')
lines.push(
  `${curated.length} venues. Unverified facts: **${unverifiedFacts}** (postcode, address, verified date, price source, price dated within ${STALE_DAYS} days, booking URL returns 200, coordinate within ${COORD_TOLERANCE_M} m of the postcode).`,
)
lines.push('')
lines.push('| Venue | Missing or failing | Booking URL | Coordinate |')
lines.push('| --- | --- | --- | --- |')
for (const r of venueRows) {
  const coordText = !r.coord
    ? OFFLINE
      ? 'not checked'
      : 'no postcode'
    : !r.coord.known
      ? 'postcode unknown'
      : `${r.coord.distanceM} m${r.coord.mismatch ? ' MISMATCH' : ''}`
  const urlText = `${r.urlStatus ?? (OFFLINE ? 'not checked' : 'none')}${r.candidateOk ? ` (working: ${r.candidateOk})` : ''}`
  lines.push(`| ${r.name} | ${r.missing.join(', ') || 'none'} | ${urlText} | ${coordText} |`)
}
lines.push('')
lines.push('## History')
lines.push('')
lines.push(
  '| Date | Venues | Unnamed | No surface | No lights | No postcode | Duplicates | Unverified curated facts | Stale prices | Dead URLs | Coord mismatches |',
)
lines.push('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |')
for (const h of history.slice(-30)) {
  lines.push(
    `| ${h.date} | ${h.pitches} | ${h.unnamed} | ${h.noSurface} | ${h.noLit} | ${h.noPostcode} | ${h.duplicates} | ${h.unverifiedCuratedFacts} | ${h.stalePrices} | ${h.deadBookingUrls ?? 'n/a'} | ${h.coordinateMismatches ?? 'n/a'} |`,
  )
}
lines.push('')
if (WRITE) {
  mkdirSync(join(ROOT, 'agent'), { recursive: true })
  writeFileSync(join(ROOT, 'agent/DATA_QUALITY.md'), lines.join('\n'))
}
console.log(lines.slice(0, 40).join('\n'))
if (!WRITE) console.log('\n(report not written: pass --write)')

if (STRICT && !OFFLINE && (deadUrls.length || mismatches.length)) {
  console.error(
    `\nSTRICT: ${deadUrls.length} dead booking URLs, ${mismatches.length} coordinate mismatches`,
  )
  process.exit(1)
}
