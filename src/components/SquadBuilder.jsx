import React, { useMemo, useState } from 'react'
import { Link } from './Link.jsx'
import { useStore } from '../lib/store.jsx'
import { AREAS } from '../data/areas.js'
import { TRAVEL_MODES } from '../lib/geo.js'

export function SquadBuilder() {
  const { state, actions } = useStore()
  const [name, setName] = useState('')
  const [areaQuery, setAreaQuery] = useState('')
  const [mode, setMode] = useState('transit')
  const [error, setError] = useState('')

  const matches = useMemo(() => {
    const q = areaQuery.trim().toLowerCase()
    if (!q) return []
    return AREAS.filter((a) => a.name.toLowerCase().includes(q)).slice(0, 6)
  }, [areaQuery])

  const exact = useMemo(
    () => AREAS.find((a) => a.name.toLowerCase() === areaQuery.trim().toLowerCase()),
    [areaQuery],
  )

  function addFriend(area) {
    const friendArea = area || exact
    if (!friendArea) {
      setError('Pick an area from the suggestions. Postcodes are not supported yet.')
      return
    }
    actions.addFriend({
      name: name.trim() || `Player ${state.squad.length + 1}`,
      label: friendArea.name,
      lat: friendArea.lat,
      lng: friendArea.lng,
      mode,
    })
    setName('')
    setAreaQuery('')
    setError('')
  }

  return (
    <section className="stack">
      <p className="hint">
        Add each player and where they travel from. Results are ranked so the whole group gets a
        fair journey.
      </p>

      <div className="stack">
        <input
          className="input"
          placeholder="Player name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={24}
        />
        <div className="area-picker">
          <input
            className="input"
            placeholder="Home area, e.g. Peckham"
            value={areaQuery}
            onChange={(e) => {
              setAreaQuery(e.target.value)
              setError('')
            }}
            onKeyDown={(e) => e.key === 'Enter' && addFriend()}
          />
          {matches.length > 0 && !exact && (
            <ul className="area-suggestions">
              {matches.map((a) => (
                <li key={a.name}>
                  <button
                    onClick={() => {
                      setAreaQuery(a.name)
                      addFriend(a)
                    }}
                  >
                    {a.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="seg" role="radiogroup" aria-label="Travel mode">
          {Object.entries(TRAVEL_MODES).map(([key, m]) => (
            <button
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
        {error && <p className="form-error">{error}</p>}
        <button className="btn primary" onClick={() => addFriend()}>
          Add player
        </button>
      </div>

      {state.squad.length > 0 && (
        <ul className="squad-list">
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
                className="icon-btn"
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
