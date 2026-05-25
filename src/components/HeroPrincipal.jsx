import { useState, useEffect } from 'react'
import { isSunday, setHours, setMinutes, setSeconds, addWeeks, startOfMonth } from 'date-fns'
import EscrituraCard from './EscrituraCard'

function getProximoDomingo9AM() {
  const ahora = new Date()
  let domingo
  if (isSunday(ahora) && ahora.getHours() < 11) {
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
  while (primerDomingo.getDay() !== 0) primerDomingo.setDate(primerDomingo.getDate() + 1)
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

export default function HeroPrincipal({ onNavigate }) {
  const [ahora, setAhora] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setAhora(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const enHorario = esHorarioSacramental()
  const proxDomingo = getProximoDomingo9AM()
  const esAyuno = esPrimerDomingoDelMes(ahora)
  const calStart = proxDomingo.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  const calEnd = new Date(proxDomingo.getTime() + 2 * 3600000).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  const calUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=Reuni%C3%B3n+Sacramental+Barrio+Buenaventura&dates=${calStart}/${calEnd}&location=4G36%2BRJ9%2C+Buena+Fe&sf=true&output=xml`

  return (
    <div className="min-h-dvh bg-[#faf7f2] dark:bg-[#0f0f14]">
      <div className="max-w-lg mx-auto px-5 pt-6 pb-4">
        <div>
          <h1 className="mt-2 text-center" style={{ letterSpacing: '-0.03em' }}>
              <span className="block font-bold text-[#1e293b] dark:text-white" style={{ fontSize: 'clamp(1.2rem, 4vw, 2rem)' }}>Barrio</span>
              <span className="block font-bold leading-[1] -mt-1 text-transparent animate-deslumbrar" style={{ fontSize: 'clamp(2.5rem, 14vw, 7rem)', letterSpacing: '-0.04em' }}>Buenaventura</span>
            </h1>

            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <a href={calUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] text-[#64748b] dark:text-slate-400 bg-white dark:bg-white/8 rounded-full px-3 py-1.5 border border-[#e4dcd0] dark:border-white/10 hover:border-[#8c6a43]/40 transition-colors">
                <span className="material-symbols-outlined text-[#8c6a43]" style={{ fontSize: 13 }}>schedule</span>
                Dom 9:00 — 11:00
              </a>
              <a href="https://maps.app.goo.gl/cro6ttkLFxy8tP1E8" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] text-[#64748b] dark:text-slate-400 bg-white dark:bg-white/8 rounded-full px-3 py-1.5 border border-[#e4dcd0] dark:border-white/10 hover:border-[#8c6a43]/40 transition-colors">
                <span className="material-symbols-outlined text-[#8c6a43]" style={{ fontSize: 13 }}>location_on</span>
                Capilla Barrio Buenaventura
              </a>
            </div>

          </div>

        {esAyuno && (
          <span className="inline-flex items-center gap-1.5 mt-3 text-[12px] text-[#8c6a43] bg-[#8c6a43]/8 rounded-xl px-3.5 py-2">
            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>restaurant</span>
            Día de Ayuno y Testimonio
          </span>
        )}

        {enHorario && (
          <div className="mt-5">
            <div className="inline-flex items-center gap-2.5 bg-[#8c6a43]/10 rounded-2xl px-4 py-3 border border-[#8c6a43]/15">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8c6a43] opacity-50" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#8c6a43]" />
              </span>
              <span className="text-sm font-medium text-[#8c6a43]">Reunión Sacramental en Curso</span>
            </div>
          </div>
        )}

        <EscrituraCard />

        <div className="mt-5 text-center">
          <p className="text-base font-extrabold leading-tight text-[#1e293b] dark:text-white">
            ¿Estás conociendo la iglesia?
          </p>
          <button
            onClick={() => onNavigate?.('nuevos')}
            className="mt-3 inline-flex items-center justify-center gap-2 rounded-xl bg-[#1e293b] px-6 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#334155] active:scale-[0.98] dark:bg-[#c6a27b] dark:text-[#121216] dark:hover:bg-[#d8c3a5]"
          >
            Quiero saber más
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </button>
        </div>

        <div className="mt-5">
          <button
            onClick={() => onNavigate?.('anuncios')}
            className="announcement-feature-button group relative w-full overflow-hidden rounded-2xl border border-[#8c6a43]/18 bg-white px-5 py-3.5 text-left shadow-sm transition-all hover:border-[#8c6a43]/35 hover:shadow-md active:scale-[0.99] dark:border-[#c6a27b]/18 dark:bg-white/8 dark:hover:bg-white/12"
          >
            <span className="relative z-10 flex items-center gap-4.5">
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center text-[#8c6a43] dark:text-[#c6a27b]">
                <svg className="h-7 w-7" fill="none" viewBox="0 0 32 32" stroke="currentColor" strokeWidth={1.7}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 7.5h13A2.5 2.5 0 0125 10v12a2.5 2.5 0 01-2.5 2.5h-13A2.5 2.5 0 017 22V10a2.5 2.5 0 012.5-2.5Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.5 12.5h9M11.5 16h6.5M11.5 19.5h8" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M23.5 11.5h2.25A2.25 2.25 0 0128 13.75v10A4.25 4.25 0 0123.75 28H12.5" />
                </svg>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xl font-extrabold leading-none text-[#1e293b] dark:text-white">Tablero del barrio</span>
              </span>
              <span className="material-symbols-outlined text-[#8c6a43] transition-transform group-hover:translate-x-1 dark:text-[#c6a27b]" style={{ fontSize: 22 }}>
                arrow_forward
              </span>
            </span>
          </button>
        </div>

        <div className="mt-5 text-center">
          <p className="text-base font-extrabold leading-tight text-[#1e293b] dark:text-white">
            Herramientas
          </p>
          <button
            onClick={() => onNavigate?.('herramientas')}
            className="mt-3 inline-flex items-center justify-center gap-2 rounded-xl bg-[#1e293b] px-6 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#334155] active:scale-[0.98] dark:bg-[#c6a27b] dark:text-[#121216] dark:hover:bg-[#d8c3a5]"
          >
            Abrir
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  )
}
