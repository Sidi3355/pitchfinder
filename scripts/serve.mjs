// Static server that behaves like the Vercel deployment: clean URLs
// (/p/abc serves p/abc.html), directory indexes, gzip for text, immutable
// caching for hashed assets, and index.html as the fallback for app routes.
// Used by Playwright and Lighthouse so tests see what users see.

import { createServer } from 'node:http'
import { createReadStream, existsSync, statSync } from 'node:fs'
import { extname, join, normalize } from 'node:path'
import { createGzip } from 'node:zlib'

const args = process.argv.slice(2)
const port = Number(args[args.indexOf('--port') + 1] || process.env.PORT || 4173)
const root = args.includes('--root')
  ? args[args.indexOf('--root') + 1]
  : new URL('../dist', import.meta.url).pathname

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.woff2': 'font/woff2',
}
const COMPRESSIBLE = new Set([
  '.html',
  '.js',
  '.mjs',
  '.css',
  '.json',
  '.svg',
  '.txt',
  '.xml',
  '.webmanifest',
])

function resolve(pathname) {
  const safe = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, '')
  const candidates = [safe, `${safe}.html`, join(safe, 'index.html')]
  for (const c of candidates) {
    const full = join(root, c)
    if (full.startsWith(root) && existsSync(full) && statSync(full).isFile()) return full
  }
  return null
}

const server = createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${port}`)
  let file = resolve(url.pathname)
  let status = 200
  if (!file) {
    // App routes fall back to the SPA shell; missing files with an extension are 404.
    if (extname(url.pathname)) {
      status = 404
      file = join(root, '404.html')
      if (!existsSync(file)) {
        res.writeHead(404, { 'Content-Type': 'text/plain' })
        res.end('Not found')
        return
      }
    } else {
      file = join(root, 'index.html')
    }
  }
  const ext = extname(file)
  const headers = { 'Content-Type': TYPES[ext] || 'application/octet-stream' }
  if (url.pathname.startsWith('/assets/'))
    headers['Cache-Control'] = 'public, max-age=31536000, immutable'
  else headers['Cache-Control'] = 'public, max-age=0, must-revalidate'
  const gzip = COMPRESSIBLE.has(ext) && /\bgzip\b/.test(req.headers['accept-encoding'] || '')
  if (gzip) headers['Content-Encoding'] = 'gzip'
  res.writeHead(status, headers)
  const stream = createReadStream(file)
  if (gzip) stream.pipe(createGzip()).pipe(res)
  else stream.pipe(res)
})

server.listen(port, () => console.log(`serving ${root} on http://localhost:${port}`))
