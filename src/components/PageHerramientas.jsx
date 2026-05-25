import FeedbackFooter from './FeedbackFooter'

const tools = [
  { id: 'recursos', label: 'Recursos', icon: 'globe', desc: 'Enlaces y materiales útiles' },
  { id: 'contactos', label: 'Contactos', icon: 'contact_phone', desc: 'WhatsApp y teléfonos del barrio' },
  { id: 'guia-organizacion', label: 'Guía de Organización', icon: 'group', desc: 'Descubre a qué organización perteneces' },
]

export default function PageHerramientas({ onBack, onNavigate }) {
  return (
    <div className="min-h-dvh bg-[#faf7f2] dark:bg-[#0f0f14]">
      <div className="max-w-lg mx-auto px-5">
        <div className="page-header">
          <button onClick={onBack} className="page-back" aria-label="Volver">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <h1 className="page-title">Herramientas</h1>
        </div>

        <div className="mt-2 space-y-2.5">
          {tools.map((t, i) => (
            <button key={t.id} onClick={() => onNavigate?.(t.id)}
              className="card flex items-center gap-3 w-full p-4 active:scale-[0.98] transition-all text-left animate-fade-up"
              style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="w-10 h-10 rounded-xl bg-[#8c6a43]/10 flex items-center justify-center flex-shrink-0 text-[#8c6a43]">
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{t.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#1e293b] dark:text-white">{t.label}</p>
                <p className="text-xs text-gray-400 dark:text-slate-500">{t.desc}</p>
              </div>
              <svg className="w-4 h-4 text-gray-300 dark:text-slate-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>

        <div className="mt-6">
          <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-[#64748b]/60 dark:text-slate-500 mb-3">Comparte tu opinión</h3>
          <FeedbackFooter />
        </div>
      </div>
    </div>
  )
}
