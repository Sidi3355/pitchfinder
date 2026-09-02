import React from 'react'
import { useStore } from '../lib/store.jsx'
import { getPitch, PITCH_TYPES } from '../data/pitches.js'
import { PitchCard } from './PitchCard.jsx'

const RSVP_OPTIONS = [
  ['in', 'In'],
  ['maybe', 'Maybe'],
  ['out', 'Out'],
]

export function MyGame() {
  const { state, results, actions } = useStore()
  const { user } = state

  if (!user) {
    return (
      <div className="mygame-signedout">
        <h2>My game</h2>
        <p>Log in to save pitches, keep your squad and coordinate kickabouts.</p>
        <div className="hero-cta">
          <button className="btn primary big" onClick={() => actions.openAuth('register')}>
            Create an account
          </button>
          <button className="btn ghost big" onClick={() => actions.openAuth('login')}>
            Log in
          </button>
        </div>
      </div>
    )
  }

  const savedRows = user.savedPitchIds
    .map((id) => results.find((r) => r.pitch.id === id) || fallbackRow(id))
    .filter(Boolean)

  const upcoming = [...user.kickabouts].sort((a, b) =>
    `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`),
  )

  return (
    <div className="mygame">
      <header className="mygame-head">
        <h2>{user.displayName}'s game</h2>
        <p>
          @{user.username} · {user.savedPitchIds.length} saved pitch
          {user.savedPitchIds.length === 1 ? '' : 'es'} · {user.kickabouts.length} kickabout
          {user.kickabouts.length === 1 ? '' : 's'}
        </p>
      </header>

      <section className="panel">
        <h3 className="panel-title">Kickabouts</h3>
        {upcoming.length === 0 ? (
          <p className="panel-sub">
            Nothing planned yet. Find a pitch, hit “Plan a kickabout”, and coordinate the squad here.
          </p>
        ) : (
          <ul className="kickabout-list">
            {upcoming.map((k) => {
              const pitch = getPitch(k.pitchId)
              const t = pitch ? PITCH_TYPES[pitch.type] : null
              const names = k.squad?.length ? k.squad : ['You']
              const inCount = names.filter((n) => k.rsvps[n] === 'in').length
              return (
                <li key={k.id} className="kickabout" style={{ '--accent': t?.color || '#38e07b' }}>
                  <div className="kickabout-when">
                    <strong>{formatDate(k.date)}</strong>
                    <span>{k.time}</span>
                  </div>
                  <div className="kickabout-info">
                    <button className="pitch-name" onClick={() => actions.selectPitch(k.pitchId)}>
                      {k.pitchName}
                    </button>
                    {k.notes && <p className="kickabout-notes">“{k.notes}”</p>}
                    <div className="rsvp-grid">
                      {names.map((name) => (
                        <div key={name} className="rsvp-row">
                          <span className="rsvp-name">{name}</span>
                          <div className="rsvp-buttons">
                            {RSVP_OPTIONS.map(([value, label]) => (
                              <button
                                key={value}
                                className={`chip tiny ${k.rsvps[name] === value ? 'chip-on' : ''}`}
                                onClick={() => actions.setRsvp(k.id, name, value)}
                              >
                                {label}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="kickabout-count">
                      {inCount}/{names.length} confirmed
                      {inCount >= 2 ? ' — game on' : ''}
                    </p>
                  </div>
                  <button
                    className="icon-btn"
                    onClick={() => actions.deleteKickabout(k.id)}
                    aria-label="Delete kickabout"
                  >
                    ✕
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      <section className="panel">
        <h3 className="panel-title">Saved pitches</h3>
        {savedRows.length === 0 ? (
          <p className="panel-sub">
            No saved pitches yet — tap the 🤍 on any pitch to keep it here.
          </p>
        ) : (
          <div className="results-grid">
            {savedRows.map((row) => (
              <PitchCard key={row.pitch.id} row={row} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

// A saved pitch can be filtered out of the current results — build a bare row
// for it so it still renders.
function fallbackRow(id) {
  const pitch = getPitch(id)
  if (!pitch) return null
  return { pitch, etas: [], avgEta: 0, maxEta: 0, spreadEta: 0, pricePerHead: pitch.pricePerHour, score: 0.5, reasons: [] }
}

function formatDate(iso) {
  try {
    return new Date(`${iso}T12:00:00`).toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    })
  } catch {
    return iso
  }
}
