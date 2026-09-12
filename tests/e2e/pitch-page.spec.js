import { test, expect } from '@playwright/test'

test('pitch page renders the essentials', async ({ page }) => {
  await page.goto('/p/pl-shoreditch')
  await expect(
    page.getByRole('heading', { level: 1, name: 'Powerleague Shoreditch' }),
  ).toBeVisible()
  await expect(page.locator('.key-facts .brand-badge')).toHaveText('Powerleague')
  // The answer first: price, hours and lights on one line; prices and opening
  // times as blocks; the rest folded.
  await expect(page.locator('.key-facts')).toContainText(/£\d+/)
  await expect(page.locator('.price-table, .price-list').first()).toContainText(/£\d+/)
  await expect(page.getByRole('heading', { name: 'Opening times' })).toBeVisible()
  // Powerleague's own site or Playfinder, which sells its slots: either is a real booking page.
  await expect(page.getByRole('link', { name: /^Book / })).toHaveAttribute(
    'href',
    /powerleague|playfinder/,
  )
  await expect(page.locator('.mini-map')).toBeVisible()
  await expect(page.getByText(/^Data: /)).toBeHidden()
  await page.getByText('Details, directions and where the data comes from').click()
  await expect(page.getByText('Run by')).toBeVisible()
  await expect(page.getByText(/^Data: /)).toBeVisible()
  await expect(page.getByRole('link', { name: 'Back to results' })).toBeVisible()
  await expect(page).toHaveTitle(/Powerleague Shoreditch/)
})

test('pitch page HTML carries Open Graph meta without JavaScript', async ({ request }) => {
  const res = await request.get('/p/pl-shoreditch')
  expect(res.status()).toBe(200)
  const html = await res.text()
  expect(html).toMatch(/<title>Powerleague Shoreditch: PitchFinder<\/title>/)
  expect(html).toMatch(/<meta property="og:title" content="Powerleague Shoreditch"/)
  expect(html).toMatch(
    /<meta property="og:description" content="Football centre in [^"]+£\d+ per hour[^"]*"/,
  )
  expect(html).toMatch(/<meta property="og:image" content="https?:\/\/[^"]+\/og\/commercial\.png"/)
  expect(html).toMatch(/<meta property="og:url" content="https?:\/\/[^"]+\/p\/pl-shoreditch"/)
  expect(html).toMatch(/<link rel="canonical" href="https?:\/\/[^"]+\/p\/pl-shoreditch"/)
  expect(html).toContain('<h1>Powerleague Shoreditch</h1>')
  expect(html).toContain('OpenStreetMap contributors')
})

test('an unnamed OpenStreetMap pitch still gets a page with a derived title', async ({
  request,
}) => {
  const index = await (await request.get('/data/index.json')).json()
  const derived = index.pitches.find((p) => p.type === 'astro' && p.nameSource !== 'osm')
  expect(derived).toBeTruthy()
  const res = await request.get(`/p/${derived.id}`)
  expect(res.status()).toBe(200)
  const html = await res.text()
  expect(html).toMatch(/<meta property="og:image" content="[^"]+\/og\/astro\.png"/)
  expect(html).toContain(`<h1>${derived.name.replace(/&/g, '&amp;')}</h1>`)
})

test('unknown pitch id shows a designed not-found state', async ({ page }) => {
  await page.goto('/p/does-not-exist')
  await expect(page.getByText('Pitch not found')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Open the map' })).toBeVisible()
})

test('unknown route shows the not-found page', async ({ page }) => {
  await page.goto('/nowhere/at/all')
  await expect(page.getByText('Page not found')).toBeVisible()
  await page.getByRole('link', { name: 'Open the map' }).click()
  await expect(page.locator('.card').first()).toBeVisible()
})
