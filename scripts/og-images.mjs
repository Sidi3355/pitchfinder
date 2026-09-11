// Renders the Open Graph images in public/og/ (one per pitch type plus a
// default) with headless Chromium. Run once when the design changes; the
// PNGs are committed so the Vercel build needs no browser.

import { chromium } from '@playwright/test'
import { existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname
const OUT = join(ROOT, 'public/og')
const localChromium = '/opt/pw-browsers/chromium'
const executablePath =
  process.env.PW_CHROMIUM_PATH || (existsSync(localChromium) ? localChromium : undefined)

const CARDS = {
  default: { title: 'Where to play football in London', sub: 'Every pitch, ranked for your group' },
  commercial: { title: 'Commercial centre', sub: 'Caged, floodlit, bookable by the hour' },
  astro: { title: 'Bookable astro', sub: 'Artificial pitches at sports centres and clubs' },
  park: { title: 'Park pitch', sub: 'Grass pitches in parks and playing fields' },
  cage: { title: 'Cage or MUGA', sub: 'Free small-sided courts and games areas' },
  game: { title: 'Are you in?', sub: 'Football with your group: say in, maybe or out' },
}

function html({ title, sub }) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
    html,body{margin:0;width:1200px;height:630px;background:#f7f8f7;font-family:-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;color:#111827}
    .wrap{position:absolute;inset:0;padding:72px 84px;display:flex;flex-direction:column;justify-content:space-between}
    .brand{display:flex;align-items:center;gap:20px;font-size:40px;font-weight:700;letter-spacing:-0.02em}
    .mark{width:64px;height:64px;border-radius:16px;background:#15803d;position:relative}
    .mark::before{content:"";position:absolute;inset:14px;border:5px solid #fff;border-radius:50%}
    .mark::after{content:"";position:absolute;left:26px;top:26px;width:12px;height:12px;border-radius:50%;background:#fff}
    h1{margin:0;font-size:84px;line-height:1.05;letter-spacing:-0.03em;font-weight:700;max-width:960px}
    p{margin:18px 0 0;font-size:36px;color:#4b5563;max-width:900px}
    .foot{font-size:28px;color:#6b7280}
    .bar{position:absolute;left:0;top:0;bottom:0;width:18px;background:#15803d}
  </style></head><body><div class="bar"></div><div class="wrap">
    <div class="brand"><span class="mark"></span>PitchFinder</div>
    <div><h1>${title}</h1><p>${sub}</p></div>
    <div class="foot">pitchfinder-pied.vercel.app</div>
  </div></body></html>`
}

const browser = await chromium.launch(executablePath ? { executablePath } : {})
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
mkdirSync(OUT, { recursive: true })
for (const [key, card] of Object.entries(CARDS)) {
  await page.setContent(html(card))
  await page.screenshot({ path: join(OUT, `${key}.png`), type: 'png' })
  console.log(`wrote public/og/${key}.png`)
}
await browser.close()
