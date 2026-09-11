// Captures the core screens on the mobile and desktop profiles for the
// critics. Usage: node scripts/screenshots.mjs <label>  (writes to
// agent/screenshots/<label>/). Starts its own static server on a spare port.

import { chromium, devices } from '@playwright/test'
import { spawn } from 'node:child_process'
import { existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname
const label = process.argv[2] || 'latest'
const OUT = join(ROOT, 'agent/screenshots', label)
const PORT = Number(process.env.SHOT_PORT || 4180)
const BASE = `http://localhost:${PORT}`
const localChromium = '/opt/pw-browsers/chromium'
const executablePath =
  process.env.PW_CHROMIUM_PATH || (existsSync(localChromium) ? localChromium : undefined)

const GROUP = 'g=Sam~Peckham~51.4741~-0.0691~t;Ali~Hackney~51.545~-0.0553~c'
const FAKE_PORT = Number(process.env.FAKE_SUPABASE_PORT || 4177)
const FAKE = `http://localhost:${FAKE_PORT}`

// [name, path, setup(page)]
const SCREENS = [
  ['home', '/'],
  ['home-group', `/?${GROUP}`],
  ['group-tab', `/?${GROUP}`, (p) => p.getByRole('tab', { name: 'Your group' }).click()],
  ['filters-tab', '/', (p) => p.getByRole('tab', { name: 'Filters' }).click()],
  ['pitch-drawer', `/?${GROUP}&p=pl-shoreditch`],
  ['pitch-page', `/p/pl-shoreditch?${GROUP}`],
  ['pitch-page-osm', '/p/osm-n11415654181'],
  ['no-results', '/?t=commercial&free=1'],
  ['not-found', '/nowhere'],
  ['about', '/about'],
  ['profile-signed-out', '/me'],
]

async function waitFor(url, ms = 20000) {
  const t0 = Date.now()
  while (Date.now() - t0 < ms) {
    try {
      if ((await fetch(url)).ok) return
    } catch {}
    await new Promise((r) => setTimeout(r, 250))
  }
  throw new Error('server did not start')
}

const server = spawn('node', ['scripts/serve.mjs', '--port', String(PORT)], {
  cwd: ROOT,
  stdio: 'ignore',
})
// The fake Supabase (real Postgres behind it when DATABASE_URL is set) so the
// game and profile screens can be captured too.
const fake = spawn('node', ['tests/e2e/fake-supabase.mjs', '--port', String(FAKE_PORT)], {
  cwd: ROOT,
  stdio: 'ignore',
})
const shot = (page, file) => page.screenshot({ path: file, type: 'jpeg', quality: 72 })
try {
  await waitFor(BASE)
  await waitFor(`${FAKE}/health`)
  const withDb = (await (await fetch(`${FAKE}/health`)).json()).database
  mkdirSync(OUT, { recursive: true })
  const browser = await chromium.launch(executablePath ? { executablePath } : {})
  const profiles = {
    mobile: { ...devices['iPhone 13'], defaultBrowserType: 'chromium', deviceScaleFactor: 1 },
    desktop: { viewport: { width: 1280, height: 800 } },
  }
  // A game to screenshot: created once through the UI as a signed-in organiser.
  let gameUrl = null
  if (withDb) {
    const ctx = await browser.newContext(profiles.desktop)
    const page = await ctx.newPage()
    const link = await (
      await fetch(
        `${FAKE}/__test/magic-link?email=organiser@example.com&redirect=${encodeURIComponent(`${BASE}/`)}`,
      )
    ).json()
    await page.goto(link.url)
    await page.waitForSelector('.header-user')
    await page.goto(`${BASE}/p/pl-shoreditch?${GROUP}`)
    await page.getByRole('button', { name: 'Plan a game' }).click()
    await page.getByLabel('Date').fill('2026-09-17')
    await page.getByLabel('Kick-off time').fill('19:30')
    await page.getByLabel('Notes').fill('Bibs and a ball sorted. £10 each.')
    await page.getByRole('button', { name: 'Create game link' }).click()
    await page.waitForURL(/\/g\//)
    gameUrl = page.url().replace(BASE, '')
    // Two guests answer so the page has content.
    for (const [name, status] of [
      ['Priya', 'In'],
      ['Tom', 'Maybe'],
    ]) {
      const g = await browser.newContext()
      const gp = await g.newPage()
      await gp.goto(`${BASE}${gameUrl}`)
      await gp.getByLabel('Your name').fill(name)
      await gp.getByRole('button', { name: status, exact: true }).click()
      await gp.waitForSelector(`text=You are ${status.toLowerCase()}`)
      await g.close()
    }
    await ctx.close()
  }
  for (const [profile, opts] of Object.entries(profiles)) {
    const ctx = await browser.newContext(opts)
    const page = await ctx.newPage()
    for (const [name, path, setup] of SCREENS) {
      await page.goto(`${BASE}${path}`)
      await page.waitForTimeout(1500)
      if (setup) {
        await setup(page)
        await page.waitForTimeout(400)
      }
      await shot(page, join(OUT, `${profile}-${name}.jpg`))
    }
    if (gameUrl) {
      await page.goto(`${BASE}${gameUrl}`)
      await page.waitForTimeout(1200)
      await shot(page, join(OUT, `${profile}-game-guest.jpg`))
      const link = await (
        await fetch(
          `${FAKE}/__test/magic-link?email=organiser@example.com&redirect=${encodeURIComponent(`${BASE}${gameUrl}`)}`,
        )
      ).json()
      await page.goto(link.url)
      await page.waitForTimeout(1500)
      await shot(page, join(OUT, `${profile}-game-organiser.jpg`))
      await page.goto(`${BASE}/me`)
      await page.waitForTimeout(1500)
      await shot(page, join(OUT, `${profile}-profile-signed-in.jpg`))
      await page.goto(`${BASE}/p/pl-shoreditch`)
      await page.waitForTimeout(800)
      await page.getByRole('button', { name: 'Report a problem with this pitch' }).click()
      await page.waitForTimeout(300)
      await shot(page, join(OUT, `${profile}-report-form.jpg`))
    }
    await page.goto(`${BASE}/p/pl-shoreditch`)
    await page.waitForTimeout(800)
    await page.getByRole('button', { name: 'Save', exact: true }).click()
    await page.waitForTimeout(400)
    await shot(page, join(OUT, `${profile}-sign-in.jpg`))
    await ctx.close()
  }
  await browser.close()
  console.log(`Screenshots written to agent/screenshots/${label}/`)
} finally {
  server.kill()
  fake.kill()
}
