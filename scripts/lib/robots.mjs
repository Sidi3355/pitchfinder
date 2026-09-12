// Minimal robots.txt check: the Disallow rules in the User-agent: * group, or
// in a group that names us. Cached per origin for the run.

const cache = new Map()

export async function allowedByRobots(
  url,
  { fetchImpl = fetch, userAgent = 'PitchFinderBot' } = {},
) {
  const { origin, pathname } = new URL(url)
  if (!cache.has(origin)) {
    try {
      const res = await fetchImpl(`${origin}/robots.txt`, { headers: { 'User-Agent': userAgent } })
      cache.set(origin, res.ok ? await res.text() : '')
    } catch {
      cache.set(origin, '')
    }
  }
  const lines = cache
    .get(origin)
    .split('\n')
    .map((l) => l.trim())
  let applies = false
  const disallows = []
  for (const line of lines) {
    const [rawKey, ...rest] = line.split(':')
    const key = rawKey?.toLowerCase()
    const value = rest.join(':').trim()
    if (key === 'user-agent') applies = value === '*' || /pitchfinder/i.test(value)
    else if (applies && key === 'disallow' && value) disallows.push(value)
  }
  return !disallows.some((rule) => pathname.startsWith(rule.replace(/\*$/, '')))
}
