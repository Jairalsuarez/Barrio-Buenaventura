import { useState } from 'react'
import { LLAMAMIENTOS } from '../lib/session'

export default function AuthModal({ onLogin, onRegister, onClose, loading, error }) {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({
    email: '', password: '', confirmPassword: '',
    nombre: '', apellido: '', fecha_nacimiento: '',
    telefono: '', llamamiento: 'Ninguno', llamamiento_personalizado: '',
  })

  function handleChange(key, value) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (mode === 'login') {
      onLogin(form.email, form.password)
    } else {
      if (form.password !== form.confirmPassword) return
      onRegister(form.email, form.password, {
        nombre: form.nombre,
        apellido: form.apellido,
        fecha_nacimiento: form.fecha_nacimiento,
        telefono: form.telefono,
        llamamiento: form.llamamiento,
        llamamiento_personalizado: form.llamamiento === 'Otro' ? form.llamamiento_personalizado : null,
      })
    }
  }

  const valido = mode === 'login'
    ? form.email && form.password
    : form.email && form.password && form.confirmPassword && form.password === form.confirmPassword
      && form.nombre && form.apellido && form.fecha_nacimiento

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-3xl bg-[#faf7f2] dark:bg-[#18181b] shadow-2xl overflow-hidden">
        <div className="relative px-6 pt-8 pb-6">
          <button onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <span className="material-symbols-outlined" style={{ fontSize: 22 }}>close</span>
          </button>

          <div className="flex justify-center mb-6">
            <img src="/icono-barrio-sin fondo.svg" alt="" className="h-12 w-12 object-contain opacity-80" />
          </div>

          <div className="flex bg-gray-100 dark:bg-slate-800 rounded-2xl p-1 mb-6">
            <button onClick={() => setMode('login')}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                mode === 'login' ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-slate-400 hover:text-gray-700'
              }`}>Iniciar sesión</button>
            <button onClick={() => setMode('register')}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                mode === 'register' ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-slate-400 hover:text-gray-700'
              }`}>Registrarse</button>
          </div>

          {error && (
            <div className="mb-4 px-3 py-2 rounded-xl bg-red-100 dark:bg-red-900/30 text-xs font-medium text-red-600 dark:text-red-400 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <input type="email" placeholder="Correo electrónico" value={form.email} onChange={e => handleChange('email', e.target.value)}
              className="w-full rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white px-4 py-2.5 text-sm placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-warm-500/40 transition-colors" required />

            <input type="password" placeholder="Contraseña" value={form.password} onChange={e => handleChange('password', e.target.value)}
              className="w-full rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white px-4 py-2.5 text-sm placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-warm-500/40 transition-colors" required />

            {mode === 'register' && (
              <>
                <input type="password" placeholder="Confirmar contraseña" value={form.confirmPassword} onChange={e => handleChange('confirmPassword', e.target.value)}
                  className="w-full rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white px-4 py-2.5 text-sm placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-warm-500/40 transition-colors" required />

                <div className="border-t border-gray-200 dark:border-slate-700 pt-3">
                  <p className="text-xs font-medium text-gray-500 dark:text-slate-400 mb-2">Datos del miembro</p>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" placeholder="Nombre" value={form.nombre} onChange={e => handleChange('nombre', e.target.value)}
                      className="w-full rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white px-4 py-2.5 text-sm placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-warm-500/40 transition-colors" required />
                    <input type="text" placeholder="Apellido" value={form.apellido} onChange={e => handleChange('apellido', e.target.value)}
                      className="w-full rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white px-4 py-2.5 text-sm placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-warm-500/40 transition-colors" required />
                  </div>
                  <input type="date" value={form.fecha_nacimiento} onChange={e => handleChange('fecha_nacimiento', e.target.value)}
                    className="mt-2 w-full rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-warm-500/40 transition-colors" required />

                  <input type="tel" placeholder="Teléfono (opcional)" value={form.telefono} onChange={e => handleChange('telefono', e.target.value)}
                    className="mt-2 w-full rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white px-4 py-2.5 text-sm placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-warm-500/40 transition-colors" />

                  <select value={form.llamamiento} onChange={e => handleChange('llamamiento', e.target.value)}
                    className="mt-2 w-full rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-warm-500/40 transition-colors">
                    <option value="Ninguno">Sin llamamiento</option>
                    {LLAMAMIENTOS.map(l => (
                      <option key={l.value} value={l.value}>{l.label}</option>
                    ))}
                  </select>

                  {form.llamamiento === 'Otro' && (
                    <input type="text" placeholder="Describa su llamamiento..." value={form.llamamiento_personalizado} onChange={e => handleChange('llamamiento_personalizado', e.target.value)}
                      className="mt-2 w-full rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white px-4 py-2.5 text-sm placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-warm-500/40 transition-colors" />
                  )}
                </div>
              </>
            )}

            <button type="submit" disabled={!valido || loading}
              className="w-full py-3 rounded-xl bg-[#8c6a43] text-white text-sm font-bold hover:bg-[#a0784d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Cargando...' : mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
