const MISIONEROS_NUMERO = '+593987321144'
const WHATSAPP_GRUPO = 'https://chat.whatsapp.com/ERfiLLO223kDKtOGQf3ZpD'
const PRESIDENTE_ELDERES = '+593969603240'
const PRESIDENTA_SOCORRO = '+593997205663'

const CONTACTOS = [
  { nombre: 'Obispo', descripcion: 'Presidencia del Barrio', telefono: '', icon: 'church' },
  { nombre: 'Grupo WhatsApp', descripcion: 'Comunicación del barrio', telefono: WHATSAPP_GRUPO, icon: 'chat', esLink: true },
  { nombre: 'Pres. Élderes', descripcion: 'Quórum de Élderes', telefono: PRESIDENTE_ELDERES, icon: 'male' },
  { nombre: 'Pres. Socorro', descripcion: 'Sociedad de Socorro', telefono: PRESIDENTA_SOCORRO, icon: 'female' },
  { nombre: 'Misioneros', descripcion: 'Servicio misional', telefono: MISIONEROS_NUMERO, icon: 'handshake' },
]

export default function ContactosSection() {
  return (
    <section className="py-16 bg-[#faf8f5]">
      <div className="max-w-lg mx-auto px-6">
        <div className="text-center mb-10">
          <p className="eyebrow mb-3">Contacto</p>
          <h2 className="section-title">Contactos Importantes</h2>
          <p className="section-subtitle">Estamos aquí para servirte</p>
        </div>
        <div className="space-y-2.5">
          {CONTACTOS.map((c, i) => (
            <a key={c.nombre}
              href={c.esLink ? c.telefono : (c.telefono ? `https://wa.me/${c.telefono.replace(/\+/g, '').replace(/\s/g, '')}` : '#')}
              target={c.esLink || c.telefono ? '_blank' : undefined}
              rel={c.esLink || c.telefono ? 'noopener noreferrer' : undefined}
              className="card-premium flex items-center gap-4 p-4 group active:scale-[0.98] transition-all animate-fade-up"
              style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="w-11 h-11 rounded-xl bg-bv-50 flex items-center justify-center flex-shrink-0 text-bv-500">
                <span className="material-symbols-outlined" style={{ fontSize: 22 }}>{c.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-bv-900 dark:text-white">{c.nombre}</p>
                <p className="text-xs text-gray-400 dark:text-slate-500">{c.descripcion}</p>
              </div>
              {c.telefono && (
                <div className="w-7 h-7 rounded-full bg-bv-50 flex items-center justify-center flex-shrink-0 group-hover:translate-x-0.5 transition-transform duration-300 ease-out">
                  <svg className="w-3.5 h-3.5 text-bv-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
