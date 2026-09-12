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

    // The group in the URL travels with the game so the game page can show journeys.
    await page.goto('/p/pl-shoreditch?g=Sam~Peckham~51.4741~-0.0691~w')
    await page.getByRole('button', { name: 'Plan a game' }).click()
    await page.getByLabel('Date').fill('2026-10-01')
    await page.getByLabel('Kick-off').fill('19:30')
    await page.getByLabel(/Notes for the group/).fill('Bring bibs')
    await page.getByRole('button', { name: 'Create game link' }).click()

    await expect(page).toHaveURL(/\/g\/[0-9a-f]{20}$/)
    const gameUrl = page.url()

    // The HTML a chat app fetches for the link carries the game's own title and image.
    const html = await (await request.get(gameUrl)).text()
    expect(html).toMatch(
      /<meta property="og:title" content="Powerleague Shoreditch, Thu,? 1 Oct,? 19:30"/,
    )
    expect(html).toMatch(/<meta property="og:image" content="[^"]+\/og\/game\.png"/)
    expect(html).toMatch(
      /<meta property="og:description" content="Football at Powerleague Shoreditch[^"]*Bring bibs/,
    )
    await expect(page.getByRole('heading', { level: 1 })).toContainText('19:30')
    await expect(page.getByText('Bring bibs')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Powerleague Shoreditch' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Organiser' })).toBeVisible()
    await expect(page.getByText('Nobody has answered yet')).toBeVisible()
    // Journey times for the saved group, routed where the router answered.
    await expect(page.locator('.eta-list li')).toHaveCount(1)
    await expect(page.locator('.eta-list li').first()).toContainText('Sam from Peckham')
    await expect(page.locator('.eta-list li .src-tag').first()).toHaveText('route')

    // A friend with the link and no account.
    const ctx = await browser.newContext()
    const guest = await ctx.newPage()
    await guest.goto(gameUrl)
    await expect(guest.getByRole('heading', { name: 'Are you in?' })).toBeVisible()
    await guest.getByRole('button', { name: 'In', exact: true }).click()
    await expect(guest.getByRole('alert')).toContainText('Add your name')
    await guest.getByLabel('Your name').fill('Priya')
    await guest.getByRole('button', { name: 'In', exact: true }).click()
    await expect(guest.getByRole('heading', { name: 'Your answer: In' })).toBeVisible()
    await expect(guest.getByText('Priya (you)')).toBeVisible()
    // Changing the answer keeps one row per guest.
    await guest.getByRole('button', { name: 'Maybe' }).click()
    await expect(guest.getByRole('heading', { name: 'Your answer: Maybe' })).toBeVisible()
    await expect(guest.getByRole('heading', { name: '0 in, 1 answered' })).toBeVisible()
    // Reload: the phone remembers who they are.
    await guest.reload()
    await expect(guest.getByRole('heading', { name: 'Your answer: Maybe' })).toBeVisible()

    // The organiser sees the answer and moves the kick-off.
    await page.reload()
    await expect(page.getByText('Priya')).toBeVisible()
    await expect(page.getByRole('heading', { name: '0 in, 1 answered' })).toBeVisible()
    await page.getByRole('button', { name: 'Change time or notes' }).click()
    await page.getByLabel('Kick-off time').fill('20:00')
    await page.getByRole('button', { name: 'Save changes' }).click()
    await expect(page.getByRole('heading', { level: 1 })).toContainText('20:00')
    await expect(page.getByText(/Moved from .*19:30/)).toBeVisible()
    await expect(page.getByText('1 answer was given before the time changed')).toBeVisible()
    await expect(page.getByText('Priya (before the time changed)')).toBeVisible()

    // The guest who answered for 19:30 is told, and confirming clears the flag.
    await guest.reload()
    await expect(guest.getByText(/Moved from .*19:30/)).toBeVisible()
    await expect(guest.getByText('The kick-off moved after you answered')).toBeVisible()
    await guest.getByRole('button', { name: 'In', exact: true }).click()
    await expect(guest.getByRole('heading', { name: 'Your answer: In' })).toBeVisible()
    await expect(guest.getByText('The kick-off moved after you answered')).toHaveCount(0)
    await ctx.close()

    // The organiser cancels.
    await page.reload()
    await expect(page.getByRole('heading', { name: '1 in, 1 answered' })).toBeVisible()
    await expect(page.getByText('before the time changed')).toHaveCount(0)
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

  test('saving a pitch asks for sign-in, finishes the save on return, and persists', async ({
    page,
    request,
    baseURL,
  }) => {
    const email = `bob-${Date.now()}@example.com`
    await page.goto('/p/pl-shoreditch?g=Sam~Peckham~51.4741~-0.0691~w')
    await page.getByRole('button', { name: 'Save', exact: true }).click()
    const dialog = page.getByRole('dialog', { name: 'Sign in' })
    await expect(dialog).toContainText('Sign in to save pitches')
    await dialog.getByLabel(/Your name/).fill('Bob')
    await dialog.getByLabel('Email').fill(email)
    await dialog.getByRole('button', { name: 'Email me a sign-in link' }).click()
    await expect(dialog).toContainText('Check your inbox')

    // The app asked to come back to this very page, group included.
    const otp = await (await request.get(`${FAKE}/__test/last-otp`)).json()
    expect(otp.redirect_to).toBe(`${baseURL}/p/pl-shoreditch?g=Sam~Peckham~51.4741~-0.0691~w`)

    // The emailed link opens in a new tab, as it does from a mail app: the pitch
    // comes back with the group, signed in, and the save is finished.
    const res = await request.get(
      `${FAKE}/__test/magic-link?email=${encodeURIComponent(email)}&redirect=${encodeURIComponent(otp.redirect_to)}`,
    )
    const { url } = await res.json()
    const tab = await page.context().newPage()
    await tab.goto(url)
    await expect(tab.getByRole('button', { name: 'Saved' })).toBeVisible()
    await expect(tab.locator('.header-user')).toHaveText('Bob')
    await expect(tab).toHaveURL(/\/p\/pl-shoreditch\?g=Sam/)
    expect(new URL(tab.url()).hash).toBe('')
    await expect(tab.locator('.eta-list li')).toHaveCount(1)
    await tab.reload()
    await expect(tab.getByRole('button', { name: 'Saved' })).toBeVisible()
    await tab.goto('/me')
    await expect(tab.getByRole('heading', { name: 'Saved pitches' })).toBeVisible()
    await expect(tab.locator('.card-title', { hasText: 'Powerleague Shoreditch' })).toBeVisible()
    await tab.close()
  })

  test('a group can be saved and reused', async ({ page, request, baseURL }) => {
    await signIn(page, request, baseURL, `cara-${Date.now()}@example.com`)
    await page.goto('/find?g=Sam~Peckham~51.4741~-0.0691~t;Ali~Hackney~51.545~-0.0553~c')
    await page.getByRole('button', { name: '+ Add' }).click()
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
    // Details, directions and the report live behind one closed disclosure.
    await page.getByText('Details, directions and where the data comes from').click()
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
