// The first screen: the group bar, the map and the ranked list on one
// surface. On phones the list is a bottom sheet over the map and a selected
// pitch takes the sheet over; on desktop it is a split view with the pitch
// in a drawer. Group and filter editing happen in panels.

import React, { Suspense, useCallback, useState } from 'react'
import { useStore } from '../lib/store.jsx'
import { MOBILE_QUERY, useMediaQuery } from '../lib/media.js'
// MapLibre (about 240 KB gzipped with its worker) loads only when a map is on screen.
const MapView = React.lazy(() => import('./MapView.jsx').then((m) => ({ default: m.MapView })))
import { MapBoundary } from './MapBoundary.jsx'
import { SquadBuilder } from './SquadBuilder.jsx'
import { Filters, countActiveFilters } from './Filters.jsx'
import { ResultsList } from './ResultsList.jsx'
import { GroupBar } from './GroupBar.jsx'
import { Panel } from './Panel.jsx'
import { Sheet, SNAPS } from './Sheet.jsx'
import { PitchSheet } from './PitchDetail.jsx'

function ResultsBody() {
  const { state, actions } = useStore()
  if (state.dataError) {
    return (
      <div className="state-block error" role="alert">
        <p>
          <strong>Could not load pitch data.</strong>
        </p>
        <p>Check your connection and try again.</p>
        <button className="btn primary sm" onClick={actions.retryData}>
          Try again
        </button>
      </div>
    )
  }
  if (state.dataLoading) {
    return (
      <div className="skeleton" aria-busy="true" aria-label="Loading pitches">
        <div className="skeleton-card" />
        <div className="skeleton-card" />
        <div className="skeleton-card" />
      </div>
    )
  }
  return <ResultsList />
}

function ListHeader({ onFilters }) {
  const { state, results } = useStore()
  const active = countActiveFilters(state.filters)
  const n = results.length
  return (
    <div className="list-header">
      <div className="list-title">
        <strong>
          {state.data
            ? `${n.toLocaleString('en-GB')} ${n === 1 ? 'pitch' : 'pitches'}`
            : state.dataError
              ? 'Pitches'
              : 'Loading pitches'}
        </strong>
        <span className="dim">
          {state.squad.length
            ? `ranked for your group of ${state.squad.length}`
            : 'add people to rank by journey'}
        </span>
      </div>
      <button
        className={`btn ghost sm${active ? ' on' : ''}`}
        onClick={onFilters}
        aria-label={`Filters${active ? `, ${active} on` : ''}`}
      >
        Filters{active ? ` · ${active}` : ''}
      </button>
    </div>
  )
}

export function Finder() {
  const { state, results, actions } = useStore()
  const mobile = useMediaQuery(MOBILE_QUERY)
  const [panel, setPanel] = useState(null) // null | 'group' | 'filters'
  const closePanel = useCallback(() => setPanel(null), [])
  const selected = state.selectedPitchId
  // The sheet opens fully for a newly selected pitch (its journeys and actions
  // are the point) and returns to half for the list; a drag overrides either
  // until the selection changes again.
  const [snapState, setSnapState] = useState({ key: null, snap: 'half' })
  const snap = snapState.key === selected ? snapState.snap : selected ? 'full' : 'half'
  const setSnap = useCallback((s) => setSnapState({ key: selected, snap: s }), [selected])
  const effectiveSnap = selected && snap === 'peek' ? 'half' : snap

  const panels = panel && (
    <Panel
      title={panel === 'group' ? 'Your group' : 'Filters'}
      onClose={closePanel}
      footer={
        panel === 'filters' ? (
          <>
            <button
              className="btn ghost"
              onClick={actions.resetFilters}
              disabled={!countActiveFilters(state.filters)}
            >
              Reset
            </button>
            <button className="btn primary" onClick={closePanel} disabled={!results.length}>
              {results.length
                ? `Show ${results.length.toLocaleString('en-GB')} ${results.length === 1 ? 'pitch' : 'pitches'}`
                : 'No pitches match'}
            </button>
          </>
        ) : (
          <button className="btn primary" onClick={closePanel} disabled={!state.squad.length}>
            {state.squad.length
              ? `Rank for ${state.squad.length} ${state.squad.length === 1 ? 'person' : 'people'}`
              : 'Add someone first'}
          </button>
        )
      }
    >
      {panel === 'group' ? <SquadBuilder /> : <Filters />}
    </Panel>
  )

  if (mobile) {
    return (
      <div className="finder mobile">
        <div className="map-pane">
          <MapBoundary>
            <Suspense fallback={<div className="map-loading" aria-hidden="true" />}>
              <MapView bottomPadding={Math.round(SNAPS[effectiveSnap] * 100)} />
            </Suspense>
          </MapBoundary>
          <GroupBar onEdit={() => setPanel('group')} />
        </div>
        <Sheet
          snap={effectiveSnap}
          onSnap={setSnap}
          label={selected ? 'Pitch' : 'Results'}
          header={selected ? null : <ListHeader onFilters={() => setPanel('filters')} />}
        >
          {selected ? <PitchSheet /> : <ResultsBody />}
        </Sheet>
        {panels}
      </div>
    )
  }

  return (
    <div className="finder">
      <aside className="side">
        <GroupBar onEdit={() => setPanel('group')} />
        <ListHeader onFilters={() => setPanel('filters')} />
        <div className="side-body">
          <ResultsBody />
        </div>
      </aside>
      <div className="map-pane">
        <MapBoundary>
          <Suspense fallback={<div className="map-loading" aria-hidden="true" />}>
            <MapView />
          </Suspense>
        </MapBoundary>
      </div>
      {panels}
    </div>
  )
}
