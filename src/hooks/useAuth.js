import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { esLlamamientoPredefinido } from '../lib/session'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s)
      if (s?.user) {
        cargarUsuario(s.user.id).then(u => {
          setUser(u)
          setLoading(false)
        })
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
      if (s?.user) {
        cargarUsuario(s.user.id).then(setUser)
      } else {
        setUser(null)
      }
    })

    return () => subscription?.unsubscribe()
  }, [])

  async function cargarUsuario(authUserId) {
    const { data } = await supabase
      .from('usuarios')
      .select('*')
      .eq('auth_user_id', authUserId)
      .maybeSingle()
    return data
  }

  const register = useCallback(async (email, password, profile) => {
    setLoading(true)
    setError(null)
    try {
      const { data: authData, error: authErr } = await supabase.auth.signUp({
        email,
        password,
      })
      if (authErr) throw authErr
      if (!authData.user) throw new Error('Error al crear la cuenta')

      const { error: linkErr } = await supabase.rpc('vincular_usuario_auth', {
        p_nombre: profile.nombre.trim(),
        p_apellido: profile.apellido.trim(),
        p_fecha_nacimiento: profile.fecha_nacimiento,
      })
      if (linkErr) throw linkErr

      const { error: updateErr } = await supabase
        .from('usuarios')
        .update({
          telefono: profile.telefono || null,
          llamamiento: profile.llamamiento || 'Ninguno',
          llamamiento_personalizado: profile.llamamiento_personalizado || null,
        })
        .eq('auth_user_id', authData.user.id)
      if (updateErr) throw updateErr

      const usuario = await cargarUsuario(authData.user.id)
      setUser(usuario)
      return usuario
    } catch (err) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const login = useCallback(async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: authErr } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (authErr) throw authErr
      if (!data.user) throw new Error('Error al iniciar sesión')

      const usuario = await cargarUsuario(data.user.id)
      setUser(usuario)
      return usuario
    } catch (err) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
  }, [])

  const isPredefinido = user ? esLlamamientoPredefinido(user.llamamiento) : false

  return {
    user,
    session,
    loading,
    error,
    isPredefinido,
    register,
    login,
    logout,
  }
}
