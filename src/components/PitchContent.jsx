// The body of a pitch: facts, journey times, actions and provenance. Shared
// by the finder drawer and the standalone pitch page.

import React, { useEffect, useState } from 'react'
import { useStore } from '../lib/store.jsx'
import { pitchName } from '../data/types.js'
import { TRAVEL_MODES, estimateEta } from '../lib/geo.js'
import { costOf, isBounded } from '../lib/data.js'
import { surfaceLabel } from '../lib/labels.js'

function formatDate(iso) {
  if (!iso) return null
  try {
    return new Date(iso).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return null
  }
}

export function useShare(pitch) {
  const [status, setStatus] = useState(null) // null | 'copied' | 'failed'
  useEffect(() => {
    if (!status) return
    const t = setTimeout(() => setStatus(null), 2000)
    return () => clearTimeout(t)
  }, [status])

  async function share() {
    const url = `${window.location.origin}/p/${pitch.id}`
    const title = pitchName(pitch)
    if (navigator.share) {
      try {
        await navigator.share({ title, url })
        return
      } catch {
        // Cancelled or unsupported payload: fall through to copying.
      }
    }
    try {
      await navigator.clipboard.writeText(url)
      setStatus('copied')
    } catch {
      setStatus('failed')
    }
  }
  return { share, status }
}

export function PitchContent({ pitch }) {
  const { state, actions } = useStore()
  const [planning, setPlanning] = useState(false)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('19:00')
  const [notes, setNotes] = useState('')
  const { share, status: shareStatus } = useShare(pitch)

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
    actions.go('/me')
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

      {planning ? (
        <section className="drawer-section">
          <h3>Plan a game here</h3>
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
            <a
              className="btn primary"
              href={pitch.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Book at venue
            </a>
          )}
          <button className="btn ghost" onClick={() => setPlanning(true)}>
            Plan a game
          </button>
          <button
            className="btn ghost"
            onClick={() => actions.toggleSave(pitch.id)}
            aria-pressed={!!saved}
          >
            {saved ? 'Saved' : 'Save'}
          </button>
          <button className="btn ghost" onClick={share} aria-live="polite">
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
            Data: curated venue list
            {pitch.matchedOsmId ? ' and OpenStreetMap' : ''}. Location and facilities from the
            operator; check the venue page before travelling.
          </>
        ) : (
          <>
            Data: OpenStreetMap contributors (ODbL)
            {state.data?.generatedAt ? `, refreshed ${formatDate(state.data.generatedAt)}` : ''}.
            Lighting and surface reflect what is mapped; conditions on the ground can differ.
          </>
        )}
      </p>
    </>
  )
}
