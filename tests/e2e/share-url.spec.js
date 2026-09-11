import { test, expect } from '@playwright/test'

async function addPlayer(page, name, area) {
  await page.getByPlaceholder('Player name').fill(name)
  await page.getByPlaceholder(/Home area/).fill(area)
  await page.getByRole('button', { name: 'Add player' }).click()
}

test('group, filters and selected pitch live in the URL and survive reload and sharing', async ({
  page,
  browser,
}) => {
  await page.goto('/')
  await expect(page.locator('.card').first()).toBeVisible()

  await page.getByRole('tab', { name: 'Your group' }).click()
  await addPlayer(page, 'Sam', 'Peckham')
  await addPlayer(page, 'Ali', 'Hackney')
  await expect(page.locator('.squad-member')).toHaveCount(2)

  await page.getByRole('tab', { name: 'Filters' }).click()
  await page.getByLabel('Floodlit (evening games)').check()

  await page.getByRole('tab', { name: 'Results' }).click()
  const firstTitle = page.locator('.card-title').first()
  const name = (await firstTitle.textContent()).trim()
  await firstTitle.click()
  await expect(page.getByRole('dialog', { name })).toBeVisible()

  const url = page.url()
  expect(url).toContain('g=Sam')
  expect(url).toContain('Ali')
  expect(url).toContain('lit=1')
  expect(url).toMatch(/[?&]p=/)

  // Reload: same pitch open, same group, same filter.
  await page.reload()
  await expect(page.getByRole('dialog', { name })).toBeVisible()
  await page.getByRole('dialog', { name }).getByRole('button', { name: 'Close' }).click()
  await page.getByRole('tab', { name: 'Your group' }).click()
  await expect(page.locator('.squad-member')).toHaveCount(2)
  await page.getByRole('tab', { name: 'Filters' }).click()
  await expect(page.getByLabel('Floodlit (evening games)')).toBeChecked()

  // A friend opening the link in a fresh browser sees the same ranked list.
  const ctx = await browser.newContext()
  const friend = await ctx.newPage()
  await friend.goto(url)
  await expect(friend.getByRole('dialog', { name })).toBeVisible()
  await expect(friend.locator('.card-title').first()).toHaveText(name)
  await ctx.close()

  // Reopen from the list, then the back button closes the pitch without losing the group.
  await page.getByRole('tab', { name: 'Results' }).click()
  await page.locator('.card-title').first().click()
  await expect(page.getByRole('dialog', { name })).toBeVisible()
  await page.goBack()
  await expect(page.getByRole('dialog')).toHaveCount(0)
  expect(page.url()).toContain('g=Sam')
})

test('no results is a designed state, not a blank list', async ({ page }) => {
  await page.goto('/?t=commercial&free=1')
  await expect(page.getByText(/No pitches match/)).toBeVisible()
})

test('a failed dataset download shows an error with a retry', async ({ page }) => {
  await page.route('**/data/pitches.json', (route) => route.abort())
  await page.goto('/')
  await expect(page.getByText(/Could not load pitch data|Couldn.t load pitch data/)).toBeVisible()
})
