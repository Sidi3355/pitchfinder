import React, { useState } from 'react'
import { useStore } from '../lib/store.jsx'
import { PitchCard } from './PitchCard.jsx'

const PAGE = 10

export function ResultsList() {
  const { state, results, actions } = useStore()
  // Paging resets whenever the result set changes materially.
  const resetKey = `${JSON.stringify(state.filters)}|${state.squad.length}`
  const [paging, setPaging] = useState({ key: resetKey, limit: PAGE })
  const limit = paging.key === resetKey ? paging.limit : PAGE
  const setLimit = (fn) => setPaging({ key: resetKey, limit: fn(limit) })

  if (!state.data) return null

  return (
    <section className="stack">
      {results.length === 0 ? (
        <div className="state-block" role="status">
          <p>
            <strong>No pitches match these filters.</strong>
          </p>
          <p>Try widening them, or start again.</p>
          <button className="btn ghost sm" onClick={actions.resetFilters}>
            Reset filters
          </button>
        </div>
      ) : (
        <>
          <div className="stack">
            {results.slice(0, limit).map((row, i) => (
              <PitchCard key={row.pitch.id} row={row} rank={i + 1} />
            ))}
          </div>
          {results.length > limit && (
            <button className="btn ghost" onClick={() => setLimit((l) => l + PAGE)}>
              Show more
            </button>
          )}
        </>
      )}
    </section>
  )
}
