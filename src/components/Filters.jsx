import React, { useMemo } from 'react'
import { useStore } from '../lib/store.jsx'
import { PITCH_TYPES } from '../data/types.js'
import { DEFAULT_FILTERS, filterCounts } from '../lib/score.js'

/** How many filter controls differ from the default. */
export function countActiveFilters(f) {
  let n = 0
  n += f.types?.length || 0
  if (f.enclosure !== DEFAULT_FILTERS.enclosure) n++
  if (f.format != null) n++
  if (f.maxPricePerHead != null) n++
  if (f.maxEta != null) n++
  if (f.needsFloodlights) n++
  if (f.freeOnly) n++
  if (f.bookableOnly) n++
  return n
}

/** "312" next to an option: how many pitches it would leave. */
function Count({ n }) {
  return n == null ? null : (
    <span className="count dim" aria-label={`${n} pitches`}>
      {n.toLocaleString('en-GB')}
    </span>
  )
}

export function Filters() {
  const { state, actions } = useStore()
  const f = state.filters
  // Live counts: what each option would leave, with the other filters as they are.
  const counts = useMemo(
    () => (state.data ? filterCounts(state.data.pitches, state.squad, f) : null),
    [state.data, state.squad, f],
  )
  const off = (n, selected) => counts != null && n === 0 && !selected

  function toggleType(type) {
    const types = f.types.includes(type) ? f.types.filter((t) => t !== type) : [...f.types, type]
    actions.setFilters({ types })
  }

  return (
    <section className="stack">
      <fieldset className="filter-group">
        <legend>Pitch type</legend>
        <div className="check-list">
          {Object.entries(PITCH_TYPES).map(([key, t]) => (
            <label
              key={key}
              className={`check-item ${off(counts?.types[key] ?? 1, f.types.includes(key)) ? 'off' : ''}`}
            >
              <input
                type="checkbox"
                checked={f.types.includes(key)}
                disabled={off(counts?.types[key] ?? 1, f.types.includes(key))}
                onChange={() => toggleType(key)}
              />
              <span className="type-dot" style={{ background: t.color }} />
              <span className="check-label">{t.label}</span>
              <Count n={counts?.types[key] ?? 0} />
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="filter-group">
        <legend>Enclosure</legend>
        <div className="seg">
          {[
            ['any', 'Any'],
            ['bounded', 'Caged / walled'],
            ['open', 'Open pitch'],
          ].map(([value, label]) => (
            <button
              key={value}
              className={f.enclosure === value ? 'active' : ''}
              disabled={off(counts?.enclosure[value], f.enclosure === value)}
              onClick={() => actions.setFilters({ enclosure: value })}
            >
              {label} <Count n={counts?.enclosure[value]} />
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="filter-group">
        <legend>Format</legend>
        <div className="seg">
          {[null, 5, 7, 11].map((format) => (
            <button
              key={String(format)}
              className={f.format === format ? 'active' : ''}
              disabled={off(counts?.format[format ?? 'any'], f.format === format)}
              onClick={() => actions.setFilters({ format })}
            >
              {format ? `${format}-a-side` : 'Any'} <Count n={counts?.format[format ?? 'any']} />
            </button>
          ))}
        </div>
        <p className="hint dim">
          Format is known for bookable venues; other pitches aren&rsquo;t excluded.
        </p>
      </fieldset>

      <fieldset className="filter-group">
        <legend>
          Budget per person{' '}
          <span className="legend-value">
            {f.maxPricePerHead != null ? `£${f.maxPricePerHead}` : 'any'}
          </span>
        </legend>
        <input
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
          aria-label="Maximum price per person per hour"
        />
      </fieldset>

      {state.squad.length > 0 ? (
        <fieldset className="filter-group">
          <legend>
            Max travel time{' '}
            <span className="legend-value">{f.maxEta != null ? `${f.maxEta} min` : 'any'}</span>
          </legend>
          <input
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
            aria-label="Maximum travel time for any player"
          />
          <p className="hint dim">Estimated for each person; nobody travels longer than this.</p>
        </fieldset>
      ) : (
        <p className="hint dim">Add your group to filter by travel time.</p>
      )}

      <fieldset className="filter-group">
        <legend>Requirements</legend>
        <div className="check-list">
          <label
            className={`check-item ${off(counts?.needsFloodlights, f.needsFloodlights) ? 'off' : ''}`}
          >
            <input
              type="checkbox"
              checked={f.needsFloodlights}
              disabled={off(counts?.needsFloodlights, f.needsFloodlights)}
              onChange={() => actions.setFilters({ needsFloodlights: !f.needsFloodlights })}
            />
            <span className="check-label">Floodlit (evening games)</span>
            <Count n={counts?.needsFloodlights} />
          </label>
          <label className={`check-item ${off(counts?.freeOnly, f.freeOnly) ? 'off' : ''}`}>
            <input
              type="checkbox"
              checked={f.freeOnly}
              disabled={off(counts?.freeOnly, f.freeOnly)}
              onChange={() => actions.setFilters({ freeOnly: !f.freeOnly })}
            />
            <span className="check-label">Free to play only</span>
            <Count n={counts?.freeOnly} />
          </label>
          <label className={`check-item ${off(counts?.bookableOnly, f.bookableOnly) ? 'off' : ''}`}>
            <input
              type="checkbox"
              checked={f.bookableOnly}
              disabled={off(counts?.bookableOnly, f.bookableOnly)}
              onChange={() => actions.setFilters({ bookableOnly: !f.bookableOnly })}
            />
            <span className="check-label">Bookable online only</span>
            <Count n={counts?.bookableOnly} />
          </label>
        </div>
      </fieldset>
    </section>
  )
}
