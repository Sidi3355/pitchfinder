import React from 'react'
import { useStore } from '../lib/store.jsx'

export function Nav() {
  const { state, actions } = useStore()
  const { view, user } = state

  return (
    <header className="nav">
      <button className="nav-brand" onClick={() => actions.go('home')}>
        <span className="nav-ball" aria-hidden="true">⚽</span>
        <span className="nav-word">
          Top<em>Bins</em>
        </span>
      </button>

      <nav className="nav-links" aria-label="Main">
        <button className={view === 'home' ? 'active' : ''} onClick={() => actions.go('home')}>
          Kick off
        </button>
        <button className={view === 'find' ? 'active' : ''} onClick={() => actions.go('find')}>
          Find a pitch
        </button>
        <button className={view === 'game' ? 'active' : ''} onClick={() => actions.go('game')}>
          My game
        </button>
      </nav>

      <div className="nav-auth">
        {user ? (
          <>
            <span className="nav-user" title={`@${user.username}`}>
              {user.displayName}
            </span>
            <button className="btn ghost small" onClick={actions.logout}>
              Log out
            </button>
          </>
        ) : (
          <>
            <button className="btn ghost small" onClick={() => actions.openAuth('login')}>
              Log in
            </button>
            <button className="btn primary small" onClick={() => actions.openAuth('register')}>
              Join the squad
            </button>
          </>
        )}
      </div>
    </header>
  )
}
