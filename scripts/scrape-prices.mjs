// Best-effort price refresh for curated bookable venues.
//
// For each venue with a bookingUrl, fetches the page (only if the site's
// robots.txt allows it), extracts plausible per-hour prices in GBP, and writes
// data/prices.json keyed by venue id. build-data.mjs overlays these onto the
// curated baseline prices, so a failed or blocked scrape simply leaves the
// baseline in place — this script must never be a hard dependency.
//
// Polite by design: identifies itself, honours robots.txt, one request per
// ~2 s, and touches only public venue pages.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const UA = 'PitchFinderBot/1.0 (+https://github.com/Sidi3355/pitchfinder; data refresh)'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const robotsCache = new Map()

async function allowedByRobots(url) {
  const { origin, pathname } = new URL(url)
  if (!robotsCache.has(origin)) {
    try {
      const res = await fetch(`${origin}/robots.txt`, { headers: { 'User-Agent': UA } })
      robotsCache.set(origin, res.ok ? await res.text() : '')
    } catch {
      robotsCache.set(origin, '')
    }
  }
  // Minimal parser: the User-agent: * group's Disallow rules.
  const txt = robotsCache.get(origin)
  const lines = txt.split('\n').map((l) => l.trim())
  let applies = false
  const disallows = []
  for (const line of lines) {
    const [rawKey, ...restParts] = line.split(':')
    const key = rawKey?.toLowerCase()
    const value = restParts.join(':').trim()
    if (key === 'user-agent') applies = value === '*' || /pitchfinder/i.test(value)
    else if (applies && key === 'disallow' && value) disallows.push(value)
  }
  return !disallows.some((rule) => pathname.startsWith(rule.replace(/\*$/, '')))
}

function extractPrices(html) {
  // £NN or £NN.NN — keep only values plausible for a pitch-hour.
  const matches = [...html.matchAll(/£\s?(\d{1,3}(?:\.\d{2})?)/g)]
    .map((m) => Number(m[1]))
    .filter((v) => v >= 15 && v <= 200)
  if (!matches.length) return null
  return { min: Math.min(...matches), max: Math.max(...matches) }
}

async function main() {
  const { venues } = JSON.parse(readFileSync(join(ROOT, 'scripts/curated-venues.json'), 'utf8'))
  const outPath = join(ROOT, 'data/prices.json')
  const prices = existsSync(outPath) ? JSON.parse(readFileSync(outPath, 'utf8')) : {}
  let updated = 0

  for (const venue of venues) {
    if (!venue.bookingUrl || venue.pricePerHour === 0) continue
    try {
      if (!(await allowedByRobots(venue.bookingUrl))) {
        console.log(`robots.txt disallows ${venue.bookingUrl} — skipping`)
        continue
      }
      const res = await fetch(venue.bookingUrl, {
        headers: { 'User-Agent': UA, Accept: 'text/html' },
        redirect: 'follow',
        signal: AbortSignal.timeout(20000),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const found = extractPrices(await res.text())
      if (found) {
        prices[venue.id] = {
          ...found,
          currency: 'GBP',
          checkedAt: new Date().toISOString(),
          sourceUrl: venue.bookingUrl,
        }
        updated++
        console.log(`${venue.id}: £${found.min}–£${found.max}`)
      } else {
        console.log(`${venue.id}: no price found on page (keeping baseline)`)
      }
    } catch (err) {
      console.log(`${venue.id}: ${err.message} (keeping baseline)`)
    }
    await sleep(2000)
  }

  mkdirSync(join(ROOT, 'data'), { recursive: true })
  writeFileSync(outPath, JSON.stringify(prices, null, 2))
  console.log(`Updated ${updated} venue prices`)
}

main().catch((err) => {
  // Non-fatal by contract — log and exit clean so the data build continues.
  console.error('price scrape failed:', err)
})
