import React, { useState } from 'react'
import { useStore } from '../lib/store.jsx'

export function AuthModal() {
  const { state, actions } = useStore()
  const isRegister = state.authModal === 'register'
  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      if (isRegister) {
        await actions.register({ username, displayName, password })
      } else {
        await actions.login({ username, password })
      }
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="modal-scrim" onClick={actions.closeAuth}>
      <div className="modal auth-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={isRegister ? 'Create account' : 'Log in'}>
        <header className="auth-head">
          <h2>{isRegister ? 'Join the squad' : 'Welcome back'}</h2>
          <button className="icon-btn big" onClick={actions.closeAuth} aria-label="Close">✕</button>
        </header>
        <p className="auth-sub">
          {isRegister
            ? 'Save pitches, keep your squad, and plan kickabouts.'
            : 'Log in to your TopBins account.'}
        </p>

        <form className="auth-form" onSubmit={submit}>
          <input
            className="input"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            autoFocus
          />
          {isRegister && (
            <input
              className="input"
              placeholder="Display name (what your mates call you)"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={30}
            />
          )}
          <input
            className="input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={isRegister ? 'new-password' : 'current-password'}
          />
          {error && <p className="form-error">{error}</p>}
          <button className="btn primary" type="submit" disabled={busy}>
            {busy ? '…' : isRegister ? 'Create account' : 'Log in'}
          </button>
        </form>

        <button
          className="auth-switch"
          onClick={() => actions.openAuth(isRegister ? 'login' : 'register')}
        >
          {isRegister ? 'Already got an account? Log in' : 'New here? Create an account'}
        </button>

        <p className="auth-note">
          Demo build: accounts live only in this browser. A real backend slots in when the app
          moves to its own repo.
        </p>
      </div>
    </div>
  )
}
