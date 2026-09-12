// The first control on the screen: who is coming and from where. A row of
// chips (one per player) and one button to add or change people. With a
// shared group (grp= in the URL) the chips are the people who added
// themselves, and the only way to change them is on the group page.

import React from 'react'
import { useStore } from '../lib/store.jsx'
import { TRAVEL_MODES } from '../lib/geo.js'
import { Link } from './Link.jsx'

export function GroupBar({ onEdit }) {
  const { state, actions } = useStore()
  const { squad, sharedSlug, sharedGroup } = state

  if (sharedSlug) {
    const href = `/group/${sharedSlug}`
    if (!sharedGroup || sharedGroup.status === 'loading') {
      return (
        <div className="group-bar" role="status">
          <span className="hint dim">Loading the group…</span>
        </div>
      )
    }
    if (sharedGroup.status !== 'ready') {
      return (
        <div className="group-bar empty">
          <Link className="group-cta" href={href}>
            <span className="group-cta-title">
              {sharedGroup.status === 'missing'
                ? 'This group link does not match a group'
                : 'Could not load the group'}
            </span>
            <span className="group-cta-sub">Open the group page</span>
          </Link>
        </div>
      )
    }
    const you = squad.some((f) => f.you)
    return (
      <div className="group-bar" role="group" aria-label={sharedGroup.group.name}>
        <ul className="chips">
          <li className="chips-label">{sharedGroup.group.name}</li>
          {squad.map((f) => (
            <li key={f.id} className="chip">
              <span className="chip-main" title={`${f.name}, ${TRAVEL_MODES[f.mode]?.label || ''}`}>
                <strong>
                  {f.name}
                  {f.you ? ' (you)' : ''}
                </strong>
                {f.label && <span className="chip-sub">{f.label}</span>}
              </span>
            </li>
          ))}
          <li>
            <Link className="chip add" href={href}>
              {you
                ? 'Edit my details'
                : squad.length
                  ? 'Add yourself'
                  : 'Nobody in yet: add yourself'}
            </Link>
          </li>
        </ul>
      </div>
    )
  }

  if (!squad.length) {
    return (
      <div className="group-bar empty">
        <button className="group-cta" onClick={onEdit}>
          <span className="group-cta-title">Where is everyone coming from?</span>
          <span className="group-cta-sub">
            Share a link so everyone adds themselves, or add people here
          </span>
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
