import { useState, useEffect, useRef } from 'react'
import { format, differenceInDays, isSameDay } from 'date-fns'
import { es } from 'date-fns/locale'
import Card from './ui/Card'
import Button from './ui/Button'
import { getCookie, setCookie } from '../lib/cookies'
import Input from './ui/Input'
import Spinner from './ui/Spinner'
import Modal from './ui/Modal'
import Icon from './ui/Icon'
import { useAcontecimientos } from '../hooks/useAcontecimientos'
import { usePushNotifications } from '../hooks/usePushNotifications'
import { useAsistencia } from '../hooks/useAsistencia'
import { supabase } from '../lib/supabase'
import { LLAMAMIENTOS } from '../lib/session'

function diasPara(fecha) {
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const target = new Date(fecha)
  target.setHours(0, 0, 0, 0)
  return differenceInDays(target, hoy)
}

function textoDiasRestantes(fecha) {
  const d = diasPara(fecha)
  if (d === 0) return 'Hoy'
  if (d === 1) return 'Mañana'
  if (d <= 7) return `en ${d} días`
  return `en ${d} días`
}

function obtenerNombreLlamamiento(llamamiento, personalizado) {
  if (!llamamiento || llamamiento === 'Ninguno') return null
  if (llamamiento === 'Otro') return personalizado || 'Otro'
  const encontrado = LLAMAMIENTOS.find(l => l.value === llamamiento)
  return encontrado ? encontrado.label : llamamiento
}

function DetalleEventoModal({ evento, userId, userLlamamiento, isPredefinido, onDelete, onClose }) {
  const { asistira, cargar, responder, loading: rsvpLoading } = useAsistencia(evento?.id, userId)
  const [asistentes, setAsistentes] = useState([])
  const [cargandoAsistentes, setCargandoAsistentes] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [creador, setCreador] = useState(null)

  useEffect(() => { if (evento) cargar() }, [evento, cargar])

  useEffect(() => {
    if (!evento) return
    setCreador(null)
    if (evento.creado_por) {
      supabase
        .from('usuarios')
        .select('nombre, apellido, llamamiento, llamamiento_personalizado')
        .eq('id', evento.creado_por)
        .single()
        .then(({ data }) => { if (data) setCreador(data) })
    }
  }, [evento])

  useEffect(() => {
    if (!evento || !isPredefinido) return
    setCargandoAsistentes(true)
    supabase
      .from('asistencia')
      .select('usuario_id, asistira, usuarios!inner (nombre, apellido)')
      .eq('acontecimiento_id', evento.id)
      .then(({ data }) => {
        if (data) setAsistentes(data)
        setCargandoAsistentes(false)
      })
  }, [evento, isPredefinido])

  if (!evento) return null

  const dias = diasPara(evento.fecha_hora)
  const queAsisten = asistentes.filter(a => a.asistira === true)
  const queNoAsisten = asistentes.filter(a => a.asistira === false)
  const nombreLlamamiento = creador
    ? obtenerNombreLlamamiento(creador.llamamiento, creador.llamamiento_personalizado)
    : null
  const puedeEliminar = userLlamamiento === 'Obispo' || evento.creado_por === userId

  return (
    <>
      <Modal open={!!evento} onClose={onClose} title="Detalles del evento">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <Icon size={28}>{getEventIconName(evento.nombre)}</Icon>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1">{evento.nombre}</h3>
              <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                {format(new Date(evento.fecha_hora), "EEEE, d 'de' MMMM '·' HH:mm", { locale: es })}
              </p>
            </div>
            <span className={`inline-flex items-center rounded-full text-xs font-semibold px-2.5 py-1 flex-shrink-0 ${
              dias === 0
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                : dias === 1
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                  : 'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-300'
            }`}>
              {textoDiasRestantes(evento.fecha_hora)}
            </span>
          </div>

          {evento.descripcion && (
            <div className="border-t border-gray-100 dark:border-slate-700 pt-4">
              <p className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Descripción</p>
              <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">{evento.descripcion}</p>
            </div>
          )}

          {nombreLlamamiento && (
            <div className="border-t border-gray-100 dark:border-slate-700 pt-4">
              <p className="text-xs text-gray-400 dark:text-slate-500">
                Creado por <span className="font-medium text-gray-600 dark:text-slate-300">{creador?.nombre} {creador?.apellido}</span> · {nombreLlamamiento}
              </p>
            </div>
          )}

          <div className="border-t border-gray-100 dark:border-slate-700 pt-4">
            <p className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-3">¿Asistirás?</p>
            <div className="flex gap-3">
              <button
                onClick={() => responder(true)}
                disabled={rsvpLoading}
                className={`flex-1 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  asistira === true
                    ? 'bg-warm-600 text-white shadow-md shadow-warm-600/30'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-warm-50 dark:hover:bg-warm-950'
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

          {isPredefinido && (
            <div className="border-t border-gray-100 dark:border-slate-700 pt-4">
              <p className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-3">
                <Icon size={16} className="mr-1">group</Icon>
                Personas que respondieron
              </p>
              {cargandoAsistentes ? (
                <div className="flex justify-center py-3"><Spinner /></div>
              ) : asistentes.length === 0 ? (
                <p className="text-xs text-gray-400 dark:text-slate-500">Nadie ha respondido aún</p>
              ) : (
                <div className="space-y-2">
                  {queAsisten.length > 0 && (
                    <div>
                      <p className="text-xs text-warm-600 dark:text-warm-400 font-medium mb-1">Asistirán ({queAsisten.length})</p>
                      <div className="flex flex-wrap gap-1.5">
                        {queAsisten.map(a => (
                          <span key={a.usuario_id} className="text-xs bg-warm-50 dark:bg-warm-950 text-warm-700 dark:text-warm-300 rounded-full px-2.5 py-1">
                            {a.usuarios.nombre} {a.usuarios.apellido}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {queNoAsisten.length > 0 && (
                    <div>
                      <p className="text-xs text-red-500 dark:text-red-400 font-medium mb-1">No asistirán ({queNoAsisten.length})</p>
                      <div className="flex flex-wrap gap-1.5">
                        {queNoAsisten.map(a => (
                          <span key={a.usuario_id} className="text-xs bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-300 rounded-full px-2.5 py-1">
                            {a.usuarios.nombre} {a.usuarios.apellido}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {puedeEliminar && (
            <div className="border-t border-gray-100 dark:border-slate-700 pt-4">
              <Button variant="danger" fullWidth onClick={() => setShowDeleteConfirm(true)}>
                Eliminar evento
              </Button>
            </div>
          )}
        </div>
      </Modal>

      <Modal open={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} title="Confirmar eliminación">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <p className="text-sm text-gray-700 dark:text-slate-300 mb-1">¿Estás seguro de eliminar</p>
          <p className="font-bold text-gray-900 dark:text-white mb-4">"{evento.nombre}"?</p>
          <p className="text-xs text-gray-400 dark:text-slate-500 mb-6">Esta acción no se puede deshacer</p>
          <div className="flex gap-3">
            <Button variant="ghost" fullWidth onClick={() => setShowDeleteConfirm(false)}>Cancelar</Button>
            <Button variant="danger" fullWidth onClick={() => { onDelete(evento.id); setShowDeleteConfirm(false); onClose() }}>
              Sí, eliminar
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

function getEventIconName(nombre) {
  const n = nombre.toLowerCase()
  if (n.includes('sacramental') || n.includes('reunión')) return 'prayer'
  if (n.includes('bautismo') || n.includes('bautizo')) return 'water_drop'
  if (n.includes('actividad') || n.includes('fiesta')) return 'celebration'
  if (n.includes('conferencia')) return 'book'
  if (n.includes('templo')) return 'account_balance'
  if (n.includes('ensenanza') || n.includes('clase') || n.includes('escuela')) return 'school'
  if (n.includes('ayuno') || n.includes('testimonio')) return 'favorite'
  return 'event'
}

export default function AgendaAcontecimientos({ userId, isPredefinido, userLlamamiento, data: externData }) {
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

  const remindersRef = useRef([])

  useEffect(() => {
    remindersRef.current.forEach(t => clearTimeout(t))
    const timers = []
    const now = Date.now()
    const keyBase = 'iglesia_bv_reminder_'
    eventos.forEach(ev => {
      const eventTime = new Date(ev.fecha_hora).getTime()
      const reminderTime = eventTime - 5 * 60 * 1000
      const delay = reminderTime - now
      if (delay > 0 && delay < 7 * 24 * 60 * 60 * 1000) {
        const sentKey = keyBase + ev.id
        if (getCookie(sentKey)) return
        const timer = setTimeout(() => {
          try { new Notification('Recordatorio', { body: `"${ev.nombre}" comienza en 5 minutos`, icon: '/icono-barrio-sin fondo.svg' }) } catch {}
          setCookie(sentKey, true, 7 * 24 * 60 * 60)
          if (navigator.serviceWorker?.controller) {
            navigator.serviceWorker.controller.postMessage({
              type: 'SCHEDULE_REMINDER',
              id: ev.id,
              nombre: ev.nombre,
              fecha_hora: ev.fecha_hora,
              ahora: now,
            })
          }
        }, delay)
        timers.push(timer)
      }
    })
    remindersRef.current = timers
    return () => timers.forEach(t => clearTimeout(t))
  }, [eventos])

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

  function handleEliminar(id) {
    eliminar(id, userLlamamiento)
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
        <Card className="mb-4 !border-warm-200 dark:!border-warm-700 !bg-warm-50 dark:!bg-slate-800">
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
                className="w-full rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white px-4 py-2.5 text-sm placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-warm-500/40 focus:border-warm-500 transition-colors resize-none"
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
            <div key={ev.id} onClick={() => setEventoSeleccionado(ev)} className="w-full text-left cursor-pointer">
              <Card className="!p-4 flex items-center gap-3 overflow-hidden animate-fade-up hover:shadow-md dark:hover:shadow-slate-900/50 transition-shadow" style={{ animationDelay: `${i * 0.08}s` }}>
                <span className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-xl bg-warm-50 dark:bg-warm-950 text-warm-500 dark:text-warm-400"><Icon size={20}>{getEventIconName(ev.nombre)}</Icon></span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-slate-100 text-sm truncate">{ev.nombre}</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                    {format(new Date(ev.fecha_hora), "d 'de' MMMM '·' HH:mm", { locale: es })}
                  </p>
                </div>
                <span className={`flex-shrink-0 text-xs font-medium rounded-full px-2 py-0.5 ${
                  diasPara(ev.fecha_hora) === 0
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                    : diasPara(ev.fecha_hora) === 1
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                      : 'bg-gray-100 text-gray-500 dark:bg-slate-700 dark:text-slate-400'
                }`}>
                  {textoDiasRestantes(ev.fecha_hora)}
                </span>
              </Card>
            </div>
          ))}
        </div>
      )}

      <DetalleEventoModal
        evento={eventoSeleccionado}
        userId={userId}
        userLlamamiento={userLlamamiento}
        isPredefinido={isPredefinido}
        onDelete={handleEliminar}
        onClose={() => setEventoSeleccionado(null)}
      />
    </section>
  )
}
