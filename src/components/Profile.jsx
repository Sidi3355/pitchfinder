import React, { useEffect, useState } from 'react'
import { useStore } from '../lib/store.jsx'
import * as sb from '../lib/supabase.js'
import { formatWhen } from '../lib/format.js'
import { costOf } from '../lib/data.js'
import { PitchCard } from './PitchCard.jsx'
import { Link } from './Link.jsx'

export function Profile() {
  const { state, actions, resultById, pitchById } = useStore()
  const { user, authStatus, authAvailable } = state

  if (!authAvailable) {
    return (
      <section className="empty-page" role="status">
        <p className="empty-kicker">Sign in unavailable</p>
        <h1 className="empty-title">Accounts are not available on this build.</h1>
        <p className="empty-body">
          The map, ranking, filters and pitch pages all work without one.
        </p>
        <Link className="btn primary" href={actions.hrefFor('/')}>
          Open the map
        </Link>
      </section>
    )
  }

  if (authStatus === 'checking') {
    return (
      <section className="page-narrow" aria-busy="true">
        <p className="hint">Checking your session…</p>
      </section>
    )
  }

  if (!user) {
    return (
      <section className="empty-page">
        <p className="empty-kicker">Your games</p>
        <h1 className="empty-title">
          Sign in to save pitches, keep your group and organise games.
        </h1>
        <p className="empty-body">A sign-in link by email or your Google account. No password.</p>
        <button className="btn primary" onClick={() => actions.openAuth('generic')}>
          Sign in
        </button>
      </section>
    )
  }

  return <SignedInProfile user={user} resultById={resultById} pitchById={pitchById} />
}

function SignedInProfile({ user, resultById, pitchById }) {
  const { state, actions } = useStore()
  const [games, setGames] = useState(null)
  const [groups, setGroups] = useState(null)
  const [error, setError] = useState('')
  const [editingName, setEditingName] = useState(false)
  const [name, setName] = useState(user.displayName)

  useEffect(() => {
    let cancelled = false
    Promise.all([sb.myGames(), sb.listGroups()])
      .then(([g, gr]) => {
        if (cancelled) return
        // Games within the last three hours still count as upcoming (in play).
        const cutoff = Date.now() - 3 * 3600e3
        setGames({
          upcoming: g.filter((x) => new Date(x.starts_at).getTime() >= cutoff),
          past: g.filter((x) => new Date(x.starts_at).getTime() < cutoff),
        })
        setGroups(gr)
      })
      .catch((err) => !cancelled && setError(err.message))
    return () => {
      cancelled = true
    }
  }, [user.id])

  const savedRows = [...state.savedIds]
    .map((id) => resultById.get(id) || fallbackRow(pitchById.get(id)))
    .filter(Boolean)

  async function saveName(e) {
    e.preventDefault()
    const value = name.trim().slice(0, 40)
    if (!value) return
    try {
      await actions.updateDisplayName(value)
      setEditingName(false)
    } catch (err) {
      setError(err.message)
    }
  }

  async function removeGroup(id) {
    try {
      await sb.deleteGroup(id)
      setGroups((list) => list.filter((g) => g.id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  const upcoming = games?.upcoming || []
  const past = games?.past || []

  return (
    <div className="profile">
      <header className="profile-head row between">
        <div>
          {editingName ? (
            <form className="row" onSubmit={saveName}>
              <input
                className="input"
                value={name}
                maxLength={40}
                onChange={(e) => setName(e.target.value)}
                aria-label="Display name"
              />
              <button className="btn primary sm" type="submit">
                Save
              </button>
              <button className="btn ghost sm" type="button" onClick={() => setEditingName(false)}>
                Cancel
              </button>
            </form>
          ) : (
            <>
              <h1>{user.displayName}</h1>
              <p className="dim">
                {user.email}{' '}
                <button className="link-btn" onClick={() => setEditingName(true)}>
                  Change name
                </button>
              </p>
            </>
          )}
        </div>
        <button className="btn ghost sm" onClick={actions.signOut}>
          Sign out
        </button>
      </header>

      {error && (
        <div className="notice error" role="alert">
          {error}
        </div>
      )}

      <section className="panel" aria-labelledby="games-title">
        <h2 id="games-title" className="panel-title">
          Your games
        </h2>
        {games === null ? (
          <p className="hint" aria-busy="true">
            Loading…
          </p>
        ) : upcoming.length === 0 ? (
          <p className="hint">
            Nothing planned. Open a pitch and choose Plan a game to get a link for the group.
          </p>
        ) : (
          <ul className="game-list">
            {upcoming.map((g) => (
              <GameRow key={g.id} game={g} />
            ))}
          </ul>
        )}
        {past.length > 0 && (
          <details className="past-games">
            <summary>{past.length} past</summary>
            <ul className="game-list">
              {past.map((g) => (
                <GameRow key={g.id} game={g} />
              ))}
            </ul>
          </details>
        )}
      </section>

      <section className="panel" aria-labelledby="groups-title">
        <h2 id="groups-title" className="panel-title">
          Saved groups
        </h2>
        {groups === null ? (
          <p className="hint">Loading…</p>
        ) : groups.length === 0 ? (
          <p className="hint">
            Build a group on the map and choose Save group to keep it for next time.
          </p>
        ) : (
          <ul className="group-list">
            {groups.map((g) => (
              <li key={g.id} className="group-row">
                <div className="group-info">
                  <strong>{g.name}</strong>
                  <span className="dim">
                    {g.members.length} {g.members.length === 1 ? 'player' : 'players'}:{' '}
                    {g.members.map((m) => m.name).join(', ')}
                  </span>
                </div>
                <Link className="btn ghost sm" href={`/?g=${encodeGroupForHref(g.members)}`}>
                  Use
                </Link>
                <button
                  className="icon-btn"
                  onClick={() => removeGroup(g.id)}
                  aria-label={`Delete group ${g.name}`}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="panel" aria-labelledby="saved-title">
        <h2 id="saved-title" className="panel-title">
          Saved pitches
        </h2>
        {savedRows.length === 0 ? (
          <p className="hint">Choose Save on any pitch to keep it here.</p>
        ) : (
          <div className="stack">
            {savedRows.map((row) => (
              <PitchCard key={row.pitch.id} row={row} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function GameRow({ game }) {
  const cancelled = game.status === 'cancelled'
  return (
    <li className="game">
      <div className="game-when">
        <strong>{formatWhen(game.starts_at)}</strong>
        {cancelled && <span className="dim">Cancelled</span>}
      </div>
      <div className="game-info">
        <Link className="card-title" href={`/g/${game.share_slug}`}>
          {game.pitch_name}
        </Link>
        {game.notes && <p className="game-notes">{game.notes}</p>}
        <p className="game-count">
          {game.in_count} in · {game.maybe_count} maybe · {game.out_count} out
        </p>
      </div>
    </li>
  )
}

// Saved pitches can be filtered out of current results: build a bare row.
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
    score: 0,
    reasons: [],
  }
}

import { encodeGroup } from '../lib/url-state.js'
function encodeGroupForHref(members) {
  return encodeGroup(members)
}
