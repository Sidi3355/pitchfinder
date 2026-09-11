import React from 'react'
import { useStore } from '../lib/store.jsx'
import { pitchName } from '../data/types.js'
import { PitchCard } from './PitchCard.jsx'
import { Link } from './Link.jsx'
import { costOf } from '../lib/data.js'

const RSVP_OPTIONS = [
  ['in', 'In'],
  ['maybe', 'Maybe'],
  ['out', 'Out'],
]

export function Profile() {
  const { state, results, resultById, pitchById, actions } = useStore()
  const { user } = state

  if (!user) {
    return (
      <div className="signedout">
        <h2>Your games, in one place</h2>
        <p>Create a profile to save pitches, keep your group, and organise games with RSVPs.</p>
        <div className="row center">
          <button className="btn primary" onClick={() => actions.openAuth('register')}>
            Sign up
          </button>
          <button className="btn ghost" onClick={() => actions.openAuth('login')}>
            Sign in
          </button>
        </div>
      </div>
    )
  }

  const savedRows = user.savedPitchIds
    .map((id) => resultById.get(id) || fallbackRow(pitchById.get(id)))
    .filter(Boolean)

  const games = [...user.kickabouts].sort((a, b) =>
    `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`),
  )

  return (
    <div className="profile">
      <header className="profile-head">
        <h1>{user.displayName}</h1>
        <p className="dim">
          @{user.username} · {user.savedPitchIds.length} saved · {games.length} game
          {games.length === 1 ? '' : 's'}
        </p>
      </header>

      <section className="panel">
        <h2 className="panel-title">Upcoming games</h2>
        {games.length === 0 ? (
          <p className="hint">
            Nothing planned. Open a pitch on the map and choose &ldquo;Plan a game&rdquo; to
            organise one.
          </p>
        ) : (
          <ul className="game-list">
            {games.map((k) => {
              const pitch = pitchById.get(k.pitchId)
              const names = k.squad?.length ? k.squad : [user.displayName]
              const inCount = names.filter((n) => k.rsvps[n] === 'in').length
              return (
                <li key={k.id} className="game">
                  <div className="game-when">
                    <strong>{formatDate(k.date)}</strong>
                    <span>{k.time}</span>
                  </div>
                  <div className="game-info">
                    <Link className="card-title" href={actions.pitchHref(k.pitchId)}>
                      {pitch ? pitchName(pitch) : k.pitchName}
                    </Link>
                    {k.notes && <p className="game-notes">{k.notes}</p>}
                    <div className="rsvp-grid">
                      {names.map((n) => (
                        <div key={n} className="rsvp-row">
                          <span className="rsvp-name">{n}</span>
                          <div className="seg sm">
                            {RSVP_OPTIONS.map(([value, label]) => (
                              <button
                                key={value}
                                className={k.rsvps[n] === value ? 'active' : ''}
                                onClick={() => actions.setRsvp(k.id, n, value)}
                              >
                                {label}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="game-count">
                      {inCount}/{names.length} confirmed
                    </p>
                  </div>
                  <button
                    className="icon-btn"
                    onClick={() => actions.deleteGame(k.id)}
                    aria-label="Delete game"
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
        <h2 className="panel-title">Saved pitches</h2>
        {savedRows.length === 0 ? (
          <p className="hint">Tap the heart on any pitch to keep it here.</p>
        ) : (
          <div className="stack">
            {savedRows.map((row) => (
              <PitchCard key={row.pitch.id} row={row} />
            ))}
          </div>
        )}
      </section>

      <p className="hint dim">
        Profiles are stored in this browser only for now — clearing site data removes them.
      </p>
    </div>
  )
}

// Saved pitches can be filtered out of current results — build a bare row.
function fallbackRow(pitch) {
  if (!pitch) return null
  return {
    pitch,
    etas: [],
    avgEta: 0,
    maxEta: 0,
    spreadEta: 0,
    cost: costOf(pitch),
    pricePerHead: null,
    score: 0.5,
    reasons: [],
  }
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
