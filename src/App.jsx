import { useState, useEffect, useRef } from 'react'
import { useAuth } from './hooks/useAuth'
import { useCumpleanos } from './hooks/useCumpleanos'
import { useAcontecimientos } from './hooks/useAcontecimientos'
import AuthModal from './components/AuthModal'
import HeroContador from './components/HeroContador'
import FraseDia from './components/FraseDia'
import SeccionCumpleanos from './components/SeccionCumpleanos'
import AgendaAcontecimientos from './components/AgendaAcontecimientos'
import EnlacesComunidad from './components/EnlacesComunidad'
import FeedbackFooter from './components/FeedbackFooter'

function scrollTo(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function saludo() {
  const h = new Date().getHours()
  if (h < 12) return 'Buenos días'
  if (h < 18) return 'Buenas tardes'
  return 'Buenas noches'
}

export default function App() {
  const { user, guest, loading: authLoading, error, isPredefinido, register, loginAsGuest } = useAuth()
  const cumpleanos = useCumpleanos()
  const acontecimientos = useAcontecimientos(user?.id)
  const [showTop, setShowTop] = useState(false)
  const [dark, setDark] = useState(() => localStorage.getItem('iglesia_bv_dark') === 'true')
  const splashDone = useRef(false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('iglesia_bv_dark', dark)
  }, [dark])

  useEffect(() => {
    function onScroll() { setShowTop(window.scrollY > 400) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const autenticado = !!user || guest
  const datosListos = autenticado && !cumpleanos.loading && !acontecimientos.loading

  useEffect(() => {
    if (splashDone.current || !datosListos) return
    splashDone.current = true
    const splash = document.getElementById('splash')
    if (!splash) return
    splash.style.transition = 'opacity 0.5s ease-out'
    splash.style.opacity = '0'
    setTimeout(() => splash.remove(), 550)
  }, [datosListos])

  if (authLoading && !autenticado) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-warm-50 dark:bg-slate-950">
        <div className="relative flex items-center justify-center w-20 h-20">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-church-200 dark:text-slate-700" strokeDasharray="264" />
            <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-church-600 dark:text-church-400 animate-ring" strokeDasharray="264" strokeDashoffset="66" />
          </svg>
          <img src="/icono-barrio-sin fondo.svg" alt="Cargando" className="w-9 h-9 animate-spin-logo" />
        </div>
        <p className="text-sm text-gray-400 dark:text-slate-500 mt-5">Cargando...</p>
      </div>
    )
  }

  if (!autenticado) {
    return (
      <AuthModal
        onRegister={register}
        onGuest={loginAsGuest}
        loading={authLoading}
        error={error}
      />
    )
  }

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800">
        <div className="flex items-center justify-between px-5 h-14 max-w-sm mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg overflow-hidden">
              <img src="/icono-barrio-sin fondo.svg" alt="Barrio Buenaventura" className="w-full h-full object-contain" />
            </div>
            <span className="text-sm font-bold text-gray-900 dark:text-white">Barrio Buenaventura</span>
          </div>
          <button
            onClick={() => setDark(!dark)}
            className={`relative w-10 h-6 rounded-full transition-colors duration-300 flex-shrink-0 ${dark ? 'bg-church-500' : 'bg-gray-300'}`}
            aria-label="Modo oscuro"
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-300 flex items-center justify-center ${dark ? 'translate-x-4' : ''}`}>
              {dark ? (
                <svg className="w-3 h-3 text-church-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                </svg>
              ) : (
                <svg className="w-3 h-3 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
              )}
            </span>
          </button>
        </div>
      </header>

      <main>
        <div className="px-5 pt-5 pb-2 max-w-sm mx-auto">
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {saludo()}, {user ? user.nombre : 'invitado'}
          </p>
        </div>
        <div id="section-inicio"><HeroContador /></div>
        <FraseDia />
        <div id="section-cumpleanos"><SeccionCumpleanos currentUser={user} data={cumpleanos} /></div>
        <div id="section-eventos"><AgendaAcontecimientos userId={user?.id} isPredefinido={isPredefinido} data={acontecimientos} /></div>
        <div id="section-comunidad"><EnlacesComunidad /></div>
        <div id="section-feedback"><FeedbackFooter usuarioId={user?.id} /></div>
      </main>

      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-20 right-5 z-50 w-11 h-11 bg-church-600 text-white rounded-2xl shadow-lg shadow-church-600/30 flex items-center justify-center hover:bg-church-700 transition-all duration-200 active:scale-90"
          aria-label="Volver al inicio"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}

      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-gray-100 dark:border-slate-800 safe-area-bottom">
        <div className="flex items-center justify-around max-w-sm mx-auto h-16 px-2">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex flex-col items-center gap-0.5 text-[10px] text-gray-400 hover:text-church-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Inicio
          </button>
          <button onClick={() => scrollTo('section-eventos')} className="flex flex-col items-center gap-0.5 text-[10px] text-gray-400 hover:text-church-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Eventos
          </button>
          <button onClick={() => scrollTo('section-cumpleanos')} className="flex flex-col items-center gap-0.5 text-[10px] text-gray-400 hover:text-church-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0A2.701 2.701 0 003 15.546M3 15.546V6.75A2.25 2.25 0 015.25 4.5h13.5A2.25 2.25 0 0121 6.75v8.796M3 15.546l8.25-8.25 4.5 4.5L21 8.25" />
            </svg>
            Cumpleaños
          </button>
        </div>
      </nav>
    </div>
  )
}
