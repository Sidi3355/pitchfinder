// App-wide state: pitch dataset, session, squad, filters, results, saved
// pitches and planned games. One React context, no extra dependencies.

import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import * as auth from './auth.js'
import { loadPitchData } from './data.js'
import { DEFAULT_FILTERS, rankPitches } from './score.js'

const StoreContext = createContext(null)

const initialState = {
  view: 'find', // 'find' | 'about' | 'profile'
  data: null, // { generatedAt, count, byType, pitches } once loaded
  dataError: null,
  user: null,
  squad: [], // [{ id, name, areaName, lat, lng, mode }]
  filters: { ...DEFAULT_FILTERS },
  selectedPitchId: null,
  authModal: null, // null | 'login' | 'register'
}

function reducer(state, action) {
  switch (action.type) {
    case 'view':
      return { ...state, view: action.view }
    case 'data':
      return { ...state, data: action.data, dataError: null }
    case 'dataError':
      return { ...state, dataError: action.message }
    case 'user':
      return { ...state, user: action.user, authModal: null }
    case 'authModal':
      return { ...state, authModal: action.mode }
    case 'squad:add': {
      const id = `f${Date.now()}${Math.floor(Math.random() * 1e4)}`
      return { ...state, squad: [...state.squad, { id, ...action.friend }] }
    }
    case 'squad:remove':
      return { ...state, squad: state.squad.filter((f) => f.id !== action.id) }
    case 'squad:mode':
      return {
        ...state,
        squad: state.squad.map((f) => (f.id === action.id ? { ...f, mode: action.mode } : f)),
      }
    case 'squad:set':
      return { ...state, squad: action.squad }
    case 'filters':
      return { ...state, filters: { ...state.filters, ...action.patch } }
    case 'filters:reset':
      return { ...state, filters: { ...DEFAULT_FILTERS } }
    case 'select':
      return { ...state, selectedPitchId: action.id }
    default:
      return state
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState, (s) => ({
    ...s,
    user: auth.currentUser(),
  }))

  useEffect(() => {
    let cancelled = false
    loadPitchData()
      .then((data) => !cancelled && dispatch({ type: 'data', data }))
      .catch((err) => !cancelled && dispatch({ type: 'dataError', message: err.message }))
    return () => {
      cancelled = true
    }
  }, [])

  const results = useMemo(
    () => (state.data ? rankPitches(state.data.pitches, state.squad, state.filters) : []),
    [state.data, state.squad, state.filters],
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

  const actions = useMemo(
    () => ({
      go: (view) => dispatch({ type: 'view', view }),
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
      addFriend: (friend) => dispatch({ type: 'squad:add', friend }),
      removeFriend: (id) => dispatch({ type: 'squad:remove', id }),
      setFriendMode: (id, mode) => dispatch({ type: 'squad:mode', id, mode }),
      setFilters: (patch) => dispatch({ type: 'filters', patch }),
      resetFilters: () => dispatch({ type: 'filters:reset' }),
      selectPitch: (id) => dispatch({ type: 'select', id }),

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
        const { user, squad } = state
        if (!user || !squad.length) return
        dispatch({ type: 'user', user: auth.updateUser(user.username, { squads: [squad] }) })
      },

      loadSquad() {
        const { user } = state
        if (user?.squads?.[0]) dispatch({ type: 'squad:set', squad: user.squads[0] })
      },
    }),
    [state],
  )

  // Keep the session in sync if another tab logs in/out.
  useEffect(() => {
    const onStorage = () => dispatch({ type: 'user', user: auth.currentUser() })
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const value = useMemo(
    () => ({ state, results, resultById, pitchById, actions }),
    [state, results, resultById, pitchById, actions],
  )
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>')
  return ctx
}
