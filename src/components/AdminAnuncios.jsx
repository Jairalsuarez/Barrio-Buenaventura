import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import Card from './ui/Card'
import Button from './ui/Button'
import Input from './ui/Input'
import Spinner from './ui/Spinner'

export default function AdminAnuncios({ userId }) {
  const [anuncios, setAnuncios] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ titulo: '', contenido: '', detalle: '', fecha_label: '' })
  const [creando, setCreando] = useState(false)

  useEffect(() => {
    cargar()
  }, [])

  async function cargar() {
    setLoading(true)
    const { data } = await supabase
      .from('anuncios')
      .select('*')
      .order('orden', { ascending: true })
      .order('created_at', { ascending: false })
    if (data) setAnuncios(data)
    setLoading(false)
  }

  async function handleCrear(e) {
    e.preventDefault()
    if (!form.titulo.trim() || !form.contenido.trim()) return
    setCreando(true)
    try {
      await supabase.from('anuncios').insert({
        titulo: form.titulo.trim(),
        contenido: form.contenido.trim(),
        detalle: form.detalle.trim() || null,
        fecha_label: form.fecha_label.trim() || 'Permanente',
        creado_por: userId,
      })
      setForm({ titulo: '', contenido: '', detalle: '', fecha_label: '' })
      setShowForm(false)
      cargar()
    } catch (err) {
      console.error(err)
    }
    setCreando(false)
  }

  async function handleEliminar(id) {
    if (!confirm('¿Eliminar este anuncio?')) return
    await supabase.from('anuncios').delete().eq('id', id)
    setAnuncios(prev => prev.filter(a => a.id !== id))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500 dark:text-slate-400">{anuncios.length} anuncios</p>
        <Button variant="primary" size="sm" onClick={() => setShowForm(!showForm)} className="!py-2 !px-3 !text-xs">
          {showForm ? 'Cancelar' : '+ Nuevo anuncio'}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-4 !border-warm-200 dark:!border-slate-600 !bg-warm-50 dark:!bg-slate-800">
          <form onSubmit={handleCrear} className="space-y-3">
            <Input label="Título" name="titulo" placeholder="Ej: Actividad de Barrio" value={form.titulo} onChange={e => setForm(p => ({ ...p, titulo: e.target.value }))} />
            <Input label="Etiqueta de fecha" name="fecha_label" placeholder="Ej: Permanente, Cada lunes, 15 de junio" value={form.fecha_label} onChange={e => setForm(p => ({ ...p, fecha_label: e.target.value }))} />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Resumen</label>
              <textarea rows={2} placeholder="Texto breve para la tarjeta..." value={form.contenido} onChange={e => setForm(p => ({ ...p, contenido: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white px-4 py-2.5 text-sm placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-warm-500/40 transition-colors resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Detalle</label>
              <textarea rows={4} placeholder="Contenido completo del anuncio..." value={form.detalle} onChange={e => setForm(p => ({ ...p, detalle: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white px-4 py-2.5 text-sm placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-warm-500/40 transition-colors resize-none" />
            </div>
            <Button type="submit" fullWidth disabled={creando}>{creando ? 'Creando...' : 'Crear anuncio'}</Button>
          </form>
        </Card>
      )}

      {loading ? (
        <div className="flex justify-center py-8"><Spinner /></div>
      ) : anuncios.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">No hay anuncios aún</p>
      ) : (
        <div className="space-y-2">
          {anuncios.map(a => (
            <Card key={a.id} className="!p-3 flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-wider text-[#8c6a43]/60 dark:text-[#c6a27b]/60 font-semibold">{a.fecha_label}</span>
                </div>
                <p className="font-medium text-gray-900 dark:text-white text-sm truncate mt-0.5">{a.titulo}</p>
                <p className="text-xs text-gray-500 dark:text-slate-400 truncate">{a.contenido}</p>
              </div>
              <button onClick={() => handleEliminar(a.id)}
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
  )
}
