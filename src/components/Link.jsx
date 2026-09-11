import React from 'react'
import { navigate } from '../lib/location.js'

/** Same-origin link that navigates without a full reload. */
export function Link({ href, replace = false, onClick, children, ...rest }) {
  function handleClick(e) {
    onClick?.(e)
    if (e.defaultPrevented) return
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    if (rest.target && rest.target !== '_self') return
    e.preventDefault()
    navigate(href, { replace })
  }
  return (
    <a href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  )
}
