// Prerenders one HTML file per pitch (dist/p/{id}.html) from the built
// index.html so a static host serves correct <title>, description and Open
// Graph tags without JavaScript, and links unfurl in WhatsApp and iMessage.
// The body carries a plain-HTML summary that React replaces on hydration.
// Also writes dist/404.html. Runs after `vite build`.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { PITCH_TYPES, pitchName } from '../src/data/types.js'
import { costOf } from '../src/lib/data.js'
import { bookingLabel, isBookable, surfaceLabel } from '../src/lib/labels.js'

const ROOT = new URL('..', import.meta.url).pathname
const DIST = join(ROOT, 'dist')
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
  return `£${cost.perHour} per hour`
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
  }<p><a href="/">All pitches</a></p><p>Pitch data © OpenStreetMap contributors (ODbL).</p></main>`
}

function setMeta(html, attr, name, content) {
  const re = new RegExp(`<meta\\s+${attr}="${name}"\\s+content="[^"]*"\\s*/?>`)
  if (!re.test(html)) throw new Error(`index.html is missing <meta ${attr}="${name}">`)
  return html.replace(re, `<meta ${attr}="${name}" content="${esc(content)}" />`)
}

function render(template, pitch) {
  const name = pitchName(pitch)
  const title = `${name}: ${PITCH_TYPES[pitch.type]?.label || 'Pitch'} in ${pitch.area || 'London'}`
  const description = describe(pitch)
  const url = `${SITE}/p/${pitch.id}`
  const image = `${SITE}/og/${PITCH_TYPES[pitch.type] ? pitch.type : 'default'}.png`
  let html = template
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
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

console.log(`Prerendered ${n} pitch pages and 404.html`)
