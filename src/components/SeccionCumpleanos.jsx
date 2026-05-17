import { useEffect, useRef } from 'react'
import Card from './ui/Card'
import Badge from './ui/Badge'
import Icon from './ui/Icon'
import { useCumpleanos } from '../hooks/useCumpleanos'

const MENSAJES_INSPIRADORES = [
  'La vida es un hermoso regalo de Dios. ¡Celebremos juntos!',
  'Cada nueva vuelta al sol es una oportunidad de acercarnos más a Cristo.',
  'Qué bendición tenerte en el barrio. ¡Dios te bendiga en tu día!',
  'Que este nuevo año de vida esté lleno de gozo, paz y propósitos divinos.',
  'El señor se regocija en tus talentos. ¡Brilla en este nuevo año!',
  'Un corazón agradecido es un imán de milagros. ¡Feliz cumpleaños!',
]

function getMensajePara(nombre) {
  const indice = nombre.length % MENSAJES_INSPIRADORES.length
  return MENSAJES_INSPIRADORES[indice]
}

export default function SeccionCumpleanos({ currentUser, data: externData }) {
  const hookData = useCumpleanos()
  const { cumpleaneros, hoy, proximos, loading } = externData ?? hookData
  const confettiFired = useRef(false)

  const soyYoHoy = currentUser && hoy.some(c => c.id === currentUser.id)

  useEffect(() => {
    if (soyYoHoy && !confettiFired.current) {
      confettiFired.current = true
      let running = true
      import('canvas-confetti').then(mod => {
        if (!running) return
        const confettiFn = mod.default
        const duration = 4000
        const end = Date.now() + duration
        const frame = () => {
          confettiFn({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0, y: 0.7 }, colors: ['#0c93eb', '#c9952e', '#ec9730', '#10b981', '#8b5cf6'] })
          confettiFn({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1, y: 0.7 }, colors: ['#0c93eb', '#c9952e', '#ec9730', '#10b981', '#8b5cf6'] })
          if (Date.now() < end) requestAnimationFrame(frame)
        }
        frame()
      })
      return () => { running = false }
    }
  }, [soyYoHoy])

  if (loading) return null

  return (
    <section className="px-5 py-6 max-w-sm mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <Icon size={24}>cake</Icon>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Cumpleaños</h2>
        <Badge variant="warm" className="text-xs">{cumpleaneros.length}</Badge>
      </div>

      {soyYoHoy && (
        <Card className="!bg-gradient-to-br from-gold-500 via-gold-400 to-warm-400 !border-none text-white text-center mb-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.2)_0%,_transparent_70%)]" />
          <div className="relative z-10">
            <Icon size={36} className="block mb-2 mx-auto">celebration</Icon>
            <p className="text-xl font-bold">¡Feliz cumpleaños, {currentUser?.nombre}!</p>
            <p className="text-sm mt-1 opacity-90">Que el Señor te bendiga en este día especial.</p>
          </div>
        </Card>
      )}

      {hoy.length > 0 && !soyYoHoy && (
        <Card className="!border-warm-200 dark:!border-warm-800 !bg-warm-50 dark:!bg-slate-800 mb-4">
          <p className="font-semibold text-warm-800 dark:text-warm-300 text-sm flex items-center gap-1">
            <Icon size={16}>balloon</Icon> Hoy es el cumpleaños de
          </p>
          <p className="text-warm-900 dark:text-warm-200 font-bold text-base mt-1">
            {hoy.map(c => `${c.nombre} ${c.apellido}`).join(', ')}
          </p>
          <p className="text-xs text-warm-700 dark:text-warm-300 mt-2">
            {getMensajePara(hoy[0]?.nombre)} ¡Felicítalos con un mensaje!
          </p>
        </Card>
      )}

      {proximos.length > 0 ? (
        <div className="space-y-2">
          {proximos.slice(0, 5).map((c, i) => (
            <Card key={c.id} className="!p-3 flex items-center gap-3 animate-slide-right" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="w-9 h-9 rounded-full bg-warm-100 dark:bg-slate-700 flex items-center justify-center text-sm font-bold text-warm-700 dark:text-warm-300 flex-shrink-0">
                {c.dias_restantes}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-slate-100 text-sm truncate">{c.nombre} {c.apellido}</p>
                <p className="text-xs text-gray-400 dark:text-slate-400">Cumple {c.edad} años</p>
              </div>
              <span className="text-xs text-gray-400 dark:text-slate-500 flex-shrink-0">{c.dias_restantes === 1 ? 'mañana' : `en ${c.dias_restantes} días`}</span>
            </Card>
          ))}
        </div>
      ) : hoy.length === 0 && (
        <p className="text-sm text-gray-400 dark:text-slate-500 text-center py-6">No hay cumpleaños próximos. Estate pendiente de la página.</p>
      )}
    </section>
  )
}
