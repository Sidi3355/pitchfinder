import React from 'react'
import { useStore } from '../lib/store.jsx'
import { PITCH_TYPES, pitchName } from '../data/types.js'
import { surfaceLabel } from '../lib/labels.js'
import { estimateEta } from '../lib/geo.js'
import { journeyReason, journeyStats } from '../lib/score.js'
import { journeysFor } from '../lib/use-journeys.js'
import { navigate } from '../lib/location.js'
import { Link } from './Link.jsx'
import { SourceTag, minutesText } from './Journeys.jsx'

const NO_JOURNEYS = new Map()

export function PitchCard({ row, rank, journeys = NO_JOURNEYS }) {
  const { state, actions } = useStore()
  const { pitch, cost } = row
  const t = PITCH_TYPES[pitch.type]
  const saved = state.savedIds.has(pitch.id)
  const onFinder = state.route.name === 'find'
  const withGroup = row.etas.length > 0
  // The card shows routed minutes where every member has a route, and the
  // ranking's estimates otherwise. The journey reason follows the same numbers.
  const journey = withGroup
    ? journeysFor(
        row.etas.map((e) => e.friend),
        pitch,
        journeys,
        estimateEta,
      )
    : null
  const stats = journey ? journeyStats(journey.rows.map((r) => r.minutes)) : null
  const journeySource = !journey
    ? null
    : !journey.routed
      ? 'estimate'
      : journey.rows.every((r) => r.source === 'tfl')
        ? 'tfl'
        : 'osrm'

  const price = !cost.known
    ? 'price not known'
    : cost.perHour === 0
      ? 'free'
      : `£${cost.perHour}/hr`
  // The meta line already says the price and the surface; reasons add what it does not.
  const reasons = row.reasons.filter((r) => !['free', 'astro', '3G'].includes(r.text))
  // Up to three people get their own minutes; a bigger group gets the one line
  // that sums it up ("everyone within 23 min").
  const perPerson = journey && journey.rows.length <= 3
  const summary =
    journey && !perPerson
      ? journeyReason({ ...stats, routed: journey.routed })?.text ||
        `up to ${minutesText(stats.maxEta, journeySource)}`
      : null

  function open() {
    if (onFinder) actions.selectPitch(pitch.id)
    else navigate(actions.pitchHref(pitch.id))
  }

  return (
    <article
      className="card clickable"
      onClick={(e) => {
        // The whole card opens the pitch; buttons and links inside keep their own jobs.
        if (e.target.closest('a, button')) return
        open()
      }}
    >
      <div className="card-main">
        <div className="card-title-row">
          {rank && <span className="rank">{rank}</span>}
          <Link
            className="card-title"
            href={actions.pitchHref(pitch.id)}
            onClick={(e) => {
              if (!onFinder) return
              e.preventDefault()
              actions.selectPitch(pitch.id)
            }}
          >
            {pitchName(pitch)}
          </Link>
          <button
            className={`save-btn ${saved ? 'saved' : ''}`}
            onClick={() => actions.toggleSave(pitch.id)}
            aria-label={
              saved ? `Saved. Remove ${pitchName(pitch)} from saved` : `Save ${pitchName(pitch)}`
            }
            aria-pressed={saved}
            title={state.user ? undefined : 'Sign in to save pitches'}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path
                d="M12 20.3 4.6 13a4.6 4.6 0 0 1 6.5-6.5l.9.9.9-.9a4.6 4.6 0 0 1 6.5 6.5Z"
                fill={saved ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <p className="card-meta">
          <span className="type-dot" style={{ background: t.color }} />
          {t.short}
          {pitch.postcode ? (
            <> · {pitch.postcode}</>
          ) : pitch.area && !(pitch.name || '').includes(pitch.area) ? (
            <> · {pitch.area}</>
          ) : null}
          {pitch.surface && <> · {surfaceLabel(pitch.surface)}</>}
          <> · {price}</>
        </p>

        {journey && (
          <p className="card-journey">
            {perPerson ? (
              journey.rows.map((r, i) => (
                <span key={r.person.id || i} className="card-journey-item">
                  {i > 0 && ' · '}
                  {r.person.name} {minutesText(r.minutes, r.source)} <SourceTag source={r.source} />
                </span>
              ))
            ) : (
              <>
                {summary} <SourceTag source={journeySource} />
              </>
            )}
          </p>
        )}

        {reasons.length > 0 && (
          <p className="card-reasons">{reasons.map((r) => r.text).join(' · ')}</p>
        )}
      </div>
    </article>
  )
}

export { surfaceLabel }
