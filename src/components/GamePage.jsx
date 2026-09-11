// A game's public page at /g/{slug}: what, where, when, who is in, and the
// RSVP control. Guests answer with a name; the browser keeps a random key so
// they can change their answer. The creator can change the time or cancel.

import React, { useCallback, useEffect, useState } from 'react'
import { useStore } from '../lib/store.jsx'
import * as sb from '../lib/supabase.js'
import { formatWhen, fromInputParts, relativeDay, toInputParts } from '../lib/format.js'
import { shareUrl } from '../lib/share.js'
import { pitchName } from '../data/types.js'
import { bookingLabel } from '../lib/labels.js'
import { Link } from './Link.jsx'
import { Directions } from './Directions.jsx'
import { TRAVEL_MODES, displayMinutes, estimateEta } from '../lib/geo.js'
import { setGuest, useGuest } from '../lib/guest.js'

const STATUSES = [
  ['in', 'In'],
  ['maybe', 'Maybe'],
  ['out', 'Out'],
]

export function GamePage({ slug }) {
  const { state, pitchById, actions } = useStore()
  const [phase, setPhase] = useState('loading') // loading | ready | missing | error | unavailable
  const [error, setError] = useState('')
  const [game, setGame] = useState(null)
  const [rsvps, setRsvps] = useState([])
  const guest = useGuest()
  const [guestName, setGuestName] = useState(guest.name)
  const [busy, setBusy] = useState(false)
  const [rsvpError, setRsvpError] = useState('')
  const [editing, setEditing] = useState(false)
  const [confirmCancel, setConfirmCancel] = useState(false)
  const [shareStatus, setShareStatus] = useState(null)
  const [now, setNow] = useState(0)

  const available = state.authAvailable
  const load = useCallback(async () => {
    if (!available) return
    try {
      const res = await sb.gameBySlug(slug, guest.key)
      if (!res) {
        setPhase('missing')
        return
      }
      setGame(res.game)
      setRsvps(res.rsvps)
      setNow(Date.now())
      setPhase('ready')
    } catch (err) {
      setError(err.message)
      setPhase('error')
    }
  }, [slug, guest.key, available])

  useEffect(() => {
    // Deferred so the effect itself does no synchronous state update.
    let active = true
    Promise.resolve().then(() => active && load())
    return () => {
      active = false
    }
  }, [load, state.user?.id])

  useEffect(() => {
    if (game) document.title = `${game.pitch_name}, ${formatWhen(game.starts_at)}: PitchFinder`
  }, [game])

  // Answers arrive while the organiser keeps this page open: refresh every 20 s when visible.
  useEffect(() => {
    if (phase !== 'ready') return
    const id = setInterval(() => {
      if (document.visibilityState === 'visible') load()
    }, 20000)
    return () => clearInterval(id)
  }, [phase, load])

  useEffect(() => {
    if (!shareStatus) return
    const t = setTimeout(() => setShareStatus(null), 2000)
    return () => clearTimeout(t)
  }, [shareStatus])

  async function answer(status) {
    setRsvpError('')
    const name = guestName.trim().slice(0, 40)
    if (!state.user && !name) {
      setRsvpError('Add your name so the group knows who is in.')
      return
    }
    setBusy(true)
    try {
      if (state.user) await sb.rsvpAsUser(slug, status)
      else {
        setGuest({ name })
        await sb.rsvpAsGuest(slug, name, guest.key, status)
      }
      await load()
    } catch (err) {
      setRsvpError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function share() {
    const result = await shareUrl({
      title: `${game.pitch_name}, ${formatWhen(game.starts_at)}`,
      text: 'Are you in?',
      url: `${window.location.origin}/g/${slug}`,
    })
    if (result !== 'shared' && result !== 'cancelled') setShareStatus(result)
  }

  async function cancelGame() {
    setBusy(true)
    try {
      await sb.updateGame(game.id, { status: 'cancelled' })
      setConfirmCancel(false)
      await load()
    } catch (err) {
      setRsvpError(err.message)
    } finally {
      setBusy(false)
    }
  }

  if (!available) {
    return (
      <section className="empty-page" role="alert">
        <p className="empty-kicker">Game unavailable</p>
        <h1 className="empty-title">Games are not available on this build.</h1>
        <p className="empty-body">Sign in and games need the server.</p>
      </section>
    )
  }
  if (phase === 'loading') {
    return (
      <section className="page-narrow" aria-busy="true">
        <p className="hint">Loading game…</p>
      </section>
    )
  }
  if (phase === 'unavailable' || phase === 'error') {
    return (
      <section className="empty-page" role="alert">
        <p className="empty-kicker">Game unavailable</p>
        <h1 className="empty-title">
          {phase === 'unavailable'
            ? 'Games are not available on this build.'
            : 'Could not load this game.'}
        </h1>
        <p className="empty-body">
          {phase === 'error' ? error : 'Sign in and games need the server.'}
        </p>
        {phase === 'error' && (
          <button className="btn primary" onClick={load}>
            Try again
          </button>
        )}
      </section>
    )
  }
  if (phase === 'missing') {
    return (
      <section className="empty-page" role="status">
        <p className="empty-kicker">Game not found</p>
        <h1 className="empty-title">This link does not match a game.</h1>
        <p className="empty-body">
          Check the link you were sent. The organiser may have deleted the game.
        </p>
        <Link className="btn primary" href={actions.hrefFor('/')}>
          Open the map
        </Link>
      </section>
    )
  }

  const pitch = pitchById.get(game.pitch_id)
  const cancelled = game.status === 'cancelled'
  const happened = new Date(game.starts_at).getTime() < now - 3 * 3600e3
  const mine = rsvps.find((r) => r.is_you)
  const groups = STATUSES.map(([status, label]) => [
    label,
    rsvps.filter((r) => r.status === status),
  ])
  const inCount = rsvps.filter((r) => r.status === 'in').length

  return (
    <article className="game-page">
      <header className="game-head">
        <p className="empty-kicker">
          {cancelled ? 'Cancelled' : relativeDay(game.starts_at, new Date(now))}
        </p>
        <h1>{formatWhen(game.starts_at)}</h1>
        <p className="game-where">
          <Link href={actions.pitchHref(game.pitch_id)}>
            {pitch ? pitchName(pitch) : game.pitch_name}
          </Link>
          {pitch?.area && <span className="dim"> · {pitch.area}</span>}
        </p>
        {game.notes && <p className="game-notes">{game.notes}</p>}
        <p className="hint dim">Organised by {game.creator_name}</p>
      </header>

      {pitch && (
        <section className="game-where-block" aria-labelledby="where-title">
          <h2 id="where-title" className="section-title">
            Getting there
          </h2>
          <p className="game-address">
            {pitch.address ? `${pitch.address}. ` : ''}
            {pitch.postcode
              ? `${pitch.postcodeSource === 'operator' ? 'Postcode' : 'Nearest postcode'} ${pitch.postcode}`
              : 'Postcode not known'}
            {pitch.borough ? `, ${pitch.borough}` : ''}
          </p>
          <Directions lat={pitch.lat} lng={pitch.lng} name={pitchName(pitch)} />
          {Array.isArray(game.group) && game.group.length > 0 && (
            <>
              <ul className="eta-list">
                {game.group.map((m, i) => (
                  <li key={`${m.name}-${i}`}>
                    <span>
                      {m.name}
                      {m.label ? <span className="dim"> from {m.label}</span> : null}{' '}
                      <span className="dim">
                        ({(TRAVEL_MODES[m.mode]?.label || 'public transport').toLowerCase()})
                      </span>
                    </span>
                    <span className="eta-dots" />
                    <strong>about {displayMinutes(estimateEta(m, pitch, m.mode))} min</strong>
                  </li>
                ))}
              </ul>
              <p className="hint dim">
                Journey times are estimates from straight-line distance and typical speeds.
              </p>
            </>
          )}
        </section>
      )}

      {cancelled ? (
        <div className="notice" role="status">
          This game has been cancelled by the organiser.{' '}
          <Link href={actions.pitchHref(game.pitch_id)}>Plan another at this pitch</Link>
        </div>
      ) : happened ? (
        <div className="notice" role="status">
          This game has happened. {inCount} said they were in.
        </div>
      ) : (
        <section className="game-rsvp" aria-labelledby="rsvp-title">
          <h2 id="rsvp-title" className="section-title">
            {mine
              ? `Your answer: ${mine.status === 'in' ? 'In' : mine.status === 'maybe' ? 'Maybe' : 'Out'}`
              : 'Are you in?'}
          </h2>
          {!state.user && (
            <label className="field">
              <span className="field-label">Your name</span>
              <input
                className="input"
                value={guestName}
                maxLength={40}
                autoComplete="given-name"
                placeholder="So the group knows who answered"
                onChange={(e) => setGuestName(e.target.value)}
              />
            </label>
          )}
          <div className="seg lg" role="group" aria-label="Your answer">
            {STATUSES.map(([status, label]) => (
              <button
                key={status}
                className={mine?.status === status ? 'active' : ''}
                aria-pressed={mine?.status === status}
                disabled={busy}
                onClick={() => answer(status)}
              >
                {label}
              </button>
            ))}
          </div>
          {rsvpError && (
            <p className="form-error" role="alert">
              {rsvpError}
            </p>
          )}
          {state.user ? (
            <p className="hint dim">Answering as {state.user.displayName}.</p>
          ) : (
            <p className="hint dim">No account needed. Your answer is remembered on this phone.</p>
          )}
        </section>
      )}

      <section aria-labelledby="who-title">
        <h2 id="who-title" className="section-title">
          {inCount} in{rsvps.length ? `, ${rsvps.length} answered` : ''}
        </h2>
        {rsvps.length === 0 ? (
          <p className="hint">
            {game.is_creator
              ? 'Nobody has answered yet. Share the link.'
              : 'Nobody has answered yet. Be the first.'}
          </p>
        ) : (
          <div className="rsvp-columns">
            {groups.map(([label, list]) => (
              <div key={label} className="rsvp-col">
                <h3>
                  {label} <span className="dim">{list.length}</span>
                </h3>
                <ul>
                  {list.map((r) => (
                    <li key={r.id}>
                      {r.name}
                      {r.is_you && <span className="dim"> (you)</span>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>

      {!cancelled && (
        <div className="drawer-actions">
          <button className="btn primary" onClick={share}>
            {shareStatus === 'copied'
              ? 'Link copied'
              : shareStatus === 'failed'
                ? 'Copy failed'
                : 'Share link'}
          </button>
          <span className="sr-only" role="status" aria-live="polite">
            {shareStatus === 'copied'
              ? 'Link copied to clipboard'
              : shareStatus === 'failed'
                ? 'Could not copy the link'
                : ''}
          </span>
          {pitch?.bookingUrl && !happened && (
            <a
              className="btn ghost"
              href={pitch.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {bookingLabel(pitch.bookingUrl)}
            </a>
          )}
        </div>
      )}

      {game.is_creator && !cancelled && !happened && (
        <section className="game-admin" aria-labelledby="admin-title">
          <h2 id="admin-title" className="section-title">
            Organiser
          </h2>
          {editing ? (
            <EditGame game={game} onDone={() => setEditing(false)} onSaved={load} />
          ) : confirmCancel ? (
            <div className="row">
              <span className="hint">Cancel this game for everyone?</span>
              <button className="btn danger" disabled={busy} onClick={cancelGame}>
                Yes, cancel it
              </button>
              <button className="btn ghost" onClick={() => setConfirmCancel(false)}>
                Keep it
              </button>
            </div>
          ) : (
            <div className="row">
              <button className="btn ghost" onClick={() => setEditing(true)}>
                Change time or notes
              </button>
              <button className="btn danger" onClick={() => setConfirmCancel(true)}>
                Cancel game
              </button>
            </div>
          )}
        </section>
      )}
    </article>
  )
}

function EditGame({ game, onDone, onSaved }) {
  const parts = toInputParts(new Date(game.starts_at))
  const [date, setDate] = useState(parts.date)
  const [time, setTime] = useState(parts.time)
  const [notes, setNotes] = useState(game.notes || '')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function save(e) {
    e.preventDefault()
    const startsAt = fromInputParts(date, time)
    if (!startsAt) {
      setError('Pick a date and time.')
      return
    }
    setBusy(true)
    try {
      await sb.updateGame(game.id, { starts_at: startsAt, notes: notes.trim() || null })
      await onSaved()
      onDone()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="stack" onSubmit={save}>
      <div className="row">
        <input
          className="input"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          aria-label="Date"
        />
        <input
          className="input"
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          aria-label="Kick-off time"
        />
      </div>
      <input
        className="input"
        value={notes}
        maxLength={500}
        placeholder="Notes for the group (optional)"
        onChange={(e) => setNotes(e.target.value)}
        aria-label="Notes"
      />
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <div className="row">
        <button className="btn primary" type="submit" disabled={busy}>
          Save changes
        </button>
        <button className="btn ghost" type="button" onClick={onDone}>
          Cancel
        </button>
      </div>
    </form>
  )
}
