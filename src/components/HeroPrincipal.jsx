import { useState, useEffect } from 'react'
import { isSunday, setHours, setMinutes, setSeconds, addWeeks, startOfMonth } from 'date-fns'
import EscrituraCard from './EscrituraCard'

function getProximoDomingo9AM() {
  const ahora = new Date()
  let domingo
  if (isSunday(ahora) && ahora.getHours() < 11) {
    domingo = ahora
  } else {
    const diasHastaDomingo = (7 - ahora.getDay()) % 7
    domingo = addWeeks(ahora, 0)
    domingo.setDate(ahora.getDate() + (diasHastaDomingo === 0 ? 7 : diasHastaDomingo))
  }
  domingo = setHours(setMinutes(setSeconds(domingo, 0), 0), 9)
  return domingo
}

function esPrimerDomingoDelMes(fecha) {
  const primerDia = startOfMonth(fecha)
  let primerDomingo = primerDia
  while (primerDomingo.getDay() !== 0) primerDomingo.setDate(primerDomingo.getDate() + 1)
  return fecha.getDate() === primerDomingo.getDate()
}

function esHorarioSacramental() {
  const ahora = new Date()
  if (!isSunday(ahora)) return false
  const inicio = setHours(setMinutes(setSeconds(ahora, 0), 0), 9)
  const fin = setHours(setMinutes(setSeconds(ahora, 0), 0), 11)
  inicio.setFullYear(ahora.getFullYear(), ahora.getMonth(), ahora.getDate())
  fin.setFullYear(ahora.getFullYear(), ahora.getMonth(), ahora.getDate())
  return ahora >= inicio && ahora <= fin
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Buenos días'
  if (h < 18) return 'Buenas tardes'
  return 'Buenas noches'
}

function getName() {
  return localStorage.getItem('iglesia_bv_name')
}

export default function HeroPrincipal({ onNavigate }) {
  const [ahora, setAhora] = useState(new Date())
  const name = getName()
  const fullGreeting = `${getGreeting()}${name ? `, ${name}` : ''}.`
  const [displayedText, setDisplayedText] = useState('')

  useEffect(() => {
    const id = setInterval(() => setAhora(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    setDisplayedText('')
    let i = 0
    const timer = setInterval(() => {
      i++
      setDisplayedText(fullGreeting.slice(0, i))
      if (i >= fullGreeting.length) clearInterval(timer)
    }, 50)
    return () => clearInterval(timer)
  }, [fullGreeting])

  const enHorario = esHorarioSacramental()
  const proxDomingo = getProximoDomingo9AM()
  const esAyuno = esPrimerDomingoDelMes(ahora)
  const calStart = proxDomingo.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  const calEnd = new Date(proxDomingo.getTime() + 2 * 3600000).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  const calUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=Reuni%C3%B3n+Sacramental+Barrio+Buenaventura&dates=${calStart}/${calEnd}&location=4G36%2BRJ9%2C+Buena+Fe&sf=true&output=xml`

  const navItems = [
    { id: 'actividades', label: 'Actividades', icon: 'event' },
    { id: 'organizaciones', label: 'Organizaciones', icon: 'groups' },
    { id: 'recursos', label: 'Recursos', icon: 'globe' },
    { id: 'nuevos', label: '¿Eres nuevo?', icon: 'favorite' },
    { id: 'contactos', label: 'Contactos', icon: 'contact_phone' },
  ]

  return (
    <div className="min-h-dvh bg-[#faf7f2] dark:bg-[#0f0f14]">
      <div className="max-w-lg mx-auto px-5 pt-6 pb-4">
        <div>
          <h1 className="mt-2 text-center animate-fade-up" style={{ letterSpacing: '-0.03em' }}>
              <span className="block font-bold text-[#1e293b] dark:text-white" style={{ fontSize: 'clamp(1.2rem, 4vw, 2rem)' }}>Barrio</span>
              <span className="block font-bold leading-[1] -mt-1 bg-gradient-to-r from-[#8c6a43] via-[#a0784d] to-[#8c6a43] bg-clip-text text-transparent dark:from-[#c6a27b] dark:via-[#d8c3a5] dark:to-[#c6a27b] animate-fade-in" style={{ fontSize: 'clamp(2.5rem, 14vw, 7rem)', letterSpacing: '-0.04em' }}>Buenaventura</span>
            </h1>

            <div className="flex flex-wrap justify-center gap-2 mt-4 animate-fade-up animate-delay-1">
              <a href={calUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] text-[#64748b] dark:text-slate-400 bg-white dark:bg-white/8 rounded-full px-3 py-1.5 border border-[#e4dcd0] dark:border-white/10 hover:border-[#8c6a43]/40 transition-colors">
                <span className="material-symbols-outlined text-[#8c6a43]" style={{ fontSize: 13 }}>schedule</span>
                Dom 9:00 — 11:00
              </a>
              <a href={`https://www.google.com/maps/search/${encodeURIComponent('4G36+RJ9, Buena Fe')}`} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] text-[#64748b] dark:text-slate-400 bg-white dark:bg-white/8 rounded-full px-3 py-1.5 border border-[#e4dcd0] dark:border-white/10 hover:border-[#8c6a43]/40 transition-colors">
                <span className="material-symbols-outlined text-[#8c6a43]" style={{ fontSize: 13 }}>location_on</span>
                4G36+RJ9, Buena Fe
              </a>
            </div>

            <p className="text-base sm:text-lg text-[#64748b] dark:text-slate-400 text-center mt-4 min-h-[1.5em]">
              {displayedText}{displayedText.length < fullGreeting.length && <span className="animate-pulse">|</span>}
            </p>
          </div>

        {esAyuno && (
          <span className="inline-flex items-center gap-1.5 mt-3 text-[12px] text-[#8c6a43] bg-[#8c6a43]/8 rounded-xl px-3.5 py-2 animate-fade-in animate-delay-1">
            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>restaurant</span>
            Día de Ayuno y Testimonio
          </span>
        )}

        {enHorario && (
          <div className="mt-5 animate-scale-in animate-delay-2">
            <div className="inline-flex items-center gap-2.5 bg-[#8c6a43]/10 rounded-2xl px-4 py-3 border border-[#8c6a43]/15">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8c6a43] opacity-50" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#8c6a43]" />
              </span>
              <span className="text-sm font-medium text-[#8c6a43]">Reunión Sacramental en Curso</span>
            </div>
          </div>
        )}

        <EscrituraCard />

        <div className="mt-5 animate-fade-up animate-delay-4">
          <button
            onClick={() => onNavigate?.('anuncios')}
            className="announcement-feature-button group relative w-full overflow-hidden rounded-2xl border border-[#8c6a43]/18 bg-white px-5 py-3.5 text-left shadow-sm transition-all hover:border-[#8c6a43]/35 hover:shadow-md active:scale-[0.99] dark:border-[#c6a27b]/18 dark:bg-white/8 dark:hover:bg-white/12"
          >
            <span className="relative z-10 flex items-center gap-4.5">
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center text-[#8c6a43] dark:text-[#c6a27b]">
                <svg className="h-7 w-7" fill="none" viewBox="0 0 32 32" stroke="currentColor" strokeWidth={1.7}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 7.5h13A2.5 2.5 0 0125 10v12a2.5 2.5 0 01-2.5 2.5h-13A2.5 2.5 0 017 22V10a2.5 2.5 0 012.5-2.5Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.5 12.5h9M11.5 16h6.5M11.5 19.5h8" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M23.5 11.5h2.25A2.25 2.25 0 0128 13.75v10A4.25 4.25 0 0123.75 28H12.5" />
                </svg>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xl font-extrabold leading-none text-[#1e293b] dark:text-white">Tablero del barrio</span>
              </span>
              <span className="material-symbols-outlined text-[#8c6a43] transition-transform group-hover:translate-x-1 dark:text-[#c6a27b]" style={{ fontSize: 22 }}>
                arrow_forward
              </span>
            </span>
          </button>
        </div>

        <div className="organization-guide-cta mt-3 animate-fade-up animate-delay-4">
          <div className="relative overflow-hidden rounded-2xl border border-[#e4dcd0] bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/8">
            <div className="absolute left-4 right-4 top-0 h-px bg-gradient-to-r from-transparent via-[#8c6a43]/35 to-transparent dark:via-[#c6a27b]/35" />
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-[#8c6a43]/15 text-[#8c6a43] dark:border-[#c6a27b]/20 dark:text-[#c6a27b]">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7a4 4 0 118 0 4 4 0 01-8 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.5 21a6.5 6.5 0 0113 0" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 5.5h2M20 4.5v2" />
                </svg>
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#8c6a43]/65 dark:text-[#c6a27b]/70">Guía rápida</p>
                <p className="mt-1 text-base font-extrabold leading-tight text-[#1e293b] dark:text-white">
                  ¿Quieres saber a qué organización perteneces?
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate?.('guia-organizacion')}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1e293b] px-4 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#334155] active:scale-[0.98] dark:bg-[#c6a27b] dark:text-[#121216] dark:hover:bg-[#d8c3a5]"
            >
              Comenzar
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-[10px] text-[#64748b] dark:text-slate-500 uppercase tracking-[0.15em] mb-3">Navegación</p>
          <div className="grid grid-cols-2 gap-2.5">
            {navItems.map((item, i) => {
              const icons = {
                event: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>,
                campaign: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38a.482.482 0 01-.629-.53c-.11-.598-.197-1.202-.246-1.812m0-9.18A8.44 8.44 0 0012 8.602a7.742 7.742 0 01.446-.393M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
                groups: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>,
                globe: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg>,
                favorite: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>,
                contact_phone: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 3.75v4.5m0-4.5h-4.5m4.5 0l-6 6m3 12c-8.284 0-15-6.716-15-15V4.5A2.25 2.25 0 014.5 2.25h1.372c.516 0 .966.351 1.091.852l1.106 4.423c.11.44-.054.902-.417 1.173l-1.293.97a1.062 1.062 0 00-.38 1.21 12.035 12.035 0 007.143 7.143c.441.162.928-.004 1.21-.38l.97-1.293a1.125 1.125 0 011.173-.417l4.423 1.106c.5.125.852.575.852 1.091V19.5a2.25 2.25 0 01-2.25 2.25h-2.25z" /></svg>,
              }
              return (
                <button key={item.id} onClick={() => onNavigate?.(item.id)}
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-white dark:bg-white/8 border border-[#e4dcd0] dark:border-white/10 shadow-sm hover:border-[#8c6a43]/30 hover:shadow-md active:scale-[0.98] transition-all text-left animate-fade-up"
                  style={{ animationDelay: `${i * 0.05 + 0.4}s` }}>
                  <div className="w-9 h-9 rounded-lg bg-[#8c6a43]/10 dark:bg-[#8c6a43]/20 flex items-center justify-center flex-shrink-0 text-[#8c6a43]">
                    {icons[item.icon]}
                  </div>
                  <span className="text-[13px] font-semibold text-[#1e293b] dark:text-white leading-tight">{item.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
