import React from 'react'
import { useStore } from './lib/store.jsx'
import { Header } from './components/Header.jsx'
import { Finder } from './components/Finder.jsx'
import { About } from './components/About.jsx'
import { Profile } from './components/Profile.jsx'
import { AuthModal } from './components/AuthModal.jsx'
import { PitchDetail } from './components/PitchDetail.jsx'

export function App() {
  const { state } = useStore()

  return (
    <div className="app">
      <Header />
      <main className={state.view === 'find' ? 'main-find' : 'main-page'}>
        {state.view === 'find' && <Finder />}
        {state.view === 'about' && <About />}
        {state.view === 'profile' && <Profile />}
      </main>
      {state.authModal && <AuthModal />}
      {state.selectedPitchId && <PitchDetail />}
    </div>
  )
}
