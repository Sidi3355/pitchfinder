import React from 'react'
import { useStore } from '../lib/store.jsx'
import { PITCH_TYPES } from '../data/pitches.js'

export function Filters() {
  const { state, actions } = useStore()
  const f = state.filters

  function toggleType(type) {
    const types = f.types.includes(type)
      ? f.types.filter((t) => t !== type)
      : [...f.types, type]
    actions.setFilters({ types })
  }

  return (
    <section className="panel">
      <div className="panel-head-row">
        <h2 className="panel-title">The vibe</h2>
        <button className="btn ghost small" onClick={actions.resetFilters}>
          Reset
        </button>
      </div>

      <label className="filter-label">Pitch type</label>
      <div className="chip-row">
        {Object.entries(PITCH_TYPES).map(([key, t]) => (
          <button
            key={key}
            className={`chip ${f.types.includes(key) ? 'chip-on' : ''}`}
            style={{ '--accent': t.color }}
            onClick={() => toggleType(key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <label className="filter-label">Caged or open?</label>
      <div className="chip-row">
        {[
          ['any', 'Any'],
          ['bounded', 'Bounded (caged / walled)'],
          ['unbounded', 'Unbounded (open)'],
        ].map(([value, label]) => (
          <button
            key={value}
            className={`chip ${f.enclosure === value ? 'chip-on' : ''}`}
            onClick={() => actions.setFilters({ enclosure: value })}
          >
            {label}
          </button>
        ))}
      </div>

      <label className="filter-label">Game format</label>
      <div className="chip-row">
        {[null, 5, 7, 11].map((format) => (
          <button
            key={String(format)}
            className={`chip ${f.format === format ? 'chip-on' : ''}`}
            onClick={() => actions.setFilters({ format })}
          >
            {format ? `${format}-a-side` : 'Any'}
          </button>
        ))}
      </div>

      <label className="filter-label" htmlFor="budget">
        Budget per head {f.maxPricePerHead != null ? `— £${f.maxPricePerHead}` : '— any'}
      </label>
      <input
        id="budget"
        className="slider"
        type="range"
        min="0"
        max="15"
        step="1"
        value={f.maxPricePerHead ?? 15}
        onChange={(e) => {
          const v = Number(e.target.value)
          actions.setFilters({ maxPricePerHead: v >= 15 ? null : v })
        }}
      />

      <label className="filter-label" htmlFor="maxeta">
        Max travel time {f.maxEta != null ? `— ${f.maxEta} min` : '— any'}
      </label>
      <input
        id="maxeta"
        className="slider"
        type="range"
        min="10"
        max="75"
        step="5"
        value={f.maxEta ?? 75}
        onChange={(e) => {
          const v = Number(e.target.value)
          actions.setFilters({ maxEta: v >= 75 ? null : v })
        }}
        disabled={!state.squad.length}
        title={state.squad.length ? '' : 'Add your squad first'}
      />

      <div className="chip-row toggles">
        <button
          className={`chip ${f.needsFloodlights ? 'chip-on' : ''}`}
          onClick={() => actions.setFilters({ needsFloodlights: !f.needsFloodlights })}
        >
          Floodlit (evening games)
        </button>
        <button
          className={`chip ${f.freeOnly ? 'chip-on' : ''}`}
          onClick={() => actions.setFilters({ freeOnly: !f.freeOnly })}
        >
          Free pitches only
        </button>
      </div>
    </section>
  )
}
