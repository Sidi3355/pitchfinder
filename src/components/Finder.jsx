import React, { useState } from 'react'
import { useStore } from '../lib/store.jsx'
import { MapView } from './MapView.jsx'
import { MapBoundary } from './MapBoundary.jsx'
import { SquadBuilder } from './SquadBuilder.jsx'
import { Filters } from './Filters.jsx'
import { ResultsList } from './ResultsList.jsx'

export function Finder() {
  const { state, actions } = useStore()
  const [tab, setTab] = useState('results') // 'results' | 'group' | 'filters'

  return (
    <div className="finder">
      <aside className="side">
        <div className="side-tabs" role="tablist">
          {[
            ['results', 'Results'],
            ['group', 'Your group'],
            ['filters', 'Filters'],
          ].map(([key, label]) => (
            <button
              key={key}
              role="tab"
              aria-selected={tab === key}
              className={tab === key ? 'active' : ''}
              onClick={() => setTab(key)}
            >
              {label}
              {key === 'group' && state.squad.length > 0 && (
                <span className="tab-badge">{state.squad.length}</span>
              )}
            </button>
          ))}
        </div>

        <div className="side-body">
          {tab === 'results' && state.dataError && (
            <div className="state-block error" role="alert">
              <p>
                <strong>Could not load pitch data.</strong>
              </p>
              <p>Check your connection and try again.</p>
              <button className="btn primary sm" onClick={actions.retryData}>
                Try again
              </button>
            </div>
          )}
          {tab === 'results' && state.dataLoading && (
            <div className="skeleton" aria-busy="true" aria-label="Loading pitches">
              <div className="skeleton-card" />
              <div className="skeleton-card" />
              <div className="skeleton-card" />
            </div>
          )}
          {tab === 'results' && state.data && <ResultsList />}
          {tab === 'group' && <SquadBuilder />}
          {tab === 'filters' && <Filters />}
        </div>
      </aside>

      <div className="map-pane">
        <MapBoundary>
          <MapView />
        </MapBoundary>
        {state.data && (
          <div className="map-data-note">
            Pitch data © OpenStreetMap contributors · updated{' '}
            {new Date(state.data.generatedAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </div>
        )}
      </div>
    </div>
  )
}
