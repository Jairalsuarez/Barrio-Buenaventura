import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { LLAMAMIENTOS } from '../lib/session'
import Spinner from './ui/Spinner'
import Card from './ui/Card'
import Icon from './ui/Icon'

const LLAMAMIENTOS_SIN_OTRO = LLAMAMIENTOS.filter(l => l.value !== 'Otro')

function calcularEdad(fecha) {
  const hoy = new Date()
  const nac = new Date(fecha)
  let edad = hoy.getFullYear() - nac.getFullYear()
  const m = hoy.getMonth() - nac.getMonth()
  if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--
  return edad
}

export default function AdminMiembros({ userId, userLlamamiento }) {
  const [miembros, setMiembros] = useState([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [editando, setEditando] = useState(null)
  const [editForm, setEditForm] = useState({ telefono: '', llamamiento: '', llamamiento_personalizado: '' })
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState(null)

  const puedeEditar = ['Obispo', 'Primer Consejero', 'Segundo Consejero', 'Secretario de Barrio'].includes(userLlamamiento)
  const soloObispoCambiarLlamamiento = userLlamamiento !== 'Obispo'

  useEffect(() => {
    setLoading(true)
    supabase
      .from('usuarios')
      .select('*')
      .order('apellido', { ascending: true })
      .order('nombre', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) setMiembros(data)
        setLoading(false)
      })
  }, [])

  function iniciarEdicion(m) {
    setEditando(m.id)
    setEditForm({
      telefono: m.telefono || '',
      llamamiento: m.llamamiento || 'Ninguno',
      llamamiento_personalizado: m.llamamiento_personalizado || '',
    })
    setMensaje(null)
  }

  async function guardarEdicion() {
    if (!editando) return
    setGuardando(true)
    setMensaje(null)
    try {
      const updates = { telefono: editForm.telefono || null }
      if (!soloObispoCambiarLlamamiento) {
        updates.llamamiento = editForm.llamamiento
        updates.llamamiento_personalizado = editForm.llamamiento === 'Otro' ? editForm.llamamiento_personalizado || null : null
      }
      const { error } = await supabase
        .from('usuarios')
        .update(updates)
        .eq('id', editando)
      if (error) throw error
      setMiembros(prev => prev.map(m => m.id === editando ? { ...m, ...updates } : m))
      setMensaje({ tipo: 'exito', texto: 'Guardado correctamente' })
      setEditando(null)
    } catch (err) {
      setMensaje({ tipo: 'error', texto: err.message })
    }
    setGuardando(false)
  }

  const filtrados = miembros.filter(m => {
    if (!busqueda.trim()) return true
    const q = busqueda.toLowerCase()
    return m.nombre.toLowerCase().includes(q) || m.apellido.toLowerCase().includes(q)
  })

  if (loading) return <div className="flex justify-center py-8"><Spinner /></div>

  return (
    <div>
      <div className="relative mb-4">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" style={{ fontSize: 18 }}>search</span>
        <input
          type="text" placeholder="Buscar miembro..." value={busqueda} onChange={e => setBusqueda(e.target.value)}
          className="w-full rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white pl-9 pr-4 py-2.5 text-sm placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-warm-500/40 transition-colors"
        />
      </div>

      {mensaje && (
        <div className={`mb-3 px-3 py-2 rounded-xl text-xs font-medium ${mensaje.tipo === 'exito' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'}`}>
          {mensaje.texto}
        </div>
      )}

      {filtrados.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">No se encontraron miembros</p>
      ) : (
        <div className="space-y-2">
          {filtrados.map(m => {
            const editandoEste = editando === m.id
            return (
              <Card key={m.id} className={`!p-3 ${editandoEste ? '!border-warm-400 dark:!border-warm-600' : ''}`}>
                {editandoEste ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm text-gray-900 dark:text-white">{m.nombre} {m.apellido}</span>
                      <button onClick={() => setEditando(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
                      </button>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">Teléfono</label>
                      <input type="tel" value={editForm.telefono} onChange={e => setEditForm(p => ({ ...p, telefono: e.target.value }))}
                        className="w-full rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-warm-500/40"
                      />
                    </div>
                    {!soloObispoCambiarLlamamiento && (
                      <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">Llamamiento</label>
                        <select value={editForm.llamamiento} onChange={e => setEditForm(p => ({ ...p, llamamiento: e.target.value }))}
                          className="w-full rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-warm-500/40">
                          <option value="Ninguno">Ninguno</option>
                          {LLAMAMIENTOS_SIN_OTRO.map(l => (
                            <option key={l.value} value={l.value}>{l.label}</option>
                          ))}
                        </select>
                        {editForm.llamamiento === 'Otro' && (
                          <input type="text" value={editForm.llamamiento_personalizado} onChange={e => setEditForm(p => ({ ...p, llamamiento_personalizado: e.target.value }))}
                            placeholder="Describa el llamamiento..." maxLength={200}
                            className="mt-2 w-full rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-warm-500/40"
                          />
                        )}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <button onClick={guardarEdicion} disabled={guardando}
                        className="flex-1 py-2 rounded-xl bg-[#8c6a43] text-white text-xs font-semibold hover:bg-[#a0784d] transition-colors disabled:opacity-50">
                        {guardando ? 'Guardando...' : 'Guardar'}
                      </button>
                      <button onClick={() => setEditando(null)}
                        className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 text-xs font-semibold hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors">
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#8c6a43]/10 dark:bg-[#8c6a43]/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-[#8c6a43] dark:text-[#c6a27b]">
                        {m.nombre.charAt(0)}{m.apellido.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{m.nombre} {m.apellido}</p>
                      <p className="text-xs text-gray-500 dark:text-slate-400">
                        {m.llamamiento === 'Ninguno' ? 'Miembro' : m.llamamiento === 'Otro' ? (m.llamamiento_personalizado || 'Otro') : m.llamamiento}
                        {m.fecha_nacimiento && <span className="ml-2">· {calcularEdad(m.fecha_nacimiento)} años</span>}
                      </p>
                    </div>
                    {puedeEditar && (
                      <button onClick={() => iniciarEdicion(m)}
                        className="text-gray-400 hover:text-[#8c6a43] dark:hover:text-[#c6a27b] transition-colors p-1">
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>edit</span>
                      </button>
                    )}
                    {m.telefono && (
                      <a href={`tel:${m.telefono}`} className="text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors p-1">
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>call</span>
                      </a>
                    )}
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
