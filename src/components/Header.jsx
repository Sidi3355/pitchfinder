import React from 'react'
import { useStore } from '../lib/store.jsx'
import { Link } from './Link.jsx'
import { Panel } from './Panel.jsx'
import { MOBILE_QUERY, useMediaQuery } from '../lib/media.js'
import { useState } from 'react'

export function Header() {
  const { state, actions } = useStore()
  const { view, user, data, authStatus } = state
  const mobile = useMediaQuery(MOBILE_QUERY)
  const [menu, setMenu] = useState(false)

  const nav = [
    ['/', 'find', 'Map'],
    ['/about', 'about', 'About'],
    ['/me', 'profile', user ? 'My games' : 'Profile'],
  ]

  return (
    <header className="header">
      <Link className="brand" href={actions.hrefFor('/')} aria-label="PitchFinder home">
        <svg className="brand-mark" viewBox="0 0 32 32" aria-hidden="true">
          <rect width="32" height="32" rx="7" fill="#15803d" />
          <circle cx="16" cy="16" r="7" fill="none" stroke="#fff" strokeWidth="2.4" />
          <circle cx="16" cy="16" r="2.2" fill="#fff" />
        </svg>
        <span className="brand-name">PitchFinder</span>
      </Link>

      {data && (
        <span className="header-stat">
          {data.count.toLocaleString('en-GB')} pitches across London
        </span>
      )}

      <nav className="header-nav" aria-label="Main">
        {!mobile &&
          nav.map(([path, name, label]) => (
            <Link
              key={path}
              href={actions.hrefFor(path)}
              className={view === name ? 'active' : ''}
              aria-current={view === name ? 'page' : undefined}
            >
              {label}
            </Link>
          ))}
      </nav>

      <div className="header-auth">
        {mobile && (
          <button className="btn ghost sm" onClick={() => setMenu(true)} aria-label="More">
            More
          </button>
        )}
        {mobile && menu && (
          <Panel title="More" onClose={() => setMenu(false)}>
            <ul className="menu-list">
              {nav.map(([path, name, label]) => (
                <li key={path}>
                  <Link
                    href={actions.hrefFor(path)}
                    onClick={() => setMenu(false)}
                    aria-current={view === name ? 'page' : undefined}
                  >
                    {label}
                  </Link>
                </li>
              ))}
              {user && (
                <li>
                  <button className="link-btn" onClick={actions.signOut}>
                    Sign out
                  </button>
                </li>
              )}
            </ul>
            {data && (
              <p className="hint dim">
                {data.count.toLocaleString('en-GB')} pitches across London. Pitch data ©
                OpenStreetMap contributors (ODbL), refreshed{' '}
                {new Date(data.generatedAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
                .
              </p>
            )}
          </Panel>
        )}
        {user ? (
          <Link className="header-user" href={actions.hrefFor('/me')}>
            {user.displayName}
          </Link>
        ) : authStatus === 'checking' ? null : (
          <button className="btn ghost sm" onClick={() => actions.openAuth('generic')}>
            Sign in
          </button>
        )}
      </div>
    </header>
  )
}
