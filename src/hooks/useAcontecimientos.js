import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'

export function useAcontecimientos(userId) {
  const [eventos, setEventos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const mounted = useRef(false)

  const cargar = useCallback(async () => {
    const { data, error: err } = await supabase
      .from('acontecimientos')
      .select('*')
      .gte('fecha_hora', new Date().toISOString())
      .order('fecha_hora', { ascending: true })
      .limit(20)

    if (err) throw err
    return data || []
  }, [])

  useEffect(() => {
    mounted.current = true
    cargar()
      .then(data => { if (mounted.current) { setEventos(data); setLoading(false) } })
      .catch(err => { if (mounted.current) { setError(err.message); setLoading(false) } })
    return () => { mounted.current = false }
  }, [cargar])

  const crear = useCallback(async (nombre, fechaHora, descripcion) => {
    try {
      const fecha = new Date(fechaHora)
      const inicioDia = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate())
      const finDia = new Date(inicioDia)
      finDia.setDate(finDia.getDate() + 1)

      const { data: existentes } = await supabase
        .from('acontecimientos')
        .select('id, nombre, fecha_hora')
        .eq('nombre', nombre.trim())
        .gte('fecha_hora', inicioDia.toISOString())
        .lt('fecha_hora', finDia.toISOString())
        .limit(1)

      if (existentes && existentes.length > 0) {
        setError('Ya existe un evento con ese nombre en esa fecha')
        return null
      }

      const isoFecha = fecha.toISOString()
      const { data, error: err } = await supabase
        .from('acontecimientos')
        .insert({
          nombre: nombre.trim(),
          fecha_hora: isoFecha,
          descripcion: descripcion?.trim() || null,
          creado_por: userId,
        })
        .select()
        .single()

      if (err) { console.error('[crear] supabase error:', err); throw err }
      setEventos(prev => {
        if (prev.some(e => e.id === data.id)) return prev
        return [...prev, data].sort((a, b) =>
          new Date(a.fecha_hora) - new Date(b.fecha_hora)
        )
      })
      return data
    } catch (err) {
      console.error('[crear] catch:', err)
      setError(err.message)
      return null
    }
  }, [userId])

  const eliminar = useCallback(async (id, userLlamamiento) => {
    try {
      const evento = eventos.find(e => e.id === id)
      if (!evento) return false

      if (userLlamamiento !== 'Obispo' && evento.creado_por !== userId) {
        setError('No tienes permiso para eliminar este evento')
        return false
      }

      const { error: err } = await supabase
        .from('acontecimientos')
        .delete()
        .eq('id', id)

      if (err) throw err
      setEventos(prev => prev.filter(e => e.id !== id))
      return true
    } catch (err) {
      setError(err.message)
      return false
    }
  }, [userId, eventos])

  return { eventos, loading, error, crear, eliminar, recargar: cargar }
}
