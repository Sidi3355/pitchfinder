import React, { Suspense, useEffect, useRef } from 'react'
import { useStore } from './lib/store.jsx'
import { Header } from './components/Header.jsx'
import { AuthModal } from './components/AuthModal.jsx'
import { Home } from './components/Home.jsx'
import { Footer } from './components/Footer.jsx'
import { MOBILE_QUERY, useMediaQuery } from './lib/media.js'
import { isLegacyFinderLink, navigate, useLocation } from './lib/location.js'

// The landing page is the first screen, so it ships in the entry chunk; every
// other route loads when it is opened. Each chunk is a few KB gzipped and the
// landing's first paint no longer pays for the finder, the pitch page or the
// event pages.
const lazy = (load) => React.lazy(load)
const Finder = lazy(() => import('./components/Finder.jsx').then((m) => ({ default: m.Finder })))
const About = lazy(() => import('./components/About.jsx').then((m) => ({ default: m.About })))
const Profile = lazy(() => import('./components/Profile.jsx').then((m) => ({ default: m.Profile })))
const PitchDetail = lazy(() =>
  import('./components/PitchDetail.jsx').then((m) => ({ default: m.PitchDetail })),
)
const PitchPage = lazy(() =>
  import('./components/PitchPage.jsx').then((m) => ({ default: m.PitchPage })),
)
const NotFound = lazy(() =>
  import('./components/NotFound.jsx').then((m) => ({ default: m.NotFound })),
)
const Privacy = lazy(() => import('./components/Privacy.jsx').then((m) => ({ default: m.Privacy })))
const GamePage = lazy(() =>
  import('./components/GamePage.jsx').then((m) => ({ default: m.GamePage })),
)
const GroupPage = lazy(() =>
  import('./components/GroupPage.jsx').then((m) => ({ default: m.GroupPage })),
)

const PageLoading = () => <div className="page-loading" aria-busy="true" aria-label="Loading" />

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
    case 'group':
      page = <GroupPage slug={route.params.slug} />
      break
    default:
      page = <NotFound />
  }

  return (
    <div className="app">
      <Header />
      <main ref={mainRef} className={route.name === 'find' ? 'main-find' : 'main-page'}>
        <Suspense fallback={<PageLoading />}>{page}</Suspense>
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
      {route.name === 'find' && !mobile && state.selectedPitchId && (
        <Suspense fallback={null}>
          <PitchDetail />
        </Suspense>
      )}
    </div>
  )
}
