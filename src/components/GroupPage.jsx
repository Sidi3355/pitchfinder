// A shared group at /group/{slug}: everyone with the link adds themselves
// (where from, how they travel, a couple of preferences) and sees the picks
// for the whole group. The organiser shares the link and can rename the
// group or remove someone. Nobody types the group in for anyone else.

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useStore } from '../lib/store.jsx'
import * as sb from '../lib/supabase.js'
import { AREAS } from '../data/areas.js'
import { PITCH_TYPES, pitchName } from '../data/types.js'
import { TRAVEL_MODES, displayMinutes } from '../lib/geo.js'
import { resolveLocation, searchGazetteer, looksLikePostcode } from '../lib/geocode-client.js'
import { rankPitches } from '../lib/score.js'
import { BUDGETS, collateFilters, membersToSquad, prefsSummary } from '../lib/group-prefs.js'
import { buildHref } from '../lib/url-state.js'
import { shareUrl } from '../lib/share.js'
import { setGuest, useGuest } from '../lib/guest.js'
import { Link } from './Link.jsx'

export function GroupPage({ slug }) {
  const { state, actions } = useStore()
  const guest = useGuest()
  const available = state.authAvailable
  const [phase, setPhase] = useState('loading') // loading | ready | missing | error | unavailable
  const [group, setGroup] = useState(null)
  const [members, setMembers] = useState([])
  const [editing, setEditing] = useState(false)
  const [renaming, setRenaming] = useState(false)
  const [shareStatus, setShareStatus] = useState(null)

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

  const me = members.find((m) => m.is_you) || null
  const squad = useMemo(() => membersToSquad(members), [members])
  const filters = useMemo(() => collateFilters(members), [members])
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

  return (
    <article className="group-page page-narrow">
      <header className="group-head">
        <p className="empty-kicker">Shared group</p>
        {renaming ? (
          <RenameForm
            group={group}
            onDone={async () => {
              setRenaming(false)
              await load()
            }}
          />
        ) : (
          <h1>{group.name}</h1>
        )}
        <p className="hint dim">
          Organised by {group.owner_name}.{' '}
          {group.is_owner && !renaming && (
            <button className="link-btn" onClick={() => setRenaming(true)}>
              Rename
            </button>
          )}
        </p>
      </header>

      <section className="group-share" aria-labelledby="share-title">
        <h2 id="share-title" className="section-title">
          Send everyone this link
        </h2>
        <p>
          Each person adds where they are coming from. No account needed. When everyone is in, the
          picks below are for the whole group.
        </p>
        <div className="row">
          <button className="btn primary" onClick={share}>
            {shareStatus === 'copied'
              ? 'Link copied'
              : shareStatus === 'failed'
                ? 'Copy failed'
                : 'Copy the link'}
          </button>
          <code className="group-link">{`${window.location.host}/group/${slug}`}</code>
        </div>
      </section>

      <section className="group-you" aria-labelledby="you-title">
        <h2 id="you-title" className="section-title">
          {me ? 'You' : 'Add yourself'}
        </h2>
        {me && !editing ? (
          <div className="member-row you">
            <div className="member-info">
              <strong>{me.name}</strong>
              <span className="dim">
                {[me.label, TRAVEL_MODES[me.mode]?.label?.toLowerCase(), prefsSummary(me.prefs)]
                  .filter(Boolean)
                  .join(' · ')}
              </span>
            </div>
            <button className="btn ghost sm" onClick={() => setEditing(true)}>
              Change
            </button>
            <button className="btn ghost sm" onClick={leave}>
              Leave
            </button>
          </div>
        ) : (
          <JoinForm
            slug={slug}
            me={me}
            guest={guest}
            user={state.user}
            onSaved={async () => {
              setEditing(false)
              await load()
            }}
            onCancel={me ? () => setEditing(false) : null}
          />
        )}
      </section>

      <section aria-labelledby="members-title">
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
                <div className="member-info">
                  <strong>
                    {m.name}
                    {m.is_you && <span className="dim"> (you)</span>}
                  </strong>
                  <span className="dim">
                    {[m.label, TRAVEL_MODES[m.mode]?.label?.toLowerCase(), prefsSummary(m.prefs)]
                      .filter(Boolean)
                      .join(' · ')}
                  </span>
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

      {members.length > 0 && (
        <section aria-labelledby="picks-title">
          <h2 id="picks-title" className="section-title">
            Best pitches for this group
          </h2>
          {(filters.needsFloodlights || filters.maxPricePerHead != null) && (
            <p className="hint dim">
              {[
                filters.needsFloodlights ? 'floodlit only' : null,
                filters.maxPricePerHead != null ? `up to £${filters.maxPricePerHead} each` : null,
              ]
                .filter(Boolean)
                .join(', ')}
              , as people asked.
            </p>
          )}
          {!state.data ? (
            <p className="hint">Loading pitches…</p>
          ) : picks.length === 0 ? (
            <p className="hint">Nothing matches everyone&rsquo;s preferences yet.</p>
          ) : (
            <ol className="pick-list">
              {picks.map((row) => {
                const p = row.pitch
                const t = PITCH_TYPES[p.type]
                return (
                  <li key={p.id}>
                    <Link
                      className="pick"
                      href={buildHref(`/p/${p.id}`, { sharedGroup: slug, filters })}
                    >
                      <span className="pick-name">{pitchName(p)}</span>
                      <span className="pick-meta">
                        <span className="pick-type">
                          <span className="type-dot" style={{ background: t.color }} />
                          {t.short}
                        </span>
                        {p.postcode ? ` · ${p.postcode}` : ''}
                        {` · everyone within about ${displayMinutes(row.maxEta)} min `}
                        <span className="src-tag" title="estimate">
                          est.
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
      {actions && null}
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

function JoinForm({ slug, me, guest, user, onSaved, onCancel }) {
  const [name, setName] = useState(me?.name || guest.name || user?.displayName || '')
  const [query, setQuery] = useState(me?.label || '')
  const [place, setPlace] = useState(me ? { label: me.label, lat: me.lat, lng: me.lng } : null)
  const [mode, setMode] = useState(me?.mode || 'transit')
  const [budget, setBudget] = useState(me?.prefs?.budget ?? null)
  const [lit, setLit] = useState(me?.prefs?.lit === true)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const suggestions = useMemo(
    () =>
      query.trim() && !looksLikePostcode(query) && !place ? searchGazetteer(query, AREAS) : [],
    [query, place],
  )

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
      if (lit) prefs.lit = true
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
      <div className="field">
        <span className="field-label">How you travel</span>
        <div className="seg" role="radiogroup" aria-label="Travel mode">
          {Object.entries(TRAVEL_MODES).map(([key, m]) => (
            <button
              type="button"
              key={key}
              role="radio"
              aria-checked={mode === key}
              className={mode === key ? 'active' : ''}
              onClick={() => setMode(key)}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>
      <div className="row wrap">
        <label className="field grow">
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
        <label className="check-item">
          <input type="checkbox" checked={lit} onChange={() => setLit((v) => !v)} />
          <span className="check-label">I need floodlights</span>
        </label>
      </div>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <div className="row">
        <button className="btn primary" type="submit" disabled={busy}>
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
