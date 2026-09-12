// The front door: what PitchFinder is, one big way in, real numbers from the
// dataset, and how it works. Bold, full-width and short; the tool is one tap
// away.

import React, { useState } from 'react'
import { useStore } from '../lib/store.jsx'
import { AREAS } from '../data/areas.js'
import { BRANDS, brandOf } from '../data/types.js'
import { resolveLocation } from '../lib/geocode-client.js'
import { encodeGroup } from '../lib/url-state.js'
import { formatDate } from '../lib/format.js'
import { navigate } from '../lib/location.js'
import { Link } from './Link.jsx'

const STEPS = [
  {
    emoji: '🔗',
    title: 'Make a group link',
    body: 'One tap. Send it to the chat. No app to install, no accounts for your mates.',
  },
  {
    emoji: '📍',
    title: 'Everyone adds themselves',
    body: 'Each person puts in where they are coming from, how they travel and what they need: budget, size, floodlights, days.',
  },
  {
    emoji: '🏆',
    title: 'Get the pitches that work for everyone',
    body: 'Goals, Powerleague and astro hire across London, ranked by journey time for the whole group, with prices and opening times from the operator.',
  },
]

const FEATURES = [
  {
    title: 'Prices you can plan around',
    body: 'Per hour, per player, peak and off-peak, straight from the operator, with the date it was read. What is not published says so.',
  },
  {
    title: 'Opening times, live',
    body: 'Open now, opens at 9am, closed Sundays: each venue shows its week and whether it is open when you want to play.',
  },
  {
    title: 'Journey times for everyone',
    body: 'Walking, cycling and driving routed over real roads. Anything estimated is labelled.',
  },
  {
    title: 'An invite that works on the night',
    body: 'Kick-off, pitch, directions, who is in. Friends answer with a name and the count updates live.',
  },
  {
    title: 'Preferences that add up',
    body: 'Everyone says what they need. The group gets the tightest budget, the days everyone can do, and floodlights if anyone asked.',
  },
  {
    title: 'Honest data, refreshed weekly',
    body: 'Operators are read every week; the map comes from OpenStreetMap. Report a problem from any pitch page.',
  },
]

function QuickStart() {
  const { state } = useStore()
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
            Or browse all {state.data ? state.data.count.toLocaleString('en-GB') : ''} places
          </Link>
          .
        </p>
      )}
    </form>
  )
}

export function Home() {
  const { state, actions } = useStore()
  const data = state.data
  const priced = data ? data.pitches.filter((p) => p.pricePerHour > 0).length : null
  const hours = data ? data.pitches.filter((p) => p.hours).length : null
  const byBrand = data
    ? data.pitches.reduce((acc, p) => {
        const b = brandOf(p)
        acc[b] = (acc[b] || 0) + 1
        return acc
      }, {})
    : null

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-glow" aria-hidden="true">
          <span className="blob b1" />
          <span className="blob b2" />
          <span className="blob b3" />
        </div>
        <div className="hero-inner">
          <p className="kicker hero-kicker appear">London 5-a-side, 7-a-side and astro hire</p>
          <h1 className="hero-title appear">
            Pick a pitch the <em>whole group</em> can get to.
          </h1>
          <p className="hero-lead appear d1">
            One link. Everyone adds where they are coming from and what they need. PitchFinder ranks
            Goals, Powerleague and astro pitches across London for all of you, with real slot prices
            and opening times.
          </p>
          <div className="hero-actions appear d2">
            {state.authAvailable ? (
              <button
                className="btn primary xl"
                onClick={() => actions.createSharedGroup('Football').catch(() => {})}
              >
                Create a group link
              </button>
            ) : (
              <Link className="btn primary xl" href="/find">
                Find a pitch
              </Link>
            )}
            <Link className="btn ghost xl" href="/find">
              Browse the map
            </Link>
          </div>
          <div className="appear d3">
            <QuickStart />
          </div>
        </div>
        <div className="hero-mockup appear d4">
          <div className="mockup-frame">
            <div className="mockup">
              <img
                src="/img/finder-desktop.jpg"
                alt="The finder: a map of London with a ranked list of pitches for a group of three, each card showing the price, whether it is open and everyone's journey time"
                width="1280"
                height="800"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="home-stats" aria-label="What is on the map">
        <div>
          <strong>{data ? data.count.toLocaleString('en-GB') : '…'}</strong>
          <span>places to book</span>
        </div>
        <div>
          <strong>{priced != null ? priced : '…'}</strong>
          <span>with a published price</span>
        </div>
        <div>
          <strong>{hours != null ? hours : '…'}</strong>
          <span>with opening times</span>
        </div>
        <div>
          <strong>{data?.generatedAt ? formatDate(data.generatedAt) : '…'}</strong>
          <span>last refreshed</span>
        </div>
      </section>

      <section id="how" className="home-section" aria-labelledby="how-title">
        <h2 id="how-title">How it works</h2>
        <ol className="home-steps">
          {STEPS.map((s, i) => (
            <li key={s.title}>
              <span className="home-step-n" aria-hidden="true">
                <span className="home-step-emoji">{s.emoji}</span>
                {i + 1}
              </span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="home-section" aria-labelledby="types-title">
        <h2 id="types-title">Where to play</h2>
        <ul className="home-types">
          {Object.entries(BRANDS).map(([key, b]) => (
            <li key={key}>
              <Link href={`/find?op=${key}`} className={`home-type brand-${key}`}>
                <span className="home-type-head">
                  <span className="brand-badge">{b.short}</span>
                  <strong>{b.label}</strong>
                  {byBrand?.[key] != null && (
                    <span className="dim">{byBrand[key].toLocaleString('en-GB')}</span>
                  )}
                </span>
                <span className="home-type-blurb">
                  {key === 'goals'
                    ? 'Floodlit 3G centres, 5 and 7-a-side, bookable by the hour.'
                    : key === 'powerleague'
                      ? 'Caged 5, 6 and 7-a-side pitches with changing rooms and a bar.'
                      : 'Council and club astros, sports hubs and leisure centres you can hire.'}
                </span>
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
          Prices, opening times and facilities are read from each operator&rsquo;s own pages every
          week, with the date shown. Pitch locations come from OpenStreetMap (© OpenStreetMap
          contributors, ODbL), postcodes from postcodes.io and routes from OSRM. Nothing is guessed:
          where a fact is not known, the page says so.{' '}
          <Link href="/about">More about the data</Link>.
        </p>
      </section>
    </div>
  )
}
