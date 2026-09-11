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

const TITLES = {
  find: 'PitchFinder: where to play football in London',
  about: 'About: PitchFinder',
  profile: 'My games: PitchFinder',
  notFound: 'Page not found: PitchFinder',
}

export function App() {
  const { state } = useStore()
  const { route } = state
  const mainRef = useRef(null)

  useEffect(() => {
    if (TITLES[route.name]) document.title = TITLES[route.name]
    // Page routes scroll inside <main>; start each page at the top.
    if (mainRef.current) mainRef.current.scrollTop = 0
  }, [route])

  let page
  switch (route.name) {
    case 'find':
      page = <Finder />
      break
    case 'about':
      page = <About />
      break
    case 'profile':
      page = <Profile />
      break
    case 'pitch':
      page = <PitchPage id={route.params.id} />
      break
    default:
      page = <NotFound />
  }

  return (
    <div className="app">
      <Header />
      <main ref={mainRef} className={route.name === 'find' ? 'main-find' : 'main-page'}>
        {page}
      </main>
      {state.authModal && <AuthModal />}
      {route.name === 'find' && state.selectedPitchId && <PitchDetail />}
    </div>
  )
}
