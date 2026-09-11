// App-wide state. The address bar is the source of truth for the group, the
// filters and the selected pitch (see url-state.js), so those are derived from
// the location rather than held in memory. The store holds the dataset, the
// session and transient UI state, and exposes actions that rewrite the URL.

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react'
import * as auth from './auth.js'
import { loadPitchData } from './data.js'
import { DEFAULT_FILTERS, rankPitches } from './score.js'
import { matchRoute, navigate, useLocation } from './location.js'
import { buildHref, parseSearch } from './url-state.js'

const StoreContext = createContext(null)

const initialState = {
  data: null, // { generatedAt, count, byType, pitches } once loaded
  dataError: null,
  dataAttempt: 0,
  user: null,
  authModal: null, // null | 'login' | 'register'
}

function reducer(state, action) {
  switch (action.type) {
    case 'data':
      return { ...state, data: action.data, dataError: null }
    case 'dataError':
      return { ...state, dataError: action.message }
    case 'data:retry':
      return { ...state, dataError: null, dataAttempt: state.dataAttempt + 1 }
    case 'user':
      return { ...state, user: action.user, authModal: null }
    case 'authModal':
      return { ...state, authModal: action.mode }
    default:
      return state
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState, (s) => ({
    ...s,
    user: auth.currentUser(),
  }))
  const location = useLocation()
  const route = useMemo(() => matchRoute(location.path), [location.path])
  const urlState = useMemo(() => parseSearch(location.search), [location.search])
  const { group: squad, filters, pitch: selectedPitchId } = urlState

  useEffect(() => {
    let cancelled = false
    loadPitchData()
      .then((data) => !cancelled && dispatch({ type: 'data', data }))
      .catch((err) => !cancelled && dispatch({ type: 'dataError', message: err.message }))
    return () => {
      cancelled = true
    }
  }, [state.dataAttempt])

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

    return {
      go: (path, opts) => navigate(hrefFor(path), opts),
      hrefFor,
      pitchHref: (id) => buildHref(`/p/${id}`, { group: squad }),
      openAuth: (mode) => dispatch({ type: 'authModal', mode }),
      closeAuth: () => dispatch({ type: 'authModal', mode: null }),
      async register(fields) {
        const user = await auth.register(fields)
        dispatch({ type: 'user', user })
      },
      async login(fields) {
        const user = await auth.login(fields)
        dispatch({ type: 'user', user })
      },
      logout() {
        auth.logout()
        dispatch({ type: 'user', user: null })
      },
      retryData: () => dispatch({ type: 'data:retry' }),

      addFriend: (friend) => setUrl({ group: [...squad, friend] }),
      removeFriend: (id) => setUrl({ group: squad.filter((f) => f.id !== id) }),
      setFriendMode: (id, mode) =>
        setUrl({ group: squad.map((f) => (f.id === id ? { ...f, mode } : f)) }),
      setSquad: (group) => setUrl({ group }),
      setFilters: (patch) => setUrl({ filters: { ...filters, ...patch } }),
      resetFilters: () => setUrl({ filters: DEFAULT_FILTERS }),
      // Opening a pitch pushes history so the back button closes it.
      selectPitch: (id) => setUrl({ pitch: id || null }, { replace: !id }),

      toggleSave(pitchId) {
        const { user } = state
        if (!user) {
          dispatch({ type: 'authModal', mode: 'login' })
          return
        }
        const saved = user.savedPitchIds.includes(pitchId)
          ? user.savedPitchIds.filter((id) => id !== pitchId)
          : [...user.savedPitchIds, pitchId]
        dispatch({ type: 'user', user: auth.updateUser(user.username, { savedPitchIds: saved }) })
      },

      createGame(game) {
        const { user } = state
        if (!user) {
          dispatch({ type: 'authModal', mode: 'login' })
          return
        }
        const entry = { id: `k${Date.now()}`, createdAt: Date.now(), rsvps: {}, ...game }
        dispatch({
          type: 'user',
          user: auth.updateUser(user.username, { kickabouts: [...user.kickabouts, entry] }),
        })
        return entry
      },

      setRsvp(gameId, name, status) {
        const { user } = state
        if (!user) return
        const kickabouts = user.kickabouts.map((k) =>
          k.id === gameId ? { ...k, rsvps: { ...k.rsvps, [name]: status } } : k,
        )
        dispatch({ type: 'user', user: auth.updateUser(user.username, { kickabouts }) })
      },

      deleteGame(gameId) {
        const { user } = state
        if (!user) return
        const kickabouts = user.kickabouts.filter((k) => k.id !== gameId)
        dispatch({ type: 'user', user: auth.updateUser(user.username, { kickabouts }) })
      },

      saveSquad() {
        const { user } = state
        if (!user || !squad.length) return
        dispatch({ type: 'user', user: auth.updateUser(user.username, { squads: [squad] }) })
      },

      loadSquad() {
        const { user } = state
        if (user?.squads?.[0]) setUrl({ group: user.squads[0] })
      },
    }
  }, [state, squad, filters, urlState, location.path, hrefFor])

  // Keep the session in sync if another tab logs in or out.
  useEffect(() => {
    const onStorage = () => dispatch({ type: 'user', user: auth.currentUser() })
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

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
