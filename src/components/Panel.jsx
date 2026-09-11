// A full-height sheet on phones, a modal panel on desktop, for the group
// editor, the filters and the More menu. Traps focus, closes on Escape.

import React, { useEffect, useRef } from 'react'
import { useFocusTrap } from '../lib/focus-trap.js'

export function Panel({ title, onClose, footer, children, wide = false }) {
  const ref = useRef(null)
  useFocusTrap(ref)

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="scrim panel-scrim" onClick={onClose}>
      <div
        ref={ref}
        className={`panel-sheet${wide ? ' wide' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="panel-head">
          <h2>{title}</h2>
          <button className="icon-btn lg" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </header>
        <div className="panel-body">{children}</div>
        {footer && <footer className="panel-foot">{footer}</footer>}
      </div>
    </div>
  )
}
