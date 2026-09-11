import React from 'react'
import { useStore } from '../lib/store.jsx'
import { Link } from './Link.jsx'

export function NotFound({ kind = 'page' }) {
  const { actions } = useStore()
  const isPitch = kind === 'pitch'
  return (
    <section className="empty-page" role="status">
      <p className="empty-kicker">{isPitch ? 'Pitch not found' : 'Page not found'}</p>
      <h1 className="empty-title">
        {isPitch
          ? 'That pitch is not in the current dataset.'
          : 'There is nothing at this address.'}
      </h1>
      <p className="empty-body">
        {isPitch
          ? 'It may have been removed from OpenStreetMap, or merged into a venue. The map has everything that is current.'
          : 'Check the link you were sent, or start from the map.'}
      </p>
      <Link className="btn primary" href={actions.hrefFor('/')}>
        Open the map
      </Link>
    </section>
  )
}
