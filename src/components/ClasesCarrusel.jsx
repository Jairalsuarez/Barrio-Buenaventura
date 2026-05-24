const CLASES = [
  { nombre: 'Primaria', icon: 'child_care', desc: 'Niños 3–11 años' },
  { nombre: 'Jóvenes', icon: 'groups', desc: 'Adolescentes' },
  { nombre: 'Sociedad de Socorro', icon: 'female', desc: 'Mujeres adultas' },
  { nombre: 'Cuórum de Élderes', icon: 'male', desc: 'Hombres adultos' },
  { nombre: 'Seminario', icon: 'lightbulb', desc: 'Estudio matutino' },
  { nombre: 'Instituto', icon: 'school', desc: 'Religión jóvenes' },
  { nombre: 'Misioneros', icon: 'handshake', desc: 'Servicio misional' },
  { nombre: 'Historia Familiar', icon: 'account_tree', desc: 'Genealogía' },
  { nombre: 'Música', icon: 'music_note', desc: 'Coros y programas' },
  { nombre: 'Autosuficiencia', icon: 'trending_up', desc: 'Desarrollo personal' },
]

export default function ClasesCarrusel() {
  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="text-center mb-10 px-6">
        <p className="eyebrow mb-3">Organizaciones</p>
        <h2 className="section-title">Clases y Organizaciones</h2>
        <p className="section-subtitle">Hay un lugar para ti</p>
      </div>
      <div className="relative">
        <div className="flex gap-4 animate-carousel" style={{ width: 'max-content' }}>
          {[...CLASES, ...CLASES].map((cls, i) => (
            <div key={i} className="card-premium flex-shrink-0 p-4 text-center" style={{ width: 160 }}>
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-bv-50 to-white dark:from-bv-950 dark:to-slate-900 flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-bv-500 dark:text-bv-300" style={{ fontSize: 26 }}>{cls.icon}</span>
              </div>
              <h3 className="text-sm font-semibold text-bv-900 dark:text-white mt-3">{cls.nombre}</h3>
              <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">{cls.desc}</p>
            </div>
          ))}
        </div>
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent pointer-events-none" />
      </div>
    </section>
  )
}
