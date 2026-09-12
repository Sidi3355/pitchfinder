// Reads the operators' own club pages (Goals, Powerleague) with a real
// browser, since both sites render in the browser and answer plain fetches
// with nothing or a 403. Polite by design: identifies itself in the user
// agent, honours robots.txt, one page every two seconds, public pages only.
//
// Writes data/venues-live.json (one record per London club with the facts
// the page states and the words that back them) and caches each page's
// visible text in data/cache/pages/<id>.json so anyone can review what was
// read. --offline re-extracts from the cache without touching the network.
// Never a hard dependency: exits 0 and leaves the previous file when a site
// is unreachable.

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { allowedByRobots } from './lib/robots.mjs'
import { extractVenueFacts } from './lib/venue-facts.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const PAGE_CACHE = join(ROOT, 'data/cache/pages')
const OUT = join(ROOT, 'data/venues-live.json')
const POSTCODE_CACHE = join(ROOT, 'data/cache/venue-postcodes.json')
const OFFLINE = process.argv.includes('--offline')
const UA =
  'Mozilla/5.0 (X11; Linux x86_64) HeadlessChrome PitchFinderBot/1.0 (+https://github.com/Sidi3355/pitchfinder; data refresh)'
const PAUSE_MS = 2000
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

export const OPERATORS = [
  {
    key: 'goals',
    name: 'Goals',
    prefix: 'go',
    site: 'https://www.goalsfootball.co.uk/',
    listUrls: [
      'https://www.goalsfootball.co.uk/clubs',
      'https://www.goalsfootball.co.uk/our-clubs',
      'https://www.goalsfootball.co.uk/',
    ],
    // /clubs/<region>/<slug> and the older /our-clubs/<region>/<slug>; sub-pages (leagues, parties) are not clubs.
    linkRe:
      /^https?:\/\/(?:www\.)?goalsfootball\.co\.uk\/(?:our-)?clubs\/[a-z-]+\/([a-z0-9-]+)\/?$/i,
  },
  {
    key: 'powerleague',
    name: 'Powerleague',
    prefix: 'pl',
    site: 'https://www.powerleague.com/',
    listUrls: ['https://www.powerleague.com/our-locations', 'https://www.powerleague.com/'],
    linkRe: /^https?:\/\/(?:www\.)?powerleague\.com\/location\/([a-z0-9-]+)\/?$/i,
  },
]

function loadJson(path, fallback) {
  try {
    return existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : fallback
  } catch {
    return fallback
  }
}

/** postcodes.io bulk lookup with a cache: postcode -> { lat, lng, region, district } or null. */
async function lookupPostcodes(postcodes) {
  const cache = loadJson(POSTCODE_CACHE, {})
  const missing = [...new Set(postcodes.filter((p) => p && !(p in cache)))]
  if (missing.length && !OFFLINE) {
    for (let i = 0; i < missing.length; i += 90) {
      const batch = missing.slice(i, i + 90)
      try {
        const res = await fetch('https://api.postcodes.io/postcodes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'User-Agent': UA },
          body: JSON.stringify({ postcodes: batch }),
        })
        const json = await res.json()
        for (const r of json.result || []) {
          const q = r.query
          cache[q] = r.result
            ? {
                lat: r.result.latitude,
                lng: r.result.longitude,
                region: r.result.region,
                district: r.result.admin_district,
              }
            : null
        }
      } catch (err) {
        console.warn(`postcodes.io: ${err.message}`)
      }
    }
    mkdirSync(dirname(POSTCODE_CACHE), { recursive: true })
    writeFileSync(POSTCODE_CACHE, JSON.stringify(cache, null, 2) + '\n')
  }
  return cache
}

async function readPage(page, url) {
  const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 })
  await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {})
  await page.waitForTimeout(500)
  const data = await page.evaluate(() => {
    const jsonld = []
    for (const s of document.querySelectorAll('script[type="application/ld+json"]')) {
      try {
        jsonld.push(JSON.parse(s.textContent))
      } catch {}
    }
    const links = [...document.querySelectorAll('a[href]')].map((a) => ({
      href: a.href,
      text: (a.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80),
    }))
    return { title: document.title, text: document.body?.innerText || '', jsonld, links }
  })
  return { status: res?.status() ?? 0, finalUrl: page.url(), ...data }
}

function bookingLink(links) {
  const external = links.find((l) => /pitchbooking\.com|playfinder\.com|bookings?\./i.test(l.href))
  if (external) return external.href
  const book = links.find(
    (l) => /\bbook\b/i.test(l.text) && !/league|party|parties|function/i.test(l.text),
  )
  return book ? book.href : null
}

async function fetchOperator(browser, op) {
  const context = await browser.newContext({
    userAgent: UA,
    locale: 'en-GB',
    viewport: { width: 1280, height: 900 },
  })
  const page = await context.newPage()
  page.setDefaultTimeout(45000)
  const clubUrls = new Map()
  for (const listUrl of op.listUrls) {
    if (!(await allowedByRobots(listUrl, { userAgent: UA }))) {
      console.log(`${op.name}: robots.txt disallows ${listUrl}`)
      continue
    }
    try {
      const got = await readPage(page, listUrl)
      for (const l of got.links) {
        const m = l.href.match(op.linkRe)
        if (m) clubUrls.set(m[1].toLowerCase(), l.href.replace(/\/$/, ''))
      }
      console.log(`${op.name}: ${listUrl} -> ${got.status}, ${clubUrls.size} club links so far`)
    } catch (err) {
      console.warn(`${op.name}: ${listUrl} failed: ${err.message}`)
    }
    await sleep(PAUSE_MS)
  }
  const venues = []
  for (const [slug, url] of [...clubUrls.entries()].sort()) {
    const id = `${op.prefix}-${slug.replace(/[^a-z0-9]/g, '')}`
    if (!(await allowedByRobots(url, { userAgent: UA }))) {
      console.log(`${op.name}: robots.txt disallows ${url}`)
      continue
    }
    try {
      const got = await readPage(page, url)
      const fetchedAt = new Date().toISOString()
      mkdirSync(PAGE_CACHE, { recursive: true })
      writeFileSync(
        join(PAGE_CACHE, `${id}.json`),
        JSON.stringify(
          {
            url,
            finalUrl: got.finalUrl,
            status: got.status,
            fetchedAt,
            title: got.title,
            text: got.text.slice(0, 60000),
            jsonld: got.jsonld,
            bookingUrl: bookingLink(got.links),
          },
          null,
          1,
        ) + '\n',
      )
      venues.push({ id, slug, url, operator: op, got, fetchedAt })
      console.log(`${op.name}: ${slug} -> ${got.status}, ${got.text.length} chars`)
    } catch (err) {
      console.warn(`${op.name}: ${slug} failed: ${err.message}`)
    }
    await sleep(PAUSE_MS)
  }
  await context.close()
  return venues
}

function fromCache() {
  const out = []
  if (!existsSync(PAGE_CACHE)) return out
  for (const file of readdirSync(PAGE_CACHE)) {
    const op = OPERATORS.find((o) => file.startsWith(`${o.prefix}-`))
    if (!op || !file.endsWith('.json')) continue
    const cached = loadJson(join(PAGE_CACHE, file), null)
    if (!cached || !cached.text) continue
    const id = file.replace(/\.json$/, '')
    out.push({
      id,
      slug: id.slice(op.prefix.length + 1),
      url: cached.url,
      operator: op,
      got: { ...cached, links: [] },
      fetchedAt: cached.fetchedAt,
    })
  }
  return out
}

function titleName(op, got, slug) {
  const t = (got.title || '').split(/\s*[|:–-]\s*/)[0].trim()
  if (new RegExp(`^${op.name}\\b`, 'i').test(t) && t.length <= 40) return t
  const pretty = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  return `${op.name} ${pretty}`
}

async function main() {
  let raw = []
  if (OFFLINE) {
    raw = fromCache()
    console.log(`offline: ${raw.length} cached club pages`)
  } else {
    const { chromium } = await import('@playwright/test')
    const browser = await chromium.launch()
    try {
      for (const op of OPERATORS) raw.push(...(await fetchOperator(browser, op)))
    } finally {
      await browser.close()
    }
  }

  const facts = raw.map((r) => ({
    ...r,
    facts: extractVenueFacts({ text: r.got.text, jsonld: r.got.jsonld }),
  }))
  const geo = await lookupPostcodes(facts.map((f) => f.facts.postcode))
  const operators = OPERATORS.map((op) => ({
    key: op.key,
    name: op.name,
    site: op.site,
    venues: [],
  }))
  let london = 0
  for (const f of facts) {
    const pc = f.facts.postcode ? geo[f.facts.postcode] : null
    const lat = f.facts.lat ?? pc?.lat ?? null
    const lng = f.facts.lng ?? pc?.lng ?? null
    const region = pc?.region || null
    const inLondon = region === 'London'
    const record = {
      id: f.id,
      slug: f.slug,
      name:
        f.facts.name && /^(Goals|Powerleague)\b/i.test(f.facts.name)
          ? f.facts.name
          : titleName(f.operator, f.got, f.slug),
      operator: f.operator.name,
      url: f.url,
      bookingUrl: f.got.bookingUrl || bookingLink(f.got.links || []) || f.url,
      address: f.facts.address,
      postcode: f.facts.postcode,
      district: pc?.district || null,
      region,
      lat,
      lng,
      inLondon,
      openingHours: f.facts.openingHours,
      hoursSource: f.facts.hoursSource,
      hoursQuotes: f.facts.hoursQuotes,
      prices: f.facts.prices,
      priceFrom: f.facts.priceFrom,
      formats: f.facts.formats,
      pitchCount: f.facts.pitchCount,
      parking: f.facts.parking,
      changingRooms: f.facts.changingRooms,
      showers: f.facts.showers,
      bar: f.facts.bar,
      cafe: f.facts.cafe,
      covered: f.facts.covered,
      lit: f.facts.lit,
      phone: f.facts.phone,
      fetchedAt: f.fetchedAt,
    }
    operators.find((o) => o.key === f.operator.key).venues.push(record)
    if (inLondon) london++
  }
  const payload = { fetchedAt: new Date().toISOString(), offline: OFFLINE, operators }
  if (!raw.length) {
    console.log('No club pages read; keeping the previous data/venues-live.json')
    return
  }
  writeFileSync(OUT, JSON.stringify(payload, null, 1) + '\n')
  const withHours = facts.filter((f) => f.facts.openingHours).length
  const withPrice = facts.filter((f) => f.facts.priceFrom != null).length
  console.log(
    `Wrote ${facts.length} clubs (${london} in London): ${withHours} with hours, ${withPrice} with an hourly price`,
  )
}

main().catch((err) => {
  console.error('fetch-venues failed:', err)
  process.exit(0)
})
