import React from 'react'
import { useStore } from '../lib/store.jsx'
import { PITCH_TYPES, pitchName } from '../data/types.js'
import { scoreToRating } from '../lib/score.js'
import { surfaceLabel } from '../lib/labels.js'
import { Link } from './Link.jsx'

export function PitchCard({ row, rank }) {
  const { state, actions } = useStore()
  const { pitch, cost } = row
  const t = PITCH_TYPES[pitch.type]
  const saved = state.user?.savedPitchIds?.includes(pitch.id)
  const onFinder = state.route.name === 'find'

  const price = !cost.known
    ? 'Price on booking'
    : cost.perHour === 0
      ? 'Free'
      : `£${cost.perHour}/hr`

  return (
    <article className="card">
      <div className="card-main">
        <div className="card-title-row">
          {rank && rank <= 3 && <span className="rank">{rank}</span>}
          <Link
            className="card-title"
            href={actions.pitchHref(pitch.id)}
            onClick={(e) => {
              // On the finder the pitch opens in the side drawer; elsewhere it is a page.
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
            aria-label={saved ? 'Remove from saved' : 'Save pitch'}
            aria-pressed={!!saved}
            title={state.user ? undefined : 'Sign in to save pitches'}
          >
            {saved ? '♥' : '♡'}
          </button>
        </div>

        <p className="card-meta">
          <span className="type-dot" style={{ background: t.color }} />
          {t.short}
          {pitch.area && <> · {pitch.area}</>}
          {pitch.surface && <> · {surfaceLabel(pitch.surface)}</>}
          {pitch.pitchCount > 1 && <> · {pitch.pitchCount} pitches</>}
        </p>

        <p className="card-facts">
          <strong>{price}</strong>
          {state.squad.length > 0 && (
            <>
              <span className="sep" />
              up to <strong>{row.maxEta} min</strong> away (est.)
            </>
          )}
          {pitch.lit === true && (
            <>
              <span className="sep" />
              floodlit
            </>
          )}
          <span className="sep" />
          fit <strong>{scoreToRating(row.score)}</strong>
        </p>

        {row.reasons.length > 0 && <p className="card-reasons">{row.reasons.join(' · ')}</p>}
      </div>
    </article>
  )
}

export { surfaceLabel }
