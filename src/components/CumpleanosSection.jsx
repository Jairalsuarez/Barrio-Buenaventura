import { useCumpleanos } from '../hooks/useCumpleanos'

export default function CumpleanosSection() {
  const { hoy, proximos, loading } = useCumpleanos()

  if (loading) return null

  return (
    <section className="py-12 bg-[#faf8f5]">
      <div className="max-w-lg mx-auto px-6">
        {hoy.length > 0 && (
          <div className="card-premium p-4 mb-4 bg-gradient-to-r from-gold-400/10 to-transparent border-gold-400/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold-400/20 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-gold-500" style={{ fontSize: 22 }}>celebration</span>
              </div>
              <div>
                <p className="text-[10px] text-gold-500 uppercase tracking-wider font-medium">Hoy cumple</p>
                <p className="text-sm font-bold text-bv-900">{hoy.map(c => `${c.nombre} ${c.apellido}`).join(', ')}</p>
              </div>
            </div>
          </div>
        )}
        {proximos.length > 0 && (
          <div>
            <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium mb-3">Próximos cumpleaños</p>
            <div className="space-y-1.5">
              {proximos.slice(0, 5).map((c, i) => (
                <div key={c.id} className="flex items-center gap-3 animate-fade-up" style={{ animationDelay: `${i * 0.06}s` }}>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    c.dias_restantes <= 7
                      ? 'bg-gold-500 text-white shadow-sm shadow-gold-500/20'
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    {c.dias_restantes}
                  </div>
                  <span className="text-sm text-bv-900 dark:text-slate-200">{c.nombre} {c.apellido}</span>
                  <div className="flex-1" />
                  <span className="text-[10px] text-gray-400">{c.edad} años · {c.dias_restantes === 0 ? 'hoy' : c.dias_restantes === 1 ? 'mañana' : `en ${c.dias_restantes} d`}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {hoy.length === 0 && proximos.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-6">No hay cumpleaños próximos</p>
        )}
      </div>
    </section>
  )
}
