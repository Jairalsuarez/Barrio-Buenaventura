const ANUNCIOS = [
  { titulo: 'Bienvenidos al Barrio', contenido: 'Reunión cada domingo 9:00 AM en la capilla. Todos son bienvenidos.', fecha: 'Permanente', color: 'bg-white' },
  { titulo: 'Clase de Seminario', contenido: 'Lunes a viernes 6:00 AM en el Centro de Estaca.', fecha: 'Diario', color: 'bg-white' },
  { titulo: 'Noche de Hogar', contenido: 'Los lunes por la noche son para la familia..', fecha: 'Cada lunes', color: 'bg-white' },
  { titulo: 'Historia Familiar', contenido: 'Miércoles de 4:00 a 7:00 PM en el centro de genealogía.', fecha: 'Miércoles', color: 'bg-white' },
]

const ROTATIONS = ['-rotate-1', 'rotate-1', 'rotate-[1.5deg]', '-rotate-[0.5deg]']

export default function TableroAnuncios() {
  return (
    <section className="py-16 bg-[#f3eee7]">
      <div className="max-w-lg mx-auto px-6">
        <div className="text-center mb-10">
          <p className="eyebrow mb-3">Tablero</p>
          <h2 className="section-title">Anuncios</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ANUNCIOS.map((a, i) => (
            <div
              key={i}
              className={`${ROTATIONS[i]} hover:rotate-0 transition-all duration-500 ease-out`}
              style={{ animationDelay: `${i * 0.12}s` }}
            >
              <div className="relative card-premium p-5 bg-white shadow-sm" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04), 1px 2px 4px rgba(0,0,0,0.02)' }}>
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10 animate-pin" style={{ transformOrigin: 'top center' }}>
                  <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
                    <circle cx="8" cy="8" r="6" fill="#d8c3a5" stroke="white" strokeWidth="2" />
                    <circle cx="8" cy="8" r="2.5" fill="white" />
                    <line x1="8" y1="14" x2="8" y2="20" stroke="#d8c3a5" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="text-[10px] uppercase tracking-wider text-gold-500 font-medium">{a.fecha}</span>
                <h3 className="text-sm font-bold text-bv-900 mt-1.5">{a.titulo}</h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{a.contenido}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
