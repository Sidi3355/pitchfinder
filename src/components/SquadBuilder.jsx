// The group editor: where each person is coming from, how they travel, and
// optionally their name. A postcode or a place name resolves through
// postcodes.io and Nominatim (see lib/geocode-client.js); the gazetteer gives
// instant suggestions and works offline. Recent places are one tap.

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useStore } from '../lib/store.jsx'
import { AREAS } from '../data/areas.js'
import { TRAVEL_MODES } from '../lib/geo.js'
import {
  geocodePostcode,
  looksLikePostcode,
  resolveLocation,
  searchGazetteer,
  suggestPostcodes,
} from '../lib/geocode-client.js'
import { listRecent, rememberLocation } from '../lib/recent-locations.js'
import { Link } from './Link.jsx'

export function SquadBuilder() {
  const { state, actions } = useStore()
  const [name, setName] = useState('')
  const [query, setQuery] = useState('')
  const [mode, setMode] = useState('transit')
  const [postcodeHints, setPostcodeHints] = useState([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [recent, setRecent] = useState(() => [])
  const inputRef = useRef(null)
  const abortRef = useRef(null)

  useEffect(() => {
    // Recent places are read once the editor is open, never during render.
    let active = true
    Promise.resolve().then(() => active && setRecent(listRecent()))
    return () => {
      active = false
    }
  }, [])

  const gazetteer = useMemo(
    () => (looksLikePostcode(query) ? [] : searchGazetteer(query, AREAS)),
    [query],
  )

  // Postcode autocomplete while typing (postcodes.io allows it; Nominatim does not).
  useEffect(() => {
    if (!looksLikePostcode(query) || query.trim().length < 3) {
      return
    }
    let active = true
    const controller = new AbortController()
    const t = setTimeout(async () => {
      try {
        const hints = await suggestPostcodes(query, { signal: controller.signal })
        if (active) setPostcodeHints(hints)
      } catch {
        if (active) setPostcodeHints([])
      }
    }, 250)
    return () => {
      active = false
      controller.abort()
      clearTimeout(t)
    }
  }, [query])

  const suggestions = looksLikePostcode(query)
    ? postcodeHints.map((pc) => ({
        label: pc,
        sub: 'postcode',
        source: 'postcodes.io',
        lookup: true,
      }))
    : gazetteer

  function add(loc) {
    actions.addFriend({
      name: name.trim() || `Player ${state.squad.length + 1}`,
      label: loc.label,
      lat: loc.lat,
      lng: loc.lng,
      mode,
    })
    setRecent(rememberLocation(loc))
    setName('')
    setQuery('')
    setPostcodeHints([])
    setError('')
    inputRef.current?.focus()
  }

  async function pick(s) {
    setError('')
    if (!s.lookup) return add(s)
    setBusy(true)
    try {
      const hit = await geocodePostcode(s.label)
      if (hit) add(hit)
      else setError('That postcode was not found.')
    } catch {
      setError('Could not look up that postcode. Check your connection, or type an area name.')
    } finally {
      setBusy(false)
    }
  }

  async function submit(e) {
    e?.preventDefault()
    const q = query.trim()
    if (!q) {
      setError('Type a postcode or a place first.')
      return
    }
    if (suggestions.length && !suggestions[0].lookup) return add(suggestions[0])
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    setBusy(true)
    setError('')
    try {
      const { results, offline } = await resolveLocation(q, {
        areas: AREAS,
        signal: controller.signal,
      })
      if (results.length) add(results[0])
      else if (offline) setError('No match, and place search needs a connection. Try an area name.')
      else setError('No match in London for that. Try a postcode or a nearby area.')
    } catch (err) {
      if (err?.name !== 'AbortError') setError('Could not search right now.')
    } finally {
      setBusy(false)
    }
  }

  function useMyLocation() {
    if (!navigator.geolocation) {
      setError('Location is not available in this browser.')
      return
    }
    setBusy(true)
    setError('')
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const lat = Math.round(coords.latitude * 1e4) / 1e4
        const lng = Math.round(coords.longitude * 1e4) / 1e4
        let label = 'My location'
        try {
          const res = await fetch(
            `https://api.postcodes.io/postcodes?lon=${lng}&lat=${lat}&limit=1&radius=500`,
          )
          const { result } = await res.json()
          if (result?.[0]?.postcode) label = result[0].postcode
        } catch {}
        add({ label, lat, lng, source: 'device' })
        setBusy(false)
      },
      () => {
        setError('Could not get your location.')
        setBusy(false)
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 },
    )
  }

  return (
    <section className="stack">
      <form className="stack" onSubmit={submit}>
        <label className="field">
          <span className="field-label">Where from?</span>
          <div className="area-picker">
            <input
              ref={inputRef}
              className="input"
              placeholder="Postcode or place, e.g. E8 3DL or Peckham"
              value={query}
              autoComplete="off"
              autoCapitalize="characters"
              onChange={(e) => {
                setQuery(e.target.value)
                setError('')
              }}
              aria-label="Where from? Postcode or place"
              aria-autocomplete="list"
            />
            {query.trim() && suggestions.length > 0 && (
              <ul className="area-suggestions" role="listbox" aria-label="Suggestions">
                {suggestions.map((s) => (
                  <li key={`${s.source}-${s.label}`} role="option" aria-selected="false">
                    <button type="button" onClick={() => pick(s)} disabled={busy}>
                      <span>{s.label}</span>
                      {s.sub && <span className="dim"> {s.sub}</span>}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </label>

        {!query.trim() && recent.length > 0 && (
          <div className="recent-row">
            <span className="hint dim">Recent:</span>
            {recent.map((r) => (
              <button key={r.label} type="button" className="chip add" onClick={() => add(r)}>
                {r.label}
              </button>
            ))}
          </div>
        )}

        <div className="row">
          <input
            className="input grow"
            placeholder="Name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={24}
            aria-label="Player name"
          />
        </div>
        <div className="seg" role="radiogroup" aria-label="Travel mode">
          {Object.entries(TRAVEL_MODES).map(([key, m]) => (
            <button
              type="button"
              key={key}
              role="radio"
              aria-checked={mode === key}
              className={mode === key ? 'active' : ''}
              onClick={() => setMode(key)}
            >
              {m.label}
            </button>
          ))}
        </div>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <div className="row">
          <button className="btn primary grow" type="submit" disabled={busy}>
            {busy ? 'Finding' : 'Add player'}
          </button>
          <button className="btn ghost" type="button" onClick={useMyLocation} disabled={busy}>
            Use my location
          </button>
        </div>
      </form>

      {state.squad.length > 0 && (
        <ul className="squad-list" aria-label="Players">
          {state.squad.map((f) => (
            <li key={f.id} className="squad-member">
              <div className="squad-member-info">
                <span className="squad-name">{f.name}</span>
                <span className="squad-area">
                  {f.label || `${f.lat.toFixed(3)}, ${f.lng.toFixed(3)}`}
                </span>
              </div>
              <select
                className="select"
                value={f.mode}
                onChange={(e) => actions.setFriendMode(f.id, e.target.value)}
                aria-label={`${f.name}'s travel mode`}
              >
                {Object.entries(TRAVEL_MODES).map(([key, m]) => (
                  <option key={key} value={key}>
                    {m.label}
                  </option>
                ))}
              </select>
              <button
                className="icon-btn lg"
                onClick={() => actions.removeFriend(f.id)}
                aria-label={`Remove ${f.name}`}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      {state.squad.length > 0 && <SaveGroup />}

      {state.squad.length === 0 && (
        <p className="hint dim">
          No players yet. Until you add some, pitches are listed by price and facilities alone.
        </p>
      )}
    </section>
  )
}

function SaveGroup() {
  const { state, actions } = useStore()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('Thursday football')
  const [phase, setPhase] = useState('idle') // idle | saving | saved | error
  const [error, setError] = useState('')

  if (!state.authAvailable) return null

  async function save(e) {
    e.preventDefault()
    setPhase('saving')
    setError('')
    try {
      const saved = await actions.saveGroup(name.trim() || 'My group')
      setPhase(saved ? 'saved' : 'idle')
    } catch (err) {
      setError(err.message)
      setPhase('error')
    }
  }

  if (phase === 'saved') {
    return (
      <p className="hint" role="status">
        Group saved. Find it under <Link href={actions.hrefFor('/me')}>My games</Link>.
      </p>
    )
  }
  if (!open) {
    return (
      <div className="row">
        <button className="btn ghost sm" onClick={() => setOpen(true)}>
          Save this group
        </button>
      </div>
    )
  }
  return (
    <form className="row" onSubmit={save}>
      <input
        className="input"
        value={name}
        maxLength={60}
        onChange={(e) => setName(e.target.value)}
        aria-label="Group name"
      />
      <button className="btn primary sm" type="submit" disabled={phase === 'saving'}>
        {state.user ? 'Save' : 'Sign in and save'}
      </button>
      <button className="btn ghost sm" type="button" onClick={() => setOpen(false)}>
        Cancel
      </button>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
    </form>
  )
}
