// The map: MapLibre GL (WebGL) over OpenFreeMap vector tiles, with the
// filtered pitch set as a clustered GeoJSON source, squad home markers and
// the squad's centre of gravity. Falls back to a plain canvas if the tile
// style can't be fetched, so markers always render.

import React, { useEffect, useRef } from 'react'
import * as maplibregl from 'maplibre-gl'
import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'
import 'maplibre-gl/dist/maplibre-gl.css'

// MapLibre v6 resolves its worker relative to the module URL, which breaks
// once Vite bundles everything into one chunk — point it at the worker Vite
// emits instead.
maplibregl.setWorkerUrl(maplibreWorkerUrl)
import { useStore } from '../lib/store.jsx'
import { PITCH_TYPES, pitchName } from '../data/types.js'
import { centroid } from '../lib/geo.js'
import { costOf } from '../lib/data.js'

const STYLE_URL = 'https://tiles.openfreemap.org/styles/positron'
const LONDON_CENTER = [-0.1, 51.5072]

const FALLBACK_STYLE = {
  version: 8,
  sources: {},
  layers: [{ id: 'bg', type: 'background', paint: { 'background-color': '#e9edea' } }],
}

const TYPE_COLOR_EXPR = [
  'match',
  ['get', 'type'],
  ...Object.entries(PITCH_TYPES).flatMap(([k, t]) => [k, t.color]),
  '#6b7280',
]

function toGeoJSON(results) {
  return {
    type: 'FeatureCollection',
    features: results.map(({ pitch, maxEta }) => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [pitch.lng, pitch.lat] },
      properties: {
        id: pitch.id,
        name: pitchName(pitch),
        type: pitch.type,
        curated: pitch.curated ? 1 : 0,
        maxEta,
        price: formatPrice(pitch),
      },
    })),
  }
}

function formatPrice(pitch) {
  const cost = costOf(pitch)
  if (!cost.known) return 'Price on booking'
  return cost.perHour === 0 ? 'Free' : `£${cost.perHour}/hr`
}

export function MapView() {
  const { state, results, actions } = useStore()
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const readyRef = useRef(false)
  const dataRef = useRef(toGeoJSON([]))
  const squadMarkersRef = useRef([])
  const popupRef = useRef(null)

  dataRef.current = toGeoJSON(results)

  // ── Init ──
  useEffect(() => {
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: STYLE_URL,
      center: LONDON_CENTER,
      zoom: 9.7,
      minZoom: 8,
      attributionControl: { compact: true },
    })
    mapRef.current = map
    if (typeof window !== 'undefined') window.__pfMap = map // debugging handle
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right')
    map.addControl(
      new maplibregl.GeolocateControl({ positionOptions: { enableHighAccuracy: true } }),
      'top-right',
    )

    // If the vector style can't be fetched (offline, blocked network), swap in
    // a plain background so the pitch layers still render and work.
    let fellBack = false
    const fallBack = () => {
      if (!fellBack && !readyRef.current) {
        fellBack = true
        map.setStyle(FALLBACK_STYLE)
      }
    }
    map.on('error', () => {
      if (!readyRef.current) fallBack()
    })
    const fallbackTimer = setTimeout(fallBack, 8000)

    const addLayers = () => {
      if (map.getSource('pitches')) return
      map.addSource('pitches', {
        type: 'geojson',
        data: dataRef.current,
        cluster: true,
        clusterRadius: 46,
        clusterMaxZoom: 13,
      })
      map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'pitches',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': '#ffffff',
          'circle-stroke-color': '#15803d',
          'circle-stroke-width': 2,
          'circle-radius': ['step', ['get', 'point_count'], 14, 25, 18, 100, 24],
        },
      })
      if (map.getStyle().glyphs) {
        map.addLayer({
          id: 'cluster-count',
          type: 'symbol',
          source: 'pitches',
          filter: ['has', 'point_count'],
          layout: {
            'text-field': ['get', 'point_count_abbreviated'],
            'text-size': 12,
            'text-font': ['Noto Sans Regular'],
          },
          paint: { 'text-color': '#14532d' },
        })
      }
      map.addLayer({
        id: 'pitch-points',
        type: 'circle',
        source: 'pitches',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': TYPE_COLOR_EXPR,
          'circle-radius': ['case', ['==', ['get', 'curated'], 1], 7, 5],
          'circle-stroke-color': '#ffffff',
          'circle-stroke-width': 1.5,
          'circle-opacity': 0.92,
        },
      })

      map.on('click', 'clusters', async (e) => {
        const feature = e.features[0]
        const zoom = await map.getSource('pitches').getClusterExpansionZoom(feature.properties.cluster_id)
        map.easeTo({ center: feature.geometry.coordinates, zoom: zoom + 0.3 })
      })
      map.on('click', 'pitch-points', (e) => {
        actions.selectPitch(e.features[0].properties.id)
      })
      for (const layer of ['clusters', 'pitch-points']) {
        map.on('mouseenter', layer, () => (map.getCanvas().style.cursor = 'pointer'))
        map.on('mouseleave', layer, () => (map.getCanvas().style.cursor = ''))
      }
      map.on('mouseenter', 'pitch-points', (e) => {
        const p = e.features[0].properties
        popupRef.current?.remove()
        popupRef.current = new maplibregl.Popup({ closeButton: false, offset: 10, className: 'map-popup' })
          .setLngLat(e.features[0].geometry.coordinates)
          .setHTML(
            `<strong>${escapeHtml(p.name)}</strong><span>${escapeHtml(
              PITCH_TYPES[p.type]?.short || '',
            )} · ${escapeHtml(p.price)}${p.maxEta > 0 ? ` · up to ${p.maxEta} min away` : ''}</span>`,
          )
          .addTo(map)
      })
      map.on('mouseleave', 'pitch-points', () => popupRef.current?.remove())

      readyRef.current = true
    }

    // 'style.load' fires for both the remote style and the fallback.
    map.on('style.load', addLayers)

    return () => {
      clearTimeout(fallbackTimer)
      readyRef.current = false
      popupRef.current?.remove()
      map.remove()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Keep source data in sync with filtered results ──
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    const apply = () => map.getSource('pitches')?.setData(dataRef.current)
    if (readyRef.current) apply()
    else map.once('style.load', apply)
  }, [results])

  // ── Squad markers + centre of gravity ──
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    squadMarkersRef.current.forEach((m) => m.remove())
    squadMarkersRef.current = []

    for (const friend of state.squad) {
      const el = document.createElement('div')
      el.className = 'squad-marker'
      el.innerHTML = `<span class="squad-marker-dot"></span><span class="squad-marker-label">${escapeHtml(friend.name)}</span>`
      squadMarkersRef.current.push(
        new maplibregl.Marker({ element: el, anchor: 'bottom' })
          .setLngLat([friend.lng, friend.lat])
          .addTo(map),
      )
    }

    if (state.squad.length > 1) {
      const c = centroid(state.squad)
      const el = document.createElement('div')
      el.className = 'centroid-marker'
      el.title = 'Centre of your group'
      squadMarkersRef.current.push(
        new maplibregl.Marker({ element: el }).setLngLat([c.lng, c.lat]).addTo(map),
      )
    }
  }, [state.squad])

  // ── Fly to selection ──
  useEffect(() => {
    const map = mapRef.current
    if (!map || !state.selectedPitchId) return
    const row = results.find((r) => r.pitch.id === state.selectedPitchId)
    if (row) {
      map.easeTo({ center: [row.pitch.lng, row.pitch.lat], zoom: Math.max(map.getZoom(), 13.5), duration: 600 })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.selectedPitchId])

  return <div ref={containerRef} className="map-container" role="application" aria-label="Map of London football pitches" />
}

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)
}
