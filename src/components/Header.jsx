import React from 'react'
import { useStore } from '../lib/store.jsx'

export function Header() {
  const { state, actions } = useStore()
  const { view, user, data } = state

  return (
    <header className="header">
      <button className="brand" onClick={() => actions.go('find')}>
        <svg className="brand-mark" viewBox="0 0 32 32" aria-hidden="true">
          <rect width="32" height="32" rx="7" fill="#15803d" />
          <circle cx="16" cy="16" r="7" fill="none" stroke="#fff" strokeWidth="2.4" />
          <circle cx="16" cy="16" r="2.2" fill="#fff" />
        </svg>
        <span className="brand-name">PitchFinder</span>
      </button>

      {data && (
        <span className="header-stat">
          {data.count.toLocaleString('en-GB')} pitches across London
        </span>
      )}

      <nav className="header-nav" aria-label="Main">
        <button className={view === 'find' ? 'active' : ''} onClick={() => actions.go('find')}>
          Map
        </button>
        <button className={view === 'about' ? 'active' : ''} onClick={() => actions.go('about')}>
          About
        </button>
        <button
          className={view === 'profile' ? 'active' : ''}
          onClick={() => actions.go('profile')}
        >
          {user ? 'My games' : 'Profile'}
        </button>
      </nav>

      <div className="header-auth">
        {user ? (
          <>
            <span className="header-user">{user.displayName}</span>
            <button className="btn ghost sm" onClick={actions.logout}>
              Sign out
            </button>
          </>
        ) : (
          <>
            <button className="btn ghost sm" onClick={() => actions.openAuth('login')}>
              Sign in
            </button>
            <button className="btn primary sm" onClick={() => actions.openAuth('register')}>
              Sign up
            </button>
          </>
        )}
      </div>
    </header>
  )
}
