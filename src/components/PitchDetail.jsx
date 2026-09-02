import React, { useEffect, useState } from 'react'
import { useStore } from '../lib/store.jsx'
import { getPitch, PITCH_TYPES } from '../data/pitches.js'
import { TRAVEL_MODES, estimateEta } from '../lib/geo.js'

export function PitchDetail() {
  const { state, actions } = useStore()
  const pitch = getPitch(state.selectedPitchId)
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
  const saved = state.user?.savedPitchIds?.includes(pitch.id)

  function planKickabout() {
    if (!state.user) {
      actions.openAuth('login')
      return
    }
    if (!date) return
    actions.createKickabout({
      pitchId: pitch.id,
      pitchName: pitch.name,
      date,
      time,
      notes: notes.trim(),
      squad: state.squad.map((f) => f.name),
    })
    setPlanning(false)
    actions.selectPitch(null)
    actions.go('game')
  }

  return (
    <div className="modal-scrim" onClick={() => actions.selectPitch(null)}>
      <div className="modal pitch-detail" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={pitch.name}>
        <header className="detail-head" style={{ '--accent': t.color }}>
          <div>
            <p className="detail-type" style={{ color: t.color }}>
              <span className="dot" style={{ background: t.color }} aria-hidden="true" />
              {t.label} · {pitch.borough}
            </p>
            <h2>{pitch.name}</h2>
            <p className="detail-area">{pitch.area}</p>
          </div>
          <button className="icon-btn big" onClick={() => actions.selectPitch(null)} aria-label="Close">
            ✕
          </button>
        </header>

        <div className="detail-facts">
          <span className="fact">
            {pitch.pricePerHour === 0 ? 'Free to play' : `£${pitch.pricePerHour}/hour`}
          </span>
          <span className="fact">
            {pitch.enclosure === 'bounded' ? 'Bounded — ball stays in' : 'Open pitch'}
          </span>
          <span className="fact">{pitch.surface}</span>
          <span className="fact">{pitch.formats.map((f) => `${f}-a-side`).join(', ')}</span>
          {pitch.floodlit && <span className="fact">Floodlit</span>}
          {pitch.indoor && <span className="fact">Indoor option</span>}
          {pitch.changingRooms && <span className="fact">Changing rooms</span>}
          <span className="fact">{pitch.bookable ? 'Bookable' : 'First come, first served'}</span>
        </div>

        {pitch.tags?.length > 0 && (
          <p className="detail-tags">{pitch.tags.map((tag) => `#${tag.replace(/\s+/g, '-')}`).join('  ')}</p>
        )}

        {state.squad.length > 0 && (
          <div className="detail-etas">
            <h3>Squad journey times</h3>
            <ul>
              {state.squad.map((f) => (
                <li key={f.id}>
                  <span>{TRAVEL_MODES[f.mode].emoji} {f.name}</span>
                  <span className="eta-dots" aria-hidden="true" />
                  <strong>{estimateEta(f, pitch, f.mode)} min</strong>
                </li>
              ))}
            </ul>
            <p className="detail-eta-note">Straight-line estimates — check a journey planner before kick-off.</p>
          </div>
        )}

        {planning ? (
          <div className="plan-form">
            <h3>Plan the kickabout</h3>
            <div className="plan-row">
              <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} aria-label="Date" />
              <input className="input" type="time" value={time} onChange={(e) => setTime(e.target.value)} aria-label="Kick-off time" />
            </div>
            <input
              className="input"
              placeholder="Notes (bring bibs, winner stays on…)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={120}
            />
            <div className="plan-actions">
              <button className="btn primary" onClick={planKickabout} disabled={!date}>
                Lock it in
              </button>
              <button className="btn ghost" onClick={() => setPlanning(false)}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="detail-actions">
            <button className="btn primary" onClick={() => setPlanning(true)}>
              Plan a kickabout here
            </button>
            <button className="btn ghost" onClick={() => actions.toggleSave(pitch.id)}>
              {saved ? '♥ Saved' : '♡ Save pitch'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
