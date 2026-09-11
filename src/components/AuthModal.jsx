import React, { useEffect, useRef, useState } from 'react'
import { useStore } from '../lib/store.jsx'
import { useFocusTrap } from '../lib/focus-trap.js'

const REASONS = {
  save: 'Sign in to save pitches. Browsing and ranking never need an account.',
  game: 'Sign in to create a game and get a link the whole group can answer.',
  group: 'Sign in to keep this group for next time.',
  generic: 'Sign in to save pitches, keep your group and organise games.',
}

export function AuthModal() {
  const { state, actions } = useStore()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [phase, setPhase] = useState('idle') // idle | sending | sent | error
  const [error, setError] = useState('')
  const firstField = useRef(null)
  const dialogRef = useRef(null)
  useFocusTrap(dialogRef)

  useEffect(() => {
    firstField.current?.focus()
    const onKey = (e) => e.key === 'Escape' && actions.closeAuth()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [actions])

  async function submit(e) {
    e.preventDefault()
    const value = email.trim()
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) {
      setError('Enter a valid email address.')
      return
    }
    setPhase('sending')
    setError('')
    try {
      await actions.signInWithEmail(value, name.trim())
      setPhase('sent')
    } catch (err) {
      setError(err.message || 'Something went wrong.')
      setPhase('error')
    }
  }

  async function google() {
    setError('')
    try {
      await actions.signInWithGoogle(name.trim())
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    }
  }

  const reason = REASONS[state.authModal?.reason] || REASONS.generic

  return (
    <div className="scrim" onClick={actions.closeAuth}>
      <div
        ref={dialogRef}
        className="modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Sign in"
      >
        <header className="row between">
          <h2 className="modal-title">Sign in</h2>
          <button className="icon-btn" onClick={actions.closeAuth} aria-label="Close">
            ✕
          </button>
        </header>

        {!state.authAvailable ? (
          <div className="notice" role="status">
            <strong>Sign in is unavailable right now.</strong> Everything else works: the map, the
            ranking, filters and pitch pages.
          </div>
        ) : phase === 'sent' ? (
          <div className="notice" role="status">
            <strong>Check your inbox.</strong> We sent a sign-in link to {email.trim()}. Open it on
            this device and you will be back here, signed in.
          </div>
        ) : (
          <>
            <p className="hint">{reason}</p>
            <form className="stack" onSubmit={submit} noValidate>
              <label className="field">
                <span className="field-label">Your name, as the group will see it</span>
                <input
                  className="input"
                  autoComplete="given-name"
                  placeholder="Sam"
                  maxLength={40}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <label className="field">
                <span className="field-label">Email</span>
                <input
                  ref={firstField}
                  className="input"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              {error && (
                <p className="form-error" role="alert">
                  {error}
                </p>
              )}
              <button className="btn primary" type="submit" disabled={phase === 'sending'}>
                {phase === 'sending' ? 'Sending link' : 'Email me a sign-in link'}
              </button>
            </form>
            <div className="or-rule">
              <span>or</span>
            </div>
            <button className="btn ghost" type="button" onClick={google}>
              Continue with Google
            </button>
            <p className="hint dim">No password. The link signs you in on this device.</p>
          </>
        )}
      </div>
    </div>
  )
}
