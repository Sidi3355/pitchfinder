import React, { useEffect, useRef } from 'react'
import { useStore } from './lib/store.jsx'
import { Backdrop } from './webgl/Backdrop.js'
import { Nav } from './components/Nav.jsx'
import { Home } from './components/Home.jsx'
import { Finder } from './components/Finder.jsx'
import { MyGame } from './components/MyGame.jsx'
import { AuthModal } from './components/AuthModal.jsx'
import { PitchDetail } from './components/PitchDetail.jsx'

export function App() {
  const { state } = useStore()
  const backdropRef = useRef(null)

  useEffect(() => {
    const el = backdropRef.current
    if (!el) return
    const backdrop = new Backdrop()
    try {
      backdrop.mount(el)
    } catch {
      return // no WebGL — the CSS background still looks fine
    }
    return () => backdrop.unmount()
  }, [])

  return (
    <>
      <div className="backdrop" ref={backdropRef} aria-hidden="true" />
      <div className="app">
        <Nav />
        <main>
          {state.view === 'home' && <Home />}
          {state.view === 'find' && <Finder />}
          {state.view === 'game' && <MyGame />}
        </main>
        <footer className="footer">
          <span>TopBins — built for London ballers.</span>
          <span className="footer-note">
            Venue details are indicative — always check with the venue before travelling.
          </span>
        </footer>
      </div>
      {state.authModal && <AuthModal />}
      {state.selectedPitchId && <PitchDetail />}
    </>
  )
}
