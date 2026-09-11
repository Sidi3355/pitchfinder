import { test, expect } from '@playwright/test'
import { mockPostcodes } from './helpers.js'

// Gate CF1: landing to a ranked list for a two-person group, starting from
// postcodes, in under 60 s and under 8 taps. Every click and every field
// focus counts as a tap. postcodes.io is mocked so the run is deterministic.

test('two-person group to ranked list within the tap and time budget', async ({ page }) => {
  let taps = 0
  const tap = async (locator) => {
    taps++
    await locator.click()
  }
  const type = async (locator, text) => {
    taps++ // focusing the field is a tap
    await locator.fill(text)
  }
  await mockPostcodes(page)
  const t0 = Date.now()
  await page.goto('/')
  await expect(page.locator('.card').first()).toBeVisible()

  await tap(page.getByRole('button', { name: /Where is everyone coming from/ }))
  const dialog = page.getByRole('dialog', { name: 'Your group' })
  await type(dialog.getByPlaceholder(/Postcode or place/), 'E8 3DL')
  await tap(dialog.getByRole('button', { name: 'Add player' }))
  await expect(dialog.getByText('E8 3DL').last()).toBeVisible()
  await type(dialog.getByPlaceholder(/Postcode or place/), 'SE15 4AB')
  await tap(dialog.getByRole('button', { name: 'Add player' }))
  await expect(dialog.getByText('SE15 4AB').last()).toBeVisible()
  await tap(page.getByRole('button', { name: 'Rank for 2 people' }))

  await expect(page.getByText('ranked for your group of 2')).toBeVisible()
  await expect(page.locator('.card').first()).toContainText(/min/)
  const elapsed = (Date.now() - t0) / 1000
  test.info().annotations.push({ type: 'taps', description: String(taps) })
  test.info().annotations.push({ type: 'seconds', description: elapsed.toFixed(1) })
  expect(taps).toBeLessThan(8)
  expect(elapsed).toBeLessThan(60)
})
