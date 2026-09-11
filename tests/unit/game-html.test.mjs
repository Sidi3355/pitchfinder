// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { renderGameHtml } from '../../src/lib/game-html.js'

const template = `<html><head><title>PitchFinder</title><meta name="description" content="x" /><link rel="canonical" href="https://example.com/" /><meta property="og:title" content="x" /><meta property="og:description" content="x" /><meta property="og:url" content="x" /><meta property="og:image" content="x" /></head><body><div id="root"></div></body></html>`

describe('renderGameHtml', () => {
  it('writes the game title, description, url and image into the shell', () => {
    const html = renderGameHtml(
      template,
      {
        game: {
          pitch_name: 'Powerleague Shoreditch',
          starts_at: '2026-10-01T18:30:00Z',
          status: 'scheduled',
          notes: 'Bring bibs',
        },
        rsvps: [{ status: 'in' }, { status: 'out' }],
      },
      { siteUrl: 'https://example.com/', slug: 'abc' },
    )
    expect(html).toMatch(/<title>Powerleague Shoreditch, Thu,? 1 Oct,? 19:30: PitchFinder<\/title>/)
    expect(html).toContain('<meta property="og:url" content="https://example.com/g/abc" />')
    expect(html).toContain('<meta property="og:image" content="https://example.com/og/game.png" />')
    expect(html).toMatch(
      /og:description" content="Football at Powerleague Shoreditch, Thu,? 1 Oct,? 19:30\. 1 in so far\. Say in, maybe or out\. Bring bibs"/,
    )
    expect(html).toMatch(/<h1>Powerleague Shoreditch, Thu,? 1 Oct,? 19:30<\/h1>/)
    expect(html).toContain('noindex')
  })
  it('escapes markup in names and handles a cancelled game and a missing one', () => {
    const html = renderGameHtml(
      template,
      {
        game: { pitch_name: '<b>x</b>', starts_at: '2026-10-01T18:30:00Z', status: 'cancelled' },
        rsvps: [],
      },
      { siteUrl: 'https://e.com', slug: 's' },
    )
    expect(html).toContain('Cancelled: &lt;b&gt;x&lt;/b&gt;')
    const missing = renderGameHtml(template, null, { siteUrl: 'https://e.com', slug: 's' })
    expect(missing).toContain('<title>Game not found: PitchFinder</title>')
  })
})
