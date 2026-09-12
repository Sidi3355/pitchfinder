import { test, expect } from '@playwright/test'
import { mockPostcodes } from './helpers.js'

// The product site around the tool: landing, menu, footer, privacy, and the
// old root links that still have to open the finder.

test('quick start on the landing page puts the first person on the map', async ({ page }) => {
  await mockPostcodes(page)
  await page.goto('/')
  await page.getByLabel('Your postcode or area').fill('E8 3DL')
  await page.getByRole('button', { name: 'Start' }).click()
  await expect(page).toHaveURL(/\/find\?g=You~E8%203DL/)
  await expect(page.getByText('ranked for your group of 1')).toBeVisible()
  await expect(page.locator('.card').first()).toContainText('You')
})

test('an unknown place on the landing page says so and keeps you there', async ({ page }) => {
  await page.route('https://api.postcodes.io/**', (route) =>
    route.fulfill({ status: 404, json: { status: 404 } }),
  )
  await page.route('https://nominatim.openstreetmap.org/**', (route) => route.fulfill({ json: [] }))
  await page.goto('/')
  await page.getByLabel('Your postcode or area').fill('Narnia')
  await page.getByRole('button', { name: 'Start' }).click()
  await expect(page.getByRole('alert')).toContainText(/No match|needs a connection/)
  await expect(page).toHaveURL(/\/$/)
})

test('browse-by-type cards open the finder with that filter', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: /Goals/ }).click()
  await expect(page).toHaveURL(/\/find\?op=goals/)
  await expect(page.getByRole('button', { name: /^Filters, 1 on/ })).toBeVisible()
})

test('old shared links on the root still open the finder with their state', async ({ page }) => {
  await page.goto('/?g=Sam~Peckham~51.4741~-0.0691~t&lit=1')
  await expect(page).toHaveURL(/\/find\?g=Sam~Peckham~51\.4741~-0\.0691~t&lit=1$/)
  await expect(page.getByText('ranked for your group of 1')).toBeVisible()
})

test('the menu reaches every page on a phone and the nav does on desktop', async ({
  page,
  isMobile,
}) => {
  await page.goto('/')
  if (isMobile) {
    await page.getByRole('button', { name: 'Menu' }).click()
    const dialog = page.getByRole('dialog', { name: 'Menu' })
    for (const name of ['Home', 'Find a pitch', 'About', 'My games', 'Privacy']) {
      await expect(dialog.getByRole('link', { name })).toBeVisible()
    }
    await expect(dialog.getByRole('button', { name: 'Sign in' })).toBeVisible()
    await dialog.getByRole('link', { name: 'Privacy' }).click()
  } else {
    const nav = page.getByRole('navigation', { name: 'Main' })
    await expect(nav.getByRole('link', { name: 'Find a pitch' })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'About' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible()
    await page.getByRole('contentinfo').getByRole('link', { name: 'Privacy' }).click()
  }
  await expect(page).toHaveURL(/\/privacy$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Privacy')
  await expect(page).toHaveTitle(/Privacy/)
})
