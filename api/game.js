// Vercel function behind the rewrite /g/:slug -> /api/game?slug=:slug.
// Serves the app shell with the game's own title and Open Graph tags so the
// link unfurls in chat apps. Reads the game through the same public function
// the browser uses, with the anon key only.

import { fetchGame, renderGameHtml } from '../src/lib/game-html.js'

export default async function handler(req, res) {
  const slug = String(req.query?.slug || '').slice(0, 64)
  const proto = req.headers['x-forwarded-proto'] || 'https'
  const host = req.headers['x-forwarded-host'] || req.headers.host
  const siteUrl = process.env.SITE_URL || `${proto}://${host}`
  try {
    const [templateRes, payload] = await Promise.all([
      fetch(`${siteUrl}/`, { headers: { 'x-pitchfinder-shell': '1' } }),
      /^[a-z0-9-]{1,64}$/i.test(slug)
        ? fetchGame(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY, slug).catch(
            () => null,
          )
        : Promise.resolve(null),
    ])
    const template = await templateRes.text()
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=30, stale-while-revalidate=300')
    res.status(200).send(renderGameHtml(template, payload, { siteUrl, slug }))
  } catch (err) {
    res.setHeader('Content-Type', 'text/plain')
    res.status(500).send(`Could not render the game page: ${err.message}`)
  }
}
