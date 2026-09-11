// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { extractPrices, pageText, summarisePrices } from '../../scripts/lib/prices.mjs'

describe('extractPrices', () => {
  it('keeps figures that say per hour or per session next to them', () => {
    const html = `<p>Pitch hire from &pound;45/hr off peak, £60 per hour peak.</p><p>Deposit £100.</p>
      <p>Get £15 off your first booking!</p><p>5-a-side game: £8 per person.</p><p>Casual session £40 per session.</p>`
    const found = extractPrices(html)
    expect(found.map((f) => [f.value, f.unit])).toEqual([
      [45, 'hour'],
      [60, 'hour'],
      [40, 'session'],
    ])
    expect(found[0].context).toContain('off peak')
  })
  it('ignores script and style content and figures outside a plausible range', () => {
    const html = `<script>var p = "£999 per hour";</script><style>.x{content:"£20/hr"}</style><div>£5 per hour</div><div>£300 per hour</div>`
    expect(extractPrices(html)).toEqual([])
  })
  it('returns nothing for a page with no unit next to any price', () => {
    expect(extractPrices('<p>Prices from £50. Book now. Membership £30.</p>')).toEqual([])
  })
})

describe('summarisePrices', () => {
  it('prefers hourly figures and reports the range', () => {
    const s = summarisePrices(
      [
        { value: 45, unit: 'hour', context: 'from £45/hr off peak' },
        { value: 60, unit: 'hour', context: '£60 per hour peak' },
        { value: 40, unit: 'session', context: '£40 per session' },
      ],
      { sourceUrl: 'https://example.com/p', checkedAt: '2026-09-11' },
    )
    expect(s).toMatchObject({
      perHour: 45,
      perSession: null,
      max: 60,
      unit: 'hour',
      sourceUrl: 'https://example.com/p',
    })
    expect(s.context).toContain('£45')
  })
  it('falls back to a session price and returns null with nothing found', () => {
    expect(summarisePrices([{ value: 40, unit: 'session', context: 'c' }])).toMatchObject({
      perHour: null,
      perSession: 40,
      max: null,
    })
    expect(summarisePrices([])).toBeNull()
  })
})

describe('pageText', () => {
  it('collapses markup to searchable text', () => {
    expect(pageText('<h1>Hi</h1>\n\n<p>a&nbsp;b &pound;5</p>')).toBe('Hi a b £5')
  })
})
