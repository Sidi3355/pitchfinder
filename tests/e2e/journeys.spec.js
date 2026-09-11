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
  await page.goto(`/?g=${WALK_CYCLE}`)
  const first = page.locator('.card').first()
  await expect(first.locator('.card-meta .src-tag')).toHaveText('route')
  await expect(first.locator('.card-meta')).toContainText(/up to \d+ min/)
  await expect(first.locator('.card-meta')).not.toContainText('about')
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
  await page.goto(`/?g=${WALK_CYCLE}`)
  const first = page.locator('.card').first()
  await expect(first.locator('.card-meta')).toContainText(/up to about \d+ min/)
  await expect(first.locator('.card-meta .src-tag')).toHaveText('est.')
  await first.locator('.card-title').click()
  await expect(page.locator('.eta-list li .src-tag').first()).toHaveText('est.')
  await expect(page.getByText(/Estimates are from straight-line distance/)).toBeVisible()
  await expect(page.locator('.src-tag', { hasText: 'route' })).toHaveCount(0)
})

test('public transport is an estimate and asks no router without a TfL key', async ({ page }) => {
  const osrmCalls = []
  page.on('request', (r) => r.url().includes('/osrm/') && osrmCalls.push(r.url()))
  await page.goto(`/?g=${TRANSIT}`)
  const first = page.locator('.card').first()
  await expect(first.locator('.card-meta .src-tag')).toHaveText('est.')
  await expect(first.locator('.card-meta')).toContainText(/up to about \d+ min/)
  await page.waitForTimeout(500)
  expect(osrmCalls).toHaveLength(0)
})
