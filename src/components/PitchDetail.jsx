import React, { useEffect } from 'react'
import { useStore } from '../lib/store.jsx'
import { PITCH_TYPES, pitchName } from '../data/types.js'
import { PitchContent } from './PitchContent.jsx'
import { Link } from './Link.jsx'

export function PitchDetail() {
  const { state, pitchById, actions } = useStore()
  const pitch = pitchById.get(state.selectedPitchId)

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && actions.selectPitch(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [actions])

  if (!pitch) {
    if (!state.data) return null
    return (
      <aside className="drawer" role="dialog" aria-label="Pitch not found">
        <header className="drawer-head">
          <h2>Pitch not found</h2>
          <button className="icon-btn" onClick={() => actions.selectPitch(null)} aria-label="Close">
            ✕
          </button>
        </header>
        <p className="hint">That pitch is not in the current dataset.</p>
      </aside>
    )
  }
  const t = PITCH_TYPES[pitch.type]
  const name = pitchName(pitch)

  return (
    <aside className="drawer" role="dialog" aria-label={name}>
      <header className="drawer-head">
        <div>
          <p className="drawer-type" style={{ color: t.color }}>
            <span className="type-dot" style={{ background: t.color }} />
            {t.label}
          </p>
          <h2>{name}</h2>
          <p className="drawer-sub">
            {[pitch.name ? pitch.area : null, pitch.operator].filter(Boolean).join(' · ')}
          </p>
        </div>
        <button className="icon-btn" onClick={() => actions.selectPitch(null)} aria-label="Close">
          ✕
        </button>
      </header>

      <PitchContent pitch={pitch} />

      <p className="hint">
        <Link href={actions.pitchHref(pitch.id)}>Open this pitch as a page</Link>
      </p>
    </aside>
  )
}

/** Pitch content for the phone bottom sheet: a back row, the header, the body. */
export function PitchSheet() {
  const { state, pitchById, actions } = useStore()
  const pitch = pitchById.get(state.selectedPitchId)
  if (!pitch) {
    return (
      <div className="pitch-sheet">
        <button className="back-row" onClick={() => actions.selectPitch(null)}>
          Back to results
        </button>
        {state.data && <p className="hint">That pitch is not in the current dataset.</p>}
      </div>
    )
  }
  const t = PITCH_TYPES[pitch.type]
  const name = pitchName(pitch)
  return (
    <div className="pitch-sheet">
      <button className="back-row" onClick={() => actions.selectPitch(null)}>
        Back to results
      </button>
      <header className="drawer-head">
        <div>
          <p className="drawer-type" style={{ color: t.color }}>
            <span className="type-dot" style={{ background: t.color }} />
            {t.label}
          </p>
          <h2>{name}</h2>
          <p className="drawer-sub">
            {[pitch.name ? pitch.area : null, pitch.operator].filter(Boolean).join(' · ')}
          </p>
        </div>
      </header>
      <PitchContent pitch={pitch} />
      <p className="hint">
        <Link href={actions.pitchHref(pitch.id)}>Open this pitch as a page</Link>
      </p>
    </div>
  )
}
