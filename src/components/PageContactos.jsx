const CONTACTOS = [
  { nombre: 'Grupo WhatsApp', descripcion: 'Comunicación del barrio', telefono: 'https://chat.whatsapp.com/ERfiLLO223kDKtOGQf3ZpD', icon: 'chat', esLink: true },
  { nombre: 'Pres. Élderes', descripcion: 'Quórum de Élderes', telefono: '+593969603240', icon: 'male' },
  { nombre: 'Pres. Socorro', descripcion: 'Sociedad de Socorro', telefono: '+593997205663', icon: 'female' },
  { nombre: 'Misioneros', descripcion: 'Servicio misional', telefono: '+593987321144', icon: 'handshake' },
]

export default function PageContactos({ onBack }) {
  return (
    <div className="min-h-dvh bg-[#faf7f2] dark:bg-[#0f0f14]">
      <div className="max-w-lg mx-auto px-5">
        <div className="page-header">
          <button onClick={onBack} className="page-back" aria-label="Volver">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <h1 className="page-title">Contactos</h1>
        </div>

        <div className="space-y-2.5 mt-2">
          {CONTACTOS.map((c, i) => (
            <a key={c.nombre}
              href={c.esLink ? c.telefono : (c.telefono ? `https://wa.me/${c.telefono.replace(/\+/g, '').replace(/\s/g, '')}` : '#')}
              target={c.esLink || c.telefono ? '_blank' : undefined}
              rel={c.esLink || c.telefono ? 'noopener noreferrer' : undefined}
              className="card flex items-center gap-3 p-4 active:scale-[0.98] transition-all animate-fade-up"
              style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="w-10 h-10 rounded-xl bg-[#8c6a43]/10 flex items-center justify-center flex-shrink-0 text-[#8c6a43]">
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{c.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#1e293b] dark:text-white">{c.nombre}</p>
                <p className="text-xs text-gray-400 dark:text-slate-500">{c.descripcion}</p>
              </div>
              {c.telefono && (
                <svg className="w-4 h-4 text-gray-300 dark:text-slate-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              )}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
