// Lighthouse gate. Assumes `vite build` has run. Starts `vite preview` on a
// spare port, audits the home route and one pitch route with mobile emulation
// and simulated slow 4G, writes reports to agent/lighthouse/, and exits
// non-zero when any score is under its gate or first contentful paint is
// slower than 3 s. Set LH_SOFT=1 to report without failing.

import { spawn } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import lighthouse from 'lighthouse'
import * as chromeLauncher from 'chrome-launcher'

const ROOT = new URL('..', import.meta.url).pathname
const PORT = Number(process.env.LH_PORT || 4174)
const OUT = join(ROOT, 'agent/lighthouse')
const GATES = { performance: 85, accessibility: 95, 'best-practices': 95, seo: 90 }
const FCP_GATE_MS = 3000

function pickPitchId() {
  try {
    const data = JSON.parse(readFileSync(join(ROOT, 'public/data/pitches.json'), 'utf8'))
    const p = data.pitches.find((x) => x.curated) || data.pitches[0]
    return p?.id || null
  } catch {
    return null
  }
}

async function waitFor(url, ms = 30000) {
  const t0 = Date.now()
  while (Date.now() - t0 < ms) {
    try {
      const r = await fetch(url)
      if (r.ok) return
    } catch {}
    await new Promise((r) => setTimeout(r, 300))
  }
  throw new Error(`preview server did not start at ${url}`)
}

async function main() {
  if (!existsSync(join(ROOT, 'dist/index.html'))) {
    throw new Error('dist/ is missing: run `npm run build` first')
  }
  const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
    cwd: ROOT,
    stdio: 'ignore',
  })
  const rows = []
  let failed = false
  try {
    await waitFor(`http://localhost:${PORT}/`)
    const chromePath =
      process.env.CHROME_PATH ||
      (existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined)
    const chrome = await chromeLauncher.launch({
      chromePath,
      chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
    })
    mkdirSync(OUT, { recursive: true })
    const pitchId = pickPitchId()
    const routes = [['home', '/'], ...(pitchId ? [['pitch', `/p/${pitchId}`]] : [])]
    try {
      for (const [name, path] of routes) {
        const result = await lighthouse(
          `http://localhost:${PORT}${path}`,
          { port: chrome.port, output: 'json', logLevel: 'error' },
          {
            extends: 'lighthouse:default',
            settings: {
              formFactor: 'mobile',
              screenEmulation: { mobile: true, width: 390, height: 844, deviceScaleFactor: 3 },
              throttlingMethod: 'simulate',
              onlyCategories: Object.keys(GATES),
            },
          },
        )
        const lhr = result.lhr
        const scores = {}
        for (const k of Object.keys(GATES))
          scores[k] = Math.round((lhr.categories[k]?.score ?? 0) * 100)
        const num = (id) => Math.round(lhr.audits[id]?.numericValue ?? 0)
        const row = {
          route: path,
          ...scores,
          fcpMs: num('first-contentful-paint'),
          lcpMs: num('largest-contentful-paint'),
          tbtMs: num('total-blocking-time'),
          cls: Number((lhr.audits['cumulative-layout-shift']?.numericValue ?? 0).toFixed(3)),
        }
        rows.push(row)
        writeFileSync(join(OUT, `${name}.json`), result.report)
        for (const [k, gate] of Object.entries(GATES)) if (scores[k] < gate) failed = true
        if (row.fcpMs > FCP_GATE_MS) failed = true
      }
    } finally {
      await chrome.kill()
    }
  } finally {
    server.kill()
  }

  const header = '| Route | Perf | A11y | Best practices | SEO | FCP | LCP | TBT | CLS |'
  const lines = [header, '| --- | --- | --- | --- | --- | --- | --- | --- | --- |']
  for (const r of rows) {
    lines.push(
      `| ${r.route} | ${r.performance} | ${r.accessibility} | ${r['best-practices']} | ${r.seo} | ${(r.fcpMs / 1000).toFixed(1)} s | ${(r.lcpMs / 1000).toFixed(1)} s | ${r.tbtMs} ms | ${r.cls} |`,
    )
  }
  const md = `# Lighthouse (mobile, simulated slow 4G)\n\nMeasured ${new Date().toISOString()} against a local \`vite preview\` build.\nGates: performance >= ${GATES.performance}, accessibility >= ${GATES.accessibility}, best practices >= ${GATES['best-practices']}, SEO >= ${GATES.seo}, FCP <= ${FCP_GATE_MS / 1000} s.\n\n${lines.join('\n')}\n\nResult: ${failed ? 'FAILED' : 'PASSED'}\n`
  writeFileSync(join(OUT, 'summary.md'), md)
  console.log(md)
  if (failed && !process.env.LH_SOFT) process.exit(1)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
