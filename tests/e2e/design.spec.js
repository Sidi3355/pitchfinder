import { test, expect } from '@playwright/test'
import { addPlayer, closeGroup, openGroup } from './helpers.js'

// Gates Q7 and Q8: dark mode reaches the page and the map; focus is visible;
// every interactive control on a phone is at least 44 px tall (and wide when
// it has no text).

test('dark mode applies to the page and the map', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto('/find')
  await expect(page.locator('.card').first()).toBeVisible()
  const bodyBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor)
  // Dark background: every channel under 40.
  const [r, g, b] = bodyBg.match(/\d+/g).map(Number)
  expect(Math.max(r, g, b)).toBeLessThan(40)
  const canvas = page.locator('.map-dark .maplibregl-canvas').first()
  await expect(canvas).toBeAttached()
  const filter = await canvas.evaluate((el) => getComputedStyle(el).filter)
  expect(filter).toContain('invert(1)')
  const mapBg = await page
    .locator('.map-pane')
    .evaluate((el) => getComputedStyle(el).backgroundColor)
  expect(Math.max(...mapBg.match(/\d+/g).map(Number))).toBeLessThan(60)
})

test('keyboard focus is visible on every focused control', async ({ page }) => {
  await page.goto('/find')
  await expect(page.locator('.card').first()).toBeVisible()
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press('Tab')
    const info = await page.evaluate(() => {
      const el = document.activeElement
      const cs = getComputedStyle(el)
      return {
        tag: el.tagName,
        label: (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 30),
        outline: cs.outlineStyle,
        width: cs.outlineWidth,
        shadow: cs.boxShadow,
      }
    })
    if (info.tag === 'BODY') continue
    // Our ring is a 2 px solid outline; MapLibre's own controls use a box shadow.
    const ring =
      (info.outline === 'solid' && parseFloat(info.width) >= 2) ||
      (info.shadow && info.shadow !== 'none')
    expect(ring, `focus ring on ${info.tag} "${info.label}": ${JSON.stringify(info)}`).toBe(true)
  }
})

test('mobile controls are at least 44 px', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'touch target sizes are a phone gate')
  const check = async (label) => {
    const boxes = await page.evaluate(() => {
      const sel = 'a[href], button, input, select, textarea, [role="button"]'
      const out = []
      for (const el of document.querySelectorAll(sel)) {
        const r = el.getBoundingClientRect()
        const cs = getComputedStyle(el)
        if (r.width === 0 || r.height === 0 || cs.visibility === 'hidden' || cs.display === 'none')
          continue
        if (el.closest('.maplibregl-ctrl, .maplibregl-popup')) continue // MapLibre's own controls
        if (el.type === 'range' || el.type === 'checkbox') continue // hit area comes from the row
        const text = (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 40)
        out.push({
          text,
          tag: el.tagName,
          w: Math.round(r.width),
          h: Math.round(r.height),
          inline: cs.display === 'inline',
        })
      }
      return out
    })
    const small = boxes.filter((b) => b.h < 44 || (b.w < 44 && !b.text))
    expect(small, `${label}: ${JSON.stringify(small)}`).toEqual([])
  }
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await check('landing')
  await page.goto('/find')
  await expect(page.locator('.card').first()).toBeVisible()
  await check('finder')
  await openGroup(page)
  await check('group panel')
  await addPlayer(page, 'Sam', 'Peckham')
  await check('group panel with a player')
  await closeGroup(page)
  await page.locator('.card-title').first().click()
  await expect(page.locator('.pitch-sheet')).toBeVisible()
  await check('pitch sheet')
  await page.goto('/p/pl-shoreditch')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await check('pitch page')
  await page.goto('/g/0123456789abcdef0123')
  await expect(page.getByText('Game not found')).toBeVisible()
  await check('game not found')
})
