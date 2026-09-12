// Reads a handful of candidate source pages with the browser and leaves what
// they serve (robots.txt, status, visible text, links, JSON-LD, a DOM
// outline) in data/cache/probe/, so a reader can be written against the real
// page rather than a guess. Polite: identified user agent, robots honoured,
// two seconds between pages. Never a hard dependency: exits 0 always.

import { mkdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { allowedByRobots } from './lib/robots.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'data/cache/probe')
const UA =
  'Mozilla/5.0 (X11; Linux x86_64) HeadlessChrome PitchFinderBot/1.0 (+https://github.com/Sidi3355/pitchfinder; data refresh)'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const TARGETS = [
  // The Bookteq widget Playfinder embeds for council and community pitches:
  // does its weekly view, or a clicked slot, show a price?
  [
    'bookteq-angell-town-widget',
    'https://widget.bookteq.com/topcic/book-online/2c8caddc-9142-4cfc-acce-083961a752fd?source=playfinder',
    { interact: 'bookteq' },
  ],
  // Playfinder venues whose page says "see calendar above" but whose calendar
  // did not appear in the page text: is it an iframe, or does it load late?
  ['playfinder-angell-town', 'https://www.playfinder.com/london/venue/angell-townmuga'],
  [
    'playfinder-angell-town-pitch',
    'https://www.playfinder.com/london/venue/angell-townmuga/football-6-a-side-pitch-93105',
  ],
  ['playfinder-burgess-park', 'https://www.playfinder.com/london/venue/burgess-park'],
  [
    'playfinder-calthorpe',
    'https://www.playfinder.com/london/venue/calthorpe-project-sports-facilities',
  ],
  ['goals-book-a-pitch', 'https://www.goalsfootball.co.uk/play/book-a-pitch'],
  ['goals-book-a-game', 'https://www.goalsfootball.co.uk/play/book-a-game'],
  [
    'pitchbooking-goals-beckenham',
    'https://pitchbooking.com/book/goals/bbcbb80a-864f-49c5-b934-c60ea76deeaa',
  ],
  ['pitchbooking-goals', 'https://pitchbooking.com/book/goals'],
  [
    'playfinder-powerleague-shoreditch',
    'https://www.playfinder.com/london/venue/powerleague-shoreditch',
  ],
  [
    'playfinder-powerleague-shoreditch-7s',
    'https://www.playfinder.com/london/venue/powerleague-shoreditch/football-7-a-side-36030',
  ],
  ['playfinder-goals-beckenham', 'https://www.playfinder.com/london/venue/goals-beckenham'],
  ['playfinder-london-football', 'https://www.playfinder.com/london/football'],
  ['playfinder-london-5-a-side', 'https://www.playfinder.com/london/football/5-a-side'],
  ['powerleague-shoreditch', 'https://www.powerleague.com/location/shoreditch'],
  ['powerleague-locations', 'https://www.powerleague.com/our-locations'],
]

async function robotsText(origin) {
  try {
    const res = await fetch(`${origin}/robots.txt`, { headers: { 'User-Agent': UA } })
    return { status: res.status, text: res.ok ? (await res.text()).slice(0, 6000) : '' }
  } catch (err) {
    return { status: 0, text: '', error: err.message }
  }
}

async function main() {
  const { chromium } = await import('@playwright/test')
  const browser = await chromium.launch()
  const context = await browser.newContext({
    userAgent: UA,
    locale: 'en-GB',
    viewport: { width: 1280, height: 900 },
  })
  const page = await context.newPage()
  page.setDefaultTimeout(45000)
  mkdirSync(OUT, { recursive: true })
  const robots = {}
  for (const [key, url, options = {}] of TARGETS) {
    const { origin } = new URL(url)
    if (!robots[origin]) robots[origin] = await robotsText(origin)
    const allowed = await allowedByRobots(url, { userAgent: UA })
    const record = { key, url, fetchedAt: new Date().toISOString(), robotsAllows: allowed }
    if (!allowed) {
      console.log(`${key}: robots.txt disallows; not read`)
      writeFileSync(join(OUT, `${key}.json`), JSON.stringify(record, null, 1) + '\n')
      continue
    }
    try {
      const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 })
      await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {})
      await page.waitForTimeout(1500)
      // Anything drawn inside a frame, and the calendar area after a longer wait.
      const frames = []
      for (const f of page.frames()) {
        if (f === page.mainFrame()) continue
        const text = await f.evaluate(() => document.body?.innerText || '').catch(() => '')
        frames.push({ url: f.url(), text: text.slice(0, 20000) })
      }
      await page.waitForTimeout(6000)
      const later = await page.evaluate(() => {
        const slots = document.querySelectorAll('.mlp-slot').length
        const html = document.querySelector('main, body')?.innerHTML || ''
        const at = html.indexOf('Book Online')
        return { slots, htmlAround: html.slice(Math.max(0, at - 200), at + 6000) }
      })
      const data = await page.evaluate(() => {
        const jsonld = []
        for (const s of document.querySelectorAll('script[type="application/ld+json"]')) {
          try {
            jsonld.push(JSON.parse(s.textContent))
          } catch {}
        }
        const links = [...document.querySelectorAll('a[href]')]
          .map((a) => ({
            href: a.href,
            text: (a.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80),
          }))
          .slice(0, 600)
        // A shallow outline: tags with class names and short text, for the first 400 elements that carry text.
        const outline = []
        for (const el of document.body.querySelectorAll(
          'h1,h2,h3,h4,table,li,button,select,option,dt,dd,time,[class*=price],[class*=Price],[class*=slot],[class*=Slot],[class*=hour],[class*=Hour],[class*=open],[class*=Open]',
        )) {
          const text = (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim()
          if (!text) continue
          outline.push(
            `${el.tagName.toLowerCase()}${el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 3).join('.') : ''}: ${text.slice(0, 160)}`,
          )
          if (outline.length >= 400) break
        }
        return {
          title: document.title,
          text: (document.body?.innerText || '').slice(0, 40000),
          jsonld,
          links,
          outline,
        }
      })
      Object.assign(record, { status: res?.status() ?? 0, finalUrl: page.url() }, data, {
        frames,
        later,
      })
      if (options.interact === 'bookteq') {
        // Weekly view, then the first bookable cell: what does each step show?
        const steps = []
        const snap = async (label) => {
          const text = await page.evaluate(() => document.body?.innerText || '')
          const outline = await page.evaluate(() =>
            [...document.body.querySelectorAll('button,a,[role=button],td,th,li,h1,h2,h3,h4,span')]
              .map((el) => {
                const t = (el.innerText || '').replace(/\s+/g, ' ').trim()
                return t && t.length <= 120
                  ? `${el.tagName.toLowerCase()}${el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 3).join('.') : ''}: ${t}`
                  : null
              })
              .filter(Boolean)
              .slice(0, 300),
          )
          steps.push({ label, url: page.url(), text: text.slice(0, 20000), outline })
        }
        await snap('loaded')
        for (const name of ['WEEKLY VIEW', 'Weekly view', 'Weekly']) {
          const el = page.getByText(name, { exact: true }).first()
          if (await el.count()) {
            await el.click({ timeout: 5000 }).catch(() => {})
            await page.waitForTimeout(4000)
            await snap('weekly view')
            break
          }
        }
        for (const name of ['Available', 'Some Availability']) {
          const el = page.getByText(name, { exact: true }).first()
          if (await el.count()) {
            await el.click({ timeout: 5000 }).catch(() => {})
            await page.waitForTimeout(4000)
            await snap(`clicked ${name}`)
            break
          }
        }
        record.steps = steps
      }
      console.log(`${key}: ${record.status}, ${data.text.length} chars, ${data.links.length} links`)
    } catch (err) {
      record.error = err.message
      console.warn(`${key}: failed: ${err.message}`)
    }
    writeFileSync(join(OUT, `${key}.json`), JSON.stringify(record, null, 1) + '\n')
    await sleep(2000)
  }
  writeFileSync(join(OUT, '_robots.json'), JSON.stringify(robots, null, 1) + '\n')
  await browser.close()
}

main().catch((err) => {
  console.error('probe failed:', err)
  process.exit(0)
})
