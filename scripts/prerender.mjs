// Prerenders one HTML file per pitch (dist/p/{id}.html) from the built
// index.html so a static host serves correct <title>, description and Open
// Graph tags without JavaScript, and links unfurl in WhatsApp and iMessage.
// The body carries a plain-HTML summary that React replaces on hydration.
// Also writes dist/404.html. Runs after `vite build`.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { compactPitch } from '../src/lib/compact.js'
import { join } from 'node:path'
import { PITCH_TYPES, pitchName } from '../src/data/types.js'
import { costOf } from '../src/lib/data.js'
import { isBookable, surfaceLabel } from '../src/lib/labels.js'

const ROOT = new URL('..', import.meta.url).pathname
const DIST = process.env.PF_DIST || join(ROOT, 'dist')
const SITE = (process.env.SITE_URL || 'https://pitchfinder-pied.vercel.app').replace(/\/$/, '')

const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

function priceText(pitch) {
  const cost = costOf(pitch)
  if (!cost.known) return 'Price not known'
  if (cost.perHour === 0) return 'Free to play'
  const { amount, minutes } = cost.slot
  const from = pitch.priceMax != null && pitch.priceMax > cost.perHour ? 'from ' : ''
  return minutes === 60 ? `${from}£${amount} per hour` : `${from}£${amount} for ${minutes} min`
}

function describe(pitch) {
  const t = PITCH_TYPES[pitch.type]?.label || 'Pitch'
  const parts = [
    `${t}${pitch.area ? ` in ${pitch.area}` : ''}${pitch.postcode ? ` (${pitch.postcode})` : ''}.`,
    `${priceText(pitch)}.`,
  ]
  const facts = []
  if (pitch.surface) facts.push(surfaceLabel(pitch.surface))
  if (pitch.lit === true) facts.push('floodlit')
  if (pitch.changingRooms) facts.push('changing rooms')
  if (pitch.pitchCount > 1) facts.push(`${pitch.pitchCount} pitches`)
  if (facts.length) parts.push(`${facts.join(', ')}.`)
  if (isBookable(pitch.bookingUrl)) parts.push('Bookable online.')
  return parts.join(' ')
}

function summary(pitch) {
  const name = pitchName(pitch)
  const t = PITCH_TYPES[pitch.type]?.label || 'Pitch'
  const rows = [
    ['Type', t],
    ['Area', pitch.area || 'Not known'],
    ['Nearest postcode', pitch.postcode || 'Not known'],
    ['Price', priceText(pitch)],
    ['Surface', pitch.surface ? surfaceLabel(pitch.surface) : 'Not known'],
    ['Floodlights', pitch.lit === true ? 'Yes' : pitch.lit === false ? 'No' : 'Not known'],
  ]
  return `<main class="prerender"><h1>${esc(name)}</h1><dl>${rows
    .map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`)
    .join('')}</dl>${
    pitch.bookingUrl
      ? `<p><a href="${esc(pitch.bookingUrl)}" rel="noopener">Book at venue</a></p>`
      : ''
  }<p><a href="/find">All pitches</a></p><p>Pitch data © OpenStreetMap contributors (ODbL).</p></main>`
}

function setMeta(html, attr, name, content) {
  const re = new RegExp(`<meta\\s+${attr}="${name}"\\s+content="[^"]*"\\s*/?>`)
  if (!re.test(html)) throw new Error(`index.html is missing <meta ${attr}="${name}">`)
  return html.replace(re, `<meta ${attr}="${name}" content="${esc(content)}" />`)
}

function render(template, pitch) {
  const name = pitchName(pitch)
  // The preview title is the name alone; the type and area belong to the
  // description, so a shared cage does not read "X cage: Cage / MUGA in X".
  const title = name
  const description = describe(pitch)
  const url = `${SITE}/p/${pitch.id}`
  const image = `${SITE}/og/${PITCH_TYPES[pitch.type] ? pitch.type : 'default'}.png`
  let html = template
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(`${name}: PitchFinder`)}</title>`)
  html = html.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${esc(url)}" />`,
  )
  html = setMeta(html, 'name', 'description', description)
  html = setMeta(html, 'property', 'og:title', title)
  html = setMeta(html, 'property', 'og:description', description)
  html = setMeta(html, 'property', 'og:url', url)
  html = setMeta(html, 'property', 'og:image', image)
  html = html.replace(/<div id="root"><\/div>/, `<div id="root">${summary(pitch)}</div>`)
  return html
}

const template = readFileSync(join(DIST, 'index.html'), 'utf8')
if (!/<div id="root"><\/div>/.test(template)) throw new Error('dist/index.html has no empty #root')
const data = JSON.parse(readFileSync(join(ROOT, 'public/data/pitches.json'), 'utf8'))

mkdirSync(join(DIST, 'p'), { recursive: true })
let n = 0
for (const pitch of data.pitches) {
  if (!/^[a-z0-9-]{1,40}$/i.test(pitch.id)) continue
  writeFileSync(join(DIST, 'p', `${pitch.id}.html`), render(template, pitch))
  n++
}

const notFound = template
  .replace(/<title>[^<]*<\/title>/, '<title>Page not found: PitchFinder</title>')
  .replace(/<meta\s+name="robots"[^>]*>/, '')
  .replace('</head>', '<meta name="robots" content="noindex" /></head>')
writeFileSync(join(DIST, '404.html'), notFound)

// Compact index for the app (what the list, map and ranking need) and one
// detail file per pitch (provenance, opening hours, members) loaded on demand.
mkdirSync(join(DIST, 'data', 'p'), { recursive: true })
const { pitches, ...meta } = data
writeFileSync(
  join(DIST, 'data', 'index.json'),
  JSON.stringify({ ...meta, pitches: pitches.map(compactPitch) }),
)
for (const pitch of pitches) {
  if (!/^[a-z0-9-]{1,40}$/i.test(pitch.id)) continue
  writeFileSync(join(DIST, 'data', 'p', `${pitch.id}.json`), JSON.stringify(pitch))
}
console.log(
  `Prerendered ${n} pitch pages and 404.html; wrote data/index.json and ${n} detail files`,
)
