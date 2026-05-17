import { useState } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import Card from './ui/Card'
import Button from './ui/Button'
import Input from './ui/Input'
import Spinner from './ui/Spinner'
import { useAcontecimientos } from '../hooks/useAcontecimientos'

function NotificationPrompt({ onAccept, onDismiss }) {
  return (
    <div className="bg-church-50 dark:bg-slate-800 border border-church-200 dark:border-slate-700 rounded-2xl p-5 text-center">
      <div className="w-12 h-12 bg-church-100 dark:bg-church-900 rounded-full flex items-center justify-center mx-auto mb-3">
        <svg className="w-6 h-6 text-church-600 dark:text-church-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
      </div>
      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">¿Quieres recibir notificaciones?</h3>
      <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">Te avisaremos cuando haya nuevos eventos en el barrio.</p>
      <div className="flex gap-2 justify-center">
        <Button variant="primary" onClick={onAccept}>Activar notificaciones</Button>
        <Button variant="ghost" onClick={onDismiss}>Ahora no</Button>
      </div>
    </div>
  )
}

export default function AgendaAcontecimientos({ userId, isPredefinido, data: externData }) {
  const hookData = useAcontecimientos(userId)
  const { eventos, loading, error, crear, eliminar } = externData ?? hookData
  const [notifAsked, setNotifAsked] = useState(false)
  const [notifGranted, setNotifGranted] = useState(() => typeof Notification !== 'undefined' && Notification.permission === 'granted')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ nombre: '', fecha_hora: '' })
  const [creando, setCreando] = useState(false)

  function handleNotifAccept() {
    if ('Notification' in window) {
      Notification.requestPermission().then(perm => {
        setNotifGranted(perm === 'granted')
        setNotifAsked(true)
      })
    }
  }

  function handleNotifDismiss() {
    setNotifAsked(true)
  }

  async function handleCrear(e) {
    e.preventDefault()
    if (!form.nombre.trim() || !form.fecha_hora) return
    setCreando(true)
    await crear(form.nombre, form.fecha_hora)
    setForm({ nombre: '', fecha_hora: '' })
    setShowForm(false)
    setCreando(false)
  }

  function getEventIcon(nombre) {
    const n = nombre.toLowerCase()
    if (n.includes('sacramental') || n.includes('reunión')) return '🙏'
    if (n.includes('bautismo') || n.includes('bautizo')) return '💧'
    if (n.includes('actividad') || n.includes('fiesta')) return '🎉'
    if (n.includes('conferencia')) return '📖'
    if (n.includes('templo')) return '🏛️'
    if (n.includes('ensenanza') || n.includes('clase') || n.includes('escuela')) return '📚'
    if (n.includes('ayuno') || n.includes('testimonio')) return '🤍'
    return '📌'
  }

  return (
    <section className="px-5 py-8 max-w-sm mx-auto">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Acontecimientos</h2>
        {isPredefinido && (
          <Button variant="primary" size="sm" onClick={() => setShowForm(!showForm)} className="!py-2 !px-3 !text-xs">
            {showForm ? 'Cancelar' : '+ Nuevo'}
          </Button>
        )}
      </div>

      {notifAsked === false && !notifGranted && (
        <NotificationPrompt onAccept={handleNotifAccept} onDismiss={handleNotifDismiss} />
      )}

      {showForm && isPredefinido && (
        <Card className="mb-4 !border-church-200 dark:!border-church-700 !bg-church-50 dark:!bg-slate-800">
          <form onSubmit={handleCrear} className="space-y-3">
            <Input
              label="Nombre del evento"
              name="nombre"
              placeholder="Ej: Reunión de Barrio"
              value={form.nombre}
              onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))}
            />
            <Input
              label="Fecha y hora"
              name="fecha_hora"
              type="datetime-local"
              value={form.fecha_hora}
              onChange={e => setForm(p => ({ ...p, fecha_hora: e.target.value }))}
            />
            <Button type="submit" fullWidth disabled={creando}>
              {creando ? 'Creando...' : 'Crear evento'}
            </Button>
          </form>
        </Card>
      )}

      {loading ? (
        <div className="flex justify-center py-8"><Spinner /></div>
      ) : error ? (
        <p className="text-sm text-red-500 dark:text-red-400 text-center py-4">{error}</p>
      ) : eventos.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400 dark:text-slate-500 text-sm">No hay eventos próximos</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {eventos.map((ev, i) => (
            <Card key={ev.id} className="!p-4 flex items-start gap-3 relative overflow-hidden animate-fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
              <span className="text-xl flex-shrink-0 mt-0.5">{getEventIcon(ev.nombre)}</span>
              <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 dark:text-slate-100 text-sm truncate">{ev.nombre}</p>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                  {format(new Date(ev.fecha_hora), "d 'de' MMMM '·' HH:mm", { locale: es })}
                </p>
              </div>
              {isPredefinido && (
                <button
                  onClick={() => eliminar(ev.id)}
                  className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0"
                  aria-label="Eliminar evento"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}
