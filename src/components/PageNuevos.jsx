import { useState, useEffect, useRef } from 'react'
import { getCookie, setCookie, removeCookie } from '../lib/cookies'
import { getNombre } from '../lib/session'

const STORAGE_KEY = 'investigator'
const COOLDOWN_HOURS = 48

function MapPickerModal({ onSelect, onClose, initialCoords }) {
  const mapRef = useRef(null)
  const mapInstance = useRef(null)
  const markerRef = useRef(null)
  const currentCenter = useRef(null)
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect
  const lockedRef = useRef(!!initialCoords)
  const [locked, setLocked] = useState(!!initialCoords)

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return

    function initMap() {
      if (!window.L || !mapRef.current || mapInstance.current) return
      const initLat = initialCoords ? parseFloat(initialCoords.lat) : -0.8333
      const initLng = initialCoords ? parseFloat(initialCoords.lng) : -79.4667
      const zoom = initialCoords ? 17 : 14
      const map = L.map(mapRef.current, { zoomControl: true, attributionControl: false }).setView([initLat, initLng], zoom)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, updateWhenIdle: true }).addTo(map)
      mapInstance.current = map

      const marker = L.marker([initLat, initLng], { draggable: false }).addTo(map)
      markerRef.current = marker
      currentCenter.current = { lat: initLat.toFixed(6), lng: initLng.toFixed(6) }

      map.on('moveend', () => {
        if (lockedRef.current) return
        const c = map.getCenter()
        currentCenter.current = { lat: c.lat.toFixed(6), lng: c.lng.toFixed(6) }
        const m = markerRef.current
        if (m) m.setLatLng(c)
      })

      map.invalidateSize()
    }

    if (window.L) {
      initMap()
    } else if (!document.querySelector('script[data-leaflet]')) {
      const script = document.createElement('script')
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      script.dataset.leaflet = ''
      script.onload = initMap
      document.body.appendChild(script)
    }

    return () => {
      if (mapInstance.current) { mapInstance.current.remove(); mapInstance.current = null }
    }
  }, [])

  function handleUnlock() {
    lockedRef.current = false
    setLocked(false)
    const c = mapInstance.current?.getCenter()
    if (c && markerRef.current) {
      markerRef.current.setLatLng(c)
      currentCenter.current = { lat: c.lat.toFixed(6), lng: c.lng.toFixed(6) }
    }
  }

  function handleDone() {
    if (currentCenter.current) onSelectRef.current(currentCenter.current)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/60">
      <div className="flex items-center justify-between bg-white dark:bg-[#1a1a22] px-4 py-3">
        <span className="text-sm font-bold text-[#1e293b] dark:text-white">Selecciona tu vivienda</span>
        <div className="flex items-center gap-2">
          {locked && (
            <button onClick={handleUnlock} className="text-xs font-semibold text-white bg-[#8c6a43] px-3 py-1.5 rounded-lg">Cambiar ubicación</button>
          )}
          <button onClick={handleDone} className="text-sm font-semibold text-[#8c6a43]">Listo</button>
        </div>
      </div>
      <div ref={mapRef} className="flex-1 bg-[#e8e4df] relative">
        {!locked && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1000] pointer-events-none w-6 h-6 rounded-full border-2 border-[#8c6a43] bg-white/40 shadow-sm" />}
      </div>
    </div>
  )
}

function AlreadyView({ onBack, onRetry }) {
  const [remaining, setRemaining] = useState('')
  const name = getNombre() || ''

  useEffect(() => {
    const stored = getCookie(STORAGE_KEY)
    if (!stored) return
    const { timestamp } = stored
    const hoursLeft = Math.max(0, COOLDOWN_HOURS - (Date.now() - timestamp) / (1000 * 60 * 60))
    if (hoursLeft <= 0) { setRemaining(''); return }
    setRemaining(`${Math.floor(hoursLeft)}h ${Math.floor((hoursLeft % 1) * 60)}m`)
  }, [])

  return (
    <div className="min-h-dvh bg-[#faf7f2] dark:bg-[#0f0f14] flex items-center justify-center px-5">
      <div className="text-center max-w-sm">
        <div className="w-14 h-14 rounded-full bg-white dark:bg-white/8 border border-[#e4dcd0] dark:border-white/10 flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-[#8c6a43] text-2xl">handshake</span>
        </div>
        {name && <p className="mt-4 text-sm text-[#8c6a43] dark:text-[#c6a27b] font-semibold">{name}</p>}
        <h2 className="text-xl font-bold text-[#1e293b] dark:text-white">ya casi estás listo</h2>
        <p className="text-sm text-[#64748b] dark:text-slate-400 mt-2 leading-relaxed">
          Pronto los misioneros te contactarán para que conozcas más.
        </p>
        <button onClick={onBack} className="mt-6 px-6 py-3 rounded-xl bg-[#8c6a43] text-white text-sm font-semibold hover:bg-[#a0784d] transition-colors">Volver</button>
        {remaining ? (
          <p className="mt-4 text-[11px] text-[#64748b] dark:text-slate-500">Puedes solicitar una nueva visita dentro de {remaining}</p>
        ) : (
          <button onClick={onRetry} className="mt-4 text-xs font-semibold text-[#8c6a43] underline underline-offset-2 hover:text-[#a0784d] transition-colors">Solicitar nuevamente</button>
        )}
      </div>
    </div>
  )
}

export default function PageNuevos({ onBack }) {
  const [step, setStep] = useState('welcome')
  const [nombre, setNombre] = useState('')
  const [ciudad, setCiudad] = useState('')
  const [telefono, setTelefono] = useState('')
  const [direccion, setDireccion] = useState('')
  const [coords, setCoords] = useState(null)
  const [showMap, setShowMap] = useState(false)

  const stored = (() => { try { return getCookie(STORAGE_KEY) } catch { return null } })()

  const userName = getNombre() || ''

  function handleMapSelect(c) {
    setCoords(c)
    setDireccion('Buscando dirección...')
    const { lat, lng } = c
    Promise.all([
      fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1&accept-language=es&zoom=18`).then(r => r.json()),
      fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(`[out:json];(way["highway"]["name"](around:20,${lat},${lng}););out tags 2;`)}`).then(r => r.json()),
      fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(`[out:json];(node["amenity"~"place_of_worship|hospital|school|college|university|stadium|library|marketplace|police|fire_station|community_centre|clinic|post_office"](around:60,${lat},${lng});way["amenity"~"place_of_worship|hospital|school|college|university|stadium|library|marketplace|police|fire_station|community_centre|clinic|post_office"](around:60,${lat},${lng});node["leisure"~"park|stadium|pitch|playground|garden"](around:60,${lat},${lng});way["leisure"~"park|stadium|pitch|playground|garden"](around:60,${lat},${lng});node["shop"](around:60,${lat},${lng});way["shop"](around:60,${lat},${lng});node["place"~"square|plaza"](around:60,${lat},${lng});way["place"~"square|plaza"](around:60,${lat},${lng}););out tags 5;`)}`).then(r => r.json())
    ]).then(([addrData, streetsData, poiData]) => {
      const addr = addrData.address || {}
      const streetNames = [...new Set(streetsData.elements?.map(e => e.tags?.name).filter(Boolean) || [])]

      let result = ''
      if (streetNames.length >= 2) {
        result = `${streetNames[0]} y ${streetNames[1]}`
      } else if (streetNames.length === 1) {
        result = streetNames[0]
      } else if (addr.road) {
        result = addr.road
      }

      const HIGH = ['place_of_worship', 'park', 'hospital', 'stadium', 'marketplace', 'plaza', 'townhall']
      const MEDIUM = ['school', 'college', 'university', 'library', 'police', 'fire_station', 'community_centre', 'post_office', 'clinic']
      const skipTypes = ['taxi', 'shelter', 'bench', 'waste_basket', 'vending_machine', 'bus_station', 'toilets', 'telephone']

      let bestPoi = null
      let bestScore = -1
      for (const el of poiData.elements || []) {
        const t = el.tags || {}
        const type = t.amenity || t.leisure || t.shop || ''
        if (skipTypes.includes(type)) continue
        if (t.name && !t.name.match(/^\d+$/)) {
          let score = 0
          if (HIGH.includes(type)) score = 10
          else if (MEDIUM.includes(type)) score = 7
          else if (t.shop) score = 4
          else score = 2
          if (score > bestScore) { bestScore = score; bestPoi = t.name }
        }
      }

      if (bestPoi) {
        result += `, cerca de ${bestPoi}`
      }
      setDireccion(result || addrData.display_name || `${lat}, ${lng}`)
    }).catch(() => setDireccion(`${lat}, ${lng}`))
  }

  function handleQuieroConocer() {
    alreadySubmitted ? setStep('already-submitted') : setStep('form')
  }

  function handleSubmit(e) {
    e.preventDefault()
    setCookie(STORAGE_KEY, { timestamp: Date.now(), nombre, ciudad, telefono, direccion, coords })
    let texto = `🆕 Nuevo investigador!\n\nNombre: ${nombre}\nCiudad: ${ciudad}\nTeléfono: ${telefono}\nDirección: ${direccion || 'No especificada'}`
    if (coords) texto += `\nGoogle Maps: https://www.google.com/maps?q=${coords.lat},${coords.lng}`
    window.open(`https://wa.me/593987321144?text=${encodeURIComponent(texto)}`, '_blank')
    setStep('thanks')
  }

  function resetForm() {
    setNombre(''); setCiudad(''); setTelefono(''); setDireccion(''); setCoords(null); setStep('welcome')
  }

  function handleRetry() {
    removeCookie(STORAGE_KEY); setNombre(''); setCiudad(''); setTelefono(''); setDireccion(''); setCoords(null); setStep('form')
  }

  if (step === 'already-submitted') return <AlreadyView onBack={() => setStep('welcome')} onRetry={handleRetry} />

  if (step === 'thanks') {
    return (
      <div className="min-h-dvh bg-[#faf7f2] dark:bg-[#0f0f14] flex items-center justify-center px-5">
        <div className="text-center max-w-sm">
          <div className="w-14 h-14 rounded-full bg-white dark:bg-white/8 border border-[#e4dcd0] dark:border-white/10 flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-[#8c6a43] text-2xl">favorite</span>
          </div>
          {userName && <p className="mt-4 text-sm text-[#8c6a43] dark:text-[#c6a27b] font-semibold">{userName}</p>}
          <h2 className="text-xl font-bold text-[#1e293b] dark:text-white">registro completado</h2>
          <p className="text-sm text-[#64748b] dark:text-slate-400 mt-2 leading-relaxed">
            Espera a que los misioneros se pongan en contacto contigo. Siempre serás bienvenido en la capilla.
          </p>
          <p className="mt-4 text-xs text-[#8c6a43]/60 dark:text-[#c6a27b]/60 italic">"Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar." — Mateo 11:28</p>
          <button onClick={resetForm} className="mt-6 px-6 py-3 rounded-xl bg-[#8c6a43] text-white text-sm font-semibold hover:bg-[#a0784d] transition-colors">Volver</button>
        </div>
      </div>
    )
  }

  if (step === 'form') {
    return (
      <div className="min-h-dvh bg-[#faf7f2] dark:bg-[#0f0f14]">
        {showMap && <MapPickerModal onSelect={handleMapSelect} onClose={() => setShowMap(false)} initialCoords={coords} />}
        <div className="max-w-lg mx-auto px-5 pb-8">
          <div className="page-header">
            <button onClick={() => setStep('welcome')} className="page-back" aria-label="Volver">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <h1 className="page-title">Quiero conocer más</h1>
          </div>
          <p className="mt-4 text-sm text-[#64748b] dark:text-slate-400">Cuéntanos de ti{userName && `, ${userName}`}.</p>
          <form onSubmit={handleSubmit} className="mt-5 space-y-5">
            <div>
              <label className="text-xs font-bold uppercase tracking-[0.1em] text-[#8c6a43]/70 dark:text-[#c6a27b]/70 block mb-1.5">Nombre completo</label>
              <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej: María García López" required
                className="w-full rounded-xl border border-[#e4dcd0] dark:border-white/10 bg-white dark:bg-[#1a1a22] px-4 py-3.5 text-sm text-[#1e293b] dark:text-white outline-none transition-all focus:border-[#8c6a43]/50 focus:ring-4 focus:ring-[#8c6a43]/10 placeholder:text-[#94a3b8]" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-[0.1em] text-[#8c6a43]/70 dark:text-[#c6a27b]/70 block mb-1.5">Ciudad</label>
              <input type="text" value={ciudad} onChange={e => setCiudad(e.target.value)} placeholder="Ej: Buena Fe" required
                className="w-full rounded-xl border border-[#e4dcd0] dark:border-white/10 bg-white dark:bg-[#1a1a22] px-4 py-3.5 text-sm text-[#1e293b] dark:text-white outline-none transition-all focus:border-[#8c6a43]/50 focus:ring-4 focus:ring-[#8c6a43]/10 placeholder:text-[#94a3b8]" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-[0.1em] text-[#8c6a43]/70 dark:text-[#c6a27b]/70 block mb-1.5">WhatsApp</label>
              <input type="tel" value={telefono} onChange={e => setTelefono(e.target.value)} placeholder="Ej: 099 999 9999" required
                className="w-full rounded-xl border border-[#e4dcd0] dark:border-white/10 bg-white dark:bg-[#1a1a22] px-4 py-3.5 text-sm text-[#1e293b] dark:text-white outline-none transition-all focus:border-[#8c6a43]/50 focus:ring-4 focus:ring-[#8c6a43]/10 placeholder:text-[#94a3b8]" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-[0.1em] text-[#8c6a43]/70 dark:text-[#c6a27b]/70 block mb-1.5">Dirección <span className="text-[#64748b] dark:text-slate-500 font-normal normal-case">(opcional)</span></label>
              <div className="flex gap-2">
                <input type="text" value={direccion} onChange={e => setDireccion(e.target.value)} placeholder="Ej: Av. Principal y Calle 3"
                  className="flex-1 rounded-xl border border-[#e4dcd0] dark:border-white/10 bg-white dark:bg-[#1a1a22] px-4 py-3.5 text-sm text-[#1e293b] dark:text-white outline-none transition-all focus:border-[#8c6a43]/50 focus:ring-4 focus:ring-[#8c6a43]/10 placeholder:text-[#94a3b8]" />
                <button type="button" onClick={() => setShowMap(true)}
                  className="flex-shrink-0 px-3.5 rounded-xl border border-[#e4dcd0] dark:border-white/10 bg-white dark:bg-[#1a1a22] text-[#8c6a43] hover:bg-[#faf7f2] dark:hover:bg-white/8 transition-colors">
                  <span className="material-symbols-outlined text-xl">map</span>
                </button>
              </div>
              {coords && (
                <a href={`https://www.google.com/maps?q=${coords.lat},${coords.lng}`} target="_blank" rel="noopener noreferrer"
                  className="mt-1.5 inline-flex items-center gap-1 text-xs text-[#8c6a43]/70 dark:text-[#c6a27b]/70 hover:text-[#8c6a43] dark:hover:text-[#c6a27b] transition-colors">
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                  Ver en Google Maps
                </a>
              )}
            </div>
            <button type="submit" disabled={!nombre.trim() || !ciudad.trim() || !telefono.trim()}
              className="w-full py-4 rounded-xl bg-[#8c6a43] text-white font-bold text-sm shadow-sm hover:bg-[#a0784d] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed">
              Enviar
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-[#faf7f2] dark:bg-[#0f0f14] flex flex-col">
      <div className="max-w-lg mx-auto w-full px-5 flex flex-col flex-1 min-h-dvh">
        <div className="page-header flex-shrink-0">
          <button onClick={onBack} className="page-back" aria-label="Volver">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <h1 className="page-title">Conoce la Iglesia</h1>
        </div>

        <div className="flex-1 flex flex-col justify-center py-4">
          <div className="text-center">
            {userName && <p className="text-6xl font-extrabold text-[#8c6a43] dark:text-[#c6a27b] tracking-[-0.04em] leading-none">{userName}</p>}
            <h2 className="text-4xl font-extrabold tracking-[-0.04em] text-[#1e293b] dark:text-white leading-tight mt-1">
              Gracias por tu interés
            </h2>
          </div>

          <div className="mt-2 flex justify-center">
            <img src="/elderes-actuales.svg" alt="Misioneros actuales" className="w-full max-w-[280px] rounded-xl shadow-sm" />
          </div>

          <div className="mt-2 text-center">
            <p className="text-base leading-relaxed text-[#64748b] dark:text-slate-300">
              Somos los misioneros del Barrio Buenaventura.             ¿Sabías que Dios nunca dejó de hablar al mundo? Así como en tiempos antiguos, un profeta vivo recibe revelación para nuestros días. El Libro de Mormón es otra prueba de que Jesucristo no nos ha abandonado. Te invitamos a descubrirlo por ti mismo.
            </p>
            <p className="mt-1 text-base leading-relaxed text-[#64748b]/80 dark:text-slate-400">
              Reunión cada domingo 9:00 AM. Capilla en Buena Fe.
            </p>
          </div>

          <div className="mt-2 text-center">
            <h3 className="text-lg font-extrabold text-[#1e293b] dark:text-white">¿Quieres que te visitemos?</h3>
            <button onClick={handleQuieroConocer}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-[#1e293b] px-8 py-3.5 text-base font-bold text-white shadow-sm transition-all hover:bg-[#334155] active:scale-[0.98] dark:bg-[#c6a27b] dark:text-[#121216] dark:hover:bg-[#d8c3a5]">
              Sí, quiero conocer más
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
