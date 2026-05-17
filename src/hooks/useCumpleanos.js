import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useCumpleanos() {
  const [cumpleaneros, setCumpleaneros] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchCumpleanos = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.rpc('cumpleanhos_proximos')
      if (error) throw error
      setCumpleaneros(data || [])
    } catch {
      setCumpleaneros([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCumpleanos()
  }, [fetchCumpleanos])

  const hoy = cumpleaneros.filter(c => c.dias_restantes === 0)
  const proximos = cumpleaneros.filter(c => c.dias_restantes > 0)

  return { cumpleaneros, hoy, proximos, loading, recargar: fetchCumpleanos }
}
