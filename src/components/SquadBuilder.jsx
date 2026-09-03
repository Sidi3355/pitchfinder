import React, { useMemo, useState } from 'react'
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
      setError('Pick an area from the suggestions — that sets the starting point for travel times.')
      return
    }
    actions.addFriend({
      name: name.trim() || `Player ${state.squad.length + 1}`,
      areaName: friendArea.name,
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
                <span className="squad-area">{f.areaName}</span>
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
              <button className="icon-btn" onClick={() => actions.removeFriend(f.id)} aria-label={`Remove ${f.name}`}>
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      {state.user && (
        <div className="row">
          <button className="btn ghost sm" onClick={actions.saveSquad} disabled={!state.squad.length}>
            Save group
          </button>
          <button className="btn ghost sm" onClick={actions.loadSquad} disabled={!state.user.squads?.[0]?.length}>
            Load saved group
          </button>
        </div>
      )}

      {state.squad.length === 0 && (
        <p className="hint dim">
          No players yet — until you add some, pitches are ranked on price and facilities alone.
        </p>
      )}
    </section>
  )
}
