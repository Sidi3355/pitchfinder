// Media query as a React external store: re-renders when it flips.

import { useSyncExternalStore } from 'react'

const queries = new Map()

function get(query) {
  if (!queries.has(query)) queries.set(query, window.matchMedia(query))
  return queries.get(query)
}

export function useMediaQuery(query) {
  return useSyncExternalStore(
    (listener) => {
      const mql = get(query)
      mql.addEventListener('change', listener)
      return () => mql.removeEventListener('change', listener)
    },
    () => get(query).matches,
    () => false,
  )
}

export const MOBILE_QUERY = '(max-width: 859px)'
export const DARK_QUERY = '(prefers-color-scheme: dark)'
