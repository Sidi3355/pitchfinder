import React, { useMemo, useState } from 'react'
import { useStore } from '../lib/store.jsx'
import { useJourneys } from '../lib/use-journeys.js'
import { PitchCard } from './PitchCard.jsx'

const PAGE = 10

export function ResultsList() {
  const { state, results, actions } = useStore()
  // Paging resets whenever the result set changes materially.
  const resetKey = `${JSON.stringify(state.filters)}|${state.squad.length}`
  const [paging, setPaging] = useState({ key: resetKey, limit: PAGE })
  const limit = paging.key === resetKey ? paging.limit : PAGE
  const setLimit = (fn) => setPaging({ key: resetKey, limit: fn(limit) })
  // Real routes for the cards on screen only; the ranking itself uses estimates.
  const visible = useMemo(() => results.slice(0, limit), [results, limit])
  const visiblePitches = useMemo(() => visible.map((r) => r.pitch), [visible])
  const journeys = useJourneys(state.squad, visiblePitches)

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
            {visible.map((row, i) => (
              <PitchCard
                key={row.pitch.id}
                row={row}
                rank={state.squad.length ? i + 1 : null}
                journeys={journeys}
              />
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
