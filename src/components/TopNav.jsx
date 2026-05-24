export default function TopNav({ dark, onToggleDark, onNavigate, onAdminClick, adminLabel }) {
  return (
    <header className="sticky top-0 z-40 bg-[#faf7f2]/90 dark:bg-[#0f0f14]/90 backdrop-blur-lg border-b border-[#e4dcd0]/50 dark:border-white/5">
      <div className="max-w-lg mx-auto px-5 h-14 flex items-center justify-between">
        <button onClick={() => onNavigate?.(null)} className="flex items-center">
          <img src="/icono-barrio-sin fondo.svg" alt="Barrio Buenaventura" className="w-6 h-6 opacity-80 dark:brightness-150 dark:invert" />
        </button>

        <div className="flex items-center gap-1">
          <button onClick={onAdminClick}
            className="w-9 h-9 rounded-xl text-[#64748b] dark:text-slate-400 hover:bg-[#8c6a43]/10 dark:hover:bg-white/5 transition-all flex items-center justify-center active:scale-90">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </button>

          <button onClick={onToggleDark}
            className="w-9 h-9 rounded-xl text-[#64748b] dark:text-slate-400 hover:bg-[#8c6a43]/10 dark:hover:bg-white/5 transition-all flex items-center justify-center active:scale-90">
            {dark ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
