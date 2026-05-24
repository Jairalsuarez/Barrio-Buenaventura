import { useState, useEffect } from 'react'
import { format, isSunday, setHours, setMinutes, setSeconds, addWeeks, startOfMonth, differenceInMilliseconds } from 'date-fns'
import { es } from 'date-fns/locale'

function getProximoDomingo9AM() {
  const ahora = new Date()
  let domingo
  if (isSunday(ahora) && ahora.getHours() < 9) {
    domingo = ahora
  } else {
    const diasHastaDomingo = (7 - ahora.getDay()) % 7
    domingo = addWeeks(ahora, 0)
    domingo.setDate(ahora.getDate() + (diasHastaDomingo === 0 ? 7 : diasHastaDomingo))
  }
  domingo = setHours(setMinutes(setSeconds(domingo, 0), 0), 9)
  return domingo
}

function esPrimerDomingoDelMes(fecha) {
  const primerDia = startOfMonth(fecha)
  let primerDomingo = primerDia
  while (primerDomingo.getDay() !== 0) {
    primerDomingo.setDate(primerDomingo.getDate() + 1)
  }
  return fecha.getDate() === primerDomingo.getDate()
}

function esHorarioSacramental() {
  const ahora = new Date()
  if (!isSunday(ahora)) return false
  const inicio = setHours(setMinutes(setSeconds(ahora, 0), 0), 9)
  const fin = setHours(setMinutes(setSeconds(ahora, 0), 0), 11)
  inicio.setFullYear(ahora.getFullYear(), ahora.getMonth(), ahora.getDate())
  fin.setFullYear(ahora.getFullYear(), ahora.getMonth(), ahora.getDate())
  return ahora >= inicio && ahora <= fin
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Buenos días'
  if (h < 18) return 'Buenas tardes'
  return 'Buenas noches'
}

function getMemberName() {
  return localStorage.getItem('iglesia_bv_name')
}

export default function HeroPrincipal({ onScrollTo }) {
  const [ahora, setAhora] = useState(new Date())
  const [userName, setUserName] = useState(getMemberName)

  useEffect(() => {
    setUserName(getMemberName())
    const id = setInterval(() => setAhora(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const enHorario = esHorarioSacramental()
  const proxDomingo = getProximoDomingo9AM()
  const diff = differenceInMilliseconds(proxDomingo, ahora)
  const dias = Math.floor(diff / 86400000)
  const horas = Math.floor((diff % 86400000) / 3600000)
  const minutos = Math.floor((diff % 3600000) / 60000)
  const segundos = Math.floor((diff % 60000) / 1000)
  const esAyuno = esPrimerDomingoDelMes(ahora)

  return (
    <section className="relative min-h-[100dvh] flex flex-col overflow-hidden bg-bv-900">
      <div className="absolute inset-0 pointer-events-none">
        <img src="/capilla.svg" alt="" className="absolute inset-0 w-full h-full object-cover opacity-35 scale-105" style={{ filter: 'saturate(0.8) contrast(1.1)' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-bv-900/60 via-bv-900/40 to-bv-950/80" />
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-bv-300/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-0 w-60 h-60 bg-gold-400/8 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-center px-6 max-w-lg mx-auto w-full">
        <div className="text-center">
          <p className="text-[11px] text-white/40 font-medium tracking-[0.15em] uppercase animate-fade-in">
            {format(ahora, "EEEE, d 'de' MMMM", { locale: es })}
          </p>

          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mt-4 animate-fade-up" style={{ letterSpacing: '-0.03em' }}>
            {getGreeting()}{userName ? `, Hermano/a ${userName}` : ''}
          </h1>

          <p className="text-sm text-white/60 mt-2 animate-fade-up animate-delay-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 400 }}>
            Barrio Buenaventura
          </p>
          <p className="text-[11px] text-white/35 mt-1.5 max-w-xs mx-auto leading-relaxed animate-fade-up animate-delay-1">
            Iglesia de Jesucristo de los Santos de los Últimos Días
          </p>

          <div className="inline-flex items-center gap-2 mt-5 bg-white/8 backdrop-blur-md rounded-full px-4 py-2 border border-white/10 animate-scale-in animate-delay-2">
            <svg className="w-3.5 h-3.5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            <span className="text-xs text-white/70">4G36+RJ9, Buena Fe</span>
          </div>

          <div className="inline-flex items-center gap-2 mt-3 bg-white/6 backdrop-blur-md rounded-full px-4 py-1.5 border border-white/8 animate-scale-in animate-delay-2">
            <span className="material-symbols-outlined text-white/50" style={{ fontSize: 14 }}>schedule</span>
            <span className="text-xs text-white/70">Domingo 9:00 AM — 11:00 AM</span>
          </div>

          {esAyuno && (
            <span className="inline-block mt-3 text-[10px] text-gold-300 bg-gold-400/10 rounded-full px-3 py-1 animate-fade-in animate-delay-2">
              Día de Ayuno y Testimonio
            </span>
          )}
        </div>

        {enHorario ? (
          <div className="mt-10 text-center animate-scale-in animate-delay-2">
            <div className="inline-flex items-center gap-2.5 bg-emerald-500/12 backdrop-blur-md rounded-2xl px-5 py-3 border border-emerald-400/15">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
              </span>
              <span className="text-sm font-medium text-emerald-300">Reunión Sacramental en Curso</span>
            </div>
          </div>
        ) : (
          <div className="mt-10 text-center animate-fade-up animate-delay-2">
            <p className="text-[10px] text-white/35 uppercase tracking-[0.2em] mb-3">Próxima reunión</p>
            <div className="flex justify-center gap-2 sm:gap-3">
              {[
                { val: dias, label: 'Días' },
                { val: horas, label: 'Horas' },
                { val: minutos, label: 'Min' },
                { val: segundos, label: 'Seg' },
              ].map((item, i) => (
                <div key={item.label} className="text-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/6 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/8 shadow-lg animate-count-pop" style={{ animationDelay: `${i * 0.1 + 0.3}s` }}>
                    <span className="text-xl sm:text-2xl font-bold text-white tabular-nums" style={{ letterSpacing: '-0.02em' }}>
                      {String(item.val).padStart(2, '0')}
                    </span>
                  </div>
                  <span className="text-[9px] text-white/35 mt-1.5 block uppercase tracking-wider">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-2.5 animate-fade-up animate-delay-3">
          <button onClick={() => onScrollTo?.('section-eventos')} className="btn-primary w-full sm:w-auto justify-center">
            Ver actividades
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
          <button onClick={() => onScrollTo?.('section-nuevos')} className="btn-secondary w-full sm:w-auto justify-center !border-white/20 !text-white hover:!bg-white/10">
            Hablar con misioneros
          </button>
        </div>

        <div className="mt-2 text-center animate-fade-in animate-delay-4">
          <a href={`https://www.google.com/maps/search/${encodeURIComponent('4G36+RJ9, Buena Fe')}`} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] text-white/40 hover:text-white/60 transition-colors underline underline-offset-2 decoration-white/20 hover:decoration-white/40">
            Cómo llegar a la capilla
          </a>
        </div>
      </div>

      <div className="relative z-10 pb-6 text-center animate-breathe">
        <button onClick={() => onScrollTo?.('section-eventos')} className="text-white/30 hover:text-white/50 transition-colors">
          <svg className="w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
      </div>
    </section>
  )
}
