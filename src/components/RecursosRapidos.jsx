const RECURSOS = [
  { nombre: 'Biblioteca del Evangelio', icon: 'book', url: 'https://www.churchofjesuschrist.org/study?lang=spa' },
  { nombre: 'FamilySearch', icon: 'account_tree', url: 'https://www.familysearch.org/es/' },
  { nombre: 'Donaciones', icon: 'volunteer_activism', url: 'https://donations.churchofjesuschrist.org/' },
  { nombre: 'Himnos', icon: 'music_note', url: 'https://www.churchofjesuschrist.org/music?lang=spa' },
  { nombre: 'Ven Sígueme', icon: 'auto_stories', url: 'https://www.churchofjesuschrist.org/study/manual/come-follow-me?lang=spa' },
  { nombre: 'Misioneros', icon: 'handshake', url: 'https://www.churchofjesuschrist.org/features/meet-with-missionaries?lang=spa' },
  { nombre: 'Ayuda', icon: 'support', url: '#' },
  { nombre: 'Calendario', icon: 'calendar_month', url: 'https://www.churchofjesuschrist.org/calendar?lang=spa' },
]

export default function RecursosRapidos() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-lg mx-auto px-6">
        <div className="text-center mb-10">
          <p className="eyebrow mb-3">Recursos</p>
          <h2 className="section-title">Recursos Útiles</h2>
        </div>
        <div className="grid grid-cols-4 gap-2.5">
          {RECURSOS.map((r, i) => (
            <a key={r.nombre} href={r.url} target="_blank" rel="noopener noreferrer"
              className="card-premium flex flex-col items-center text-center gap-2 p-3.5 group animate-fade-up active:scale-[0.97] transition-all"
              style={{ animationDelay: `${i * 0.06}s` }}>
              <div className="w-10 h-10 rounded-xl bg-bv-50 flex items-center justify-center text-bv-500 group-hover:scale-110 transition-transform duration-300 ease-out">
                <span className="material-symbols-outlined" style={{ fontSize: 22 }}>{r.icon}</span>
              </div>
              <span className="text-[9px] font-medium text-bv-900 dark:text-white leading-tight">{r.nombre}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
