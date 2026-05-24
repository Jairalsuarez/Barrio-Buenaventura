import { useState, useEffect } from 'react'
import { useAuth } from './hooks/useAuth'
import { useAcontecimientos } from './hooks/useAcontecimientos'
import NamePrompt from './components/NamePrompt'
import HeroPrincipal from './components/HeroPrincipal'
import FraseDia from './components/FraseDia'
import ClasesCarrusel from './components/ClasesCarrusel'
import MensajeSemanal from './components/MensajeSemanal'
import TableroAnuncios from './components/TableroAnuncios'
import RecursosRapidos from './components/RecursosRapidos'
import NuevosSection from './components/NuevosSection'
import ContactosSection from './components/ContactosSection'
import CumpleanosSection from './components/CumpleanosSection'
import AgendaAcontecimientos from './components/AgendaAcontecimientos'
import FeedbackFooter from './components/FeedbackFooter'
import FooterLanding from './components/FooterLanding'
import AdminPanel from './components/AdminPanel'
import AuthModal from './components/AuthModal'
import Icon from './components/ui/Icon'

function scrollTo(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function App() {
  const { user, guest, loading: authLoading, error, isPredefinido, register, loginWithUserData, loginAsGuest, logout } = useAuth()
  const acontecimientos = useAcontecimientos(user?.id)
  const [showTop, setShowTop] = useState(false)
  const [dark, setDark] = useState(() => localStorage.getItem('iglesia_bv_dark') === 'true')
  const [showAdminModal, setShowAdminModal] = useState(false)
  const [showAdminPanel, setShowAdminPanel] = useState(false)
  const [installPrompt, setInstallPrompt] = useState(null)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('iglesia_bv_dark', dark)
  }, [dark])

  useEffect(() => {
    function onScroll() { setShowTop(window.scrollY > 600 && document.body.style.overflow !== 'hidden') }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const splash = document.getElementById('splash')
    if (splash && splash.parentNode) splash.remove()
  }, [])

  useEffect(() => {
    if ('onbeforeinstallprompt' in window) {
      const handler = (e) => { e.preventDefault(); setInstallPrompt(e) }
      window.addEventListener('beforeinstallprompt', handler)
      return () => window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const autenticado = !!user || guest

  function handleLogout() {
    logout()
    setShowAdminPanel(false)
  }

  function handleAdminClick() {
    if (autenticado && isPredefinido) {
      setShowAdminPanel(!showAdminPanel)
    } else {
      setShowAdminModal(true)
    }
  }

  function isUserPredefinido(u) {
    if (!u) return false
    return u.llamamiento && u.llamamiento !== 'Otro' && u.llamamiento !== 'Ninguno'
  }

  if (showAdminModal) {
    return (
      <AuthModal
        onRegister={async (formData) => {
          const userData = await register(formData)
          setShowAdminModal(false)
          setShowAdminPanel(isUserPredefinido(userData))
        }}
        onLoginExisting={(userData) => {
          loginWithUserData(userData)
          setShowAdminModal(false)
          setShowAdminPanel(isUserPredefinido(userData))
        }}
        onGuest={() => {
          loginAsGuest()
          setShowAdminModal(false)
        }}
        loading={authLoading}
        error={error}
      />
    )
  }

  if (!localStorage.getItem('iglesia_bv_name')) {
    return <NamePrompt onSave={() => window.location.reload()} />
  }

  return (
    <div className="min-h-screen relative bg-[#faf8f5] dark:bg-slate-950">
      {!showAdminPanel && (
        <>
          <HeroPrincipal onScrollTo={scrollTo} />
          <CumpleanosSection />
          <FraseDia />
          <div id="section-eventos">
            <AgendaAcontecimientos
              userId={user?.id}
              isPredefinido={isPredefinido}
              userLlamamiento={user?.llamamiento}
              data={acontecimientos}
            />
          </div>
          <ClasesCarrusel />
          <MensajeSemanal />
          <TableroAnuncios />
          <RecursosRapidos />
          <div id="section-nuevos"><NuevosSection /></div>
          <ContactosSection />
          <div id="section-feedback"><FeedbackFooter usuarioId={user?.id} /></div>
          <FooterLanding />

          {showTop && (
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="fixed bottom-20 right-5 z-50 w-11 h-11 bg-bv-600 text-white rounded-2xl shadow-lg shadow-bv-600/30 flex items-center justify-center hover:bg-bv-700 transition-all duration-200 active:scale-90"
              aria-label="Volver al inicio">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
              </svg>
            </button>
          )}

          <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-gray-100 dark:border-slate-800 safe-area-bottom">
            <div className="flex items-center justify-around max-w-lg mx-auto h-16 px-2">
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="flex flex-col items-center gap-0.5 text-[10px] text-gray-400 hover:text-bv-600 dark:hover:text-bv-400 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Inicio
              </button>
              <button onClick={() => scrollTo('section-eventos')}
                className="flex flex-col items-center gap-0.5 text-[10px] text-gray-400 hover:text-bv-600 dark:hover:text-bv-400 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Eventos
              </button>
              <button onClick={() => scrollTo('section-nuevos')}
                className="flex flex-col items-center gap-0.5 text-[10px] text-gray-400 hover:text-bv-600 dark:hover:text-bv-400 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0A2.701 2.701 0 003 15.546M3 15.546V6.75A2.25 2.25 0 015.25 4.5h13.5A2.25 2.25 0 0121 6.75v8.796M3 15.546l8.25-8.25 4.5 4.5L21 8.25" />
                </svg>
                Nuevo
              </button>
              <button onClick={handleAdminClick}
                className="flex flex-col items-center gap-0.5 text-[10px] text-gray-400 hover:text-bv-600 dark:hover:text-bv-400 transition-colors relative">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
                Admin
              </button>
            </div>
          </nav>
        </>
      )}
    </div>
  )
}
