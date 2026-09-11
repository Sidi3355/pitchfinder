// Keeps a map failure from taking the rest of the app down. MapLibre needs
// WebGL; when it is missing or the GPU process dies, the list, filters and
// pitch pages must keep working and the map area says why it is blank.

import React from 'react'

export function webglSupported() {
  if (typeof document === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

export function MapUnavailable({ compact = false }) {
  return (
    <div className={`map-unavailable${compact ? ' compact' : ''}`} role="note">
      <p>
        <strong>The map cannot be shown in this browser.</strong>
      </p>
      <p>It needs WebGL, which is switched off or unsupported here. Everything else still works.</p>
    </div>
  )
}

export class MapBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error) {
    // Reported once so it is visible in dev tools without being a console error in production.
    if (import.meta.env.DEV) console.warn('Map failed to initialise:', error)
  }

  render() {
    if (this.state.failed || !webglSupported())
      return <MapUnavailable compact={this.props.compact} />
    return this.props.children
  }
}
