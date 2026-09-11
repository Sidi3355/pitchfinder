import React from 'react'
import { useStore } from '../lib/store.jsx'
import { PITCH_TYPES, pitchName } from '../data/types.js'
import { surfaceLabel } from '../lib/labels.js'
import { displayMinutes } from '../lib/geo.js'
import { navigate } from '../lib/location.js'
import { Link } from './Link.jsx'

export function PitchCard({ row, rank }) {
  const { state, actions } = useStore()
  const { pitch, cost } = row
  const t = PITCH_TYPES[pitch.type]
  const saved = state.savedIds.has(pitch.id)
  const onFinder = state.route.name === 'find'
  const withGroup = row.etas.length > 0

  const price = !cost.known
    ? 'price not known'
    : cost.perHour === 0
      ? 'free'
      : `£${cost.perHour}/hr`
  const hasEstimate = row.reasons.some((r) => r.estimate)

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
          {withGroup && <> · up to about {displayMinutes(row.maxEta)} min</>}
        </p>

        {row.reasons.length > 0 && (
          <p className="card-reasons">
            {row.reasons.map((r) => r.text).join(' · ')}
            {hasEstimate && <span className="dim"> (est.)</span>}
          </p>
        )}
      </div>
    </article>
  )
}

export { surfaceLabel }
