import { test, expect } from '@playwright/test'

// Chromium's own GL driver notices under software WebGL ("GPU stall due to
// ReadPixels") are about the test machine, not the app, and are ignored.
const DRIVER_NOTICE = /^\[\.WebGL-[^\]]*\]GL Driver Message/

function collectConsole(page) {
  const errors = []
  page.on('console', (msg) => {
    if ((msg.type() === 'error' || msg.type() === 'warning') && !DRIVER_NOTICE.test(msg.text())) {
      errors.push(`${msg.type()}: ${msg.text()}`)
    }
  })
  page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`))
  return errors
}

test('the landing page explains the product and leads to the finder without console errors', async ({
  page,
}) => {
  const errors = collectConsole(page)
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Pick a pitch')
  await expect(page.getByRole('heading', { name: 'How it works' })).toBeVisible()
  await expect(page.locator('.home-stats strong').first()).toHaveText(/^[\d,]+$/)
  await expect(page.getByRole('contentinfo')).toContainText('OpenStreetMap')
  await page.getByRole('link', { name: 'Find a pitch' }).first().click()
  await expect(page).toHaveURL(/\/find$/)
  await expect(page.locator('.list-title strong')).toContainText(/pitches/)
  await expect(page.locator('.card').first()).toBeVisible()
  expect(errors).toEqual([])
})

test('the finder loads the dataset and shows a ranked list', async ({ page }) => {
  const errors = collectConsole(page)
  await page.goto('/find')
  await expect(page.locator('.list-title strong')).toContainText(/pitches/)
  await expect(page.locator('.card').first()).toBeVisible()
  expect(errors).toEqual([])
})
