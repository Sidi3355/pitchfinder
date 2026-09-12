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
import { JourneyList } from './Journeys.jsx'
import { usePitchDetail } from '../lib/use-detail.js'
import { buildIcs, buildSummary, formatMoney, icsDataUrl, splitCost } from '../lib/game-extras.js'
import { costOf } from '../lib/data.js'
import { setGuest, useGuest } from '../lib/guest.js'
import { Avatar, AvatarStack, BrandBadge, Confetti, openLine } from './Facts.jsx'
import { formatTime } from '../lib/hours.js'

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
  const [copyStatus, setCopyStatus] = useState(null)
  const [now, setNow] = useState(0)
  const [cheer, setCheer] = useState(false)
  // Called before any early return: hooks must run in the same order every render.
  const pitchDetail = usePitchDetail(game ? pitchById.get(game.pitch_id) : null)

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

  // The countdown to kick-off moves on its own; a minute is close enough.
  useEffect(() => {
    if (phase !== 'ready') return
    const t = setInterval(() => setNow(Date.now()), 30000)
    return () => clearInterval(t)
  }, [phase])

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

  useEffect(() => {
    if (!cheer) return undefined
    const t = setTimeout(() => setCheer(false), 1800)
    return () => clearTimeout(t)
  }, [cheer])

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
      if (status === 'in') setCheer(true)
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

  async function copyMessage() {
    const cost = pitch ? costOf(pitch) : { known: false }
    const text = buildSummary({
      pitchName: pitch ? pitchName(pitch) : game.pitch_name,
      when: formatWhen(game.starts_at),
      postcode: pitch?.postcode,
      pricePerHour: cost.known ? cost.slot.amount : null,
      inCount: inCount >= 2 ? inCount : 0,
      url: `${window.location.origin}/g/${slug}`,
      notes: game.notes,
    })
    try {
      await navigator.clipboard.writeText(text)
      setCopyStatus('copied')
    } catch {
      setCopyStatus('failed')
    }
    setTimeout(() => setCopyStatus(null), 2000)
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
      <section className="page-narrow" aria-busy="true" aria-label="Loading game">
        <div className="skeleton-line w-40" />
        <div className="skeleton-line w-60" />
        <div className="skeleton-card" />
        <div className="skeleton-block" />
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
        <Link className="btn primary" href={actions.hrefFor('/find')}>
          Open the map
        </Link>
      </section>
    )
  }

  const pitch = pitchDetail
  const cancelled = game.status === 'cancelled'
  const happened = new Date(game.starts_at).getTime() < now - 3 * 3600e3
  const mine = rsvps.find((r) => r.is_you)
  const groups = STATUSES.map(([status, label]) => [
    label,
    rsvps.filter((r) => r.status === status),
  ])
  const inCount = rsvps.filter((r) => r.status === 'in').length
  const staleCount = rsvps.filter((r) => r.before_change).length

  const starts = new Date(game.starts_at)
  const dayLabel = starts.toLocaleDateString('en-GB', { weekday: 'short' })
  const dateLabel = starts.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  const timeLabel = formatTime(
    `${String(starts.getHours()).padStart(2, '0')}:${String(starts.getMinutes()).padStart(2, '0')}`,
  )
  const inNames = rsvps.filter((r) => r.status === 'in').map((r) => r.name)
  const open = pitch ? openLine(pitch, starts) : null
  const soon = now > 0 && starts.getTime() - now > 0 && starts.getTime() - now < 24 * 3600e3

  return (
    <article className={`event game-event${cancelled ? ' is-cancelled' : ''}`}>
      <aside className="event-cover">
        <div className="cover-tile tile-game" aria-hidden="true">
          <span className="cover-day">{dayLabel}</span>
          <span className="cover-date">{dateLabel}</span>
          <span className="cover-time">{timeLabel}</span>
          {!cancelled && !happened && soon && <span className="badge-soon">Starts soon</span>}
        </div>
        {!cancelled && !happened && now > 0 && <Countdown startsAt={game.starts_at} now={now} />}
        <p className="kicker">
          {cancelled
            ? 'Cancelled'
            : happened
              ? 'Played'
              : relativeDay(game.starts_at, new Date(now))}
        </p>
        <h1 className="event-title">
          <Link href={actions.pitchHref(game.pitch_id)}>
            {pitch ? pitchName(pitch) : game.pitch_name}
          </Link>
        </h1>
        <p className="event-when">
          {formatWhen(game.starts_at)}
          {pitch?.area && <span className="dim"> · {pitch.area}</span>}
        </p>
        {game.previous_starts_at && !cancelled && !happened && (
          <p className="game-moved" role="status">
            Moved from {formatWhen(game.previous_starts_at)}.
          </p>
        )}
        {game.notes && <p className="game-notes">{game.notes}</p>}
        <p className="event-host">
          <Avatar name={game.creator_name} size="sm" />
          <span>
            Hosted by <strong>{game.creator_name}</strong>
          </span>
        </p>
        <p className="event-count">
          {inNames.length ? <AvatarStack names={inNames} /> : null}
          <span>
            {inCount} in{rsvps.length ? `, ${rsvps.length} answered` : ''}
          </span>
        </p>
        {!cancelled && (
          <div className="event-share">
            <button className="btn primary lg wide" onClick={share}>
              {shareStatus === 'copied'
                ? 'Link copied'
                : shareStatus === 'failed'
                  ? 'Copy failed'
                  : 'Share the invite'}
            </button>
          </div>
        )}
      </aside>

      <div className="event-body">
        {cancelled ? (
          <div className="event-card notice" role="status">
            This game has been cancelled by the organiser.{' '}
            <Link href={actions.pitchHref(game.pitch_id)}>Plan another at this pitch</Link>
          </div>
        ) : happened ? (
          <div className="event-card notice" role="status">
            This game has happened. {inCount} said they were in.
          </div>
        ) : (
          <section
            className={`event-card rsvp-card${cheer ? ' celebrate' : ''}`}
            aria-labelledby="rsvp-title"
          >
            <Confetti active={cheer} />
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
            <div className="rsvp-buttons" role="group" aria-label="Your answer">
              {STATUSES.map(([status, label]) => (
                <button
                  key={status}
                  className={`rsvp-btn rsvp-${status}${mine?.status === status ? ' active' : ''}`}
                  aria-pressed={mine?.status === status}
                  disabled={busy}
                  onClick={() => answer(status)}
                >
                  {label}
                </button>
              ))}
            </div>
            {mine?.before_change && (
              <p className="notice" role="status">
                The kick-off moved after you answered. Tap your answer again to confirm it for the
                new time.
              </p>
            )}
            {rsvpError && (
              <p className="form-error" role="alert">
                {rsvpError}
              </p>
            )}
            {state.user ? (
              <p className="hint dim">Answering as {state.user.displayName}.</p>
            ) : (
              <p className="hint dim">
                No account needed. Your answer is remembered on this phone.
              </p>
            )}
          </section>
        )}

        {pitch && (
          <section className="event-card game-where-block" aria-labelledby="where-title">
            <h2 id="where-title" className="section-title">
              Getting there
            </h2>
            <p className="game-venue-line">
              <BrandBadge pitch={pitch} />
              {open && (
                <span className={`key-open ${open.open ? 'is-open' : 'is-closed'}`}>
                  {open.open ? 'Open at kick-off' : 'Closed at kick-off, check the hours'}
                </span>
              )}
            </p>
            <p className="game-address">
              {pitch.address ? `${pitch.address}. ` : ''}
              {pitch.postcode
                ? `${pitch.postcodeSource === 'operator' ? 'Postcode' : 'Nearest postcode'} ${pitch.postcode}`
                : 'Postcode not known'}
              {pitch.borough ? `, ${pitch.borough}` : ''}
            </p>
            <Directions lat={pitch.lat} lng={pitch.lng} name={pitchName(pitch)} />
            {(() => {
              const cost = costOf(pitch)
              if (!cost.known) return null
              if (cost.perHour === 0) return <p className="game-cost">Free to play.</p>
              const { amount, minutes } = cost.slot
              const each = inCount >= 2 ? splitCost(amount, inCount) : null
              const calendar =
                pitch.priceSource === 'pitchbooking' || pitch.priceSource === 'playfinder'
              const note = calendar
                ? `the cheapest ${minutes === 60 ? 'hour' : `${minutes}-minute slot`} on the booking calendar, whole pitch; peak times cost more`
                : 'operator\u2019s published rate for an hour, whole pitch'
              return (
                <p className="game-cost">
                  {formatMoney(amount)} for the pitch
                  {each
                    ? `, ${formatMoney(each)} each with ${inCount} in`
                    : ', split between whoever is in'}
                  <span className="fact-note">{note}</span>
                </p>
              )
            })()}
            {Array.isArray(game.group) && game.group.length > 0 && (
              <JourneyList people={game.group} pitch={pitch} showFrom />
            )}
          </section>
        )}

        <section className="event-card" aria-labelledby="who-title">
          <h2 id="who-title" className="section-title">
            {inCount} in{rsvps.length ? `, ${rsvps.length} answered` : ''}
          </h2>
          {staleCount > 0 && !cancelled && !happened && (
            <p className="hint dim">
              {staleCount === 1 ? '1 answer was' : `${staleCount} answers were`} given before the
              time changed and may not stand.
            </p>
          )}
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
                        <Avatar name={r.name} size="sm" you={r.is_you} />
                        <span>
                          {r.name}
                          {r.is_you && <span className="dim"> (you)</span>}
                          {r.before_change && !cancelled && !happened && (
                            <span className="dim"> (before the time changed)</span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </section>

        {!cancelled && (
          <div className="drawer-actions event-actions">
            <button className="btn ghost" onClick={share}>
              {shareStatus === 'copied'
                ? 'Link copied'
                : shareStatus === 'failed'
                  ? 'Copy failed'
                  : 'Share link'}
            </button>
            <a
              className="btn ghost"
              href={icsDataUrl(
                buildIcs({
                  uid: `${game.id}@pitchfinder`,
                  title: `Football: ${pitch ? pitchName(pitch) : game.pitch_name}`,
                  startsAt: game.starts_at,
                  location: [pitch ? pitchName(pitch) : game.pitch_name, pitch?.postcode]
                    .filter(Boolean)
                    .join(', '),
                  description: `${game.notes ? `${game.notes}\n` : ''}In or out? ${window.location.origin}/g/${slug}`,
                  url: `${window.location.origin}/g/${slug}`,
                }),
              )}
              download={`football-${slug}.ics`}
            >
              Add to calendar
            </a>
            <button className="btn ghost" onClick={copyMessage}>
              {copyStatus === 'copied' ? 'Message copied' : 'Copy message for the group'}
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
          <section className="event-card game-admin" aria-labelledby="admin-title">
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
      </div>
    </article>
  )
}

/**
 * Days, hours and minutes to kick-off, as three tiles (after the Event
 * Countdown Card on 21st.dev). The minutes tile breathes while the clock
 * runs; nothing moves when motion is reduced.
 */
function Countdown({ startsAt, now }) {
  const ms = new Date(startsAt).getTime() - now
  if (ms <= 0) {
    return (
      <p className="countdown-label" role="status">
        Kicking off now
      </p>
    )
  }
  const days = Math.floor(ms / 86400e3)
  const hours = Math.floor((ms % 86400e3) / 3600e3)
  const mins = Math.floor((ms % 3600e3) / 60e3)
  const units = [
    [days, days === 1 ? 'day' : 'days'],
    [hours, hours === 1 ? 'hour' : 'hours'],
    [mins, 'min'],
  ]
  const spoken = `${days} days, ${hours} hours and ${mins} minutes to kick-off`
  return (
    <div>
      <p className="countdown-label" id="countdown-label">
        Kick-off in
      </p>
      <div className="countdown" role="timer" aria-label={spoken}>
        {units.map(([value, label], i) => (
          <div key={label} className={`count-unit${i === 2 ? ' live' : ''}`} aria-hidden="true">
            <strong>{String(value).padStart(2, '0')}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
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
