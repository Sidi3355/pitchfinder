import React from 'react'
import { Link } from './Link.jsx'

export function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-inner">
        <span className="footer-brand">PitchFinder</span>
        <nav className="footer-nav" aria-label="Footer">
          <Link href="/find">Find a pitch</Link>
          <Link href="/about">About</Link>
          <Link href="/privacy">Privacy</Link>
          <a
            href="https://github.com/Sidi3355/pitchfinder"
            target="_blank"
            rel="noopener noreferrer"
          >
            Source on GitHub
          </a>
        </nav>
        <p className="footer-legal">
          Pitch data ©{' '}
          <a
            href="https://www.openstreetmap.org/copyright"
            target="_blank"
            rel="noopener noreferrer"
          >
            OpenStreetMap
          </a>{' '}
          contributors, ODbL. Routes by OSRM. Postcodes by postcodes.io.
        </p>
      </div>
    </footer>
  )
}
