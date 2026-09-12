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

function money(n) {
  return Number.isInteger(n) ? `£${n}` : `£${n.toFixed(2)}`
}

/**
 * 'from £42/hr' or 'from £95 for 40 min', and '£9.50 each for 10' (the
 * cheapest slot split between the group), or an honest 'Price on booking'.
 */
export function priceLine(pitch, headCount = 0) {
  const cost = costOf(pitch)
  if (!cost.known) return { known: false, main: 'Price on booking', each: null }
  if (cost.perHour === 0) return { known: true, main: 'Free', each: null }
  const range = pitch.priceMax != null && pitch.priceMax > cost.perHour
  const { amount, minutes } = cost.slot
  const each =
    headCount >= 2
      ? `${money(Math.ceil((amount / headCount) * 100) / 100)} each for ${headCount}`
      : null
  const main =
    minutes === 60
      ? `${range ? 'from ' : ''}${money(amount)}/hr`
      : `${range ? 'from ' : ''}${money(amount)} for ${minutes} min`
  return { known: true, main, each }
}

const UNIT_LABEL = { hour: '/hr', session: ' a session', person: ' a player' }

/** '5-a-side, Mon to Thu, kick-off 10:00 to 17:30' -> { days, when }. */
function splitSlotLabel(label) {
  const rest = String(label || '').replace(/^\d+-a-side,\s*/, '')
  const at = rest.indexOf(', kick-off ')
  if (at < 0) return { days: rest, when: '' }
  return { days: rest.slice(0, at), when: rest.slice(at + 2) }
}

function SourceLink({ url, children }) {
  return url ? (
    <a href={url} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ) : (
    children
  )
}

/**
 * The slots on sale, by pitch size: each row is a set of days and kick-off
 * times at one price for one slot length, read from the booking calendar.
 */
function SlotPrices({ pitch, lines, stated }) {
  const groups = new Map()
  for (const l of lines) {
    const key = l.format || 0
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(l)
  }
  const order = [...groups.keys()].sort((a, b) => a - b)
  const source = lines[0].source
  const url = pitch.priceSourceUrl || lines[0].sourceUrl
  const read = pitch.priceCheckedAt || lines[0].checkedAt
  const slotsSeen = lines.reduce((n, l) => n + (l.slotsSeen || 0), 0)
  return (
    <>
      {order.map((format) => {
        const rows = groups.get(format)
        const surface = rows.find((r) => r.surface)?.surface
        return (
          <table className="price-table" key={format}>
            <caption>
              {format ? `${format}-a-side` : 'Pitch'}
              {surface === '3g' ? ' on 3G' : surface === 'astro' ? ' on astroturf' : ''}
            </caption>
            <tbody>
              {rows.map((l, i) => {
                const { days, when } = splitSlotLabel(l.label)
                return (
                  <tr key={`${l.amount}-${l.minutes}-${i}`}>
                    <th scope="row">
                      <span className="price-days">{days}</span>
                      {when && <span className="price-when">{when}</span>}
                    </th>
                    <td>
                      <strong className="price-amount">{money(l.amount)}</strong>
                      <span className="price-unit">
                        {l.minutes === 60 ? ' an hour' : ` for ${l.minutes} min`}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )
      })}
      {stated.length > 0 && (
        <ul className="price-list price-stated">
          {stated.map((l, i) => (
            <li key={`${l.amount}-${l.unit}-${i}`}>
              <span className="price-label">{l.label}</span>
              <strong className="price-amount">
                {money(l.amount)}
                <span className="price-unit">{UNIT_LABEL[l.unit] || ''}</span>
              </strong>
            </li>
          ))}
        </ul>
      )}
      <p className="fact-source">
        {source === 'pitchbooking' ? (
          <>
            The slots on sale on Goals&rsquo; own booking site,{' '}
            <SourceLink url={url}>{sourceHost(url) || 'pitchbooking.com'}</SourceLink>
          </>
        ) : (
          <>
            The slots on sale on <SourceLink url={url}>Playfinder</SourceLink>, which sells this
            venue&rsquo;s pitches
          </>
        )}
        {read ? `, read ${formatDate(read)}` : ''}
        {slotsSeen ? ` from ${slotsSeen} slots over the coming week` : ''}. The booking page shows
        the exact slot.
        {stated.length > 0 && ' Per-player prices are the operator\u2019s own words.'}
      </p>
    </>
  )
}

/**
 * Every price known for the venue. With a booking calendar read, the slots on
 * sale by pitch size; otherwise the pitch-hire rate (curated baseline or the
 * operator's page) and each price the operator's page states. Each carries
 * its source.
 */
export function PriceBlock({ pitch }) {
  const cost = costOf(pitch)
  const all = Array.isArray(pitch.prices) ? pitch.prices : []
  const slotLines = all.filter((l) => l.unit === 'slot' && l.amount != null)
  const stated = all.filter((l) => l.unit !== 'slot')
  const hire =
    !slotLines.length && cost.known && cost.perHour > 0
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
      {slotLines.length ? (
        <SlotPrices pitch={pitch} lines={slotLines} stated={stated} />
      ) : lines.length ? (
        <ul className="price-list">
          {lines.map((l, i) => (
            <li key={l.key || `${l.amount}-${l.unit}-${i}`}>
              <span className="price-label">{l.label}</span>
              <strong className="price-amount">
                {l.from ? 'from ' : ''}
                {money(l.amount)}
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
      {!slotLines.length && (
        <p className="fact-source">
          {hire && (
            <>
              Pitch hire is the whole pitch for an hour, from{' '}
              <SourceLink url={pitch.priceSourceUrl}>{hireHost || 'the operator'}</SourceLink>
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
          {!hire &&
            !stated.length &&
            !pitch.bookingUrl &&
            'No booking page is known for this pitch.'}
        </p>
      )}
    </section>
  )
}

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
            ) : pitch.hoursSource === 'playfinder' ? (
              <>
                The hours listed on <SourceLink url={pitch.hoursSourceUrl}>Playfinder</SourceLink>
                {pitch.hoursCheckedAt ? `, checked ${formatDate(pitch.hoursCheckedAt)}` : ''}. The
                venue may open longer for direct bookings.
              </>
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
