import { useState, useEffect } from 'react'
import { format, isSunday, setHours, setMinutes, setSeconds, isWithinInterval, startOfMonth, addWeeks, differenceInMilliseconds } from 'date-fns'
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
  return isWithinInterval(ahora, { start: inicio, end: fin })
}

function generarGoogleCalendarUrl() {
  const prox = getProximoDomingo9AM()
  const fin = new Date(prox)
  fin.setHours(11)
  const startStr = prox.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  const endStr = fin.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: 'Reunión Sacramental - Barrio Buenaventura',
    dates: `${startStr}/${endStr}`,
    recurrence: 'RRULE:FREQ=WEEKLY;BYDAY=SU',
    details: 'Ven a renovar tus convenios y fortalecer tu fe. Te esperamos con los brazos abiertos.',
    location: '4G36+RJ9, Buena Fe',
    sf: 'true',
    output: 'xml',
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export default function HeroContador() {
  const [ahora, setAhora] = useState(new Date())

  useEffect(() => {
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
  const esAyuno = esPrimerDomingoDelMes(ahora) || esPrimerDomingoDelMes(proxDomingo)

  return (
      <section className="relative overflow-hidden bg-gradient-to-br from-church-900 via-church-800 to-church-950 dark:from-slate-900 dark:via-slate-800 dark:to-slate-950 px-5 pt-10 pb-12 text-white">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-white blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-church-400 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-sm mx-auto">
        <p className="text-xs text-church-300 text-center mb-6">
          {format(ahora, "EEEE, d 'de' MMMM '·' HH:mm", { locale: es })}
        </p>

        {enHorario && (
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-sm font-semibold rounded-full px-5 py-2 border border-emerald-500/30">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              Reunión Sacramental en Curso
            </div>
          </div>
        )}

        {esAyuno && (
          <div className="text-center -mt-2 mb-4">
            <span className="inline-block bg-gold-500/20 text-gold-300 text-xs font-semibold rounded-full px-4 py-1.5 border border-gold-500/30">
              Día de Ayuno y Testimonio
            </span>
          </div>
        )}

        {!enHorario && (
          <div className="text-center">
            <p className="text-xs text-church-300 uppercase tracking-widest mb-3">Próxima Reunión Sacramental</p>
            <div className="flex justify-center gap-3">
              {[
                { val: dias, label: 'Días' },
                { val: horas, label: 'Horas' },
                { val: minutos, label: 'Min' },
                { val: segundos, label: 'Seg' },
              ].map(item => (
                <div key={item.label} className="text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center border border-white/10">
                    <span className="text-2xl sm:text-3xl font-bold tabular-nums">{String(item.val).padStart(2, '0')}</span>
                  </div>
                  <span className="text-[10px] text-church-300 mt-1.5 block uppercase tracking-wider">{item.label}</span>
                </div>
              ))}
            </div>
            <a
              href={generarGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-5 text-xs text-church-300 bg-white/10 hover:bg-white/20 rounded-full px-4 py-2 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Agregar a Google Calendar
            </a>
          </div>
        )}

        {enHorario && (
          <div className="text-center mt-5">
            <a
              href={generarGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs text-church-300 bg-white/10 hover:bg-white/20 rounded-full px-4 py-2 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Recordatorio en Google Calendar
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
