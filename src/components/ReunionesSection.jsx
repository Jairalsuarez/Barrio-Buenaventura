const REUNIONES = [
  { nombre: 'Reunión Sacramental', hora: '9:00 AM', ubicacion: 'Capilla del Barrio', desc: 'Santa Cena y mensajes inspiradores' },
  { nombre: 'Escuela Dominical', hora: '10:15 AM', ubicacion: 'Salones', desc: 'Estudio de las Escrituras' },
  { nombre: 'Soc. Socorro / Cuórum Élderes', hora: '11:10 AM', ubicacion: 'Salones', desc: 'Clases por separado' },
  { nombre: 'Seminario / Instituto', hora: '6:00 AM (Lun-Vie)', ubicacion: 'Centro de Estaca', desc: 'Estudio matutino' },
]

function ClockIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-bv-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-bv-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  )
}

export default function ReunionesSection() {
  return (
    <section id="section-reuniones" className="px-6 py-16 bg-[#faf8f5]">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-10">
          <p className="eyebrow mb-3">Nuestras reuniones</p>
          <h2 className="section-title">Reuniones Dominicales</h2>
          <p className="section-subtitle">Todos los domingos · 9:00 AM</p>
        </div>
        <div className="space-y-3">
          {REUNIONES.map((r, i) => (
            <div key={r.nombre}
              className="card-premium p-4 flex items-center gap-4 animate-fade-up"
              style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="w-10 h-10 rounded-xl bg-bv-50 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-bv-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-bv-900 dark:text-white text-[0.9375rem]">{r.nombre}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{r.desc}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="flex items-center gap-1 text-[10px] text-gray-400"><ClockIcon />{r.hora}</span>
                  <span className="flex items-center gap-1 text-[10px] text-gray-400"><PinIcon />{r.ubicacion}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
