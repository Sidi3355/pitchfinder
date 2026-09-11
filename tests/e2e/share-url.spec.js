import { test, expect } from '@playwright/test'
import { addPlayer, closeFilters, closeGroup, openFilters, openGroup } from './helpers.js'

test('group, filters and selected pitch live in the URL and survive reload and sharing', async ({
  page,
  browser,
}) => {
  await page.goto('/')
  await expect(page.locator('.card').first()).toBeVisible()

  await openGroup(page)
  await addPlayer(page, 'Sam', 'Peckham')
  await addPlayer(page, 'Ali', 'Hackney')
  await closeGroup(page)
  await expect(page.locator('.chip-main')).toHaveCount(2)

  await openFilters(page)
  await page.getByLabel('Floodlit (evening games)').check()
  await closeFilters(page)
  await expect(page.getByRole('button', { name: /^Filters/ })).toContainText('1')

  const firstTitle = page.locator('.card-title').first()
  const name = (await firstTitle.textContent()).trim()
  await firstTitle.click()
  await expect(page.getByRole('heading', { level: 2, name })).toBeVisible()

  const url = page.url()
  expect(url).toContain('g=Sam')
  expect(url).toContain('Ali')
  expect(url).toContain('lit=1')
  expect(url).toMatch(/[?&]p=/)

  // Reload: same pitch open, same group, same filter.
  await page.reload()
  await expect(page.getByRole('heading', { level: 2, name })).toBeVisible()
  await expect(page.locator('.chip-main')).toHaveCount(2)
  await page
    .getByRole('button', { name: /Back to results|Close/ })
    .first()
    .click()
  await expect(page.getByRole('button', { name: /^Filters/ })).toContainText('1')

  // A friend opening the link in a fresh browser sees the same pitch and list.
  const ctx = await browser.newContext()
  const friend = await ctx.newPage()
  await friend.goto(url)
  await expect(friend.getByRole('heading', { level: 2, name })).toBeVisible()
  await expect(friend.locator('.chip-main')).toHaveCount(2)
  await ctx.close()

  // Reopen from the list; the back button closes the pitch without losing the group.
  await page.locator('.card-title').first().click()
  await expect(page.getByRole('heading', { level: 2, name })).toBeVisible()
  await page.goBack()
  await expect(page.getByRole('heading', { level: 2, name })).toHaveCount(0)
  expect(page.url()).toContain('g=Sam')
})

test('no results is a designed state with a way out', async ({ page }) => {
  await page.goto('/?t=commercial&free=1')
  await expect(page.getByText(/No pitches match/)).toBeVisible()
  await page.getByRole('button', { name: 'Reset filters' }).click()
  await expect(page.locator('.card').first()).toBeVisible()
})

test('a failed dataset download shows an error with a retry', async ({ page }) => {
  let fail = true
  await page.route(/\/data\/(index|pitches)\.json$/, (route) =>
    fail ? route.abort() : route.continue(),
  )
  await page.goto('/')
  await expect(page.getByText('Could not load pitch data.')).toBeVisible()
  fail = false
  await page.getByRole('button', { name: 'Try again' }).click()
  await expect(page.locator('.card').first()).toBeVisible()
})
