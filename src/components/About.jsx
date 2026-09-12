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
        Nominatim.
      </p>
      <p>
        Prices are read from the booking calendars every week: Goals&rsquo; own booking site
        (Pitchbooking) for Goals, and{' '}
        <a href="https://www.playfinder.com/" target="_blank" rel="noopener noreferrer">
          Playfinder
        </a>
        , which sells the pitches, for Powerleague and the council, club and leisure-centre astros.
        Each price says the pitch size, the days and kick-off times it was seen on, the slot length,
        where it was read, when, and from how many slots. Opening times come from the
        operator&rsquo;s own page where it has one, otherwise from the booking site&rsquo;s listing,
        and say which. Powerleague&rsquo;s own site does not answer automated readers, so its facts
        come from Playfinder and say so. When a venue publishes nothing we say so rather than guess.
      </p>
      <p>
        Walking, cycling and driving times on the cards and pitch pages are routed by OSRM over
        OpenStreetMap roads, door to door, and are tagged &ldquo;route&rdquo;. Public transport
        times, and anything the router could not answer, are estimates from straight-line distance
        and typical speeds, tagged &ldquo;est.&rdquo;. The ranking uses the estimates so the list is
        instant. Check a journey planner before you set off.
      </p>

      <h2>Something wrong?</h2>
      <p>
        Every pitch page has a &ldquo;Report a problem&rdquo; button. Fixing a pitch on
        OpenStreetMap also fixes it here after the next refresh, and improves the map for everyone.
      </p>
    </div>
  )
}
