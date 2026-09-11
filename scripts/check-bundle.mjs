// Bundle budget: the JavaScript needed to render the first screen must stay
// under 350 KB gzipped, and MapLibre must not be part of it (it is loaded on
// demand when the map comes on screen). Run after `vite build`.

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { gzipSync } from 'node:zlib'
import { join } from 'node:path'

const DIST = new URL('../dist/', import.meta.url).pathname
const BUDGET_KB = 350

const html = readFileSync(join(DIST, 'index.html'), 'utf8')
const initial = new Set()
for (const m of html.matchAll(/<script[^>]+src="\/?([^"]+\.js)"/g)) initial.add(m[1])
for (const m of html.matchAll(/<link[^>]+rel="modulepreload"[^>]+href="\/?([^"]+\.js)"/g))
  initial.add(m[1])

let total = 0
const rows = []
for (const file of initial) {
  const bytes = gzipSync(readFileSync(join(DIST, file))).length
  total += bytes
  rows.push([file, bytes])
}
rows.sort((a, b) => b[1] - a[1])

console.log('Initial JavaScript (gzipped):')
for (const [file, bytes] of rows)
  console.log(`  ${(bytes / 1024).toFixed(1).padStart(7)} KB  ${file}`)
console.log(`  ${(total / 1024).toFixed(1).padStart(7)} KB  total (budget ${BUDGET_KB} KB)`)

const allJs = readdirSync(join(DIST, 'assets')).filter((f) => f.endsWith('.js'))
const lazy = allJs.filter((f) => !initial.has(`assets/${f}`))
console.log('Lazy chunks:')
for (const f of lazy) {
  const bytes = gzipSync(readFileSync(join(DIST, 'assets', f))).length
  console.log(`  ${(bytes / 1024).toFixed(1).padStart(7)} KB  assets/${f}`)
}

const failures = []
if (total > BUDGET_KB * 1024)
  failures.push(`initial JS ${(total / 1024).toFixed(1)} KB exceeds ${BUDGET_KB} KB`)
const maplibreInitial = [...initial].find((f) => /maplibre/i.test(f))
// The split is enforced once backlog item 7 (code-split MapLibre) lands;
// until then it is reported so the number is visible in every CI run.
if (maplibreInitial) {
  const msg = `MapLibre is in the initial bundle (${maplibreInitial})`
  if (process.env.BUNDLE_REQUIRE_MAP_SPLIT) failures.push(msg)
  else console.warn(`\nWarning: ${msg}`)
}

if (failures.length) {
  console.error('\nBundle budget FAILED:\n  ' + failures.join('\n  '))
  process.exit(1)
}
console.log('\nBundle budget OK')
