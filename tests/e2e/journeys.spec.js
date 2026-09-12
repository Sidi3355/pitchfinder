import { test, expect } from '@playwright/test'

// Item 10: walking, cycling and driving times come from a router (OSRM) and
// are tagged "route"; public transport and anything the router cannot answer
// stay estimates tagged "est.". The test build points OSRM at the stub in
// fake-supabase.mjs, so the numbers are deterministic and no public server
// is called from CI.

const WALK_CYCLE = 'Sam~Peckham~51.4741~-0.0691~w;Ali~Hackney~51.545~-0.0553~c'
const TRANSIT = 'Sam~Peckham~51.4741~-0.0691~t'

test('cards and the pitch page show routed minutes tagged as routes', async ({ page }) => {
  const osrmCalls = []
  page.on('request', (r) => r.url().includes('/osrm/') && osrmCalls.push(r.url()))
  await page.goto(`/find?g=${WALK_CYCLE}`)
  const first = page.locator('.card').first()
  // Each person gets their own routed minutes on the card.
  await expect(first.locator('.card-journey .src-tag')).toHaveText(['route', 'route'])
  await expect(first.locator('.card-journey')).toContainText(/Sam \d+ min/)
  await expect(first.locator('.card-journey')).toContainText(/Ali \d+ min/)
  await expect(first.locator('.card-journey')).not.toContainText('about')
  // One table request per person, not one per pitch.
  expect(osrmCalls.filter((u) => u.includes('/foot/'))).toHaveLength(1)
  expect(osrmCalls.filter((u) => u.includes('/bike/'))).toHaveLength(1)

  await first.locator('.card-title').click()
  const rows = page.locator('.eta-list li')
  await expect(rows).toHaveCount(2)
  await expect(rows.nth(0)).toContainText('Sam')
  await expect(rows.nth(0)).toContainText(/\d+ min/)
  await expect(rows.nth(0).locator('.src-tag')).toHaveText('route')
  await expect(rows.nth(1).locator('.src-tag')).toHaveText('route')
  await expect(page.getByText(/Routes are from OSRM/)).toBeVisible()
  await expect(page.getByText(/Estimates are from/)).toHaveCount(0)
})

test('the estimate stays, labelled, when the router is down', async ({ page }) => {
  await page.route('**/osrm/**', (route) => route.fulfill({ status: 503, json: {} }))
  await page.goto(`/find?g=${WALK_CYCLE}`)
  const first = page.locator('.card').first()
  await expect(first.locator('.card-journey')).toContainText(/Sam about \d+ min/)
  await expect(first.locator('.card-journey .src-tag')).toHaveText(['est.', 'est.'])
  await first.locator('.card-title').click()
  await expect(page.locator('.eta-list li .src-tag').first()).toHaveText('est.')
  await expect(page.getByText(/Estimates are from straight-line distance/)).toBeVisible()
  await expect(page.locator('.src-tag', { hasText: 'route' })).toHaveCount(0)
})

test('public transport is an estimate and asks no router without a TfL key', async ({ page }) => {
  const osrmCalls = []
  page.on('request', (r) => r.url().includes('/osrm/') && osrmCalls.push(r.url()))
  await page.goto(`/find?g=${TRANSIT}`)
  const first = page.locator('.card').first()
  await expect(first.locator('.card-journey .src-tag')).toHaveText('est.')
  await expect(first.locator('.card-journey')).toContainText(/Sam about \d+ min/)
  await page.waitForTimeout(500)
  expect(osrmCalls).toHaveLength(0)
})

test('a bigger group gets one summed-up line, and no rank badges without a group', async ({
  page,
}) => {
  const four =
    'A~Peckham~51.4741~-0.0691~w;B~Hackney~51.545~-0.0553~w;C~Bow~51.53~-0.02~w;D~Brixton~51.46~-0.11~w'
  await page.goto(`/find?g=${four}`)
  const first = page.locator('.card').first()
  await expect(first.locator('.card-journey .src-tag')).toHaveText('route')
  await expect(first.locator('.card-journey')).toContainText(
    /everyone within \d+ min|a similar journey for everyone|\d+ min on average|up to \d+ min/,
  )
  await expect(first.locator('.rank')).toHaveText('1')
  await page.goto('/find')
  await expect(page.locator('.card').first()).toBeVisible()
  await expect(page.locator('.card .rank')).toHaveCount(0)
})
