import React, { useMemo } from 'react'
import { useStore } from '../lib/store.jsx'
import { BRANDS } from '../data/types.js'
import { DEFAULT_FILTERS, filterCounts } from '../lib/score.js'
import { DAYS } from '../lib/hours.js'

const DAY_LABEL = {
  mon: 'Mon',
  tue: 'Tue',
  wed: 'Wed',
  thu: 'Thu',
  fri: 'Fri',
  sat: 'Sat',
  sun: 'Sun',
}

/** How many filter controls differ from the default. */
export function countActiveFilters(f) {
  let n = 0
  n += f.types?.length || 0
  n += f.brands?.length || 0
  if (f.format != null) n++
  if (f.surface) n++
  if (f.maxPricePerHead != null) n++
  if (f.maxEta != null) n++
  if (f.needsFloodlights) n++
  if (f.needsCovered) n++
  if (f.needsChanging) n++
  if (f.needsParking) n++
  if (f.pricedOnly) n++
  if (f.openOn && (f.openOn.days?.length || f.openOn.from)) n++
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

const NEEDS = [
  ['needsFloodlights', 'Floodlights', 'evening games'],
  ['needsCovered', 'Under cover', 'rain or shine'],
  ['needsChanging', 'Changing rooms', 'showers after'],
  ['needsParking', 'Parking', 'coming by car'],
  ['pricedOnly', 'Published price', 'no surprises'],
]

export function Filters() {
  const { state, actions } = useStore()
  const f = state.filters
  // Live counts: what each option would leave, with the other filters as they are.
  const counts = useMemo(
    () => (state.data ? filterCounts(state.data.pitches, state.squad, f) : null),
    [state.data, state.squad, f],
  )
  const off = (n, selected) => counts != null && n === 0 && !selected
  const openOn = f.openOn || { days: null, from: null }
  const days = openOn.days || []

  function toggleBrand(brand) {
    const brands = f.brands.includes(brand)
      ? f.brands.filter((b) => b !== brand)
      : [...f.brands, brand]
    actions.setFilters({ brands })
  }
  function toggleDay(day) {
    const next = days.includes(day) ? days.filter((d) => d !== day) : [...days, day]
    const ordered = DAYS.filter((d) => next.includes(d))
    actions.setFilters({
      openOn:
        ordered.length || openOn.from
          ? { days: ordered.length ? ordered : null, from: openOn.from }
          : null,
    })
  }
  function setFrom(from) {
    actions.setFilters({
      openOn: days.length || from ? { days: days.length ? days : null, from } : null,
    })
  }

  return (
    <section className="stack filters">
      <fieldset className="filter-group">
        <legend>Where to play</legend>
        <div className="chip-row">
          {Object.entries(BRANDS).map(([key, b]) => {
            const on = f.brands.includes(key)
            return (
              <button
                key={key}
                type="button"
                className={`pref-chip brand-${key}${on ? ' on' : ''}`}
                aria-pressed={on}
                disabled={off(counts?.brands[key] ?? 1, on)}
                onClick={() => toggleBrand(key)}
              >
                {b.label} <Count n={counts?.brands[key]} />
              </button>
            )
          })}
        </div>
      </fieldset>

      <fieldset className="filter-group">
        <legend>Pitch size</legend>
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
          Size is known for operators&rsquo; venues; other pitches stay in.
        </p>
      </fieldset>

      <fieldset className="filter-group">
        <legend>Surface</legend>
        <div className="seg">
          {[
            [null, 'Any'],
            ['3g', '3G'],
            ['astro', 'Astro'],
          ].map(([value, label]) => (
            <button
              key={String(value)}
              className={f.surface === value ? 'active' : ''}
              disabled={off(counts?.surface[value ?? 'any'], f.surface === value)}
              onClick={() => actions.setFilters({ surface: value })}
            >
              {label} <Count n={counts?.surface[value ?? 'any']} />
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="filter-group">
        <legend>Must have</legend>
        <div className="chip-row">
          {NEEDS.map(([key, label, sub]) => {
            const on = !!f[key]
            return (
              <button
                key={key}
                type="button"
                className={`pref-chip${on ? ' on' : ''}`}
                aria-pressed={on}
                disabled={off(counts?.[key], on)}
                onClick={() => actions.setFilters({ [key]: !on })}
                title={sub}
              >
                {label} <Count n={counts?.[key]} />
              </button>
            )
          })}
        </div>
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
        <p className="hint dim">
          {state.squad.length > 1
            ? `The pitch price split ${state.squad.length} ways.`
            : 'Split between the people in your group.'}
        </p>
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
        <legend>When</legend>
        <div className="chip-row days" role="group" aria-label="Days">
          {DAYS.map((day) => {
            const on = days.includes(day)
            return (
              <button
                key={day}
                type="button"
                className={`pref-chip day${on ? ' on' : ''}`}
                aria-pressed={on}
                onClick={() => toggleDay(day)}
              >
                {DAY_LABEL[day]}
              </button>
            )
          })}
        </div>
        <div className="seg">
          {[
            [null, 'Any time'],
            ['19:00', 'Evenings'],
            ['12:00', 'Daytime'],
          ].map(([value, label]) => (
            <button
              key={String(value)}
              className={openOn.from === value ? 'active' : ''}
              onClick={() => setFrom(value)}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="hint dim">
          Places open then stay in. A place whose hours are not published stays in too, and says so.
        </p>
      </fieldset>
    </section>
  )
}

export { DEFAULT_FILTERS }
