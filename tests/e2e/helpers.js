import { expect } from '@playwright/test'

/** Open the group panel from the group bar (empty or with chips). */
export async function openGroup(page) {
  const cta = page.getByRole('button', { name: /Where is everyone coming from/ })
  if (await cta.isVisible().catch(() => false)) await cta.click()
  else await page.getByRole('button', { name: '+ Add' }).click()
  await expect(page.getByRole('dialog', { name: 'Your group' })).toBeVisible()
}

export async function addPlayer(page, name, place) {
  const dialog = page.getByRole('dialog', { name: 'Your group' })
  if (name) await dialog.getByPlaceholder('Name (optional)').fill(name)
  await dialog.getByPlaceholder(/Postcode or place/).fill(place)
  await dialog.getByRole('button', { name: 'Add player' }).click()
}

/** Canned postcodes.io answers so the flow is deterministic offline. */
export const POSTCODES = {
  'E8 3DL': {
    latitude: 51.5475,
    longitude: -0.0553,
    admin_ward: 'Dalston',
    admin_district: 'Hackney',
  },
  'SE15 4AB': {
    latitude: 51.4741,
    longitude: -0.0691,
    admin_ward: 'Rye Lane',
    admin_district: 'Southwark',
  },
}

export async function mockPostcodes(page) {
  await page.route('https://api.postcodes.io/**', (route) => {
    const url = new URL(route.request().url())
    const m = url.pathname.match(/^\/postcodes\/([^/]+)(\/autocomplete)?$/)
    if (!m) return route.fulfill({ status: 404, json: { status: 404 } })
    const code = decodeURIComponent(m[1]).toUpperCase()
    if (m[2]) {
      const list = Object.keys(POSTCODES).filter((k) =>
        k.replace(' ', '').startsWith(code.replace(' ', '')),
      )
      return route.fulfill({ json: { status: 200, result: list } })
    }
    const hit = POSTCODES[code]
    if (!hit)
      return route.fulfill({ status: 404, json: { status: 404, error: 'Postcode not found' } })
    return route.fulfill({ json: { status: 200, result: { postcode: code, ...hit } } })
  })
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
