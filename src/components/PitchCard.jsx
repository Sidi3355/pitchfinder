import React from 'react'
import { useStore } from '../lib/store.jsx'
import { PITCH_TYPES } from '../data/pitches.js'
import { scoreToRating } from '../lib/score.js'

export function PitchCard({ row, rank }) {
  const { state, actions } = useStore()
  const { pitch } = row
  const t = PITCH_TYPES[pitch.type]
  const saved = state.user?.savedPitchIds?.includes(pitch.id)
  const rating = scoreToRating(row.score)

  return (
    <article className={`pitch-card ${rank ? 'pitch-card-top' : ''}`} style={{ '--accent': t.color }}>
      {rank && <span className="pitch-rank">#{rank}</span>}
      <header className="pitch-card-head">
        <button className="pitch-name" onClick={() => actions.selectPitch(pitch.id)}>
          {pitch.name}
        </button>
        <button
          className={`save-btn ${saved ? 'saved' : ''}`}
          onClick={() => actions.toggleSave(pitch.id)}
          aria-label={saved ? 'Remove from saved pitches' : 'Save pitch'}
          title={state.user ? '' : 'Log in to save pitches'}
        >
          {saved ? '♥' : '♡'}
        </button>
      </header>

      <p className="pitch-meta">
        <span className="dot" style={{ background: t.color }} aria-hidden="true" />
        <span className="pitch-type" style={{ color: t.color }}>
          {t.label}
        </span>
        <span>· {pitch.area}</span>
        <span>· {pitch.surface}</span>
      </p>

      <div className="pitch-stats">
        <span className="stat">
          <strong>{pitch.pricePerHour === 0 ? 'FREE' : `£${pitch.pricePerHour}`}</strong>
          {pitch.pricePerHour > 0 && <small>/hour</small>}
        </span>
        {state.squad.length > 0 && (
          <span className="stat">
            <strong>{row.maxEta}′</strong>
            <small>worst ETA</small>
          </span>
        )}
        <span className="stat">
          <strong>{pitch.formats.map((f) => `${f}s`).join(' ')}</strong>
          <small>formats</small>
        </span>
        <span className="stat squad-score" title="Squad Score — fit for your group">
          <strong>{rating}</strong>
          <small>score</small>
        </span>
      </div>

      {row.reasons.length > 0 && (
        <p className="pitch-reasons">{row.reasons.join(' · ')}</p>
      )}
    </article>
  )
}
