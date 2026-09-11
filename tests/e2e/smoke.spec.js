import { test, expect } from '@playwright/test'

test('home loads the dataset and shows a ranked list', async ({ page }) => {
  const errors = []
  page.on('console', (msg) => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      errors.push(`${msg.type()}: ${msg.text()}`)
    }
  })
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /^Pitches$|Best for your group/ })).toBeVisible()
  await expect(page.locator('.card').first()).toBeVisible()
  test.info().annotations.push({ type: 'console', description: errors.join('\n') || 'none' })
})
