// The first control on the screen: who is coming and from where. A row of
// chips (one per player) and one button to add or change people.

import React from 'react'
import { useStore } from '../lib/store.jsx'
import { TRAVEL_MODES } from '../lib/geo.js'

export function GroupBar({ onEdit }) {
  const { state, actions } = useStore()
  const { squad } = state

  if (!squad.length) {
    return (
      <div className="group-bar empty">
        <button className="group-cta" onClick={onEdit}>
          <span className="group-cta-title">Where is everyone coming from?</span>
          <span className="group-cta-sub">Add people to rank pitches by journey time</span>
        </button>
      </div>
    )
  }

  return (
    <div className="group-bar" role="group" aria-label="Your group">
      <ul className="chips">
        {squad.map((f) => (
          <li key={f.id} className="chip">
            <button
              className="chip-main"
              onClick={onEdit}
              title={`${f.name}, ${TRAVEL_MODES[f.mode]?.label || ''}`}
            >
              <strong>{f.name}</strong>
              {f.label && <span className="chip-sub">{f.label}</span>}
            </button>
            <button
              className="chip-x"
              onClick={() => actions.removeFriend(f.id)}
              aria-label={`Remove ${f.name}`}
            >
              ✕
            </button>
          </li>
        ))}
        <li>
          <button className="chip add" onClick={onEdit}>
            + Add
          </button>
        </li>
      </ul>
    </div>
  )
}
