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
    <div className="scrim" onClick={actions.closeAuth}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={isRegister ? 'Create profile' : 'Sign in'}
      >
        <header className="row between">
          <h2 className="modal-title">{isRegister ? 'Create your profile' : 'Sign in'}</h2>
          <button className="icon-btn" onClick={actions.closeAuth} aria-label="Close">
            ✕
          </button>
        </header>
        <p className="hint">
          {isRegister
            ? 'Save pitches, keep your group and organise games.'
            : 'Welcome back.'}
        </p>

        <form className="stack" onSubmit={submit}>
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
              placeholder="Display name"
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
            {busy ? '…' : isRegister ? 'Create profile' : 'Sign in'}
          </button>
        </form>

        <button className="link-btn" onClick={() => actions.openAuth(isRegister ? 'login' : 'register')}>
          {isRegister ? 'Already have a profile? Sign in' : 'New here? Create a profile'}
        </button>

        <p className="hint dim">
          Profiles are currently stored in this browser only. Cloud accounts with sync are on the
          roadmap.
        </p>
      </div>
    </div>
  )
}
