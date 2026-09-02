import React from 'react'
import { useStore } from '../lib/store.jsx'
import { PitchCard } from './PitchCard.jsx'

export function ResultsList() {
  const { state, results } = useStore()
  const top = results.slice(0, 5)
  const rest = results.slice(5)

  return (
    <section className="results">
      <div className="results-head">
        <h2 className="panel-title">
          {state.squad.length
            ? `Best pitches for your ${state.squad.length}-player squad`
            : 'Top-rated pitches'}
        </h2>
        <span className="results-count">
          {results.length} pitch{results.length === 1 ? '' : 'es'} match
        </span>
      </div>

      {results.length === 0 ? (
        <div className="results-empty">
          <p>Nothing gets past those filters — that's a worldie of a save.</p>
          <p>Loosen the budget or travel time and try again.</p>
        </div>
      ) : (
        <>
          <div className="results-grid">
            {top.map((row, i) => (
              <PitchCard key={row.pitch.id} row={row} rank={i + 1} />
            ))}
          </div>
          {rest.length > 0 && (
            <details className="results-more">
              <summary>Show {rest.length} more matching pitch{rest.length === 1 ? '' : 'es'}</summary>
              <div className="results-grid">
                {rest.map((row) => (
                  <PitchCard key={row.pitch.id} row={row} />
                ))}
              </div>
            </details>
          )}
        </>
      )}
    </section>
  )
}
