// Dev tool: CPU profile of the home route under 4x CPU throttling with
// software WebGL, listing the functions with the most self time.
// Usage: node scripts/profile-home.mjs   (needs a build in dist/)

import { chromium, devices } from '@playwright/test'
import { spawn } from 'node:child_process'

const server = spawn('node', ['scripts/serve.mjs', '--port', '4186'], { stdio: 'ignore' })
await new Promise((r) => setTimeout(r, 800))
const browser = await chromium.launch({
  executablePath: process.env.PW_CHROMIUM_PATH || '/opt/pw-browsers/chromium',
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
})
const ctx = await browser.newContext({ ...devices['iPhone 13'], defaultBrowserType: 'chromium' })
const page = await ctx.newPage()
const client = await ctx.newCDPSession(page)
await client.send('Emulation.setCPUThrottlingRate', { rate: 4 })
await client.send('Profiler.enable')
await client.send('Profiler.start')
const t0 = Date.now()
await page.goto(`http://localhost:4186/${process.argv[2] || ''}`, { waitUntil: 'load' })
await page.waitForSelector('.card')
await page.waitForTimeout(4000)
const { profile } = await client.send('Profiler.stop')
const self = new Map()
const byId = new Map(profile.nodes.map((n) => [n.id, n]))
for (let i = 0; i < profile.samples.length; i++) {
  const f = byId.get(profile.samples[i]).callFrame
  const key = `${f.functionName || '(anon)'} ${(f.url || '').split('/').pop()}:${f.lineNumber}`
  self.set(key, (self.get(key) || 0) + (profile.timeDeltas[i] || 0))
}
for (const [k, us] of [...self.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20)) {
  console.log(`${(us / 1000).toFixed(0).padStart(6)} ms  ${k}`)
}
console.log('wall', Date.now() - t0, 'ms')
await browser.close()
server.kill()
