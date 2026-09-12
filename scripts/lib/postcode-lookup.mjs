// postcodes.io bulk lookup with a committed cache: postcode -> { lat, lng,
// region, district } or null when the postcode is not known. No key, no
// limits beyond politeness; 90 postcodes per request.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'

export async function lookupPostcodes(
  postcodes,
  { cacheFile, offline = false, userAgent = 'PitchFinderBot/1.0', fetchImpl = fetch } = {},
) {
  let cache = {}
  try {
    if (cacheFile && existsSync(cacheFile)) cache = JSON.parse(readFileSync(cacheFile, 'utf8'))
  } catch {
    cache = {}
  }
  const wanted = [...new Set(postcodes.filter((p) => p && !(p in cache)))]
  if (wanted.length && !offline) {
    for (let i = 0; i < wanted.length; i += 90) {
      const batch = wanted.slice(i, i + 90)
      try {
        const res = await fetchImpl('https://api.postcodes.io/postcodes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'User-Agent': userAgent },
          body: JSON.stringify({ postcodes: batch }),
        })
        const json = await res.json()
        for (const r of json.result || []) {
          cache[r.query] = r.result
            ? {
                lat: r.result.latitude,
                lng: r.result.longitude,
                region: r.result.region,
                district: r.result.admin_district,
              }
            : null
        }
      } catch (err) {
        console.warn(`postcodes.io: ${err.message}`)
      }
    }
    if (cacheFile) {
      mkdirSync(dirname(cacheFile), { recursive: true })
      writeFileSync(cacheFile, JSON.stringify(cache, null, 2) + '\n')
    }
  }
  return cache
}
