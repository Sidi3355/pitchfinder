// Server-side HTML for a game link: the app shell with the game's title,
// description and Open Graph tags, so the link unfurls in WhatsApp and
// iMessage. Used by api/game.js on Vercel and by scripts/serve.mjs in tests.
// Plain ESM, no React, no DOM.

const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

export function formatWhenServer(iso) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return 'time to be confirmed'
  const day = d.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: 'Europe/London',
  })
  const time = d.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/London',
  })
  return `${day}, ${time}`
}

function setMeta(html, attr, name, content) {
  const re = new RegExp(`<meta\\s+${attr}="${name}"\\s+content="[^"]*"\\s*/?>`)
  return re.test(html)
    ? html.replace(re, `<meta ${attr}="${name}" content="${esc(content)}" />`)
    : html
}

/**
 * @param template the built index.html
 * @param payload  the game_by_slug result ({ game, rsvps }) or null
 * @param opts     { siteUrl, slug }
 */
export function renderGameHtml(template, payload, { siteUrl, slug }) {
  const url = `${siteUrl.replace(/\/$/, '')}/g/${slug}`
  if (!payload?.game) {
    let html = template.replace(
      /<title>[^<]*<\/title>/,
      '<title>Game not found: PitchFinder</title>',
    )
    html = setMeta(html, 'property', 'og:url', url)
    return html.replace('</head>', '<meta name="robots" content="noindex" /></head>')
  }
  const { game, rsvps = [] } = payload
  const when = formatWhenServer(game.starts_at)
  const cancelled = game.status === 'cancelled'
  const inCount = rsvps.filter((r) => r.status === 'in').length
  const title = cancelled ? `Cancelled: ${game.pitch_name}, ${when}` : `${game.pitch_name}, ${when}`
  const description = cancelled
    ? 'This game has been cancelled by the organiser.'
    : `Football at ${game.pitch_name}, ${when}. ${inCount ? `${inCount} in so far. ` : ''}Say in, maybe or out.${game.notes ? ` ${game.notes}` : ''}`.slice(
        0,
        200,
      )
  let html = template
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}: PitchFinder</title>`)
  html = html.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${esc(url)}" />`,
  )
  html = setMeta(html, 'name', 'description', description)
  html = setMeta(html, 'property', 'og:title', title)
  html = setMeta(html, 'property', 'og:description', description)
  html = setMeta(html, 'property', 'og:url', url)
  html = setMeta(html, 'property', 'og:image', `${siteUrl.replace(/\/$/, '')}/og/game.png`)
  html = html.replace('</head>', '<meta name="robots" content="noindex" /></head>')
  const summary = `<main class="prerender"><h1>${esc(title)}</h1><p>${esc(description)}</p><p><a href="/">PitchFinder</a></p></main>`
  return html.replace(/<div id="root"><\/div>/, `<div id="root">${summary}</div>`)
}

/** Fetch a game through the public function with the anon key. */
export async function fetchGame(supabaseUrl, anonKey, slug, fetchImpl = globalThis.fetch) {
  if (!supabaseUrl || !anonKey) return null
  const res = await fetchImpl(`${supabaseUrl.replace(/\/$/, '')}/rest/v1/rpc/game_by_slug`, {
    method: 'POST',
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ p_slug: slug, p_guest_key: null }),
  })
  if (!res.ok) return null
  return res.json()
}
