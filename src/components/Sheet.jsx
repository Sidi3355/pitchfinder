// Bottom sheet for phones. Three snap points (peek, half, full), dragged by
// its handle or header with pointer events, no library. The body scrolls on
// its own at every snap; dragging is only from the grab area, which keeps
// list scrolling and sheet dragging from fighting each other.

import React, { useCallback, useEffect, useRef, useState } from 'react'

export const SNAPS = { peek: 0.16, half: 0.5, full: 0.92 }

export function Sheet({ snap, onSnap, header, children, label }) {
  const [dragHeight, setDragHeight] = useState(null)
  const drag = useRef(null)

  const available = useCallback(
    () =>
      window.innerHeight -
      (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 56),
    [],
  )

  const onPointerDown = (e) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return
    // Buttons inside the header keep their clicks; only the handle and the
    // plain header surface start a drag (pointer capture would swallow clicks).
    if (e.target.closest('button, a, input, select') && !e.target.closest('.sheet-handle')) return
    const startHeight = SNAPS[snap] * available()
    drag.current = {
      startY: e.clientY,
      startHeight,
      lastY: e.clientY,
      lastT: performance.now(),
      velocity: 0,
    }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e) => {
    if (!drag.current) return
    const now = performance.now()
    const dy = e.clientY - drag.current.startY
    const dt = Math.max(1, now - drag.current.lastT)
    drag.current.velocity = (e.clientY - drag.current.lastY) / dt
    drag.current.lastY = e.clientY
    drag.current.lastT = now
    const max = SNAPS.full * available()
    setDragHeight(Math.min(max, Math.max(60, drag.current.startHeight - dy)))
  }

  const onPointerUp = () => {
    if (!drag.current) return
    const total = available()
    const height = dragHeight ?? drag.current.startHeight
    const v = drag.current.velocity // px per ms, positive = downwards
    let next = snap
    if (Math.abs(v) > 0.5) {
      const order = ['peek', 'half', 'full']
      const i = order.indexOf(snap)
      next = v < 0 ? order[Math.min(2, i + 1)] : order[Math.max(0, i - 1)]
    } else {
      let best = snap
      let bestD = Infinity
      for (const [name, frac] of Object.entries(SNAPS)) {
        const d = Math.abs(frac * total - height)
        if (d < bestD) {
          bestD = d
          best = name
        }
      }
      next = best
    }
    drag.current = null
    setDragHeight(null)
    if (next !== snap) onSnap(next)
  }

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && snap === 'full') onSnap('half')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [snap, onSnap])

  const style =
    dragHeight != null
      ? { height: `${dragHeight}px`, transition: 'none' }
      : { height: `calc(${SNAPS[snap] * 100}% )` }

  return (
    <section className={`sheet sheet-${snap}`} style={style} aria-label={label}>
      <div
        className="sheet-grab"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <button
          type="button"
          className="sheet-handle"
          aria-label={snap === 'full' ? 'Shrink the list' : 'Expand the list'}
          onClick={() => onSnap(snap === 'full' ? 'half' : snap === 'half' ? 'full' : 'half')}
        >
          <span />
        </button>
        {header && <div className="sheet-header">{header}</div>}
      </div>
      <div className="sheet-body">{children}</div>
    </section>
  )
}
