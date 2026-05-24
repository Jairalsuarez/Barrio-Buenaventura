import { useState, useEffect } from 'react'
import { useAuth } from './hooks/useAuth'
import { useAcontecimientos } from './hooks/useAcontecimientos'
import NamePrompt from './components/NamePrompt'
import TopNav from './components/TopNav'
import HeroPrincipal from './components/HeroPrincipal'
import PageActividades from './components/PageActividades'
import PageEscritura from './components/PageEscritura'
import PageAnuncios from './components/PageAnuncios'
import PageOrganizaciones from './components/PageOrganizaciones'
import PageGuiaOrganizacion from './components/PageGuiaOrganizacion'
import PageRecursos from './components/PageRecursos'
import PageNuevos from './components/PageNuevos'
import PageContactos from './components/PageContactos'
import FeedbackFooter from './components/FeedbackFooter'
import FooterLanding from './components/FooterLanding'
import AdminPanel from './components/AdminPanel'
import AuthModal from './components/AuthModal'
import Icon from './components/ui/Icon'

function AppLoadingScreen() {
  return (
    <div className="fixed inset-0 z-[9998] flex flex-col items-center justify-center bg-[#faf7f2] dark:bg-[#0f0f14]">
      <img src="/icono-barrio-sin fondo.svg" alt="" className="h-14 w-14 object-contain opacity-90" />
      <div className="mt-6 h-1 w-28 overflow-hidden rounded-full bg-[#e4dcd0] dark:bg-white/10">
        <div className="h-full w-1/2 rounded-full bg-[#8c6a43] dark:bg-[#c6a27b] animate-loading-bar" />
      </div>
      <p className="mt-4 text-xs font-medium text-[#8c6a43]/70 dark:text-[#c6a27b]/70">Preparando todo...</p>
    </div>
  )
}

export default function App() {
  const { user, guest, loading: authLoading, error, isPredefinido, register, loginWithUserData, loginAsGuest, logout } = useAuth()
  const acontecimientos = useAcontecimientos(user?.id)
  const [hasName, setHasName] = useState(() => Boolean(localStorage.getItem('iglesia_bv_name')))
  const [assetsReady, setAssetsReady] = useState(false)
  const [entryLoading, setEntryLoading] = useState(false)
  const [page, setPage] = useState(null)
  const [dark, setDark] = useState(() => localStorage.getItem('iglesia_bv_dark') === 'true')
  const [showAdminModal, setShowAdminModal] = useState(false)
  const [showAdminPanel, setShowAdminPanel] = useState(false)
  const [installPrompt, setInstallPrompt] = useState(null)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('iglesia_bv_dark', dark)
  }, [dark])

  const appReady = assetsReady && (!hasName || !acontecimientos.loading)

  useEffect(() => {
    let cancelled = false

    async function prepareApp() {
      const loadPromise = document.readyState === 'complete'
        ? Promise.resolve()
        : new Promise((resolve) => window.addEventListener('load', resolve, { once: true }))
      const fontPromise = document.fonts?.ready ?? Promise.resolve()
      const minDelay = new Promise((resolve) => setTimeout(resolve, 700))

      await Promise.all([loadPromise, fontPromise, minDelay])
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
      if (!cancelled) setAssetsReady(true)
    }

    prepareApp()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!appReady) return
    const splash = document.getElementById('splash')
    if (splash && splash.parentNode) {
      splash.style.opacity = '0'
      window.setTimeout(() => splash.remove(), 180)
    }
  }, [appReady])

  useEffect(() => {
    if (!entryLoading || !hasName) return

    let cancelled = false

    async function finishEntryLoading() {
      const minDelay = new Promise((resolve) => setTimeout(resolve, 950))
      const fontPromise = document.fonts?.ready ?? Promise.resolve()
      await Promise.all([minDelay, fontPromise])
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
      if (!cancelled) setEntryLoading(false)
    }

    finishEntryLoading()
    return () => { cancelled = true }
  }, [entryLoading, hasName])

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

  function handleNameSaved() {
    setEntryLoading(true)
    setHasName(true)
  }

  if (!appReady || entryLoading) {
    return <AppLoadingScreen />
  }

  if (!hasName) {
    return <NamePrompt onSave={handleNameSaved} />
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

  if (showAdminPanel && isPredefinido) {
    return (
      <div className="min-h-screen bg-[#faf7f2] dark:bg-[#0f0f14]">
        <div className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-center justify-between px-5 h-14 max-w-lg mx-auto">
            <div className="flex items-center gap-2">
              <Icon size={20} fill>settings</Icon>
              <span className="text-sm font-bold text-[#1e293b] dark:text-white">Panel Admin</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setDark(!dark)}
                className={`relative w-9 h-5 rounded-full transition-colors duration-300 ${dark ? 'bg-[#8c6a43]' : 'bg-gray-300'}`}>
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 flex items-center justify-center ${dark ? 'translate-x-4' : ''}`}>
                  {dark ? (
                    <svg className="w-2.5 h-2.5 text-[#8c6a43]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                    </svg>
                  ) : (
                    <svg className="w-2.5 h-2.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                    </svg>
                  )}
                </span>
              </button>
              <button onClick={handleLogout}
                className="text-xs text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 bg-gray-100 dark:bg-slate-800 rounded-lg px-3 py-1.5 transition-colors">
                Salir
              </button>
              <button onClick={() => setShowAdminPanel(false)}
                className="text-xs bg-[#8c6a43] text-white rounded-lg px-3 py-1.5 font-medium hover:bg-[#a0784d] transition-colors">
                Ver página
              </button>
            </div>
          </div>
        </div>
        <AdminPanel
          eventos={acontecimientos.eventos}
          loading={acontecimientos.loading}
          error={acontecimientos.error}
          crear={acontecimientos.crear}
          eliminar={acontecimientos.eliminar}
          userLlamamiento={user?.llamamiento}
          userId={user?.id}
          isPredefinido={isPredefinido}
        />
      </div>
    )
  }

  if (page === 'actividades') return <PageActividades onBack={() => setPage(null)} userId={user?.id} isPredefinido={isPredefinido} userLlamamiento={user?.llamamiento} acontecimientos={acontecimientos} />
  if (page === 'escritura') return <PageEscritura onBack={() => setPage(null)} />
  if (page === 'anuncios') return <PageAnuncios onBack={() => setPage(null)} />
  if (page === 'organizaciones') return <PageOrganizaciones onBack={() => setPage(null)} />
  if (page === 'guia-organizacion') return <PageGuiaOrganizacion onBack={() => setPage(null)} />
  if (page === 'recursos') return <PageRecursos onBack={() => setPage(null)} />
  if (page === 'nuevos') return <PageNuevos onBack={() => setPage(null)} />
  if (page === 'contactos') return <PageContactos onBack={() => setPage(null)} />

  return (
    <div className="min-h-dvh relative bg-[#faf7f2] dark:bg-[#0f0f14]">
      <TopNav dark={dark} onToggleDark={() => setDark(!dark)} onNavigate={setPage} onAdminClick={handleAdminClick} />
      <HeroPrincipal onNavigate={setPage} />

      <FeedbackFooter />
      <FooterLanding />

      {installPrompt && (
        <div className="fixed bottom-4 left-4 right-4 z-40 max-w-lg mx-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-800 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#8c6a43]/10 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[#8c6a43]" style={{ fontSize: 20 }}>install_mobile</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#1e293b] dark:text-white">Instala la app</p>
              <p className="text-xs text-gray-400 dark:text-slate-500">Accede rápido desde tu pantalla</p>
            </div>
            <button onClick={() => installPrompt.prompt()}
              className="px-4 py-2 rounded-xl bg-[#8c6a43] text-white text-xs font-semibold hover:bg-[#a0784d] transition-colors">
              Instalar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
