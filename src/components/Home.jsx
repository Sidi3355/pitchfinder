import React, { useEffect, useRef } from 'react'
import { useStore } from '../lib/store.jsx'
import { HeroScene } from '../webgl/HeroScene.js'
import { PITCHES, PITCH_TYPES } from '../data/pitches.js'

export function Home() {
  const { actions } = useStore()
  const heroRef = useRef(null)

  useEffect(() => {
    const el = heroRef.current
    if (!el) return
    const scene = new HeroScene()
    try {
      scene.mount(el)
    } catch {
      return
    }
    return () => scene.unmount()
  }, [])

  const counts = Object.fromEntries(
    Object.keys(PITCH_TYPES).map((t) => [t, PITCHES.filter((p) => p.type === t).length]),
  )

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-canvas" ref={heroRef} aria-hidden="true" />
        <div className="hero-copy">
          <p className="hero-kicker">London's pitch finder</p>
          <h1>
            Find the pitch.
            <br />
            <span className="grad">Hit top bins.</span>
          </h1>
          <p className="hero-sub">
            Every Powerleague, Goals, park pitch and cage in London — ranked for your whole
            friend group by travel time, price and the way you like to play.
          </p>
          <div className="hero-cta">
            <button className="btn primary big" onClick={() => actions.go('find')}>
              Build your squad →
            </button>
            <button className="btn ghost big" onClick={() => actions.openAuth('register')}>
              Create an account
            </button>
          </div>
        </div>
      </section>

      <section className="types">
        <h2 className="section-title">Every way London plays</h2>
        <p className="section-sub">Pick your battlefield — from rooftop cages to Hackney Marshes.</p>
        <div className="type-grid">
          {Object.entries(PITCH_TYPES).map(([key, t]) => (
            <button
              key={key}
              className="type-card"
              style={{ '--accent': t.color }}
              onClick={() => {
                actions.setFilters({ types: [key] })
                actions.go('find')
              }}
            >
              <span className="type-emoji" aria-hidden="true">{t.emoji}</span>
              <span className="type-name">{t.label}</span>
              <span className="type-count">{counts[key]} venues</span>
              <span className="type-blurb">{t.blurb}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="how">
        <h2 className="section-title">How it works</h2>
        <div className="how-grid">
          <div className="how-step">
            <span className="how-num">1</span>
            <h3>Drop your squad on the map</h3>
            <p>Add each friend's home area and how they travel — walk, cycle, tube or drive.</p>
          </div>
          <div className="how-step">
            <span className="how-num">2</span>
            <h3>Set the vibe</h3>
            <p>Caged or open pitch, budget per head, 5s / 7s / 11s, floodlights for evening games.</p>
          </div>
          <div className="how-step">
            <span className="how-num">3</span>
            <h3>Get your shortlist</h3>
            <p>The Squad Score ranks every pitch so nobody's schlepping across town while you play.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
