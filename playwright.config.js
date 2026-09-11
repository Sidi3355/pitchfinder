import { defineConfig, devices } from '@playwright/test'
import { existsSync } from 'node:fs'

// The sandbox this was built in ships Chromium at a fixed path that predates
// the Playwright release; CI installs a matching browser instead.
const localChromium = '/opt/pw-browsers/chromium'
const executablePath =
  process.env.PW_CHROMIUM_PATH || (existsSync(localChromium) ? localChromium : undefined)

const PORT = Number(process.env.PW_PORT || 4173)
const FAKE_PORT = Number(process.env.FAKE_SUPABASE_PORT || 4177)

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    // The product is for London: browsers in the tests keep London time and British English.
    timezoneId: 'Europe/London',
    locale: 'en-GB',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    launchOptions: executablePath ? { executablePath } : {},
  },
  projects: [
    {
      name: 'mobile',
      use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' },
    },
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: `node scripts/serve.mjs --port ${PORT}`,
      url: `http://localhost:${PORT}`,
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
    },
    {
      // Stand-in Supabase: real Postgres and RLS when DATABASE_URL is set,
      // otherwise a server that answers 503 so account tests skip cleanly.
      command: `node tests/e2e/fake-supabase.mjs --port ${FAKE_PORT}`,
      url: `http://localhost:${FAKE_PORT}/health`,
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
    },
  ],
})
