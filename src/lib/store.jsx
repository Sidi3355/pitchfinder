// App-wide state. The address bar is the source of truth for the group, the
// filters and the selected pitch (see url-state.js), so those are derived from
// the location rather than held in memory. The store holds the dataset, the
// session (Supabase) and transient UI state, and exposes actions.

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react'
import * as sb from './supabase.js'
import { loadPitchData } from './data.js'
import { DEFAULT_FILTERS, rankPitches } from './score.js'
import { matchRoute, navigate, useLocation } from './location.js'
import { buildHref, parseSearch } from './url-state.js'
import { setPending, takePending } from './pending.js'

const StoreContext = createContext(null)

const RETURN_KEY = 'pf:return-to'

const initialState = {
  data: null, // { generatedAt, count, byType, pitches } once loaded
  dataError: null,
  dataAttempt: 0,
  user: null, // { id, email, displayName } | null
  authStatus: 'checking', // 'checking' | 'in' | 'out'
  authAvailable: sb.configured,
  authModal: null, // null | { reason: 'save' | 'game' | 'group' | 'generic' }
  savedIds: new Set(),
  notice: null, // { text, at } shown briefly after a completed action
}

function reducer(state, action) {
  switch (action.type) {
    case 'data':
      return { ...state, data: action.data, dataError: null }
    case 'dataError':
      return { ...state, dataError: action.message }
    case 'data:retry':
      return { ...state, dataError: null, dataAttempt: state.dataAttempt + 1 }
    case 'auth':
      return {
        ...state,
        user: action.user,
        authStatus: action.user ? 'in' : 'out',
        authModal: action.user ? null : state.authModal,
        savedIds: action.user ? state.savedIds : new Set(),
      }
    case 'authUnavailable':
      return { ...state, authAvailable: false, authStatus: 'out', user: null }
    case 'authModal':
      return { ...state, authModal: action.modal }
    case 'saved':
      return { ...state, savedIds: new Set(action.ids) }
    case 'displayName':
      return { ...state, user: state.user ? { ...state.user, displayName: action.name } : null }
    case 'notice':
      return { ...state, notice: action.text ? { text: action.text, at: Date.now() } : null }
    default:
      return state
  }
}

function clearLegacyStorage() {
  // The pre-Supabase build kept accounts in localStorage under topbins:*.
  try {
    for (const key of Object.keys(localStorage))
      if (key.startsWith('topbins:')) localStorage.removeItem(key)
  } catch {}
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const location = useLocation()
  const route = useMemo(() => matchRoute(location.path), [location.path])
  const urlState = useMemo(() => parseSearch(location.search), [location.search])
  const { group: squad, filters, pitch: selectedPitchId } = urlState

  // ── Dataset ──
  useEffect(() => {
    let cancelled = false
    loadPitchData()
      .then((data) => !cancelled && dispatch({ type: 'data', data }))
      .catch((err) => !cancelled && dispatch({ type: 'dataError', message: err.message }))
    return () => {
      cancelled = true
    }
  }, [state.dataAttempt])

  // Finish what the person was doing before sign-in interrupted them.
  async function finishPending(user) {
    const action = takePending()
    if (!action) return
    try {
      if (action.type === 'save' && action.pitchId) {
        await sb.savePitch(user.id, action.pitchId)
        dispatch({ type: 'saved', ids: [...(await sb.listSaved())] })
        dispatch({ type: 'notice', text: 'Pitch saved.' })
      } else if (action.type === 'group' && action.members?.length) {
        await sb.saveGroup(user.id, { name: action.name || 'My group', members: action.members })
        dispatch({ type: 'notice', text: 'Group saved. Find it under My games.' })
      } else if (action.type === 'game' && action.pitchId) {
        const game = await sb.createGame(user.id, action)
        dispatch({ type: 'notice', text: 'Game created. Share the link with the group.' })
        navigate(`/g/${game.share_slug}`)
      }
    } catch (err) {
      dispatch({ type: 'notice', text: `Signed in, but could not finish: ${err.message}` })
    }
  }

  // A sign-in link opened into an already-loaded page only changes the hash;
  // reload so the session restore below runs from the top.
  useEffect(() => {
    const onHash = () => {
      if (/access_token=/.test(window.location.hash)) window.location.reload()
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  // ── Session ──
  useEffect(() => {
    clearLegacyStorage()
    if (!sb.configured) {
      dispatch({ type: 'authUnavailable' })
      return
    }
    const returning = /access_token=/.test(window.location.hash)
    if (!sb.hasStoredSession() && !returning) {
      dispatch({ type: 'auth', user: null })
      return
    }
    let cancelled = false
    let unsubscribe = null
    sb.onAuthChange((user) => {
      if (cancelled) return
      dispatch({ type: 'auth', user })
    })
      .then((u) => (unsubscribe = u))
      .catch(() => !cancelled && dispatch({ type: 'auth', user: null }))
    sb.currentUser({ force: true })
      .then((user) => {
        if (cancelled) return
        dispatch({ type: 'auth', user })
        if (returning) {
          const to = sessionStorage.getItem(RETURN_KEY)
          sessionStorage.removeItem(RETURN_KEY)
          if (to && to.startsWith('/')) navigate(to, { replace: true })
          else if (window.location.hash)
            window.history.replaceState(null, '', window.location.pathname + window.location.search)
          if (user) finishPending(user)
        }
      })
      .catch(() => !cancelled && dispatch({ type: 'auth', user: null }))
    return () => {
      cancelled = true
      unsubscribe?.()
    }
  }, [])

  // ── Saved pitches follow the session ──
  const userId = state.user?.id
  useEffect(() => {
    if (!userId) return
    let cancelled = false
    sb.listSaved()
      .then((ids) => !cancelled && dispatch({ type: 'saved', ids }))
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [userId])

  const results = useMemo(
    () => (state.data ? rankPitches(state.data.pitches, squad, filters) : []),
    [state.data, squad, filters],
  )

  const resultById = useMemo(() => {
    const m = new Map()
    for (const r of results) m.set(r.pitch.id, r)
    return m
  }, [results])

  const pitchById = useMemo(() => {
    const m = new Map()
    if (state.data) for (const p of state.data.pitches) m.set(p.id, p)
    return m
  }, [state.data])

  /** Href for another route that keeps the group and filters, drops the selected pitch. */
  const hrefFor = useCallback(
    (path, patch = {}) => buildHref(path, { group: squad, filters, pitch: null, ...patch }),
    [squad, filters],
  )

  const actions = useMemo(() => {
    const setUrl = (patch, { replace = true } = {}) =>
      navigate(buildHref(location.path, { ...urlState, ...patch }), { replace })
    const requireUser = (reason, pending) => {
      if (state.user) return true
      if (pending) setPending(pending)
      dispatch({ type: 'authModal', modal: { reason } })
      return false
    }
    const returnUrl = () => `${window.location.origin}/`

    return {
      go: (path, opts) => navigate(hrefFor(path), opts),
      hrefFor,
      pitchHref: (id) => buildHref(`/p/${id}`, { group: squad }),
      retryData: () => dispatch({ type: 'data:retry' }),

      openAuth: (reason = 'generic') => dispatch({ type: 'authModal', modal: { reason } }),
      closeAuth: () => dispatch({ type: 'authModal', modal: null }),
      async signInWithEmail(email, name) {
        sessionStorage.setItem(RETURN_KEY, location.href)
        sb.rememberPendingName(name)
        await sb.signInWithEmail(email, returnUrl())
      },
      async signInWithGoogle(name) {
        sessionStorage.setItem(RETURN_KEY, location.href)
        sb.rememberPendingName(name)
        await sb.signInWithGoogle(returnUrl())
      },
      async signOut() {
        try {
          await sb.signOut()
        } finally {
          dispatch({ type: 'auth', user: null })
        }
      },
      async updateDisplayName(name) {
        if (!state.user) return
        await sb.updateDisplayName(state.user.id, name)
        dispatch({ type: 'displayName', name })
      },

      addFriend: (friend) => setUrl({ group: [...squad, friend] }),
      removeFriend: (id) => setUrl({ group: squad.filter((f) => f.id !== id) }),
      setFriendMode: (id, mode) =>
        setUrl({ group: squad.map((f) => (f.id === id ? { ...f, mode } : f)) }),
      setSquad: (group, opts) => setUrl({ group }, opts),
      setFilters: (patch) => setUrl({ filters: { ...filters, ...patch } }),
      resetFilters: () => setUrl({ filters: DEFAULT_FILTERS }),
      // Opening a pitch pushes history so the back button closes it.
      selectPitch: (id) => setUrl({ pitch: id || null }, { replace: !id }),

      /** Save or unsave. Returns false when the user has to sign in first. */
      async toggleSave(pitchId) {
        if (!requireUser('save', { type: 'save', pitchId })) return false
        const next = new Set(state.savedIds)
        if (next.has(pitchId)) {
          next.delete(pitchId)
          dispatch({ type: 'saved', ids: next })
          await sb.unsavePitch(pitchId)
        } else {
          next.add(pitchId)
          dispatch({ type: 'saved', ids: next })
          await sb.savePitch(state.user.id, pitchId)
        }
        return true
      },

      /** Creates a game and returns it (with share_slug), or null if sign-in is needed. */
      async createGame({ pitchId, pitchName, startsAt, notes }) {
        const group = squad.map(({ name, label, lat, lng, mode }) => ({
          name,
          label,
          lat,
          lng,
          mode,
        }))
        if (!requireUser('game', { type: 'game', pitchId, pitchName, startsAt, notes, group }))
          return null
        return sb.createGame(state.user.id, { pitchId, pitchName, startsAt, notes, group })
      },

      async saveGroup(name) {
        const members = squad.map(({ name: n, label, lat, lng, mode }) => ({
          name: n,
          label,
          lat,
          lng,
          mode,
        }))
        if (!requireUser('group', { type: 'group', name, members })) return null
        return sb.saveGroup(state.user.id, { name, members })
      },
      clearNotice: () => dispatch({ type: 'notice', text: null }),
    }
  }, [state.user, state.savedIds, squad, filters, urlState, location.path, location.href, hrefFor])

  const value = useMemo(
    () => ({
      state: {
        ...state,
        squad,
        filters,
        selectedPitchId,
        route,
        view: route.name,
        dataLoading: !state.data && !state.dataError,
      },
      results,
      resultById,
      pitchById,
      actions,
    }),
    [state, squad, filters, selectedPitchId, route, results, resultById, pitchById, actions],
  )
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>')
  return ctx
}
