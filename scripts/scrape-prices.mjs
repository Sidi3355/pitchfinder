// Best-effort price refresh for curated venues, polite by design: identifies
// itself, honours robots.txt, one request per two seconds, public pages only.
//
// A page's text is cached in data/cache/pages/<venue id>.json (status, date,
// extracted text) so re-runs within seven days cost nothing and anyone can
// review what the scraper saw. A price is written to data/prices.json only
// when the page states it per hour or per session next to the figure (see
// lib/prices.mjs). Otherwise the venue's entry is removed, never guessed.
// build-data.mjs falls back to the curated baseline in that case, and the
// audit reports it as unverified. Never a hard dependency: exits 0 always.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { extractPrices, pageText, summarisePrices } from './lib/prices.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const UA = 'PitchFinderBot/1.0 (+https://github.com/Sidi3355/pitchfinder; data refresh)'
const PAGE_CACHE = join(ROOT, 'data/cache/pages')
const MAX_AGE_DAYS = 7
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const robotsCache = new Map()

export async function allowedByRobots(url, fetchImpl = fetch) {
  const { origin, pathname } = new URL(url)
  if (!robotsCache.has(origin)) {
    try {
      const res = await fetchImpl(`${origin}/robots.txt`, { headers: { 'User-Agent': UA } })
      robotsCache.set(origin, res.ok ? await res.text() : '')
    } catch {
      robotsCache.set(origin, '')
    }
  }
  // Minimal parser: Disallow rules in the User-agent: * group (or one naming us).
  const lines = robotsCache
    .get(origin)
    .split('\n')
    .map((l) => l.trim())
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

function readPageCache(id) {
  const file = join(PAGE_CACHE, `${id}.json`)
  if (!existsSync(file)) return null
  try {
    return JSON.parse(readFileSync(file, 'utf8'))
  } catch {
    return null
  }
}

function ageDays(iso) {
  return (Date.now() - new Date(iso).getTime()) / 86400e3
}

async function fetchPage(venue) {
  const url = venue.priceSourceUrl || venue.bookingUrl
  const cached = readPageCache(venue.id)
  if (
    cached &&
    cached.url === url &&
    cached.fetchedAt &&
    ageDays(cached.fetchedAt) < MAX_AGE_DAYS
  ) {
    return { ...cached, fromCache: true }
  }
  if (!(await allowedByRobots(url))) {
    return { url, status: 'robots-disallow', fetchedAt: new Date().toISOString(), text: '' }
  }
  let entry
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': UA, Accept: 'text/html' },
      redirect: 'follow',
      signal: AbortSignal.timeout(20000),
    })
    const text = res.ok ? pageText(await res.text()).slice(0, 60000) : ''
    entry = {
      url,
      finalUrl: res.url,
      status: res.status,
      fetchedAt: new Date().toISOString(),
      text,
    }
  } catch (err) {
    entry = { url, status: `error: ${err.message}`, fetchedAt: new Date().toISOString(), text: '' }
  }
  mkdirSync(PAGE_CACHE, { recursive: true })
  writeFileSync(join(PAGE_CACHE, `${venue.id}.json`), JSON.stringify(entry, null, 1))
  await sleep(2000)
  return entry
}

async function main() {
  const { venues } = JSON.parse(readFileSync(join(ROOT, 'scripts/curated-venues.json'), 'utf8'))
  const outPath = join(ROOT, 'data/prices.json')
  const prices = existsSync(outPath) ? JSON.parse(readFileSync(outPath, 'utf8')) : {}
  let written = 0
  let removed = 0

  for (const venue of venues) {
    const url = venue.priceSourceUrl || venue.bookingUrl
    if (!url || venue.pricePerHour === 0) continue
    const page = await fetchPage(venue)
    if (page.status !== 200) {
      console.log(`${venue.id}: ${page.status}${page.fromCache ? ' (cached)' : ''}`)
      if (prices[venue.id] && ageDays(prices[venue.id].checkedAt) > 60) {
        delete prices[venue.id]
        removed++
      }
      continue
    }
    const found = extractPrices(page.text)
    const summary = summarisePrices(found, {
      sourceUrl: page.finalUrl || url,
      checkedAt: page.fetchedAt,
    })
    if (summary) {
      prices[venue.id] = summary
      written++
      console.log(
        `${venue.id}: £${summary.perHour ?? summary.perSession} per ${summary.unit}${summary.max ? ` to £${summary.max}` : ''}`,
      )
    } else {
      console.log(`${venue.id}: page loaded but states no per-hour or per-session price`)
      if (prices[venue.id]) {
        delete prices[venue.id]
        removed++
      }
    }
  }

  mkdirSync(dirname(outPath), { recursive: true })
  writeFileSync(outPath, JSON.stringify(prices, null, 2) + '\n')
  console.log(
    `Prices: ${written} written, ${removed} removed, ${Object.keys(prices).length} in data/prices.json`,
  )
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((err) => {
    // Non-fatal by contract: log and exit clean so the data build continues.
    console.error('price scrape failed:', err)
  })
}
