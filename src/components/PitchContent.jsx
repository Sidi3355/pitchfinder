// The body of a pitch: facts, journey times, actions, plan-a-game, report a
// problem, and provenance. Shared by the finder drawer and the pitch page.

import React, { useEffect, useState } from 'react'
import { useStore } from '../lib/store.jsx'
import { navigate } from '../lib/location.js'
import * as sb from '../lib/supabase.js'
import { pitchName } from '../data/types.js'
import { TRAVEL_MODES, estimateEta } from '../lib/geo.js'
import { costOf, isBounded } from '../lib/data.js'
import { surfaceLabel } from '../lib/labels.js'
import { formatDate, fromInputParts } from '../lib/format.js'
import { shareUrl } from '../lib/share.js'

export function PitchContent({ pitch }) {
  const { state, actions } = useStore()
  const [panel, setPanel] = useState(null) // null | 'plan' | 'report'
  const [shareStatus, setShareStatus] = useState(null)

  useEffect(() => {
    if (!shareStatus) return
    const t = setTimeout(() => setShareStatus(null), 2000)
    return () => clearTimeout(t)
  }, [shareStatus])

  const cost = costOf(pitch)
  const saved = state.savedIds.has(pitch.id)
  const name = pitchName(pitch)

  async function share() {
    const result = await shareUrl({ title: name, url: `${window.location.origin}/p/${pitch.id}` })
    if (result !== 'shared' && result !== 'cancelled') setShareStatus(result)
  }

  return (
    <>
      <dl className="facts">
        <div>
          <dt>Price</dt>
          <dd>
            {!cost.known ? 'Not known' : cost.perHour === 0 ? 'Free' : `£${cost.perHour}/hour`}
            {pitch.priceMax != null &&
              pitch.priceMax !== pitch.pricePerHour &&
              ` to £${pitch.priceMax}`}
            {cost.known && cost.perHour > 0 && (
              <span className="fact-note">
                {pitch.priceSource === 'scraped' && pitch.priceCheckedAt
                  ? `venue page, checked ${formatDate(pitch.priceCheckedAt)}`
                  : "operator's published rate, whole pitch"}
              </span>
            )}
            {!cost.known && pitch.bookingUrl && <span className="fact-note">set at booking</span>}
          </dd>
        </div>
        <div>
          <dt>Enclosure</dt>
          <dd>{isBounded(pitch) ? 'Bounded, ball stays in play' : 'Open pitch'}</dd>
        </div>
        <div>
          <dt>Surface</dt>
          <dd>{pitch.surface ? surfaceLabel(pitch.surface) : 'Not known'}</dd>
        </div>
        {Array.isArray(pitch.formats) && (
          <div>
            <dt>Formats</dt>
            <dd>{pitch.formats.map((f) => `${f}-a-side`).join(', ')}</dd>
          </div>
        )}
        <div>
          <dt>Floodlights</dt>
          <dd>{pitch.lit === true ? 'Yes' : pitch.lit === false ? 'No' : 'Not known'}</dd>
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
          <h3>Journey times (estimates)</h3>
          <ul className="eta-list">
            {state.squad.map((f) => (
              <li key={f.id}>
                <span>
                  {f.name} <span className="dim">({TRAVEL_MODES[f.mode].label.toLowerCase()})</span>
                </span>
                <span className="eta-dots" />
                <strong>about {estimateEta(f, pitch, f.mode)} min</strong>
              </li>
            ))}
          </ul>
          <p className="hint dim">
            Estimated from straight-line distance and typical speeds. Check a journey planner before
            you set off.
          </p>
        </section>
      )}

      {panel === 'plan' ? (
        <PlanGame pitch={pitch} name={name} onClose={() => setPanel(null)} />
      ) : panel === 'report' ? (
        <ReportProblem pitch={pitch} onClose={() => setPanel(null)} />
      ) : (
        <div className="drawer-actions">
          {pitch.bookingUrl && (
            <a
              className="btn primary"
              href={pitch.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Book at venue
            </a>
          )}
          <button className="btn ghost" onClick={() => setPanel('plan')}>
            Plan a game
          </button>
          <button
            className="btn ghost"
            onClick={() => actions.toggleSave(pitch.id)}
            aria-pressed={saved}
          >
            {saved ? 'Saved' : 'Save'}
          </button>
          <button className="btn ghost" onClick={share}>
            {shareStatus === 'copied'
              ? 'Link copied'
              : shareStatus === 'failed'
                ? 'Copy failed'
                : 'Share'}
          </button>
        </div>
      )}

      <p className="hint dim drawer-footnote">
        {pitch.curated ? (
          <>
            Data: curated venue list{pitch.matchedOsmId ? ' and OpenStreetMap' : ''}. Location and
            facilities from the operator; check the venue page before travelling.
          </>
        ) : (
          <>
            Data: OpenStreetMap contributors (ODbL)
            {state.data?.generatedAt ? `, refreshed ${formatDate(state.data.generatedAt)}` : ''}.
            Lighting and surface reflect what is mapped; conditions on the ground can differ.
          </>
        )}{' '}
        {panel !== 'report' && (
          <button className="link-btn" onClick={() => setPanel('report')}>
            Report a problem with this pitch
          </button>
        )}
      </p>
    </>
  )
}

function PlanGame({ pitch, name, onClose }) {
  const { state, actions } = useStore()
  const [date, setDate] = useState('')
  const [time, setTime] = useState('19:00')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    const startsAt = fromInputParts(date, time)
    if (!startsAt) {
      setError('Pick a date and time.')
      return
    }
    setBusy(true)
    setError('')
    try {
      const game = await actions.createGame({
        pitchId: pitch.id,
        pitchName: name,
        startsAt,
        notes: notes.trim(),
      })
      if (game) navigate(`/g/${game.share_slug}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="drawer-section" onSubmit={submit}>
      <h3>Plan a game here</h3>
      {!state.authAvailable && (
        <div className="notice" role="status">
          Sign in is unavailable right now, so games cannot be created. Share the pitch link
          instead.
        </div>
      )}
      <div className="row">
        <input
          className="input"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          aria-label="Date"
          required
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
        placeholder="Notes for the group (optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        maxLength={500}
        aria-label="Notes"
      />
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <div className="row">
        <button className="btn primary" type="submit" disabled={busy || !state.authAvailable}>
          {state.user ? 'Create game link' : 'Sign in and create game'}
        </button>
        <button className="btn ghost" type="button" onClick={onClose}>
          Cancel
        </button>
      </div>
      <p className="hint dim">
        You get a link to send to the group. Anyone with it can say in or out.
      </p>
    </form>
  )
}

const FIELDS = [
  ['price', 'Price'],
  ['lit', 'Floodlights'],
  ['surface', 'Surface'],
  ['name', 'Name'],
  ['location', 'Location on the map'],
  ['bookingUrl', 'Booking link'],
  ['closed', 'Closed or no longer exists'],
  ['other', 'Something else'],
]

function ReportProblem({ pitch, onClose }) {
  const { state } = useStore()
  const [field, setField] = useState('price')
  const [suggested, setSuggested] = useState('')
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [phase, setPhase] = useState('idle') // idle | sending | sent | error
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()
    if (!suggested.trim() && !message.trim()) {
      setError('Tell us what is wrong, or what it should say.')
      return
    }
    setPhase('sending')
    setError('')
    try {
      await sb.reportProblem({
        pitchId: pitch.id,
        field,
        suggestedValue: suggested.trim(),
        message: message.trim(),
        email: email.trim(),
        userId: state.user?.id,
        pageUrl: window.location.href,
      })
      setPhase('sent')
    } catch (err) {
      setError(err.message)
      setPhase('error')
    }
  }

  if (phase === 'sent') {
    return (
      <div className="notice" role="status">
        <strong>Thanks, report received.</strong> Corrections to OpenStreetMap pitches are also
        welcome on OpenStreetMap itself, where they help everyone.{' '}
        <button className="link-btn" onClick={onClose}>
          Done
        </button>
      </div>
    )
  }

  return (
    <form className="drawer-section report-form" onSubmit={submit}>
      <h3>Report a problem</h3>
      {!state.authAvailable && (
        <div className="notice" role="status">
          Reporting is unavailable right now. Please try again later.
        </div>
      )}
      <label className="field">
        <span className="field-label">What is wrong?</span>
        <select className="select wide" value={field} onChange={(e) => setField(e.target.value)}>
          {FIELDS.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        <span className="field-label">What should it say? (optional)</span>
        <input
          className="input"
          value={suggested}
          maxLength={200}
          onChange={(e) => setSuggested(e.target.value)}
        />
      </label>
      <label className="field">
        <span className="field-label">Details</span>
        <textarea
          className="input"
          rows={3}
          value={message}
          maxLength={1000}
          onChange={(e) => setMessage(e.target.value)}
        />
      </label>
      <label className="field">
        <span className="field-label">Email, if you want a reply (optional)</span>
        <input
          className="input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <div className="row">
        <button
          className="btn primary"
          type="submit"
          disabled={phase === 'sending' || !state.authAvailable}
        >
          {phase === 'sending' ? 'Sending' : 'Send report'}
        </button>
        <button className="btn ghost" type="button" onClick={onClose}>
          Cancel
        </button>
      </div>
    </form>
  )
}
