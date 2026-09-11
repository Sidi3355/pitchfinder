// Copy rules: no em dashes in UI copy or docs. Scans the paths given on the
// command line (default: docs) and fails when a U+2014 is found.

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const roots = process.argv.slice(2).length ? process.argv.slice(2) : ['README.md', 'agent', 'src', 'index.html']
const EM_DASH = '—'
const failures = []

function walk(path) {
  const st = statSync(path)
  if (st.isDirectory()) {
    for (const f of readdirSync(path)) {
      if (f === 'lighthouse' || f === 'node_modules') continue
      walk(join(path, f))
    }
    return
  }
  if (!/\.(md|jsx?|tsx?|html|json)$/.test(path)) return
  const lines = readFileSync(path, 'utf8').split('\n')
  lines.forEach((line, i) => {
    if (line.includes(EM_DASH)) failures.push(`${path}:${i + 1}: ${line.trim().slice(0, 80)}`)
  })
}

for (const r of roots) walk(r)
if (failures.length) {
  console.error(`Em dashes found (${failures.length}):\n  ${failures.join('\n  ')}`)
  process.exit(1)
}
console.log(`Copy check OK (${roots.join(', ')})`)
