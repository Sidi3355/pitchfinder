import { test, expect } from '@playwright/test'
import { closeFilters, openFilters } from './helpers.js'

// Item 11: every filter option says how many pitches it would leave, options
// that would leave none are switched off, and the travel-time filter only
// appears once there is a group to measure from.

test('filter options carry live counts that match the result count', async ({ page }) => {
  await page.goto('/find')
  await expect(page.locator('.card').first()).toBeVisible()
  await openFilters(page)
  const dialog = page.getByRole('dialog', { name: 'Filters' })
  const floodlit = dialog.locator('.pref-chip', { hasText: 'Floodlights' })
  const count = Number((await floodlit.locator('.count').innerText()).replace(/,/g, ''))
  expect(count).toBeGreaterThan(0)
  await floodlit.click()
  await expect(floodlit).toHaveAttribute('aria-pressed', 'true')
  await expect(dialog.getByRole('button', { name: /Show [\d,]+ pitch/ })).toContainText(
    count.toLocaleString('en-GB'),
  )
  // Counts follow the other filters: with floodlights on, the operator counts shrink or stay.
  const goals = dialog.locator('.pref-chip', { hasText: 'Goals' }).locator('.count')
  await expect(goals).toHaveText(/^[\d,]+$/)
  await expect(dialog.getByText('Add your group to filter by travel time.')).toBeVisible()
  await expect(dialog.getByLabel('Maximum travel time for any player')).toHaveCount(0)
  await closeFilters(page)
  await expect(page.locator('.list-title')).toContainText(count.toLocaleString('en-GB'))
})

test('an option that would leave nothing is switched off, not hidden', async ({ page }) => {
  // A published price of nothing per head leaves nobody: every operator chip goes to 0.
  await page.goto('/find?priced=1&budget=0')
  await expect(page.getByText(/No pitches match/)).toBeVisible()
  await openFilters(page)
  const dialog = page.getByRole('dialog', { name: 'Filters' })
  const goals = dialog.locator('.pref-chip', { hasText: 'Goals' })
  await expect(goals.locator('.count')).toHaveText('0')
  await expect(goals).toBeDisabled()
  await expect(dialog.getByLabel('Maximum travel time for any player')).toHaveCount(0)
})

test('the travel-time filter appears with a group', async ({ page }) => {
  await page.goto('/find?g=Sam~Peckham~51.4741~-0.0691~t')
  await expect(page.locator('.card').first()).toBeVisible()
  await openFilters(page)
  const dialog = page.getByRole('dialog', { name: 'Filters' })
  await expect(dialog.getByLabel('Maximum travel time for any player')).toBeVisible()
})
