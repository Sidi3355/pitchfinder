// App-wide state: session, squad (friends + locations), filters, results,
// saved pitches and kickabouts. One React context, no extra dependencies.

import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import * as auth from './auth.js'
import { DEFAULT_FILTERS, rankPitches } from './score.js'

const StoreContext = createContext(null)

const initialState = {
  view: 'home', // 'home' | 'find' | 'game'
  user: null,
  squad: [],    // [{ id, name, areaName, lat, lng, mode }]
  filters: { ...DEFAULT_FILTERS },
  selectedPitchId: null,
  authModal: null, // null | 'login' | 'register'
}

function reducer(state, action) {
  switch (action.type) {
    case 'view':
      return { ...state, view: action.view, selectedPitchId: null }
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

  const results = useMemo(
    () => rankPitches(state.squad, state.filters),
    [state.squad, state.filters],
  )

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
        const updated = auth.updateUser(user.username, { savedPitchIds: saved })
        dispatch({ type: 'user', user: updated })
      },

      createKickabout(kickabout) {
        const { user } = state
        if (!user) {
          dispatch({ type: 'authModal', mode: 'login' })
          return
        }
        const entry = {
          id: `k${Date.now()}`,
          createdAt: Date.now(),
          rsvps: {}, // name -> 'in' | 'out' | 'maybe'
          ...kickabout,
        }
        const updated = auth.updateUser(user.username, {
          kickabouts: [...user.kickabouts, entry],
        })
        dispatch({ type: 'user', user: updated })
        return entry
      },

      setRsvp(kickaboutId, name, status) {
        const { user } = state
        if (!user) return
        const kickabouts = user.kickabouts.map((k) =>
          k.id === kickaboutId ? { ...k, rsvps: { ...k.rsvps, [name]: status } } : k,
        )
        dispatch({ type: 'user', user: auth.updateUser(user.username, { kickabouts }) })
      },

      deleteKickabout(kickaboutId) {
        const { user } = state
        if (!user) return
        const kickabouts = user.kickabouts.filter((k) => k.id !== kickaboutId)
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

  const value = useMemo(() => ({ state, results, actions }), [state, results, actions])
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>')
  return ctx
}
