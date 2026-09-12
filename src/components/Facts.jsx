// The facts a bookable venue shows everywhere: what it costs, when it is
// open, what it has, who runs it. Every figure carries its source. Nothing
// is inferred: a fact the operator does not publish says so.

import React from 'react'
import { BRANDS, brandOf } from '../data/types.js'
import { DAYS, formatHours, openState } from '../lib/hours.js'
import { formatDate } from '../lib/format.js'
import { costOf } from '../lib/data.js'

export function sourceHost(url) {
  try {
    return new URL(url).host.replace(/^www\./, '')
  } catch {
    return null
  }
}

export function BrandBadge({ pitch, className = '' }) {
  const key = brandOf(pitch)
  const b = BRANDS[key]
  return (
    <span className={`brand-badge brand-${key} ${className}`.trim()} title={b.label}>
      {b.short}
    </span>
  )
}

/** 'from £42/hr' and '£7 each for 6', or an honest 'price on booking'. */
export function priceLine(pitch, headCount = 0) {
  const cost = costOf(pitch)
  if (!cost.known) return { known: false, main: 'Price on booking', each: null }
  if (cost.perHour === 0) return { known: true, main: 'Free', each: null }
  const range = pitch.priceMax != null && pitch.priceMax > cost.perHour
  const each =
    headCount >= 2
      ? `£${Math.ceil((cost.perHour / headCount) * 100) / 100} each for ${headCount}`
      : null
  return { known: true, main: `${range ? 'from ' : ''}£${cost.perHour}/hr`, each }
}

const UNIT_LABEL = { hour: '/hr', session: ' a session', person: ' a player' }

/**
 * Every price known for the venue: the pitch-hire rate (curated baseline or
 * the operator's page) and each price the operator's page states with what
 * it is for. Each carries its source.
 */
export function PriceBlock({ pitch }) {
  const cost = costOf(pitch)
  const stated = Array.isArray(pitch.prices) ? pitch.prices : []
  const hire =
    cost.known && cost.perHour > 0
      ? {
          key: 'hire',
          label: 'Pitch hire',
          amount: cost.perHour,
          unit: 'hour',
          from: pitch.priceMax != null && pitch.priceMax > cost.perHour,
        }
      : null
  const lines = [
    ...(hire ? [hire] : []),
    ...stated.filter((l) => !(hire && l.unit === 'hour' && l.amount === hire.amount)),
  ]
  const hireHost = sourceHost(pitch.priceSourceUrl)
  const pageHost = sourceHost(pitch.sourceUrl || pitch.bookingUrl)
  const readOn = pitch.hoursCheckedAt || pitch.verifiedAt
  return (
    <section className="fact-block" aria-labelledby={`price-${pitch.id}`}>
      <h2 id={`price-${pitch.id}`} className="fact-title">
        Prices
      </h2>
      {lines.length ? (
        <ul className="price-list">
          {lines.map((l, i) => (
            <li key={l.key || `${l.amount}-${l.unit}-${i}`}>
              <span className="price-label">{l.label}</span>
              <strong className="price-amount">
                {l.from ? 'from ' : ''}£{l.amount}
                <span className="price-unit">{UNIT_LABEL[l.unit] || ''}</span>
              </strong>
            </li>
          ))}
        </ul>
      ) : cost.known && cost.perHour === 0 ? (
        <p className="fact-line">Free to play.</p>
      ) : (
        <p className="fact-line">
          <strong>Not published online.</strong> The booking page shows the price for your slot.
        </p>
      )}
      <p className="fact-source">
        {hire && (
          <>
            Pitch hire is the whole pitch for an hour, from{' '}
            {pitch.priceSourceUrl ? (
              <a href={pitch.priceSourceUrl} target="_blank" rel="noopener noreferrer">
                {hireHost || 'the operator'}
              </a>
            ) : (
              'the operator'
            )}
            {pitch.priceCheckedAt
              ? `, checked ${formatDate(pitch.priceCheckedAt)}`
              : ', date not recorded'}
            . Peak slots can cost more.{' '}
          </>
        )}
        {stated.length > 0 && (
          <>
            Per-player prices are the operator&rsquo;s own words
            {pageHost ? ` on ${pageHost}` : ''}
            {readOn ? `, read ${formatDate(readOn)}` : ''}.{' '}
          </>
        )}
        {!hire && !stated.length && pitch.bookingUrl && (
          <>
            Set at booking on{' '}
            <a href={pitch.bookingUrl} target="_blank" rel="noopener noreferrer">
              {pageHost || 'the booking page'}
            </a>
            .
          </>
        )}
        {!hire && !stated.length && !pitch.bookingUrl && 'No booking page is known for this pitch.'}
      </p>
    </section>
  )
}

/** Opening times as a week, today first in words, with the source. */
export function HoursBlock({ pitch, now = new Date() }) {
  const week = pitch.hours || null
  const today = DAYS[(now.getDay() + 6) % 7]
  const state = openState(week, now)
  const host = sourceHost(pitch.hoursSourceUrl || pitch.sourceUrl)
  return (
    <section className="fact-block" aria-labelledby={`hours-${pitch.id}`}>
      <h2 id={`hours-${pitch.id}`} className="fact-title">
        Opening times
      </h2>
      {week ? (
        <>
          <p className={`open-state ${state.open ? 'is-open' : 'is-closed'}`}>
            <span className="open-dot" aria-hidden="true" />
            {state.label}
          </p>
          <table className="hours-table">
            <tbody>
              {formatHours(week).map((line) => {
                const isToday = line.days === 'Every day' || line.days.includes(labelFor(today))
                return (
                  <tr key={line.days} className={isToday ? 'today' : ''}>
                    <th scope="row">{line.days}</th>
                    <td>{line.times}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <p className="fact-source">
            {pitch.hoursSource === 'osm' ? (
              <>From OpenStreetMap. Hours can change: check before travelling.</>
            ) : (
              <>
                From{' '}
                {pitch.hoursSourceUrl ? (
                  <a href={pitch.hoursSourceUrl} target="_blank" rel="noopener noreferrer">
                    {host || 'the operator'}
                  </a>
                ) : (
                  host || 'the operator'
                )}
                {pitch.hoursCheckedAt ? `, checked ${formatDate(pitch.hoursCheckedAt)}` : ''}.
              </>
            )}
          </p>
        </>
      ) : (
        <p className="fact-line">
          <strong>Not published online.</strong>{' '}
          {pitch.bookingUrl ? (
            <>
              The{' '}
              <a href={pitch.bookingUrl} target="_blank" rel="noopener noreferrer">
                booking page
              </a>{' '}
              shows the slots on offer.
            </>
          ) : (
            'Check with the venue before travelling.'
          )}
        </p>
      )}
    </section>
  )
}

function labelFor(day) {
  return { mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun' }[day]
}

/** Short open-now line for a card, or null when hours are not known. */
export function openLine(pitch, now = new Date()) {
  if (!pitch.hours) return null
  return openState(pitch.hours, now)
}

const FACILITIES = [
  ['lit', 'Floodlit'],
  ['covered', 'Under cover'],
  ['changingRooms', 'Changing rooms'],
  ['showers', 'Showers'],
  ['parking', 'Parking'],
  ['bar', 'Bar'],
  ['cafe', 'Café'],
]

/** What the venue has, as chips. Only what is known to be true appears. */
export function FacilityChips({ pitch, showFormats = true }) {
  const items = FACILITIES.filter(([k]) => pitch[k] === true).map(([, label]) => label)
  if (showFormats && Array.isArray(pitch.formats) && pitch.formats.length)
    items.unshift(pitch.formats.map((f) => `${f}-a-side`).join(' and '))
  if (pitch.surface === '3g') items.push('3G')
  else if (pitch.surface === 'astro') items.push('Astroturf')
  if (pitch.pitchCount > 1) items.push(`${pitch.pitchCount} pitches`)
  if (!items.length) return null
  return (
    <ul className="facility-chips" aria-label="Facilities">
      {items.map((label) => (
        <li key={label}>{label}</li>
      ))}
    </ul>
  )
}

/** A person as a coloured circle with their initials. */
export function Avatar({ name, size = 'md', you = false }) {
  const initials = String(name || '?')
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
  let hash = 0
  for (const c of String(name || '')) hash = (hash * 31 + c.charCodeAt(0)) % 360
  return (
    <span
      className={`avatar avatar-${size}${you ? ' you' : ''}`}
      style={{ '--hue': hash }}
      aria-hidden="true"
    >
      {initials || '?'}
    </span>
  )
}

export function AvatarStack({ names, max = 5 }) {
  const shown = names.slice(0, max)
  const extra = names.length - shown.length
  return (
    <span className="avatar-stack" aria-label={names.join(', ')}>
      {shown.map((n, i) => (
        <Avatar key={`${n}-${i}`} name={n} size="sm" />
      ))}
      {extra > 0 && <span className="avatar avatar-sm more">+{extra}</span>}
    </span>
  )
}

/** A short burst for a moment worth marking. Nothing moves when motion is reduced. */
export function Confetti({ active }) {
  if (!active) return null
  return (
    <span className="confetti" aria-hidden="true">
      {Array.from({ length: 14 }, (_, i) => (
        <i key={i} style={{ '--i': i }} />
      ))}
    </span>
  )
}
