import React from 'react'
import { useStore } from '../lib/store.jsx'
import { PITCH_TYPES } from '../data/types.js'
import { formatDate } from '../lib/format.js'

export function About() {
  const { state } = useStore()
  const data = state.data

  return (
    <div className="about">
      <h1>About PitchFinder</h1>
      <p>
        PitchFinder helps a group of friends pick where to play football in London. Add where
        everyone is coming from and it ranks {data ? data.count.toLocaleString('en-GB') : 'the'}{' '}
        places to play by journey time, price and facilities, then gives you one link for the group
        chat. Anyone with the link sees the same list, and a game link lets everyone say in or out.
      </p>

      <h2>What counts as a pitch</h2>
      <ul className="about-list">
        {Object.entries(PITCH_TYPES).map(([key, t]) => (
          <li key={key}>
            <span className="type-dot" style={{ background: t.color }} />
            <strong>{t.label}</strong>
            {data?.byType?.[key] != null && (
              <span className="dim"> ({data.byType[key].toLocaleString('en-GB')})</span>
            )}
            : {t.blurb}
          </li>
        ))}
      </ul>

      <h2>Where the data comes from</h2>
      <p>
        Pitch locations and attributes come from{' '}
        <a href="https://www.openstreetmap.org/about" target="_blank" rel="noopener noreferrer">
          OpenStreetMap
        </a>{' '}
        (© OpenStreetMap contributors, ODbL), refreshed every week
        {data?.generatedAt ? `, last on ${formatDate(data.generatedAt)}` : ''}. Pitches with no name
        on the map are named after the park, playing field or road they sit on; each pitch page says
        when that is the case. Nearest postcodes come from postcodes.io and road names from
        Nominatim. Bookable venues carry the operator&rsquo;s published price with a link to where
        it was seen; when a venue sets prices at booking we say so rather than guess.
      </p>
      <p>
        Journey times are estimates from distance and typical speeds, and are labelled as such.
        Check a journey planner before you set off.
      </p>

      <h2>Something wrong?</h2>
      <p>
        Every pitch page has a &ldquo;Report a problem&rdquo; button. Fixing a pitch on
        OpenStreetMap also fixes it here after the next refresh, and improves the map for everyone.
      </p>
    </div>
  )
}
