import React from 'react'
import { SquadBuilder } from './SquadBuilder.jsx'
import { Filters } from './Filters.jsx'
import { PitchMap } from './PitchMap.jsx'
import { ResultsList } from './ResultsList.jsx'

export function Finder() {
  return (
    <div className="finder">
      <aside className="finder-side">
        <SquadBuilder />
        <Filters />
      </aside>
      <div className="finder-main">
        <PitchMap />
        <ResultsList />
      </div>
    </div>
  )
}
