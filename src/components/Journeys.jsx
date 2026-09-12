// Journey times for a group to one pitch: a routed figure where OSRM (or TfL,
// when keyed) answered, the labelled estimate otherwise. Used by the pitch
// drawer, the pitch page and the game page.

import React, { useMemo } from 'react'
import { TRAVEL_MODES, displayMinutes, estimateEta } from '../lib/geo.js'
import { SOURCE_LABELS, SOURCE_SHORT } from '../lib/routing.js'
import { journeysFor, useJourneys } from '../lib/use-journeys.js'

export function SourceTag({ source }) {
  return (
    <span className="src-tag" title={SOURCE_LABELS[source]}>
      {SOURCE_SHORT[source]}
    </span>
  )
}

/** "23 min" for a route, "about 25 min" for an estimate. */
export function minutesText(minutes, source) {
  return source === 'estimate' ? `about ${displayMinutes(minutes)} min` : `${minutes} min`
}

/** One sentence per source in use, so the list never claims more than it knows. */
export function journeyNote(rows) {
  const sources = new Set(rows.map((r) => r.source))
  const parts = []
  if (sources.has('osrm'))
    parts.push('Routes are from OSRM over OpenStreetMap roads, door to door.')
  if (sources.has('tfl')) parts.push('Public transport times are from the TfL Journey Planner.')
  if (sources.has('estimate'))
    parts.push('Estimates are from straight-line distance and typical speeds.')
  parts.push('Check a journey planner before you set off.')
  return parts.join(' ')
}

export function JourneyList({ people, pitch, showFrom = false }) {
  const pitches = useMemo(() => [pitch], [pitch])
  const routed = useJourneys(people, pitches)
  const { rows } = journeysFor(people, pitch, routed, estimateEta)
  return (
    <>
      <ul className="eta-list">
        {rows.map(({ person, minutes, source }, i) => (
          <li key={person.id || `${person.name}-${i}`}>
            <span>
              {person.name}
              {showFrom && person.label ? (
                <span className="dim"> from {person.label}</span>
              ) : null}{' '}
              <span className="dim">
                ({(TRAVEL_MODES[person.mode]?.label || 'public transport').toLowerCase()})
              </span>
            </span>
            <span className="eta-dots" />
            <strong>{minutesText(minutes, source)}</strong>
            <SourceTag source={source} />
          </li>
        ))}
      </ul>
      <p className="hint dim">{journeyNote(rows)}</p>
    </>
  )
}
