import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { getSession, setSession, clearSession, isGuest, setGuest, esLlamamientoPredefinido } from '../lib/session'

export function useAuth() {
  const stored = getSession()
  const [user, setUser] = useState(() => stored)
  const [guest, setGuestState] = useState(() => !stored && isGuest())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const register = useCallback(async (datos) => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: err } = await supabase
        .rpc('insertar_usuario_seguro', {
          p_nombre: datos.nombre.trim(),
          p_apellido: datos.apellido.trim(),
          p_fecha_nacimiento: datos.fecha_nacimiento,
          p_telefono: datos.telefono || null,
          p_llamamiento: datos.llamamiento || 'Ninguno',
          p_llamamiento_personalizado: datos.llamamiento_personalizado || null,
          p_tipo_perfil: 'miembro',
        })

      if (err) throw err
      if (!data) {
        setError('Error al crear el registro. Intenta de nuevo.')
        return null
      }

      const { data: userData, error: fetchErr } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', data)
        .single()

      if (fetchErr) throw fetchErr

      setSession(userData)
      setUser(userData)
      setGuestState(false)
      return userData
    } catch (err) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const loginAsGuest = useCallback(() => {
    setGuest()
    setGuestState(true)
    setUser(null)
  }, [])

  const logout = useCallback(() => {
    clearSession()
    setUser(null)
    setGuestState(false)
  }, [])

  const isPredefinido = user ? esLlamamientoPredefinido(user.llamamiento) : false

  return {
    user,
    guest,
    loading,
    error,
    isPredefinido,
    register,
    loginAsGuest,
    logout,
  }
}
