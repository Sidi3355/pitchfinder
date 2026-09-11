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
try {
  await waitFor(BASE)
  mkdirSync(OUT, { recursive: true })
  const browser = await chromium.launch(executablePath ? { executablePath } : {})
  const profiles = {
    mobile: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' },
    desktop: { viewport: { width: 1280, height: 800 } },
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
      await page.screenshot({ path: join(OUT, `${profile}-${name}.png`), fullPage: false })
    }
    await ctx.close()
  }
  await browser.close()
  console.log(`Screenshots written to agent/screenshots/${label}/`)
} finally {
  server.kill()
}
