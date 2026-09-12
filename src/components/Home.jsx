// The front door: what PitchFinder is, how it works, and a quick start that
// puts the first person on the map. Plain sections, real numbers from the
// dataset, one primary action.

import React, { useState } from 'react'
import { useStore } from '../lib/store.jsx'
import { AREAS } from '../data/areas.js'
import { PITCH_TYPES } from '../data/types.js'
import { resolveLocation } from '../lib/geocode-client.js'
import { encodeGroup } from '../lib/url-state.js'
import { formatDate } from '../lib/format.js'
import { navigate } from '../lib/location.js'
import { Link } from './Link.jsx'

const STEPS = [
  {
    title: 'Everyone says where they are coming from',
    body: 'Share one group link. Each person adds their own postcode or area, how they travel and what they need. Nothing needs an account.',
  },
  {
    title: 'Get a short list you can trust',
    body: 'Every pitch in London ranked for the whole group: journey times routed door to door, prices from the operator, floodlights and surface from the map.',
  },
  {
    title: 'Share one link, everyone says in or out',
    body: 'The link unfurls in the chat with the pitch, day and time. Friends answer without signing up, and the organiser sees the count update.',
  },
]

const FEATURES = [
  {
    title: 'Journey times for everyone',
    body: 'Walking, cycling and driving are routed over real roads and tagged as routes. Anything estimated says so.',
  },
  {
    title: 'Prices with a source',
    body: 'Bookable venues show the operator’s published rate and where it was seen. When a venue prices at booking, we say that rather than guess.',
  },
  {
    title: 'A game link that works on the night',
    body: 'Nearest postcode, one-tap directions, a calendar file and a message ready to paste into the group chat.',
  },
  {
    title: 'Answers without accounts',
    body: 'Guests say in, maybe or out with just a name. Their phone remembers them, and a moved kick-off asks everyone again.',
  },
  {
    title: 'Filters that tell the truth',
    body: 'Floodlit, free, bookable, budget per head, format: each option says how many pitches it leaves before you tap it.',
  },
  {
    title: 'Open data, refreshed weekly',
    body: 'Pitches come from OpenStreetMap and are rebuilt every week. Report a problem from any pitch page.',
  },
]

function QuickStart() {
  const { state, actions } = useStore()
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    const q = query.trim()
    if (!q) {
      setError('Type a postcode or an area first.')
      return
    }
    setBusy(true)
    setError('')
    try {
      const { results, offline } = await resolveLocation(q, { areas: AREAS })
      if (results.length) {
        const hit = results[0]
        const g = encodeGroup([
          { name: 'You', label: hit.label, lat: hit.lat, lng: hit.lng, mode: 'transit' },
        ])
        navigate(`/find?g=${g}`)
      } else if (offline) {
        setError('Place search needs a connection. Try a postcode or an area name.')
      } else {
        setError('No match in London for that. Try a postcode or a nearby area.')
      }
    } catch {
      setError('Could not search right now. Open the map and add yourself there.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="quick-start" onSubmit={submit} aria-labelledby="quick-start-title">
      <h2 id="quick-start-title" className="quick-start-title">
        Where are you coming from?
      </h2>
      <div className="quick-start-row">
        <input
          className="input"
          type="search"
          inputMode="text"
          autoComplete="postal-code"
          placeholder="Postcode or area, e.g. E8 3DL or Peckham"
          aria-label="Your postcode or area"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn primary" type="submit" disabled={busy}>
          {busy ? 'Finding' : 'Start'}
        </button>
      </div>
      {error ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : (
        <p className="hint dim">
          Add the rest of the group on the next screen.{' '}
          <Link href="/find">
            Or browse all {state.data ? state.data.count.toLocaleString('en-GB') : ''} pitches
          </Link>
          .
        </p>
      )}
      {state.authAvailable && (
        <p className="quick-start-group">
          Organising for a group?{' '}
          <button
            type="button"
            className="link-btn"
            onClick={() => actions.createSharedGroup('Football').catch(() => {})}
          >
            Create a group link
          </button>{' '}
          and everyone adds themselves.
        </p>
      )}
    </form>
  )
}

export function Home() {
  const { state } = useStore()
  const data = state.data
  const priced = data ? data.pitches.filter((p) => p.pricePerHour > 0).length : null
  const lit = data ? data.pitches.filter((p) => p.lit === true).length : null

  return (
    <div className="home">
      <section className="home-intro">
        <div className="home-intro-copy">
          <p className="empty-kicker">Football in London</p>
          <h1>Pick a pitch the whole group can get to.</h1>
          <p className="home-lead">
            PitchFinder ranks every football pitch in London for your group, from wherever each
            person starts, then gives you one link for the chat so everyone can say in or out.
          </p>
          <div className="home-actions">
            <Link className="btn primary lg" href="/find">
              Find a pitch
            </Link>
            <a className="btn ghost lg" href="#how">
              How it works
            </a>
          </div>
        </div>
        <QuickStart />
      </section>

      <section className="home-stats" aria-label="What is on the map">
        <div>
          <strong>{data ? data.count.toLocaleString('en-GB') : '…'}</strong>
          <span>places to play</span>
        </div>
        <div>
          <strong>{lit != null ? lit.toLocaleString('en-GB') : '…'}</strong>
          <span>known to be floodlit</span>
        </div>
        <div>
          <strong>{priced != null ? priced : '…'}</strong>
          <span>bookable venues with a published price</span>
        </div>
        <div>
          <strong>{data?.generatedAt ? formatDate(data.generatedAt) : '…'}</strong>
          <span>data last refreshed</span>
        </div>
      </section>

      <section id="how" className="home-section" aria-labelledby="how-title">
        <h2 id="how-title">How it works</h2>
        <ol className="home-steps">
          {STEPS.map((s, i) => (
            <li key={s.title}>
              <span className="home-step-n">{i + 1}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="home-section" aria-labelledby="types-title">
        <h2 id="types-title">Browse by type</h2>
        <ul className="home-types">
          {Object.entries(PITCH_TYPES).map(([key, t]) => (
            <li key={key}>
              <Link href={`/find?t=${key}`} className="home-type">
                <span className="home-type-head">
                  <span className="type-dot" style={{ background: t.color }} />
                  <strong>{t.label}</strong>
                  {data?.byType?.[key] != null && (
                    <span className="dim">{data.byType[key].toLocaleString('en-GB')}</span>
                  )}
                </span>
                <span className="home-type-blurb">{t.blurb}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="home-section" aria-labelledby="features-title">
        <h2 id="features-title">What you get</h2>
        <ul className="home-features">
          {FEATURES.map((f) => (
            <li key={f.title}>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="home-section home-trust" aria-labelledby="trust-title">
        <h2 id="trust-title">Where the data comes from</h2>
        <p>
          Pitch locations and facilities come from OpenStreetMap (© OpenStreetMap contributors,
          ODbL). Postcodes come from postcodes.io, routes from OSRM, and prices from each
          operator&rsquo;s own pages. Nothing is guessed: where a fact is not known, the page says
          so. <Link href="/about">More about the data</Link>.
        </p>
      </section>
    </div>
  )
}
