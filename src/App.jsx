import React, { useEffect, useRef } from 'react'
import { useStore } from './lib/store.jsx'
import { Header } from './components/Header.jsx'
import { Finder } from './components/Finder.jsx'
import { About } from './components/About.jsx'
import { Profile } from './components/Profile.jsx'
import { AuthModal } from './components/AuthModal.jsx'
import { PitchDetail } from './components/PitchDetail.jsx'
import { PitchPage } from './components/PitchPage.jsx'
import { NotFound } from './components/NotFound.jsx'
import { Home } from './components/Home.jsx'
import { Privacy } from './components/Privacy.jsx'
import { Footer } from './components/Footer.jsx'
import { MOBILE_QUERY, useMediaQuery } from './lib/media.js'
import { GamePage } from './components/GamePage.jsx'
import { isLegacyFinderLink, navigate, useLocation } from './lib/location.js'

const TITLES = {
  home: 'PitchFinder: pick a pitch the whole group can get to',
  find: 'Find a pitch: PitchFinder',
  about: 'About: PitchFinder',
  privacy: 'Privacy: PitchFinder',
  profile: 'My games: PitchFinder',
  notFound: 'Page not found: PitchFinder',
}

export function App() {
  const { state, actions } = useStore()
  const { route } = state
  const mainRef = useRef(null)
  const mobile = useMediaQuery(MOBILE_QUERY)
  const location = useLocation()

  // Links shared before the finder moved to /find still open the finder.
  const legacy = isLegacyFinderLink(location.path, location.search)
  useEffect(() => {
    if (legacy) navigate(`/find${location.search}`, { replace: true })
  }, [legacy, location.search])

  useEffect(() => {
    if (!state.notice) return
    const t = setTimeout(actions.clearNotice, 5000)
    return () => clearTimeout(t)
  }, [state.notice, actions])

  useEffect(() => {
    if (TITLES[route.name]) document.title = TITLES[route.name]
    // Page routes scroll inside <main>; start each page at the top.
    if (mainRef.current) mainRef.current.scrollTop = 0
  }, [route])

  let page
  switch (route.name) {
    case 'home':
      page = legacy ? null : <Home />
      break
    case 'find':
      page = <Finder />
      break
    case 'about':
      page = <About />
      break
    case 'privacy':
      page = <Privacy />
      break
    case 'profile':
      page = <Profile />
      break
    case 'pitch':
      page = <PitchPage id={route.params.id} />
      break
    case 'game':
      page = <GamePage slug={route.params.slug} />
      break
    default:
      page = <NotFound />
  }

  return (
    <div className="app">
      <Header />
      <main ref={mainRef} className={route.name === 'find' ? 'main-find' : 'main-page'}>
        {page}
        {route.name !== 'find' && !legacy && <Footer />}
      </main>
      {state.authModal && <AuthModal />}
      <div className="toast-region" role="status" aria-live="polite">
        {state.notice && (
          <div className="toast">
            {state.notice.text}
            <button className="link-btn" onClick={actions.clearNotice} aria-label="Dismiss">
              ✕
            </button>
          </div>
        )}
      </div>
      {route.name === 'find' && !mobile && state.selectedPitchId && <PitchDetail />}
    </div>
  )
}
