import React from 'react'
import { useStore } from '../lib/store.jsx'
import { PITCH_TYPES } from '../data/types.js'

export function About() {
  const { state, actions } = useStore()
  const data = state.data

  return (
    <div className="about">
      <section className="about-hero">
        <h1>Every football pitch in London, on one map.</h1>
        <p>
          PitchFinder maps {data ? data.count.toLocaleString('en-GB') : 'thousands of'} places to
          play across Greater London: commercial five-a-side centres, bookable astro, park grass and
          free cages. It ranks them for your whole group by travel time, price and facilities.
        </p>
        <button className="btn primary" onClick={() => actions.go('/')}>
          Open the map
        </button>
      </section>

      <section className="about-grid">
        {Object.entries(PITCH_TYPES).map(([key, t]) => (
          <button
            key={key}
            className="about-type"
            onClick={() => {
              actions.setFilters({ types: [key] })
              actions.go('/')
            }}
          >
            <span className="about-type-head">
              <span className="type-dot lg" style={{ background: t.color }} />
              <strong>{t.label}</strong>
              {data?.byType?.[key] != null && (
                <span className="about-count">{data.byType[key].toLocaleString('en-GB')}</span>
              )}
            </span>
            <span className="about-blurb">{t.blurb}</span>
          </button>
        ))}
      </section>

      <section className="about-notes">
        <h2>Where the data comes from</h2>
        <p>
          Pitch locations and attributes come from{' '}
          <a href="https://www.openstreetmap.org/about" target="_blank" rel="noopener noreferrer">
            OpenStreetMap
          </a>{' '}
          (© OpenStreetMap contributors, ODbL) and are refreshed automatically every week. Bookable
          venues carry prices from their operators&rsquo; published rates, re-checked by an
          automated job; where a venue sets prices dynamically we say &ldquo;price on booking&rdquo;
          rather than guessing. Travel times are estimates from distance and typical speeds, always
          confirm details with the venue before travelling.
        </p>
        <p>
          Spotted a missing or misplaced pitch? Fix it on OpenStreetMap and it will appear here
          after the next refresh, that improves the map for everyone, not just this app.
        </p>
      </section>
    </div>
  )
}
