import React, { useEffect } from 'react'
import { useStore } from '../lib/store.jsx'
import { PITCH_TYPES, pitchName } from '../data/types.js'
import { PitchContent } from './PitchContent.jsx'
import { MiniMap } from './MiniMap.jsx'
import { MapBoundary } from './MapBoundary.jsx'
import { NotFound } from './NotFound.jsx'
import { Link } from './Link.jsx'

export function PitchPage({ id }) {
  const { state, pitchById, actions } = useStore()
  const pitch = pitchById.get(id)

  useEffect(() => {
    if (pitch) document.title = `${pitchName(pitch)}: PitchFinder`
  }, [pitch])

  if (state.dataError) {
    return (
      <section className="empty-page" role="alert">
        <p className="empty-kicker">Could not load pitch data</p>
        <h1 className="empty-title">The pitch list did not download.</h1>
        <p className="empty-body">Check your connection and try again.</p>
        <button className="btn primary" onClick={actions.retryData}>
          Try again
        </button>
      </section>
    )
  }
  if (!state.data) {
    return (
      <section className="page-narrow" aria-busy="true">
        <p className="hint">Loading pitch…</p>
      </section>
    )
  }
  if (!pitch) return <NotFound kind="pitch" />

  const t = PITCH_TYPES[pitch.type]
  const name = pitchName(pitch)

  return (
    <article className="pitch-page">
      <nav className="page-back" aria-label="Breadcrumb">
        <Link href={actions.hrefFor('/')}>Back to results</Link>
      </nav>
      <header className="pitch-page-head">
        <p className="drawer-type" style={{ color: t.color }}>
          <span className="type-dot" style={{ background: t.color }} />
          {t.label}
        </p>
        <h1>{name}</h1>
        <p className="drawer-sub">{[pitch.area, pitch.operator].filter(Boolean).join(' · ')}</p>
      </header>
      <MapBoundary compact>
        <MiniMap pitch={pitch} />
      </MapBoundary>
      <div className="pitch-page-body">
        <PitchContent pitch={pitch} />
      </div>
    </article>
  )
}
