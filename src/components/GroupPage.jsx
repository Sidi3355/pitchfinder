// A shared group at /group/{slug}, laid out like an event page: the cover
// with the name, host and link on one side, and on the other your own
// entry, who is in, what the group needs and the best pitches for everyone.
// Everyone with the link adds themselves; nobody types the group in for
// anyone else. The organiser can rename the group or remove someone.

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useStore } from '../lib/store.jsx'
import * as sb from '../lib/supabase.js'
import { AREAS } from '../data/areas.js'
import { pitchName } from '../data/types.js'
import { TRAVEL_MODES, displayMinutes } from '../lib/geo.js'
import { resolveLocation, searchGazetteer, looksLikePostcode } from '../lib/geocode-client.js'
import { rankPitches } from '../lib/score.js'
import {
  BRAND_PREFS,
  BUDGETS,
  DAYPARTS,
  FORMATS,
  MAX_MINUTES,
  NEEDS,
  SURFACES,
  collateFilters,
  collateSummary,
  membersToSquad,
  prefsSummary,
} from '../lib/group-prefs.js'
import { DAYS } from '../lib/hours.js'
import { buildHref } from '../lib/url-state.js'
import { shareUrl } from '../lib/share.js'
import { setGuest, useGuest } from '../lib/guest.js'
import { Link } from './Link.jsx'
import { Avatar, AvatarStack, BrandBadge, openLine, priceLine } from './Facts.jsx'

const DAY_LABEL = {
  mon: 'Mon',
  tue: 'Tue',
  wed: 'Wed',
  thu: 'Thu',
  fri: 'Fri',
  sat: 'Sat',
  sun: 'Sun',
}

export function GroupPage({ slug }) {
  const { state } = useStore()
  const guest = useGuest()
  const available = state.authAvailable
  const [phase, setPhase] = useState('loading') // loading | ready | missing | error | unavailable
  const [group, setGroup] = useState(null)
  const [members, setMembers] = useState([])
  const [editing, setEditing] = useState(false)
  const [renaming, setRenaming] = useState(false)
  const [shareStatus, setShareStatus] = useState(null)
  const [justJoined, setJustJoined] = useState(false)

  const load = useCallback(async () => {
    if (!available) {
      setPhase('unavailable')
      return
    }
    try {
      const data = await sb.groupBySlug(slug, guest.key)
      if (!data) {
        setPhase('missing')
        return
      }
      setGroup(data.group)
      setMembers(data.members)
      setPhase('ready')
    } catch {
      setPhase((p) => (p === 'ready' ? p : 'error'))
    }
  }, [slug, guest.key, available])

  useEffect(() => {
    let active = true
    Promise.resolve().then(() => active && load())
    return () => {
      active = false
    }
  }, [load, state.user?.id])

  useEffect(() => {
    if (group) document.title = `${group.name}: PitchFinder`
  }, [group])

  // People add themselves from their own phones: refresh every 20 s while visible.
  useEffect(() => {
    if (phase !== 'ready') return undefined
    const id = setInterval(() => {
      if (document.visibilityState === 'visible') load()
    }, 20000)
    return () => clearInterval(id)
  }, [phase, load])

  useEffect(() => {
    if (!shareStatus) return undefined
    const t = setTimeout(() => setShareStatus(null), 2000)
    return () => clearTimeout(t)
  }, [shareStatus])

  useEffect(() => {
    if (!justJoined) return undefined
    const t = setTimeout(() => setJustJoined(false), 2500)
    return () => clearTimeout(t)
  }, [justJoined])

  const me = members.find((m) => m.is_you) || null
  const squad = useMemo(() => membersToSquad(members), [members])
  const filters = useMemo(() => collateFilters(members), [members])
  const summary = useMemo(() => collateSummary(members), [members])
  const picks = useMemo(
    () =>
      state.data && squad.length ? rankPitches(state.data.pitches, squad, filters).slice(0, 3) : [],
    [state.data, squad, filters],
  )
  const finderHref = buildHref('/find', { sharedGroup: slug, filters })

  async function share() {
    const result = await shareUrl({
      title: group?.name || 'Our group',
      text: 'Add where you are coming from and we will pick a pitch that works for everyone.',
      url: `${window.location.origin}/group/${slug}`,
    })
    if (result !== 'shared' && result !== 'cancelled') setShareStatus(result)
  }

  async function remove(member) {
    if (!window.confirm(`Take ${member.name} out of the group?`)) return
    await sb.removeGroupMember(member.id)
    await load()
  }

  async function leave() {
    await sb.groupLeave(slug, guest.key)
    setEditing(false)
    await load()
  }

  if (phase === 'unavailable') {
    return (
      <section className="empty-page" role="status">
        <p className="empty-kicker">Group unavailable</p>
        <h1 className="empty-title">
          Shared groups need the server, which this build has not got.
        </h1>
        <p className="empty-body">The map, ranking and pitch pages all work without it.</p>
        <Link className="btn primary" href="/find">
          Open the map
        </Link>
      </section>
    )
  }
  if (phase === 'loading') {
    return (
      <div className="page-narrow skeleton" aria-busy="true" aria-label="Loading the group">
        <div className="skeleton-card" />
        <div className="skeleton-card" />
      </div>
    )
  }
  if (phase === 'error') {
    return (
      <section className="empty-page" role="alert">
        <p className="empty-kicker">Group unavailable</p>
        <h1 className="empty-title">Could not load this group.</h1>
        <p className="empty-body">Check your connection and try again.</p>
        <button className="btn primary" onClick={load}>
          Try again
        </button>
      </section>
    )
  }
  if (phase === 'missing') {
    return (
      <section className="empty-page" role="status">
        <p className="empty-kicker">Group not found</p>
        <h1 className="empty-title">This link does not match a group.</h1>
        <p className="empty-body">Check the link you were sent, or start from the map.</p>
        <Link className="btn primary" href="/find">
          Open the map
        </Link>
      </section>
    )
  }

  const names = members.map((m) => m.name)

  return (
    <article className="event group-event">
      <aside className="event-cover">
        <div className="cover-tile tile-group" aria-hidden="true">
          <span className="cover-emoji">⚽</span>
        </div>
        <p className="kicker">Group link</p>
        {renaming ? (
          <RenameForm
            group={group}
            onDone={async () => {
              setRenaming(false)
              await load()
            }}
          />
        ) : (
          <h1 className="event-title">{group.name}</h1>
        )}
        <p className="event-host">
          <Avatar name={group.owner_name} size="sm" />
          <span>
            Hosted by <strong>{group.owner_name}</strong>
            {group.is_owner && !renaming && (
              <>
                {' · '}
                <button className="link-btn" onClick={() => setRenaming(true)}>
                  Rename
                </button>
              </>
            )}
          </span>
        </p>
        <p className="event-count">
          {names.length ? <AvatarStack names={names} /> : null}
          <span>
            {members.length === 0
              ? 'Nobody in yet'
              : `${members.length} ${members.length === 1 ? 'person' : 'people'} in`}
          </span>
        </p>
        <section className="event-share" aria-labelledby="share-title">
          <h2 id="share-title" className="visually-hidden">
            Send everyone this link
          </h2>
          <p className="share-lead">
            Send the link. Each person adds themselves, no account needed.
          </p>
          <button className="btn primary lg wide" onClick={share}>
            {shareStatus === 'copied'
              ? 'Link copied'
              : shareStatus === 'failed'
                ? 'Copy failed'
                : 'Copy the link'}
          </button>
          <code className="group-link">{`${window.location.host}/group/${slug}`}</code>
        </section>
      </aside>

      <div className="event-body">
        <section
          className={`event-card you-card${justJoined ? ' celebrate' : ''}`}
          aria-labelledby="you-title"
        >
          <h2 id="you-title" className="section-title">
            {me ? 'You' : 'Add yourself'}
          </h2>
          {me && !editing ? (
            <div className="member-row you">
              <Avatar name={me.name} you />
              <div className="member-info">
                <strong>{me.name}</strong>
                <span className="dim">
                  {[me.label, TRAVEL_MODES[me.mode]?.label?.toLowerCase()]
                    .filter(Boolean)
                    .join(' · ')}
                </span>
                {prefsSummary(me.prefs) && (
                  <span className="member-prefs">{prefsSummary(me.prefs)}</span>
                )}
              </div>
              <div className="member-actions">
                <button className="btn ghost sm" onClick={() => setEditing(true)}>
                  Change
                </button>
                <button className="btn ghost sm" onClick={leave}>
                  Leave
                </button>
              </div>
            </div>
          ) : (
            <JoinForm
              slug={slug}
              me={me}
              guest={guest}
              user={state.user}
              onSaved={async () => {
                setEditing(false)
                if (!me) setJustJoined(true)
                await load()
              }}
              onCancel={me ? () => setEditing(false) : null}
            />
          )}
        </section>

        <section className="event-card" aria-labelledby="members-title">
          <h2 id="members-title" className="section-title">
            {members.length === 0
              ? 'Nobody in yet'
              : `${members.length} ${members.length === 1 ? 'person' : 'people'} in`}
          </h2>
          {members.length === 0 ? (
            <p className="hint">Add yourself first, then send the link round.</p>
          ) : (
            <ul className="member-list">
              {members.map((m) => (
                <li key={m.id} className="member-row">
                  <Avatar name={m.name} you={m.is_you} />
                  <div className="member-info">
                    <strong>
                      {m.name}
                      {m.is_you && <span className="dim"> (you)</span>}
                    </strong>
                    <span className="dim">
                      {[m.label, TRAVEL_MODES[m.mode]?.label?.toLowerCase()]
                        .filter(Boolean)
                        .join(' · ')}
                    </span>
                    {prefsSummary(m.prefs) && (
                      <span className="member-prefs">{prefsSummary(m.prefs)}</span>
                    )}
                  </div>
                  {group.is_owner && !m.is_you && (
                    <button
                      className="icon-btn"
                      onClick={() => remove(m)}
                      aria-label={`Remove ${m.name} from the group`}
                    >
                      ✕
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        {summary.length > 0 && (
          <section className="event-card" aria-labelledby="needs-title">
            <h2 id="needs-title" className="section-title">
              What the group needs
            </h2>
            <ul className="needs-list">
              {summary.map((line) => (
                <li key={line.text} className={line.warn ? 'warn' : ''}>
                  <strong>{line.text}</strong>
                  {line.who && <span className="dim"> · {line.who}</span>}
                </li>
              ))}
            </ul>
          </section>
        )}

        {members.length > 0 && (
          <section className="event-card" aria-labelledby="picks-title">
            <h2 id="picks-title" className="section-title">
              Best pitches for everyone
            </h2>
            {!state.data ? (
              <p className="hint">Loading pitches…</p>
            ) : picks.length === 0 ? (
              <p className="hint">
                Nothing matches everyone&rsquo;s preferences yet. Loosen one and try again.
              </p>
            ) : (
              <ol className="pick-list">
                {picks.map((row, i) => {
                  const p = row.pitch
                  const price = priceLine(p, squad.length)
                  const open = openLine(p)
                  return (
                    <li key={p.id}>
                      <Link
                        className="pick"
                        href={buildHref(`/p/${p.id}`, { sharedGroup: slug, filters })}
                      >
                        <span className="pick-rank" aria-hidden="true">
                          {i + 1}
                        </span>
                        <span className="pick-body">
                          <span className="pick-name">{pitchName(p)}</span>
                          <span className="pick-meta">
                            <BrandBadge pitch={p} />
                            {p.postcode ? ` · ${p.postcode}` : ''}
                            {` · everyone within about ${displayMinutes(row.maxEta)} min `}
                            <span className="src-tag" title="estimate">
                              est.
                            </span>
                          </span>
                          <span className="pick-price">
                            <strong className={price.known ? '' : 'dim'}>{price.main}</strong>
                            {price.each ? ` · ${price.each}` : ''}
                            {open ? ` · ${open.label}` : ''}
                          </span>
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ol>
            )}
            <p className="row">
              <Link className="btn primary" href={finderHref}>
                See all pitches on the map
              </Link>
            </p>
          </section>
        )}
      </div>
    </article>
  )
}

function RenameForm({ group, onDone }) {
  const [name, setName] = useState(group.name)
  const [busy, setBusy] = useState(false)
  async function save(e) {
    e.preventDefault()
    const n = name.trim().slice(0, 60)
    if (!n) return
    setBusy(true)
    try {
      await sb.renameGroup(group.id, n)
      await onDone()
    } finally {
      setBusy(false)
    }
  }
  return (
    <form className="row" onSubmit={save}>
      <input
        className="input grow"
        value={name}
        maxLength={60}
        onChange={(e) => setName(e.target.value)}
        aria-label="Group name"
        autoFocus
      />
      <button className="btn primary sm" type="submit" disabled={busy}>
        Save
      </button>
    </form>
  )
}

function Seg({ label, options, value, onChange }) {
  return (
    <div className="field">
      <span className="field-label">{label}</span>
      <div className="seg" role="radiogroup" aria-label={label}>
        {options.map(([key, text]) => (
          <button
            type="button"
            key={String(key)}
            role="radio"
            aria-checked={value === key}
            className={value === key ? 'active' : ''}
            onClick={() => onChange(key)}
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  )
}

function JoinForm({ slug, me, guest, user, onSaved, onCancel }) {
  const p = me?.prefs || {}
  const [name, setName] = useState(me?.name || guest.name || user?.displayName || '')
  const [query, setQuery] = useState(me?.label || '')
  const [place, setPlace] = useState(me ? { label: me.label, lat: me.lat, lng: me.lng } : null)
  const [mode, setMode] = useState(me?.mode || 'transit')
  const [budget, setBudget] = useState(p.budget ?? null)
  const [needs, setNeeds] = useState({
    lit: p.lit === true,
    covered: p.covered === true,
    changing: p.changing === true,
    parking: p.parking === true,
  })
  const [format, setFormat] = useState([5, 7, 11].includes(p.format) ? p.format : null)
  const [surface, setSurface] = useState(['3g', 'astro'].includes(p.surface) ? p.surface : null)
  const [brand, setBrand] = useState(
    ['goals', 'powerleague', 'other'].includes(p.brand) ? p.brand : null,
  )
  const [maxMinutes, setMaxMinutes] = useState(p.maxMinutes ?? null)
  const [days, setDays] = useState(
    Array.isArray(p.days) ? p.days.filter((d) => DAYS.includes(d)) : [],
  )
  const [daypart, setDaypart] = useState(
    ['evening', 'daytime'].includes(p.daypart) ? p.daypart : null,
  )
  const [more, setMore] = useState(
    !!(p.format || p.surface || p.brand || p.maxMinutes || (p.days && p.days.length) || p.daypart),
  )
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const suggestions = useMemo(
    () =>
      query.trim() && !looksLikePostcode(query) && !place ? searchGazetteer(query, AREAS) : [],
    [query, place],
  )

  function toggleDay(day) {
    setDays((d) =>
      d.includes(day) ? d.filter((x) => x !== day) : DAYS.filter((x) => x === day || d.includes(x)),
    )
  }

  async function submit(e) {
    e.preventDefault()
    const n = name.trim().slice(0, 40)
    if (!n) return setError('Add your name so the group knows who is in.')
    const q = query.trim()
    if (!q) return setError('Say where you are coming from: a postcode or an area.')
    setBusy(true)
    setError('')
    try {
      let loc = place && place.label === q ? place : null
      if (!loc) {
        const { results, offline } = await resolveLocation(q, { areas: AREAS })
        if (!results.length) {
          setError(
            offline
              ? 'Place search needs a connection. Try a postcode or an area name.'
              : 'No match in London for that. Try a postcode or a nearby area.',
          )
          return
        }
        loc = results[0]
      }
      const prefs = {}
      if (budget) prefs.budget = budget
      for (const k of Object.keys(needs)) if (needs[k]) prefs[k] = true
      if (format) prefs.format = format
      if (surface) prefs.surface = surface
      if (brand) prefs.brand = brand
      if (maxMinutes) prefs.maxMinutes = maxMinutes
      if (days.length) prefs.days = days
      if (daypart) prefs.daypart = daypart
      await sb.groupJoin(
        slug,
        { name: n, label: loc.label, lat: loc.lat, lng: loc.lng, mode, prefs },
        user ? null : guest.key,
      )
      if (!user) setGuest({ name: n })
      await onSaved()
    } catch (err) {
      setError(err.message || 'Could not save that right now.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="stack join-form" onSubmit={submit}>
      <label className="field">
        <span className="field-label">Your name</span>
        <input
          className="input"
          value={name}
          maxLength={40}
          autoComplete="given-name"
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <label className="field">
        <span className="field-label">Where are you coming from?</span>
        <div className="area-picker">
          <input
            className="input"
            placeholder="Postcode or area, e.g. E8 3DL or Peckham"
            value={query}
            autoComplete="off"
            autoCapitalize="characters"
            onChange={(e) => {
              setQuery(e.target.value)
              setPlace(null)
              setError('')
            }}
            aria-autocomplete="list"
          />
          {suggestions.length > 0 && (
            <ul className="area-suggestions" role="listbox" aria-label="Suggestions">
              {suggestions.map((s) => (
                <li key={s.label} role="option" aria-selected="false">
                  <button
                    type="button"
                    onClick={() => {
                      setPlace(s)
                      setQuery(s.label)
                    }}
                  >
                    {s.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </label>
      <Seg
        label="How you travel"
        options={Object.entries(TRAVEL_MODES).map(([key, m]) => [key, m.label])}
        value={mode}
        onChange={setMode}
      />
      <div className="field">
        <span className="field-label">What do you need?</span>
        <div className="chip-row" role="group" aria-label="What do you need?">
          {NEEDS.map(([key, label, sub]) => (
            <button
              type="button"
              key={key}
              className={`pref-chip${needs[key] ? ' on' : ''}`}
              aria-pressed={needs[key]}
              title={sub}
              onClick={() => setNeeds((n) => ({ ...n, [key]: !n[key] }))}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <label className="field">
        <span className="field-label">Budget</span>
        <select
          className="select"
          value={budget ?? ''}
          onChange={(e) => setBudget(e.target.value ? Number(e.target.value) : null)}
        >
          {BUDGETS.map(([value, label]) => (
            <option key={String(value)} value={value ?? ''}>
              {label}
            </option>
          ))}
        </select>
      </label>

      {!more ? (
        <button type="button" className="link-btn more-prefs" onClick={() => setMore(true)}>
          More preferences: size, surface, operator, journey, days
        </button>
      ) : (
        <div className="stack more-prefs-body">
          <Seg label="Pitch size" options={FORMATS} value={format} onChange={setFormat} />
          <Seg label="Surface" options={SURFACES} value={surface} onChange={setSurface} />
          <Seg label="Where" options={BRAND_PREFS} value={brand} onChange={setBrand} />
          <Seg
            label="Longest journey you would do"
            options={MAX_MINUTES}
            value={maxMinutes}
            onChange={setMaxMinutes}
          />
          <div className="field">
            <span className="field-label">Days you can do</span>
            <div className="chip-row days" role="group" aria-label="Days you can do">
              {DAYS.map((day) => (
                <button
                  type="button"
                  key={day}
                  className={`pref-chip day${days.includes(day) ? ' on' : ''}`}
                  aria-pressed={days.includes(day)}
                  onClick={() => toggleDay(day)}
                >
                  {DAY_LABEL[day]}
                </button>
              ))}
            </div>
          </div>
          <Seg label="Time of day" options={DAYPARTS} value={daypart} onChange={setDaypart} />
        </div>
      )}

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <div className="row">
        <button className="btn primary lg" type="submit" disabled={busy}>
          {busy ? 'Saving' : me ? 'Save' : 'Add me'}
        </button>
        {onCancel && (
          <button className="btn ghost" type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
