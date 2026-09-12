import React, { useState } from 'react'
import { useStore } from '../lib/store.jsx'
import { Link } from './Link.jsx'
import { Panel } from './Panel.jsx'
import { MOBILE_QUERY, useMediaQuery } from '../lib/media.js'

const NAV = [
  ['/find', 'find', 'Find a pitch'],
  ['/about', 'about', 'About'],
]

export function Header() {
  const { state, actions } = useStore()
  const { view, user, data, authStatus } = state
  const mobile = useMediaQuery(MOBILE_QUERY)
  const [menu, setMenu] = useState(false)

  const accountLabel = user ? user.displayName : 'My games'
  const links = [...NAV, ['/me', 'profile', accountLabel]]

  return (
    <header className="header">
      <Link className="brand" href="/" aria-label="PitchFinder home">
        <svg className="brand-mark" viewBox="0 0 32 32" aria-hidden="true">
          <rect width="32" height="32" rx="7" fill="#15803d" />
          <circle cx="16" cy="16" r="7" fill="none" stroke="#fff" strokeWidth="2.4" />
          <circle cx="16" cy="16" r="2.2" fill="#fff" />
        </svg>
        <span className="brand-name">PitchFinder</span>
      </Link>

      {data && view === 'find' && (
        <span className="header-stat">
          {data.count.toLocaleString('en-GB')} pitches across London
        </span>
      )}

      <nav className="header-nav" aria-label="Main">
        {!mobile &&
          NAV.map(([path, name, label]) => (
            <Link
              key={path}
              href={name === 'find' ? actions.hrefFor(path) : path}
              className={view === name ? 'active' : ''}
              aria-current={view === name ? 'page' : undefined}
            >
              {label}
            </Link>
          ))}
      </nav>

      <div className="header-auth">
        {!mobile &&
          (user ? (
            <Link
              className={`header-user${view === 'profile' ? ' active' : ''}`}
              href="/me"
              aria-current={view === 'profile' ? 'page' : undefined}
            >
              {user.displayName}
            </Link>
          ) : authStatus === 'checking' ? null : (
            <button className="btn ghost sm" onClick={() => actions.openAuth('generic')}>
              Sign in
            </button>
          ))}
        {mobile && user && (
          <Link className="header-user" href="/me" aria-label={`${user.displayName}, my games`}>
            {user.displayName}
          </Link>
        )}
        {mobile && (
          <button
            className="btn ghost sm"
            onClick={() => setMenu(true)}
            aria-label="Menu"
            aria-haspopup="dialog"
          >
            Menu
          </button>
        )}
        {mobile && menu && (
          <Panel title="Menu" onClose={() => setMenu(false)}>
            <ul className="menu-list">
              <li>
                <Link
                  href="/"
                  onClick={() => setMenu(false)}
                  aria-current={view === 'home' ? 'page' : undefined}
                >
                  Home
                </Link>
              </li>
              {links.map(([path, name, label]) => (
                <li key={path}>
                  <Link
                    href={name === 'find' ? actions.hrefFor(path) : path}
                    onClick={() => setMenu(false)}
                    aria-current={view === name ? 'page' : undefined}
                  >
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/privacy" onClick={() => setMenu(false)}>
                  Privacy
                </Link>
              </li>
              {user ? (
                <li>
                  <button className="link-btn" onClick={actions.signOut}>
                    Sign out
                  </button>
                </li>
              ) : authStatus === 'checking' ? null : (
                <li>
                  <button
                    className="link-btn"
                    onClick={() => {
                      setMenu(false)
                      actions.openAuth('generic')
                    }}
                  >
                    Sign in
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
      </div>
    </header>
  )
}
