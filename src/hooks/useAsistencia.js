import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useAsistencia(eventoId, userId) {
  const [asistira, setAsistira] = useState(null)
  const [loading, setLoading] = useState(false)

  const cargar = useCallback(async () => {
    if (!eventoId || !userId) return
    const { data } = await supabase
      .from('asistencia')
      .select('asistira')
      .eq('acontecimiento_id', eventoId)
      .eq('usuario_id', userId)
      .maybeSingle()
    if (data) setAsistira(data.asistira)
  }, [eventoId, userId])

  const responder = useCallback(async (valor) => {
    if (!eventoId || !userId) return
    setLoading(true)
    const { error } = await supabase
      .from('asistencia')
      .upsert({
        acontecimiento_id: eventoId,
        usuario_id: userId,
        asistira: valor,
      }, { onConflict: 'acontecimiento_id,usuario_id' })
    if (!error) setAsistira(valor)
    setLoading(false)
  }, [eventoId, userId])

  return { asistira, loading, cargar, responder }
}
