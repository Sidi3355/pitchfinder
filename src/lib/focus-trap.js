// Keeps Tab and Shift+Tab inside a dialog while it is open, and puts focus
// back where it was when the dialog closes.

import { useEffect } from 'react'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function useFocusTrap(ref, active = true) {
  useEffect(() => {
    if (!active || !ref.current) return
    const root = ref.current
    const previous = document.activeElement
    const onKey = (e) => {
      if (e.key !== 'Tab') return
      const items = [...root.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null)
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      } else if (!root.contains(document.activeElement)) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      if (previous && typeof previous.focus === 'function') previous.focus()
    }
  }, [ref, active])
}
