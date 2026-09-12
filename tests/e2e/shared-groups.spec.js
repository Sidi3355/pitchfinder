import { test, expect } from '@playwright/test'
import { mockPostcodes } from './helpers.js'

// Shared groups: the organiser creates a link, everyone adds themselves from
// their own phone, and the picks and the map are for the whole group.

const FAKE = `http://localhost:${process.env.FAKE_SUPABASE_PORT || 4177}`

async function signIn(page, request, baseURL, email) {
  const res = await request.get(
    `${FAKE}/__test/magic-link?email=${encodeURIComponent(email)}&redirect=${encodeURIComponent(`${baseURL}/`)}`,
  )
  const { url } = await res.json()
  await page.goto(url)
  await expect(page.locator('.header-user')).toBeVisible()
}

test.describe('shared groups', () => {
  test.skip(!process.env.DATABASE_URL, 'needs Postgres behind the fake Supabase (DATABASE_URL)')

  test('organiser shares a link, a guest adds themselves, and the map ranks for both', async ({
    page,
    browser,
    request,
    baseURL,
  }) => {
    await mockPostcodes(page)
    await signIn(page, request, baseURL, `sam-${Date.now()}@example.com`)

    // From the finder's group panel: one button makes the link.
    await page.goto('/find')
    await page.getByRole('button', { name: /Where is everyone coming from/ }).click()
    await page.getByRole('button', { name: 'Create a group link' }).click()
    await expect(page).toHaveURL(/\/group\/[0-9a-f]{20}$/)
    const groupUrl = page.url()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Football')
    await expect(page.getByRole('heading', { name: 'Nobody in yet' })).toBeVisible()

    // The organiser adds themselves like anyone else.
    await page.getByLabel('Your name').fill('Sam')
    await page.getByLabel('Where are you coming from?').fill('SE15 4AB')
    await page.getByRole('radio', { name: 'Walk' }).click()
    await page.getByRole('button', { name: 'Add me' }).click()
    await expect(page.getByRole('heading', { name: '1 person in' })).toBeVisible()
    await expect(page.locator('.member-row.you')).toContainText('Sam')
    await expect(page.locator('.member-row.you')).toContainText('SE15 4AB')
    await expect(page.getByRole('heading', { name: 'Best pitches for everyone' })).toBeVisible()
    await expect(page.locator('.pick')).toHaveCount(3)

    // A friend with the link and no account adds themselves, with preferences.
    const ctx = await browser.newContext()
    const guest = await ctx.newPage()
    await mockPostcodes(guest)
    await guest.goto(groupUrl)
    await expect(guest.getByRole('heading', { name: 'Add yourself' })).toBeVisible()
    await expect(guest.getByRole('heading', { name: '1 person in' })).toBeVisible()
    await guest.getByLabel('Your name').fill('Priya')
    await guest.getByLabel('Where are you coming from?').fill('E8 3DL')
    await guest.getByLabel('Budget').selectOption('8')
    await guest.getByRole('button', { name: 'Floodlights' }).click()
    await guest.getByRole('button', { name: 'Add me' }).click()
    await expect(guest.getByRole('heading', { name: '2 people in' })).toBeVisible()
    await expect(guest.locator('.member-row.you')).toContainText('up to £8 each · floodlights')
    await expect(guest.locator('.needs-list')).toContainText('Up to £8 each')
    await expect(guest.locator('.needs-list')).toContainText('Floodlights')
    // Their phone remembers them: a reload shows their own entry, not the form.
    await guest.reload()
    await expect(guest.getByRole('heading', { name: 'You' })).toBeVisible()
    await expect(guest.getByRole('button', { name: 'Change' })).toBeVisible()

    // The map for the whole group: both chips, the collated filters, and a pitch page that keeps the group.
    await guest.getByRole('link', { name: 'See all pitches on the map' }).click()
    await expect(guest).toHaveURL(/\/find\?grp=[0-9a-f]{20}&budget=8&lit=1$/)
    await expect(guest.locator('.chip:not(.add)')).toHaveCount(2)
    await expect(guest.locator('.chip', { hasText: 'Priya (you)' })).toBeVisible()
    await expect(guest.getByText('ranked for your group of 2')).toBeVisible()
    await expect(guest.getByRole('link', { name: 'Edit my details' })).toBeVisible()
    await expect(guest.locator('.chip-x')).toHaveCount(0)
    await guest.locator('.card-title').first().click()
    await expect(guest.locator('.eta-list li')).toHaveCount(2)
    await ctx.close()

    // The organiser sees Priya, and can take someone out.
    await page.reload()
    await expect(page.getByRole('heading', { name: '2 people in' })).toBeVisible()
    page.once('dialog', (d) => d.accept())
    await page.getByRole('button', { name: 'Remove Priya from the group' }).click()
    await expect(page.getByRole('heading', { name: '1 person in' })).toBeVisible()

    // And the group is listed under My games.
    await page.goto('/me')
    await expect(page.getByRole('heading', { name: 'Your groups' })).toBeVisible()
    await expect(page.getByText('1 in: Sam')).toBeVisible()
  })

  test('an unknown group link shows a designed not-found state', async ({ page }) => {
    await page.goto('/group/0123456789abcdef0123')
    await expect(page.getByText('This link does not match a group.')).toBeVisible()
    await page.goto('/find?grp=0123456789abcdef0123')
    await expect(page.getByText('This group link does not match a group')).toBeVisible()
  })
})

test('a selected pitch is highlighted in the list and its details stay folded', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'the phone shows the pitch in the sheet instead of the list')
  await page.goto('/find')
  const first = page.locator('.card').first()
  await first.locator('.card-title').click()
  await expect(first).toHaveClass(/selected/)
  await expect(first).toHaveAttribute('aria-current', 'true')
  await expect(page.locator('.card.selected')).toHaveCount(1)
  const details = page.locator('.drawer .pitch-more')
  await expect(details).toBeVisible()
  await expect(details).not.toHaveAttribute('open', '')
  await expect(page.locator('.drawer .facts')).toBeHidden()
  await page.locator('.card').nth(1).locator('.card-title').click()
  await expect(page.locator('.card.selected')).toHaveCount(1)
  await expect(page.locator('.card').nth(1)).toHaveClass(/selected/)
})
