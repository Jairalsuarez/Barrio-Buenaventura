import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useCumpleanos() {
  const [cumpleaneros, setCumpleaneros] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function fetch() {
      try {
        const { data, error } = await supabase.rpc('cumpleanhos_proximos')
        if (error) throw error
        if (mounted) setCumpleaneros(data || [])
      } catch {
        if (mounted) setCumpleaneros([])
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetch()
    return () => { mounted = false }
  }, [])

  const hoy = cumpleaneros.filter(c => c.dias_restantes === 0)
  const proximos = cumpleaneros.filter(c => c.dias_restantes > 0)

  return { cumpleaneros, hoy, proximos, loading }
}
