import React, { useEffect, useState } from 'react'
import { useStore } from '../lib/store.jsx'
import { PitchCard } from './PitchCard.jsx'

const PAGE = 10

export function ResultsList() {
  const { state, results } = useStore()
  const [limit, setLimit] = useState(PAGE)

  // Reset paging when the result set changes materially.
  useEffect(() => setLimit(PAGE), [state.filters, state.squad.length])

  if (!state.data) return null

  return (
    <section className="stack">
      <div className="row between">
        <h2 className="side-title">
          {state.squad.length ? `Best for your group of ${state.squad.length}` : 'Top-rated pitches'}
        </h2>
        <span className="hint dim">{results.length.toLocaleString('en-GB')} match</span>
      </div>

      {results.length === 0 ? (
        <div className="notice">No pitches match the current filters. Try widening them.</div>
      ) : (
        <>
          <div className="stack">
            {results.slice(0, limit).map((row, i) => (
              <PitchCard key={row.pitch.id} row={row} rank={i + 1} />
            ))}
          </div>
          {results.length > limit && (
            <button className="btn ghost" onClick={() => setLimit((l) => l + PAGE)}>
              Show more ({(results.length - limit).toLocaleString('en-GB')} remaining)
            </button>
          )}
        </>
      )}
    </section>
  )
}
