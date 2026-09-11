import { test, expect } from '@playwright/test'

const FAKE = `http://localhost:${process.env.FAKE_SUPABASE_PORT || 4177}`

async function signIn(page, request, baseURL, email) {
  const res = await request.get(
    `${FAKE}/__test/magic-link?email=${encodeURIComponent(email)}&redirect=${encodeURIComponent(`${baseURL}/`)}`,
  )
  const { url } = await res.json()
  await page.goto(url)
  await expect(page.locator('.header-user')).toBeVisible()
}

test.describe('accounts and shared games', () => {
  test.skip(!process.env.DATABASE_URL, 'needs Postgres behind the fake Supabase (DATABASE_URL)')

  test('organiser creates a game, a guest RSVPs from the link, the organiser sees it', async ({
    page,
    browser,
    request,
    baseURL,
  }) => {
    await signIn(page, request, baseURL, `alice-${Date.now()}@example.com`)

    await page.goto('/p/pl-shoreditch')
    await page.getByRole('button', { name: 'Plan a game' }).click()
    await page.getByLabel('Date').fill('2026-10-01')
    await page.getByLabel('Kick-off time').fill('19:30')
    await page.getByLabel('Notes').fill('Bring bibs')
    await page.getByRole('button', { name: 'Create game link' }).click()

    await expect(page).toHaveURL(/\/g\/[0-9a-f]{20}$/)
    const gameUrl = page.url()
    await expect(page.getByRole('heading', { level: 1 })).toContainText('19:30')
    await expect(page.getByText('Bring bibs')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Powerleague Shoreditch' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Organiser' })).toBeVisible()
    await expect(page.getByText('Nobody has answered yet')).toBeVisible()

    // A friend with the link and no account.
    const ctx = await browser.newContext()
    const guest = await ctx.newPage()
    await guest.goto(gameUrl)
    await expect(guest.getByRole('heading', { name: 'Are you in?' })).toBeVisible()
    await guest.getByRole('button', { name: 'In', exact: true }).click()
    await expect(guest.getByRole('alert')).toContainText('Add your name')
    await guest.getByLabel('Your name').fill('Priya')
    await guest.getByRole('button', { name: 'In', exact: true }).click()
    await expect(guest.getByRole('heading', { name: 'You are in' })).toBeVisible()
    await expect(guest.getByText('Priya (you)')).toBeVisible()
    // Changing the answer keeps one row per guest.
    await guest.getByRole('button', { name: 'Maybe' }).click()
    await expect(guest.getByRole('heading', { name: 'You are maybe' })).toBeVisible()
    await expect(guest.getByRole('heading', { name: '0 in, 1 answered' })).toBeVisible()
    // Reload: the phone remembers who they are.
    await guest.reload()
    await expect(guest.getByRole('heading', { name: 'You are maybe' })).toBeVisible()
    await ctx.close()

    // The organiser sees the answer, then cancels.
    await page.reload()
    await expect(page.getByText('Priya')).toBeVisible()
    await expect(page.getByRole('heading', { name: '0 in, 1 answered' })).toBeVisible()
    await page.getByRole('button', { name: 'Cancel game' }).click()
    await page.getByRole('button', { name: 'Yes, cancel it' }).click()
    await expect(page.getByText('cancelled by the organiser')).toBeVisible()

    // And it shows under My games.
    await page.goto('/me')
    await expect(page.getByRole('heading', { name: 'Your games' })).toBeVisible()
    await expect(page.getByText('Powerleague Shoreditch').first()).toBeVisible()
  })

  test('an unknown game link shows a designed not-found state', async ({ page }) => {
    await page.goto('/g/0123456789abcdef0123')
    await expect(page.getByText('Game not found')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Open the map' })).toBeVisible()
  })

  test('saving a pitch asks for sign-in, then persists across reloads', async ({
    page,
    request,
    baseURL,
  }) => {
    await page.goto('/p/pl-shoreditch')
    await page.getByRole('button', { name: 'Save', exact: true }).click()
    await expect(page.getByRole('dialog', { name: 'Sign in' })).toContainText(
      'Sign in to save pitches',
    )
    await page.getByRole('button', { name: 'Close' }).click()

    await signIn(page, request, baseURL, `bob-${Date.now()}@example.com`)
    await page.goto('/p/pl-shoreditch')
    await page.getByRole('button', { name: 'Save', exact: true }).click()
    await expect(page.getByRole('button', { name: 'Saved' })).toBeVisible()
    await page.reload()
    await expect(page.getByRole('button', { name: 'Saved' })).toBeVisible()
    await page.goto('/me')
    await expect(page.getByRole('heading', { name: 'Saved pitches' })).toBeVisible()
    await expect(page.locator('.card-title', { hasText: 'Powerleague Shoreditch' })).toBeVisible()
  })

  test('a group can be saved and reused', async ({ page, request, baseURL }) => {
    await signIn(page, request, baseURL, `cara-${Date.now()}@example.com`)
    await page.goto('/?g=Sam~Peckham~51.4741~-0.0691~t;Ali~Hackney~51.545~-0.0553~c')
    await page.getByRole('tab', { name: 'Your group' }).click()
    await page.getByRole('button', { name: 'Save this group' }).click()
    await page.getByLabel('Group name').fill('Thursday lot')
    await page.getByRole('button', { name: 'Save', exact: true }).click()
    await expect(page.getByText('Group saved')).toBeVisible()
    await page.goto('/me')
    await expect(page.getByText('Thursday lot')).toBeVisible()
    await page.getByRole('link', { name: 'Use' }).click()
    await expect(page).toHaveURL(/g=Sam/)
  })

  test('reporting a problem writes a report', async ({ page, request }) => {
    const before = (await (await request.get(`${FAKE}/__test/reports`)).json()).count
    await page.goto('/p/pl-shoreditch')
    await page.getByRole('button', { name: 'Report a problem with this pitch' }).click()
    await page.getByLabel('What is wrong?').selectOption('lit')
    await page.getByLabel('Details').fill('Lights were off at 8pm on Thursday.')
    await page.getByRole('button', { name: 'Send report' }).click()
    await expect(page.getByText('Thanks, report received.')).toBeVisible()
    const after = (await (await request.get(`${FAKE}/__test/reports`)).json()).count
    expect(after).toBe(before + 1)
  })
})

test('when the server is unreachable, browsing works and account actions say so', async ({
  page,
}) => {
  await page.route(`${FAKE}/**`, (route) => route.abort())
  await page.goto('/p/pl-shoreditch')
  await expect(
    page.getByRole('heading', { level: 1, name: 'Powerleague Shoreditch' }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Save', exact: true }).click()
  await page.getByLabel('Email').fill('someone@example.com')
  await page.getByRole('button', { name: 'Email me a sign-in link' }).click()
  await expect(page.getByRole('alert')).toContainText('Could not reach the server')
})
