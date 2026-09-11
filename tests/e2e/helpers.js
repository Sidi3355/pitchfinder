import { expect } from '@playwright/test'

/** Open the group panel from the group bar (empty or with chips). */
export async function openGroup(page) {
  const cta = page.getByRole('button', { name: /Where is everyone coming from/ })
  if (await cta.isVisible().catch(() => false)) await cta.click()
  else await page.getByRole('button', { name: '+ Add' }).click()
  await expect(page.getByRole('dialog', { name: 'Your group' })).toBeVisible()
}

export async function addPlayer(page, name, area) {
  const dialog = page.getByRole('dialog', { name: 'Your group' })
  if (name) await dialog.getByPlaceholder('Player name').fill(name)
  await dialog.getByPlaceholder(/Home area/).fill(area)
  await dialog.getByRole('button', { name: 'Add player' }).click()
}

export async function closeGroup(page) {
  await page.getByRole('button', { name: /Rank for \d+ (person|people)/ }).click()
  await expect(page.getByRole('dialog', { name: 'Your group' })).toHaveCount(0)
}

export async function openFilters(page) {
  await page.getByRole('button', { name: /^Filters/ }).click()
  await expect(page.getByRole('dialog', { name: 'Filters' })).toBeVisible()
}

export async function closeFilters(page) {
  await page.getByRole('button', { name: /Show [\d,]+ pitch/ }).click()
  await expect(page.getByRole('dialog', { name: 'Filters' })).toHaveCount(0)
}
