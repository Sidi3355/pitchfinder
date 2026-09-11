// A pitch from the index plus its detail file once that has loaded.

import { useEffect, useState } from 'react'
import { loadPitchDetail } from './data.js'

export function usePitchDetail(pitch) {
  const [detail, setDetail] = useState(null)
  const id = pitch?.id
  useEffect(() => {
    let active = true
    if (!id) return
    loadPitchDetail(id).then((d) => active && d && setDetail(d))
    return () => {
      active = false
    }
  }, [id])
  if (!pitch) return pitch
  return detail && detail.id === pitch.id ? { ...pitch, ...detail } : pitch
}
