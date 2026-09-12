// Reads the slot calendars that show what a pitch really costs, with a real
// browser, and writes data/slots-live.json.
//
// - Goals: Pitchbooking, Goals' own booking site, one page per club, day and
//   pitch size for the next seven days.
// - Powerleague and the council, club and leisure-centre astros: Playfinder's
//   public venue pages (address, hours, facilities, pitches) and the week of
//   slots on each artificial football pitch. Powerleague's own site answers
//   this browser with 403 and is left alone.
//
// Polite by design: identified user agent, robots.txt honoured, two seconds
// between pages, a page budget and a deadline so a run always ends and
// commits what it has. Every page read is cached under data/cache/ so anyone
// can review what was read, and --offline rebuilds the output from the cache
// without touching the network. Never a hard dependency: exits 0 always.

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { allowedByRobots } from './lib/robots.mjs'
import { lookupPostcodes } from './lib/postcode-lookup.mjs'
import { extractFacilities, extractPostcode } from './lib/venue-facts.mjs'
import { parseHoursText } from '../src/lib/hours.js'
import { nameSimilarity } from './lib/pipeline.mjs'
import {
  addDays,
  bandsFromSlots,
  formatFromLabel,
  parsePitchbookingSlots,
  parsePlayfinderSlots,
  slotsFromColumns,
  surfaceFromLabel,
  weekStartFromHeading,
} from './lib/slots.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'data/slots-live.json')
const PF_CACHE = join(ROOT, 'data/cache/playfinder')
const PB_CACHE = join(ROOT, 'data/cache/pitchbooking')
const POSTCODE_CACHE = join(ROOT, 'data/cache/venue-postcodes.json')
const OFFLINE = process.argv.includes('--offline')
const UA =
  'Mozilla/5.0 (X11; Linux x86_64) HeadlessChrome PitchFinderBot/1.0 (+https://github.com/Sidi3355/pitchfinder; data refresh)'
const PAUSE_MS = 2000
const MAX_PAGES = Number(process.env.SLOTS_MAX_PAGES || 650)
const DEADLINE_MS = Number(process.env.SLOTS_DEADLINE_MINUTES || 70) * 60000
const MAX_PITCHES_PER_VENUE = 4
const PLAYFINDER = 'https://www.playfinder.com'
const PITCHBOOKING = 'https://pitchbooking.com'
const GOALS_BOOKING = 'https://www.goalsfootball.co.uk/play/book-a-pitch'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const started = Date.now()
let pagesRead = 0
let stoppedBy = null

function loadJson(path, fallback) {
  try {
    return existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : fallback
  } catch {
    return fallback
  }
}
function saveJson(path, value) {
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, JSON.stringify(value, null, 1) + '\n')
}
function outOfBudget() {
  if (pagesRead >= MAX_PAGES) stoppedBy = stoppedBy || 'budget'
  else if (Date.now() - started > DEADLINE_MS) stoppedBy = stoppedBy || 'deadline'
  return !!stoppedBy
}

// ── Browser ───────────────────────────────────────────────────────────────

async function readPage(page, url) {
  pagesRead++
  const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 })
  await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {})
  await page.waitForTimeout(800)
  const data = await page.evaluate(() => {
    const links = [...document.querySelectorAll('a[href]')].map((a) => ({
      href: a.href,
      text: (a.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80),
    }))
    const dayRe = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)\s*\n?\s*(\d{1,2})(?:st|nd|rd|th)?$/
    const found = []
    for (const el of document.querySelectorAll('body *')) {
      if (el.children.length > 3) continue
      const t = (el.innerText || '').trim()
      if (t.length > 12 || !dayRe.test(t)) continue
      found.push(el)
    }
    const headers = found
      .filter((el) => !found.some((other) => other !== el && el.contains(other)))
      .map((el) => {
        const r = el.getBoundingClientRect()
        const m = el.innerText.trim().match(dayRe)
        return { day: m[1].toLowerCase(), num: Number(m[2]), cx: (r.left + r.right) / 2 }
      })
    const rawSlots = [...document.querySelectorAll('.mlp-slot')].map((el) => {
      const r = el.getBoundingClientRect()
      return {
        text: (el.innerText || '').replace(/\s+/g, ' ').trim(),
        cx: (r.left + r.right) / 2,
        hidden: r.width === 0,
      }
    })
    const selects = [...document.querySelectorAll('select')].map((s) => ({
      name: s.name || s.id || '',
      options: [...s.options].map((o) => ({ value: o.value, label: o.textContent.trim() })),
    }))
    return {
      title: document.title,
      h1: (document.querySelector('h1')?.innerText || '').trim(),
      selected: (document.querySelector('button.btn-mlp-darker')?.innerText || '').trim(),
      text: document.body?.innerText || '',
      links,
      headers,
      rawSlots,
      selects,
    }
  })
  return { status: res?.status() ?? 0, finalUrl: page.url(), ...data }
}

async function fetchText(page, url) {
  try {
    const res = await page.request.get(url, { timeout: 30000, headers: { 'User-Agent': UA } })
    return res.ok() ? await res.text() : ''
  } catch {
    return ''
  }
}

/** Every <loc> in a sitemap, following nested sitemaps a little way. */
async function sitemapUrls(page, url, { maxFiles = 40 } = {}) {
  const out = []
  const queue = [url]
  let files = 0
  while (queue.length && files < maxFiles) {
    const next = queue.shift()
    files++
    const xml = await fetchText(page, next)
    for (const m of xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)) {
      const loc = m[1]
      if (/\.xml(\?.*)?$/i.test(loc)) queue.push(loc)
      else out.push(loc)
    }
    await sleep(500)
  }
  return out
}

// ── Playfinder ────────────────────────────────────────────────────────────

function playfinderSlug(href) {
  const m = String(href).match(
    /^https?:\/\/(?:www\.)?playfinder\.com\/london\/venue\/([a-z0-9-]+)\/?(?:[?#].*)?$/i,
  )
  return m ? m[1].toLowerCase() : null
}
function playfinderPitch(href) {
  const m = String(href).match(
    /^https?:\/\/(?:www\.)?playfinder\.com\/london\/venue\/([a-z0-9-]+)\/(football-[a-z0-9-]+-\d+)\/?(?:[?#].*)?$/i,
  )
  return m ? { slug: m[1].toLowerCase(), pitch: m[2].toLowerCase() } : null
}

function slotsFromPage(got, today) {
  const weekStart = weekStartFromHeading(got.text, today)
  const byColumn = slotsFromColumns(
    got.rawSlots.filter((s) => !s.hidden),
    got.headers,
    weekStart,
  )
  if (byColumn) return { weekStart, slots: byColumn, dayAssignment: 'columns' }
  const parsed = parsePlayfinderSlots(got.text, { today })
  return { weekStart: parsed.weekStart, slots: parsed.slots, dayAssignment: 'sequence' }
}

function venueFacts(got, slug) {
  const text = got.text.split('Nearby Football Pitches')[0]
  const addressLine =
    text.match(/Click to interact with the map\s*\n\s*([^\n]+)/)?.[1]?.trim() || null
  const postcode =
    extractPostcode(addressLine || '') || extractPostcode(text.split('Description')[0])
  const hours = parseHoursText(text)
  const facilities = extractFacilities(text)
  // The same pitch is linked more than once; the label that names the size
  // and surface ('5 a side | 3G Astroturf') wins over a bare 'football'.
  const byPitch = new Map()
  for (const l of got.links) {
    const p = playfinderPitch(l.href)
    if (!p || p.slug !== slug) continue
    const informative = /\|/.test(l.text) || formatFromLabel(l.text) != null
    const prev = byPitch.get(p.pitch)
    if (prev && !(informative && !prev.informative)) continue
    byPitch.set(p.pitch, { text: l.text, informative })
  }
  const pitches = [...byPitch.entries()].map(([pitch, { text: label }]) => ({
    url: `${PLAYFINDER}/london/venue/${slug}/${pitch}`,
    label,
    format: formatFromLabel(label) ?? formatFromLabel(pitch),
    surface: surfaceFromLabel(label),
  }))
  const area = got.title.match(/^[^,|]+,\s*([^|]+?)\s*\|/)?.[1]?.trim() || null
  return {
    name: got.h1 || got.title.split(/\s*[,|]\s*/)[0].trim(),
    area,
    address: addressLine,
    postcode,
    hours: hours?.week || null,
    hoursQuotes: hours?.quotes || [],
    facilities,
    pitches,
    priceSummary: text.match(/^\s*Prices\s*\n\s*([^\n]+)/m)?.[1]?.trim() || null,
  }
}

function artificialFootball(pitches) {
  const picked = []
  const seen = new Set()
  for (const p of pitches) {
    if (!p.format || !(p.surface === '3g' || p.surface === 'astro')) continue
    const key = `${p.format}|${p.surface}`
    if (seen.has(key)) continue
    seen.add(key)
    picked.push(p)
    if (picked.length >= MAX_PITCHES_PER_VENUE) break
  }
  return picked
}

async function discoverPlayfinder(page) {
  const venues = new Map() // slug -> Set of football pitch sub-slugs seen in the sitemap
  const locs = await sitemapUrls(page, `${PLAYFINDER}/sitemap.xml`)
  for (const loc of locs) {
    const pitch = playfinderPitch(loc)
    if (pitch) {
      if (!venues.has(pitch.slug)) venues.set(pitch.slug, new Set())
      venues.get(pitch.slug).add(pitch.pitch)
      continue
    }
    const slug = playfinderSlug(loc)
    if (slug && !venues.has(slug)) venues.set(slug, new Set())
  }
  const pitchUrlsKnown = [...venues.values()].some((s) => s.size)
  console.log(
    `Playfinder sitemap: ${locs.length} urls, ${venues.size} London venues` +
      (pitchUrlsKnown ? ' (with pitch pages)' : ''),
  )
  if (!venues.size) {
    // No sitemap: seed from the London football listing; venue pages add their neighbours.
    try {
      const got = await readPage(page, `${PLAYFINDER}/london/football`)
      for (const l of got.links) {
        const p = playfinderPitch(l.href) || { slug: playfinderSlug(l.href) }
        if (p.slug && !venues.has(p.slug)) venues.set(p.slug, new Set())
      }
      await sleep(PAUSE_MS)
    } catch (err) {
      console.warn(`Playfinder listing failed: ${err.message}`)
    }
  }
  return { venues, pitchUrlsKnown }
}

function priorityOf(slug, pitchSlugs, pitchUrlsKnown, knownNames, cached) {
  if (pitchUrlsKnown && ![...pitchSlugs].some((p) => p.startsWith('football-'))) return null
  if (/^goals-/.test(slug)) return null // Goals comes from Goals' own booking site
  let score = 1
  if (/^powerleague/.test(slug)) score = 4
  else {
    let best = 0
    for (const name of knownNames) best = Math.max(best, nameSimilarity(slug, name))
    if (best >= 0.5) score = 2 + best
  }
  const age = cached?.fetchedAt ? Date.now() - new Date(cached.fetchedAt).getTime() : Infinity
  return { score, age }
}

async function readPlayfinder(page, knownNames, today) {
  const { venues, pitchUrlsKnown } = await discoverPlayfinder(page)
  const queue = []
  for (const [slug, pitchSlugs] of venues) {
    const cached = loadJson(join(PF_CACHE, `${slug}.json`), null)
    const pr = priorityOf(slug, pitchSlugs, pitchUrlsKnown, knownNames, cached)
    if (pr) queue.push({ slug, ...pr })
  }
  // Powerleague first, then venues that look like ones on the map, then the
  // rest; within a tier the never-read and the oldest first.
  queue.sort((a, b) => b.score - a.score || b.age - a.age)
  console.log(`Playfinder: ${queue.length} venues queued`)
  const seenSlugs = new Set(venues.keys())
  let read = 0
  for (let i = 0; i < queue.length; i++) {
    if (outOfBudget()) break
    const { slug } = queue[i]
    const url = `${PLAYFINDER}/london/venue/${slug}`
    if (!(await allowedByRobots(url, { userAgent: UA }))) continue
    try {
      const got = await readPage(page, url)
      const facts = venueFacts(got, slug)
      const record = {
        url,
        finalUrl: got.finalUrl,
        status: got.status,
        fetchedAt: new Date().toISOString(),
        title: got.title,
        text: got.text.split('PLAYFINDER FOR SPORTS VENUE OPERATORS')[0].slice(0, 12000),
        ...facts,
        pitches: facts.pitches.map((p) => ({ ...p })),
      }
      // Neighbours the page links to, when the sitemap gave nothing.
      if (!pitchUrlsKnown) {
        for (const l of got.links) {
          const p = playfinderPitch(l.href) || { slug: playfinderSlug(l.href) }
          if (p.slug && !seenSlugs.has(p.slug)) {
            seenSlugs.add(p.slug)
            const pr = priorityOf(p.slug, new Set(), false, knownNames, null)
            if (pr) queue.push({ slug: p.slug, ...pr })
          }
        }
      }
      const wanted = artificialFootball(facts.pitches)
      if (got.status !== 200 || !facts.name) record.skipped = `page answered ${got.status}`
      else if (!wanted.length) record.skipped = 'no artificial football pitch'
      await sleep(PAUSE_MS)
      for (const pitch of wanted) {
        if (outOfBudget()) break
        const target = record.pitches.find((p) => p.url === pitch.url)
        // The venue page already shows the selected pitch's week.
        let calendar = null
        if (got.selected && got.selected === pitch.label && got.rawSlots.length)
          calendar = slotsFromPage(got, today)
        else {
          try {
            const sub = await readPage(page, pitch.url)
            calendar = slotsFromPage(sub, today)
          } catch (err) {
            console.warn(`Playfinder: ${pitch.url} failed: ${err.message}`)
          }
          await sleep(PAUSE_MS)
        }
        if (calendar) Object.assign(target, calendar)
      }
      saveJson(join(PF_CACHE, `${slug}.json`), record)
      read++
      const slotCount = record.pitches.reduce((n, p) => n + (p.slots?.length || 0), 0)
      console.log(
        `Playfinder: ${slug} -> ${got.status}, ${facts.pitches.length} pitches, ${slotCount} slots${record.skipped ? ` (${record.skipped})` : ''}`,
      )
    } catch (err) {
      console.warn(`Playfinder: ${slug} failed: ${err.message}`)
      await sleep(PAUSE_MS)
    }
  }
  console.log(`Playfinder: ${read} venues read this run`)
}

// ── Pitchbooking (Goals) ──────────────────────────────────────────────────

function goalsSlug(name) {
  return String(name || '')
    .replace(/^goals\s+/i, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

async function discoverPitchbooking(page, londonClubs) {
  const urls = new Set()
  for (const loc of await sitemapUrls(page, `${PITCHBOOKING}/sitemap.xml`)) {
    const m = loc.match(
      /^https?:\/\/(?:www\.)?pitchbooking\.com\/book\/goals\/([0-9a-f-]{20,})\/?$/i,
    )
    if (m) urls.add(`${PITCHBOOKING}/book/goals/${m[1].toLowerCase()}`)
  }
  console.log(`Pitchbooking sitemap: ${urls.size} Goals booking pages`)
  if (urls.size) return [...urls]
  // Fallback: the club picker on Goals' own booking page leads to Pitchbooking.
  try {
    if (!(await allowedByRobots(GOALS_BOOKING, { userAgent: UA }))) return []
    const got = await readPage(page, GOALS_BOOKING)
    const picker = got.selects.find((s) => s.options.some((o) => /goals|london/i.test(o.label)))
    if (!picker) return []
    for (const o of picker.options) {
      const slug = goalsSlug(o.label)
      if (!londonClubs.some((c) => c.slug === slug)) continue
      try {
        await page.selectOption('select', { label: o.label })
        const [popup] = await Promise.all([
          page.waitForEvent('popup', { timeout: 8000 }).catch(() => null),
          page
            .getByRole('button', { name: /book now/i })
            .first()
            .click({ timeout: 5000 }),
        ])
        const target = popup || page
        await target.waitForURL(/pitchbooking\.com/, { timeout: 15000 }).catch(() => {})
        const m = target
          .url()
          .match(/^https?:\/\/(?:www\.)?pitchbooking\.com\/book\/goals\/([0-9a-f-]{20,})/i)
        if (m) urls.add(`${PITCHBOOKING}/book/goals/${m[1].toLowerCase()}`)
        if (popup) await popup.close()
        else await page.goBack().catch(() => {})
        pagesRead++
      } catch (err) {
        console.warn(`Goals picker: ${o.label}: ${err.message}`)
      }
      await sleep(PAUSE_MS)
    }
  } catch (err) {
    console.warn(`Goals booking page: ${err.message}`)
  }
  return [...urls]
}

async function readPitchbooking(page, londonClubs, today) {
  const urls = await discoverPitchbooking(page, londonClubs)
  const dates = Array.from({ length: 7 }, (_, i) => addDays(today, i + 1))
  let read = 0
  for (const url of urls) {
    if (outOfBudget()) break
    if (!(await allowedByRobots(url, { userAgent: UA }))) continue
    try {
      const got = await readPage(page, url)
      const name = (got.h1 || got.title.split('|')[0]).trim()
      const slug = goalsSlug(name)
      const club = londonClubs.find((c) => c.slug === slug || goalsSlug(c.name) === slug)
      if (!club) {
        console.log(`Pitchbooking: ${name} is not a London club on the map; skipped`)
        await sleep(PAUSE_MS)
        continue
      }
      const picker = got.selects.find((s) => s.options.some((o) => formatFromLabel(o.label)))
      const pitchTypes = (picker?.options || [])
        .map((o) => ({ value: o.value, label: o.label, format: formatFromLabel(o.label) }))
        .filter((o) => o.format && o.value)
      const cachePath = join(PB_CACHE, `${club.id}.json`)
      const record = {
        id: club.id,
        slug: club.slug,
        name,
        url,
        fetchedAt: new Date().toISOString(),
        text: got.text.slice(0, 6000),
        postcode: extractPostcode(got.text.split('\n').slice(0, 40).join('\n')),
        pitchTypes,
        days: {},
      }
      await sleep(PAUSE_MS)
      for (const date of dates) {
        for (const type of pitchTypes) {
          if (outOfBudget()) break
          try {
            const day = await readPage(page, `${url}?date=${date}&pitchType=${type.value}`)
            const parsed = parsePitchbookingSlots(day.text)
            if (parsed.date && parsed.date !== date)
              console.warn(`Pitchbooking: asked for ${date}, page shows ${parsed.date}`)
            record.days[date] = record.days[date] || {}
            record.days[date][type.format] = parsed.slots.map((s) => ({
              date: parsed.date || date,
              day: s.day,
              time: s.time,
              minutes: s.minutes,
              amount: s.amount,
              perPlayer: s.perPlayer,
              pitches: s.pitches.length,
            }))
          } catch (err) {
            console.warn(`Pitchbooking: ${club.id} ${date} ${type.label}: ${err.message}`)
          }
          await sleep(PAUSE_MS)
        }
      }
      saveJson(cachePath, record)
      read++
      const n = Object.values(record.days).reduce(
        (a, byFormat) => a + Object.values(byFormat).reduce((b, s) => b + s.length, 0),
        0,
      )
      console.log(
        `Pitchbooking: ${club.id} -> ${pitchTypes.length} pitch types, ${n} slots over ${Object.keys(record.days).length} days`,
      )
    } catch (err) {
      console.warn(`Pitchbooking: ${url} failed: ${err.message}`)
      await sleep(PAUSE_MS)
    }
  }
  console.log(`Pitchbooking: ${read} clubs read this run`)
}

// ── Output from the caches ────────────────────────────────────────────────

function listCache(dir) {
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => loadJson(join(dir, f), null))
    .filter(Boolean)
}

async function buildOutput() {
  const pf = listCache(PF_CACHE)
  const pb = listCache(PB_CACHE)
  const geo = await lookupPostcodes([...pf.map((v) => v.postcode), ...pb.map((c) => c.postcode)], {
    cacheFile: POSTCODE_CACHE,
    offline: OFFLINE,
    userAgent: UA,
  })
  const place = (postcode) => {
    const g = postcode ? geo[postcode] : null
    return {
      lat: g?.lat ?? null,
      lng: g?.lng ?? null,
      region: g?.region || null,
      district: g?.district || null,
      inLondon: g?.region === 'London',
    }
  }
  const venues = pf
    .map((v) => {
      const slug = v.url.split('/').pop()
      const bands = []
      const pitches = (v.pitches || []).map((p) => {
        const slots = p.slots || []
        const pitchBands = bandsFromSlots(slots, { format: p.format, surface: p.surface })
        bands.push(...pitchBands)
        return {
          url: p.url,
          label: p.label,
          format: p.format,
          surface: p.surface,
          weekStart: p.weekStart || null,
          dayAssignment: p.dayAssignment || null,
          slotsSeen: slots.length,
          pricedSlots: slots.filter((s) => s.amount != null).length,
        }
      })
      return {
        slug,
        url: v.url,
        name: v.name,
        area: v.area,
        address: v.address,
        postcode: v.postcode,
        ...place(v.postcode),
        hours: v.hours || null,
        hoursQuotes: v.hoursQuotes || [],
        facilities: v.facilities || {},
        pitches,
        bands,
        priceSummary: v.priceSummary || null,
        skipped: v.skipped || null,
        fetchedAt: v.fetchedAt,
      }
    })
    .sort((a, b) => a.slug.localeCompare(b.slug))
  const clubs = pb
    .map((c) => {
      const slots = []
      for (const [, byFormat] of Object.entries(c.days || {}))
        for (const [format, list] of Object.entries(byFormat))
          for (const s of list) slots.push({ ...s, format: Number(format) })
      const bands = []
      for (const format of new Set(slots.map((s) => s.format)))
        bands.push(
          ...bandsFromSlots(
            slots.filter((s) => s.format === format),
            { format, surface: '3g' },
          ),
        )
      return {
        id: c.id,
        slug: c.slug,
        name: c.name,
        url: c.url,
        postcode: c.postcode,
        ...place(c.postcode),
        pitchTypes: c.pitchTypes,
        dates: Object.keys(c.days || {}).sort(),
        slotsSeen: slots.length,
        bands,
        fetchedAt: c.fetchedAt,
      }
    })
    .sort((a, b) => a.id.localeCompare(b.id))
  return {
    fetchedAt: new Date().toISOString(),
    offline: OFFLINE,
    pitchbooking: { site: PITCHBOOKING, clubs },
    playfinder: { site: PLAYFINDER, venues },
    run: { pagesRead, stoppedBy },
  }
}

async function main() {
  const today = new Date().toISOString().slice(0, 10)
  const live = loadJson(join(ROOT, 'data/venues-live.json'), { operators: [] })
  const londonClubs = (live.operators || [])
    .filter((op) => op.key === 'goals')
    .flatMap((op) => op.venues || [])
    .filter((c) => c.inLondon)
  const dataset = loadJson(join(ROOT, 'public/data/pitches.json'), { pitches: [] })
  const curated = loadJson(join(ROOT, 'scripts/curated-venues.json'), { venues: [] })
  const knownNames = [...(dataset.pitches || []), ...(curated.venues || [])]
    .filter((p) => p.type === 'astro' || /powerleague/i.test(p.name || ''))
    .map((p) => p.name)
    .filter(Boolean)

  if (!OFFLINE) {
    const { chromium } = await import('@playwright/test')
    const browser = await chromium.launch()
    try {
      const context = await browser.newContext({
        userAgent: UA,
        locale: 'en-GB',
        viewport: { width: 1280, height: 900 },
      })
      const page = await context.newPage()
      page.setDefaultTimeout(45000)
      await readPitchbooking(page, londonClubs, today)
      await readPlayfinder(page, knownNames, today)
      await context.close()
    } finally {
      await browser.close()
    }
  }
  const out = await buildOutput()
  saveJson(OUT, out)
  const withBands = out.playfinder.venues.filter((v) => v.bands.length).length
  console.log(
    `Wrote ${out.pitchbooking.clubs.length} Goals clubs and ${out.playfinder.venues.length} Playfinder venues (${withBands} with prices); ${pagesRead} pages read${stoppedBy ? `, stopped by ${stoppedBy}` : ''}`,
  )
}

export {
  venueFacts,
  artificialFootball,
  priorityOf,
  goalsSlug,
  slotsFromPage,
  playfinderSlug,
  playfinderPitch,
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((err) => {
    console.error('fetch-slots failed:', err)
    process.exit(0)
  })
}
