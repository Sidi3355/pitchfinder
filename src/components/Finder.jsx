import React, { useState } from 'react'
import { useStore } from '../lib/store.jsx'
import { MapView } from './MapView.jsx'
import { MapBoundary } from './MapBoundary.jsx'
import { SquadBuilder } from './SquadBuilder.jsx'
import { Filters } from './Filters.jsx'
import { ResultsList } from './ResultsList.jsx'

export function Finder() {
  const { state } = useStore()
  const [tab, setTab] = useState('results') // 'results' | 'group' | 'filters'

  return (
    <div className="finder">
      <aside className="side">
        {state.dataError && (
          <div className="notice error">
            Couldn&rsquo;t load pitch data ({state.dataError}). Refresh to try again.
          </div>
        )}
        {!state.data && !state.dataError && <div className="notice">Loading pitch data…</div>}

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
          {tab === 'results' && <ResultsList />}
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
