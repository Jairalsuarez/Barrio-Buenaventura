import { useState, useEffect, useRef } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import Card from './ui/Card'
import Button from './ui/Button'
import Input from './ui/Input'
import Spinner from './ui/Spinner'
import Modal from './ui/Modal'
import { useAcontecimientos } from '../hooks/useAcontecimientos'
import { usePushNotifications } from '../hooks/usePushNotifications'
import { useAsistencia } from '../hooks/useAsistencia'

function DetalleEventoModal({ evento, userId, onClose }) {
  const { asistira, cargar, responder, loading: rsvpLoading } = useAsistencia(evento?.id, userId)

  useEffect(() => { if (evento) cargar() }, [evento, cargar])

  if (!evento) return null

  return (
    <Modal open={!!evento} onClose={onClose} title="Detalles del evento">
      <div className="space-y-4">
        <div>
          <p className="text-2xl mb-1">{getEventIcon(evento.nombre)}</p>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{evento.nombre}</h3>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            {format(new Date(evento.fecha_hora), "d 'de' MMMM '·' HH:mm", { locale: es })}
          </p>
        </div>
        {evento.descripcion && (
          <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">{evento.descripcion}</p>
        )}
        <div className="border-t border-gray-100 dark:border-slate-700 pt-4">
          <p className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-3">¿Asistirás?</p>
          <div className="flex gap-3">
            <button
              onClick={() => responder(true)}
              disabled={rsvpLoading}
              className={`flex-1 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                asistira === true
                  ? 'bg-church-600 text-white shadow-md shadow-church-600/30'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-church-50 dark:hover:bg-church-950'
              }`}
            >
              Sí, asistiré
            </button>
            <button
              onClick={() => responder(false)}
              disabled={rsvpLoading}
              className={`flex-1 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                asistira === false
                  ? 'bg-red-500 text-white shadow-md shadow-red-500/30'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-950'
              }`}
            >
              No asistiré
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
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

export default function AgendaAcontecimientos({ userId, isPredefinido, data: externData }) {
  const hookData = useAcontecimientos(userId)
  const { eventos, loading, error, crear, eliminar } = externData ?? hookData
  const { subscribe } = usePushNotifications(userId)
  const subscribedRef = useRef(false)

  useEffect(() => {
    if (subscribedRef.current) return
    subscribedRef.current = true
    if (typeof Notification === 'undefined') return
    if (Notification.permission === 'granted') {
      subscribe()
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(perm => {
        if (perm === 'granted') subscribe()
      })
    }
  }, [subscribe])

  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ nombre: '', fecha_hora: '', descripcion: '' })
  const [creando, setCreando] = useState(false)
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null)

  async function handleCrear(e) {
    e.preventDefault()
    if (!form.nombre.trim() || !form.fecha_hora) return
    setCreando(true)
    try {
      const ev = await crear(form.nombre, form.fecha_hora, form.descripcion)
      if (ev && !window.location.hostname.includes('localhost')) {
        fetch('/api/send-push', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: 'Nuevo evento',
            body: form.descripcion?.trim() ? `${form.nombre.trim()}: ${form.descripcion.trim()}` : form.nombre.trim(),
            url: '/',
          }),
        }).catch(() => {})
      }
    } catch {}
    setForm({ nombre: '', fecha_hora: '', descripcion: '' })
    setShowForm(false)
    setCreando(false)
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
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Descripción</label>
              <textarea
                name="descripcion"
                rows={3}
                placeholder="Describe el evento..."
                value={form.descripcion}
                onChange={e => setForm(p => ({ ...p, descripcion: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white px-4 py-2.5 text-sm placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-church-500/40 focus:border-church-500 transition-colors resize-none"
              />
            </div>
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
            <button key={ev.id} onClick={() => setEventoSeleccionado(ev)} className="w-full text-left">
              <Card className="!p-4 flex items-start gap-3 relative overflow-hidden animate-fade-up hover:shadow-md dark:hover:shadow-slate-900/50 transition-shadow" style={{ animationDelay: `${i * 0.08}s` }}>
                <span className="text-xl flex-shrink-0 mt-0.5">{getEventIcon(ev.nombre)}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-slate-100 text-sm truncate">{ev.nombre}</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                    {format(new Date(ev.fecha_hora), "d 'de' MMMM '·' HH:mm", { locale: es })}
                  </p>
                  {ev.descripcion && (
                    <p className="text-xs text-gray-400 dark:text-slate-500 mt-1 line-clamp-1">{ev.descripcion}</p>
                  )}
                </div>
                {isPredefinido && (
                  <button
                    onClick={(e) => { e.stopPropagation(); eliminar(ev.id) }}
                    className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0"
                    aria-label="Eliminar evento"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </Card>
            </button>
          ))}
        </div>
      )}

      <DetalleEventoModal
        evento={eventoSeleccionado}
        userId={userId}
        onClose={() => setEventoSeleccionado(null)}
      />
    </section>
  )
}
