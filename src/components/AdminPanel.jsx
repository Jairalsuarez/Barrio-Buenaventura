import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { supabase } from '../lib/supabase'
import { esLlamamientoPredefinido } from '../lib/session'
import Card from './ui/Card'
import Button from './ui/Button'
import Input from './ui/Input'
import Icon from './ui/Icon'
import Spinner from './ui/Spinner'
import AdminMiembros from './AdminMiembros'
import AdminAnuncios from './AdminAnuncios'
import AdminOrganizaciones from './AdminOrganizaciones'
import AdminConfiguracion from './AdminConfiguracion'

function getTabsForRole(llamamiento) {
  const esPredefinido = esLlamamientoPredefinido(llamamiento)
  if (!esPredefinido) return []

  const isObispo = llamamiento === 'Obispo'
  const isConsejero = llamamiento === 'Primer Consejero' || llamamiento === 'Segundo Consejero'
  const isSecretario = llamamiento === 'Secretario de Barrio'
  const esPresidente = llamamiento.startsWith('President')

  const tabs = [{ id: 'eventos', label: 'Eventos' }]

  if (isObispo || isConsejero || isSecretario) {
    tabs.push({ id: 'miembros', label: 'Miembros' })
    tabs.push({ id: 'anuncios', label: 'Anuncios' })
  }

  if (isObispo || esPresidente) {
    tabs.push({ id: 'organizacion', label: 'Organización' })
  }

  tabs.push({ id: 'feedback', label: 'Feedback' })

  if (isObispo) {
    tabs.push({ id: 'configuracion', label: 'Configuración' })
  }

  return tabs
}

export default function AdminPanel({ eventos, loading, error, crear, eliminar, userLlamamiento, userId, isPredefinido }) {
  const [tab, setTab] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ nombre: '', fecha_hora: '', descripcion: '' })
  const [creando, setCreando] = useState(false)
  const [feedbacks, setFeedbacks] = useState([])
  const [loadingFeedback, setLoadingFeedback] = useState(false)

  const tabs = getTabsForRole(userLlamamiento)

  useEffect(() => {
    if (tabs.length > 0 && !tab) setTab(tabs[0].id)
  }, [tabs, tab])

  useEffect(() => {
    if (tab === 'feedback' && isPredefinido) {
      setLoadingFeedback(true)
      supabase
        .from('feedback')
        .select('*, usuarios!left(nombre, apellido)')
        .order('created_at', { ascending: false })
        .limit(50)
        .then(({ data }) => {
          if (data) setFeedbacks(data)
          setLoadingFeedback(false)
        })
    }
  }, [tab, isPredefinido])

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

  if (!isPredefinido) return null

  return (
    <section className="px-5 py-8 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Icon size={28} fill>settings</Icon>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Administración</h2>
      </div>

      {tabs.length > 1 && (
        <div className="flex gap-1 bg-gray-100 dark:bg-slate-800 rounded-2xl p-1 mb-6 overflow-x-auto">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-1 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 whitespace-nowrap ${
                tab === t.id ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300'
              }`}>
              {t.label}
            </button>
          ))}
        </div>
      )}

      {tab === 'eventos' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500 dark:text-slate-400">{eventos.length} eventos</p>
            <Button variant="primary" size="sm" onClick={() => setShowForm(!showForm)} className="!py-2 !px-3 !text-xs">
              {showForm ? 'Cancelar' : '+ Nuevo evento'}
            </Button>
          </div>

          {showForm && (
            <Card className="mb-4 !border-warm-200 dark:!border-slate-600 !bg-warm-50 dark:!bg-slate-800">
              <form onSubmit={handleCrear} className="space-y-3">
                <Input label="Nombre" name="nombre" placeholder="Ej: Reunión de Barrio" value={form.nombre} onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))} />
                <Input label="Fecha y hora" name="fecha_hora" type="datetime-local" value={form.fecha_hora} onChange={e => setForm(p => ({ ...p, fecha_hora: e.target.value }))} />
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Descripción</label>
                  <textarea rows={3} placeholder="Describe el evento..." value={form.descripcion} onChange={e => setForm(p => ({ ...p, descripcion: e.target.value }))}
                    className="w-full rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white px-4 py-2.5 text-sm placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-warm-500/40 focus:border-warm-500 transition-colors resize-none" />
                </div>
                <Button type="submit" fullWidth disabled={creando}>{creando ? 'Creando...' : 'Crear evento'}</Button>
              </form>
            </Card>
          )}

          {loading ? (
            <div className="flex justify-center py-8"><Spinner /></div>
          ) : error ? (
            <p className="text-sm text-red-500 text-center py-4">{error}</p>
          ) : eventos.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No hay eventos próximos</p>
          ) : (
            <div className="space-y-2">
              {eventos.map(ev => (
                <Card key={ev.id} className="!p-3 flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{ev.nombre}</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">
                      {format(new Date(ev.fecha_hora), "d 'de' MMMM '·' HH:mm", { locale: es })}
                    </p>
                  </div>
                  <button onClick={() => eliminar(ev.id, userLlamamiento)}
                    className="text-red-400 hover:text-red-600 transition-colors p-2 flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'miembros' && <AdminMiembros userId={userId} userLlamamiento={userLlamamiento} />}

      {tab === 'anuncios' && <AdminAnuncios userId={userId} />}

      {tab === 'organizacion' && <AdminOrganizaciones userLlamamiento={userLlamamiento} />}

      {tab === 'feedback' && (
        <div>
          <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">Comentarios de la comunidad</p>
          {loadingFeedback ? (
            <div className="flex justify-center py-8"><Spinner /></div>
          ) : feedbacks.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No hay feedback aún</p>
          ) : (
            <div className="space-y-2">
              {feedbacks.map(fb => (
                <Card key={fb.id} className="!p-3">
                  <p className="text-sm text-gray-700 dark:text-slate-300">{fb.mensaje}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-400 dark:text-slate-500">
                      {fb.usuarios ? `${fb.usuarios.nombre} ${fb.usuarios.apellido}` : 'Anónimo'}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {format(new Date(fb.created_at), "d 'de' MMMM, HH:mm", { locale: es })}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'configuracion' && <AdminConfiguracion />}
    </section>
  )
}
