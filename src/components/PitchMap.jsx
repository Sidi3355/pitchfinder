// A stylised, self-contained map of London — no tile servers, no API keys.
// Equirectangular projection of real coordinates onto an SVG with the Thames
// drawn as a reference. Drag to pan, scroll/pinch buttons to zoom.

import React, { useMemo, useRef, useState } from 'react'
import { useStore } from '../lib/store.jsx'
import { PITCH_TYPES } from '../data/pitches.js'
import { makeProjection, THAMES, centroid } from '../lib/geo.js'

const W = 1000
const H = 640

export function PitchMap() {
  const { state, results, actions } = useStore()
  const proj = useMemo(() => makeProjection(W, H), [])
  const [view, setView] = useState({ x: 0, y: 0, k: 1 })
  const [hover, setHover] = useState(null) // { id, x, y }
  const dragRef = useRef(null)
  const svgRef = useRef(null)

  const thamesPath = useMemo(() => {
    return THAMES.map((pt, i) => {
      const { x, y } = proj.toXY(pt)
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
    }).join(' ')
  }, [proj])

  const topIds = useMemo(() => new Set(results.slice(0, 5).map((r) => r.pitch.id)), [results])
  const resultById = useMemo(() => new Map(results.map((r) => [r.pitch.id, r])), [results])
  const squadCentre = state.squad.length ? centroid(state.squad) : null

  function onPointerDown(e) {
    dragRef.current = { startX: e.clientX, startY: e.clientY, ...view }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  function onPointerMove(e) {
    if (!dragRef.current) return
    const rect = svgRef.current.getBoundingClientRect()
    const scaleX = W / rect.width
    setView({
      ...view,
      x: dragRef.current.x + (e.clientX - dragRef.current.startX) * scaleX,
      y: dragRef.current.y + (e.clientY - dragRef.current.startY) * scaleX,
    })
  }
  function onPointerUp() {
    dragRef.current = null
  }
  function zoom(factor) {
    setView((v) => {
      const k = Math.max(0.8, Math.min(5, v.k * factor))
      // Zoom around the viewport centre.
      const cx = W / 2
      const cy = H / 2
      const ratio = k / v.k
      return { k, x: cx - (cx - v.x) * ratio, y: cy - (cy - v.y) * ratio }
    })
  }

  const hoverResult = hover ? resultById.get(hover.id) : null

  return (
    <section className="map-panel">
      <div className="map-head">
        <h2 className="panel-title">The London board</h2>
        <div className="map-zoom">
          <button className="icon-btn" onClick={() => zoom(1.3)} aria-label="Zoom in">＋</button>
          <button className="icon-btn" onClick={() => zoom(1 / 1.3)} aria-label="Zoom out">－</button>
          <button
            className="icon-btn"
            onClick={() => setView({ x: 0, y: 0, k: 1 })}
            aria-label="Reset view"
          >
            ⟲
          </button>
        </div>
      </div>

      <div className="map-wrap">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="map-svg"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          role="img"
          aria-label="Map of football pitches across London"
        >
          <defs>
            <radialGradient id="mapGlow" cx="50%" cy="45%" r="70%">
              <stop offset="0%" stopColor="#fbfdfb" />
              <stop offset="100%" stopColor="#edf3ee" />
            </radialGradient>
          </defs>
          <rect width={W} height={H} fill="url(#mapGlow)" />

          <g transform={`translate(${view.x},${view.y}) scale(${view.k})`}>
            {/* Pitch-line grid for flavour */}
            <g opacity="0.08" stroke="#16a34a" strokeWidth="1">
              {Array.from({ length: 9 }, (_, i) => (
                <line key={`v${i}`} x1={(i + 1) * (W / 10)} y1="0" x2={(i + 1) * (W / 10)} y2={H} />
              ))}
              {Array.from({ length: 5 }, (_, i) => (
                <line key={`h${i}`} x1="0" y1={(i + 1) * (H / 6)} x2={W} y2={(i + 1) * (H / 6)} />
              ))}
              <circle cx={W / 2} cy={H / 2} r="70" fill="none" />
            </g>

            {/* The Thames */}
            <path d={thamesPath} fill="none" stroke="#d3e7f4" strokeWidth={14 / view.k} strokeLinecap="round" strokeLinejoin="round" />
            <path d={thamesPath} fill="none" stroke="#8fc0e2" strokeWidth={3.5 / view.k} strokeLinecap="round" strokeLinejoin="round" />

            {/* Squad homes + centre of gravity */}
            {state.squad.map((f) => {
              const { x, y } = proj.toXY(f)
              return (
                <g key={f.id} transform={`translate(${x},${y})`}>
                  <circle r={10 / view.k} fill="#16241c" opacity="0.10" />
                  <circle r={4.5 / view.k} fill="#16241c" stroke="#ffffff" strokeWidth={1.5 / view.k} />
                  <text y={-9 / view.k} textAnchor="middle" className="map-friend-label" fontSize={11 / view.k}>
                    {f.name}
                  </text>
                </g>
              )
            })}
            {squadCentre && (
              <g transform={`translate(${proj.toXY(squadCentre).x},${proj.toXY(squadCentre).y})`} aria-hidden="true">
                <circle r={8 / view.k} fill="none" stroke="#16241c" strokeWidth={1.5 / view.k} />
                <circle r={2 / view.k} fill="#16241c" />
              </g>
            )}

            {/* Pitches — only those passing the filters, top 5 highlighted */}
            {results.map(({ pitch }) => {
              const { x, y } = proj.toXY(pitch)
              const t = PITCH_TYPES[pitch.type]
              const isTop = topIds.has(pitch.id)
              const r = (isTop ? 8 : 5) / view.k
              return (
                <g
                  key={pitch.id}
                  transform={`translate(${x},${y})`}
                  className="map-marker"
                  onClick={() => actions.selectPitch(pitch.id)}
                  onPointerEnter={() => setHover({ id: pitch.id, x, y })}
                  onPointerLeave={() => setHover(null)}
                >
                  {isTop && <circle r={r * 2.1} fill={t.color} opacity="0.15" className="marker-pulse" />}
                  <circle r={r} fill={t.color} stroke="#ffffff" strokeWidth={1.6 / view.k} />
                  {isTop && (
                    <text y={1.5 / view.k} textAnchor="middle" dominantBaseline="middle" fontSize={r} fill="#ffffff" fontWeight="900">
                      ★
                    </text>
                  )}
                </g>
              )
            })}
          </g>
        </svg>

        {hover && hoverResult && (
          <div
            className="map-tooltip"
            style={{
              left: `${(((hover.x * view.k + view.x) / W) * 100).toFixed(2)}%`,
              top: `${(((hover.y * view.k + view.y) / H) * 100).toFixed(2)}%`,
            }}
          >
            <strong>{hoverResult.pitch.name}</strong>
            <span>
              {PITCH_TYPES[hoverResult.pitch.type].label}
              {state.squad.length > 0 && ` · worst ETA ${hoverResult.maxEta} min`}
              {hoverResult.pitch.pricePerHour === 0
                ? ' · free'
                : ` · £${hoverResult.pitch.pricePerHour}/hr`}
            </span>
          </div>
        )}
      </div>

      <div className="map-legend">
        {Object.entries(PITCH_TYPES).map(([key, t]) => (
          <span key={key} className="legend-item">
            <span className="legend-dot" style={{ background: t.color }} />
            {t.label}
          </span>
        ))}
        <span className="legend-item">
          <span className="legend-dot" style={{ background: '#16241c' }} />
          Your squad
        </span>
        <span className="legend-item">
          <span className="legend-dot ring" />
          Squad centre
        </span>
      </div>
    </section>
  )
}
