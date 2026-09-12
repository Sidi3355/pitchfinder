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

import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { allowedByRobots } from './lib/robots.mjs'
import { extractVenueFacts } from './lib/venue-facts.mjs'
import { lookupPostcodes } from './lib/postcode-lookup.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const PAGE_CACHE = join(ROOT, 'data/cache/pages')
const OUT = join(ROOT, 'data/venues-live.json')
const POSTCODE_CACHE = join(ROOT, 'data/cache/venue-postcodes.json')
const OFFLINE = process.argv.includes('--offline')
const UA =
  'Mozilla/5.0 (X11; Linux x86_64) HeadlessChrome PitchFinderBot/1.0 (+https://github.com/Sidi3355/pitchfinder; data refresh)'
const PAUSE_MS = 2000
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// Pages under a club that are not the club itself.
const SUB_PAGE_RE =
  /^(leagues?|kids-parties|parties|birthday-parties|function-hire|functions|events|offers|contact|book|booking|pitch-hire|tournaments|holiday-camps|camps|academy|walking-football|padel|gallery|news|faqs?|jobs|careers)$/i

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
    // /clubs/<region>/<slug>, /our-clubs/<region>/<slug> or /clubs/<slug>; sub-pages are not clubs.
    linkRe:
      /^https?:\/\/(?:www\.)?goalsfootball\.co\.uk\/(?:our-)?clubs\/(?:[a-z0-9-]+\/)?([a-z0-9-]+)\/?(?:[?#].*)?$/i,
    // Tried directly when the list pages give nothing: the London clubs known so far.
    seeds: [
      'beckenham',
      'bexleyheath',
      'chingford',
      'dagenham',
      'gillette-corner',
      'hayes',
      'ruislip',
      'sutton',
      'wembley',
      'heathrow',
      'wimbledon',
      'eltham',
      'tolworth',
      'croydon',
      'leyton',
      'kingston',
      'surrey-quays',
      'norwood',
      'brentford',
      'ealing',
      'hounslow',
      'harrow',
    ],
    seedUrl: (slug) => [
      `https://www.goalsfootball.co.uk/clubs/south-east/${slug}`,
      `https://www.goalsfootball.co.uk/our-clubs/south-east/${slug}`,
      `https://www.goalsfootball.co.uk/clubs/london/${slug}`,
    ],
  },
  {
    key: 'powerleague',
    name: 'Powerleague',
    prefix: 'pl',
    site: 'https://www.powerleague.com/',
    listUrls: ['https://www.powerleague.com/our-locations', 'https://www.powerleague.com/'],
    linkRe: /^https?:\/\/(?:www\.)?powerleague\.com\/location\/([a-z0-9-]+)\/?(?:[?#].*)?$/i,
    seeds: [
      'shoreditch',
      'vauxhall',
      'wembley',
      'mill-hill',
      'barnet',
      'croydon',
      'canary-wharf',
      'battersea',
      'enfield',
      'finchley',
      'tottenham',
    ],
    seedUrl: (slug) => [`https://www.powerleague.com/location/${slug}`],
  },
]

function loadJson(path, fallback) {
  try {
    return existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : fallback
  } catch {
    return fallback
  }
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
  let blocked = false
  for (const listUrl of op.listUrls) {
    if (!(await allowedByRobots(listUrl, { userAgent: UA }))) {
      console.log(`${op.name}: robots.txt disallows ${listUrl}`)
      continue
    }
    try {
      const got = await readPage(page, listUrl)
      if (got.status === 403) blocked = true
      for (const l of got.links) {
        const m = l.href.match(op.linkRe)
        if (m && !SUB_PAGE_RE.test(m[1]))
          clubUrls.set(m[1].toLowerCase(), l.href.replace(/[?#].*$/, '').replace(/\/$/, ''))
      }
      console.log(`${op.name}: ${listUrl} -> ${got.status}, ${clubUrls.size} club links so far`)
      if (!clubUrls.size) {
        // Leave the hrefs behind so the pattern can be fixed against what the page really links to.
        mkdirSync(PAGE_CACHE, { recursive: true })
        writeFileSync(
          join(PAGE_CACHE, `_list-${op.key}.json`),
          JSON.stringify(
            {
              url: listUrl,
              status: got.status,
              fetchedAt: new Date().toISOString(),
              hrefs: got.links.slice(0, 400),
            },
            null,
            1,
          ) + '\n',
        )
      }
    } catch (err) {
      console.warn(`${op.name}: ${listUrl} failed: ${err.message}`)
    }
    await sleep(PAUSE_MS)
  }
  // No list to go on: try the clubs known so far at the site's own URL pattern.
  if (!clubUrls.size && !blocked && op.seeds) {
    for (const slug of op.seeds) {
      for (const url of op.seedUrl(slug)) {
        const res = await page.request.head(url, { timeout: 20000 }).catch(() => null)
        if (res?.status() === 200) {
          clubUrls.set(slug, url)
          break
        }
        await sleep(500)
      }
    }
    console.log(`${op.name}: ${clubUrls.size} clubs found from known slugs`)
  }
  if (blocked) console.log(`${op.name}: the site answers this browser with 403; nothing read`)
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
      // A slug the site answers with its shell (nav and offers, no club) is not a club.
      const facts = extractVenueFacts({ text: got.text, jsonld: got.jsonld })
      if (!facts.postcode && got.text.length < 2500) {
        console.log(`${op.name}: ${slug} -> ${got.status}, no club on the page; skipped`)
        const stale = join(PAGE_CACHE, `${id}.json`)
        if (existsSync(stale)) rmSync(stale)
        await sleep(PAUSE_MS)
        continue
      }
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
  const geo = await lookupPostcodes(
    facts.map((f) => f.facts.postcode),
    { cacheFile: POSTCODE_CACHE, offline: OFFLINE, userAgent: UA },
  )
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
      geoSource: f.facts.lat != null ? 'page' : pc ? 'postcode' : null,
      inLondon,
      openingHours: f.facts.openingHours,
      hoursSource: f.facts.hoursSource,
      hoursQuotes: f.facts.hoursQuotes,
      prices: f.facts.prices,
      priceFrom: f.facts.priceFrom,
      surface: f.facts.surface,
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
