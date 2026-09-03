import React, { useEffect, useState } from 'react'
import { useStore } from '../lib/store.jsx'
import { PITCH_TYPES, pitchName } from '../data/types.js'
import { TRAVEL_MODES, estimateEta } from '../lib/geo.js'
import { costOf, isBounded } from '../lib/data.js'
import { surfaceLabel } from './PitchCard.jsx'

export function PitchDetail() {
  const { state, pitchById, actions } = useStore()
  const pitch = pitchById.get(state.selectedPitchId)
  const [planning, setPlanning] = useState(false)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('19:00')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && actions.selectPitch(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [actions])

  if (!pitch) return null
  const t = PITCH_TYPES[pitch.type]
  const cost = costOf(pitch)
  const saved = state.user?.savedPitchIds?.includes(pitch.id)
  const name = pitchName(pitch)

  function planGame() {
    if (!state.user) {
      actions.openAuth('login')
      return
    }
    if (!date) return
    actions.createGame({
      pitchId: pitch.id,
      pitchName: name,
      date,
      time,
      notes: notes.trim(),
      squad: state.squad.map((f) => f.name),
    })
    setPlanning(false)
    actions.selectPitch(null)
    actions.go('profile')
  }

  return (
    <aside className="drawer" role="dialog" aria-label={name}>
      <header className="drawer-head">
        <div>
          <p className="drawer-type" style={{ color: t.color }}>
            <span className="type-dot" style={{ background: t.color }} />
            {t.label}
          </p>
          <h2>{name}</h2>
          <p className="drawer-sub">
            {[pitch.area, pitch.operator].filter(Boolean).join(' · ')}
          </p>
        </div>
        <button className="icon-btn" onClick={() => actions.selectPitch(null)} aria-label="Close">
          ✕
        </button>
      </header>

      <dl className="facts">
        <div>
          <dt>Price</dt>
          <dd>
            {!cost.known ? 'Set at booking' : cost.perHour === 0 ? 'Free' : `£${cost.perHour}/hour`}
            {pitch.priceMax != null && pitch.priceMax !== pitch.pricePerHour && ` – £${pitch.priceMax}`}
            {pitch.priceCheckedAt && (
              <span className="fact-note">
                checked {new Date(pitch.priceCheckedAt).toLocaleDateString('en-GB')}
              </span>
            )}
          </dd>
        </div>
        <div>
          <dt>Enclosure</dt>
          <dd>{isBounded(pitch) ? 'Bounded — ball stays in play' : 'Open pitch'}</dd>
        </div>
        {pitch.surface && (
          <div>
            <dt>Surface</dt>
            <dd>{surfaceLabel(pitch.surface)}</dd>
          </div>
        )}
        {Array.isArray(pitch.formats) && (
          <div>
            <dt>Formats</dt>
            <dd>{pitch.formats.map((f) => `${f}-a-side`).join(', ')}</dd>
          </div>
        )}
        <div>
          <dt>Floodlights</dt>
          <dd>{pitch.lit === true ? 'Yes' : pitch.lit === false ? 'No' : 'Not recorded'}</dd>
        </div>
        {pitch.changingRooms != null && (
          <div>
            <dt>Changing rooms</dt>
            <dd>{pitch.changingRooms ? 'Yes' : 'No'}</dd>
          </div>
        )}
        {pitch.pitchCount > 1 && (
          <div>
            <dt>Pitches on site</dt>
            <dd>{pitch.pitchCount}</dd>
          </div>
        )}
      </dl>

      {state.squad.length > 0 && (
        <section className="drawer-section">
          <h3>Journey times</h3>
          <ul className="eta-list">
            {state.squad.map((f) => (
              <li key={f.id}>
                <span>
                  {f.name} <span className="dim">({TRAVEL_MODES[f.mode].label.toLowerCase()})</span>
                </span>
                <span className="eta-dots" />
                <strong>{estimateEta(f, pitch, f.mode)} min</strong>
              </li>
            ))}
          </ul>
          <p className="hint dim">Estimates from straight-line distance — check a journey planner before you set off.</p>
        </section>
      )}

      {planning ? (
        <section className="drawer-section">
          <h3>Plan a game here</h3>
          <div className="row">
            <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} aria-label="Date" />
            <input className="input" type="time" value={time} onChange={(e) => setTime(e.target.value)} aria-label="Kick-off time" />
          </div>
          <input
            className="input"
            placeholder="Notes for the group (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={120}
          />
          <div className="row">
            <button className="btn primary" onClick={planGame} disabled={!date}>
              Confirm game
            </button>
            <button className="btn ghost" onClick={() => setPlanning(false)}>
              Cancel
            </button>
          </div>
        </section>
      ) : (
        <div className="drawer-actions">
          {pitch.bookingUrl && (
            <a className="btn primary" href={pitch.bookingUrl} target="_blank" rel="noopener noreferrer">
              Book at venue ↗
            </a>
          )}
          <button className="btn ghost" onClick={() => setPlanning(true)}>
            Plan a game
          </button>
          <button className="btn ghost" onClick={() => actions.toggleSave(pitch.id)}>
            {saved ? 'Saved ♥' : 'Save'}
          </button>
        </div>
      )}

      {!pitch.curated && (
        <p className="hint dim drawer-footnote">
          Sourced from OpenStreetMap. Details like lighting and surface reflect what's mapped —
          conditions on the ground can differ.
        </p>
      )}
    </aside>
  )
}
