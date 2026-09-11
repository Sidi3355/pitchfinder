// Routed journey minutes for a few people to a few pitches, fetched after
// render and cached, so cards and pitch pages can show a real route where a
// router answered and the labelled estimate everywhere else. Ranking never
// waits for this: it runs on estimates so the list is instant.

import { useEffect, useMemo, useState } from 'react'
import { journeyTimes } from './routing.js'

const r4 = (n) => Math.round(n * 1e4) / 1e4

/** Key for one person's journey to one pitch, by where they are and how they travel. */
export function journeyKey(person, pitch) {
  return `${r4(person.lat)},${r4(person.lng)},${person.mode || 'transit'}|${pitch.id}`
}

const EMPTY = new Map()

/**
 * @param people [{ lat, lng, mode }]
 * @param pitches [{ id, lat, lng }] the few on screen, never the whole list
 * @returns Map<journeyKey, { minutes, source, mode }> with routed results only
 */
export function useJourneys(people, pitches) {
  const [routed, setRouted] = useState(EMPTY)
  // Content keys, so a fresh array with the same members does not refetch.
  const peopleKey = useMemo(
    () => JSON.stringify(people.map((p) => [r4(p.lat), r4(p.lng), p.mode || 'transit'])),
    [people],
  )
  const pitchKey = useMemo(
    () => JSON.stringify(pitches.map((p) => [p.id, p.lat, p.lng])),
    [pitches],
  )

  useEffect(() => {
    const ppl = JSON.parse(peopleKey).map(([lat, lng, mode]) => ({ lat, lng, mode }))
    const pts = JSON.parse(pitchKey).map(([id, lat, lng]) => ({ id, lat, lng }))
    if (!ppl.length || !pts.length) return undefined
    const ctrl = new AbortController()
    const timer = setTimeout(async () => {
      const found = []
      await Promise.all(
        ppl.map(async (person) => {
          const times = await journeyTimes(person, pts, person.mode, {
            signal: ctrl.signal,
          }).catch(() => new Map())
          for (const [id, value] of times) {
            if (value.source !== 'estimate') found.push([journeyKey(person, { id }), value])
          }
        }),
      )
      if (ctrl.signal.aborted || !found.length) return
      setRouted((prev) => {
        if (found.every(([k, v]) => prev.get(k)?.minutes === v.minutes)) return prev
        const next = new Map(prev)
        for (const [k, v] of found) next.set(k, v)
        return next
      })
    }, 200)
    return () => {
      clearTimeout(timer)
      ctrl.abort()
    }
  }, [peopleKey, pitchKey])

  return routed
}

/**
 * Minutes for each person to a pitch: the routed value where there is one,
 * else the estimate. `routed` is true only when every person has a route.
 */
export function journeysFor(people, pitch, routed, estimate) {
  const rows = people.map((person) => {
    const hit = routed.get(journeyKey(person, pitch))
    return hit
      ? { person, minutes: hit.minutes, source: hit.source }
      : { person, minutes: estimate(person, pitch, person.mode), source: 'estimate' }
  })
  return { rows, routed: rows.length > 0 && rows.every((r) => r.source !== 'estimate') }
}
