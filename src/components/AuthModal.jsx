import { useState } from 'react'
import Button from './ui/Button'
import Input from './ui/Input'
import Select from './ui/Select'
import { LLAMAMIENTOS, esLlamamientoPredefinido } from '../lib/session'

function validarFormulario(datos) {
  const errores = {}
  if (!datos.nombre.trim()) errores.nombre = 'El nombre es obligatorio'
  if (!datos.apellido.trim()) errores.apellido = 'El apellido es obligatorio'
  if (!datos.fecha_nacimiento) errores.fecha_nacimiento = 'La fecha de nacimiento es obligatoria'
  if (datos.llamamiento && esLlamamientoPredefinido(datos.llamamiento) && !datos.telefono.trim()) {
    errores.telefono = 'El teléfono es obligatorio para este llamamiento'
  }
  return errores
}

export default function AuthModal({ onRegister, onGuest, loading, error }) {
  const [tieneLlamamiento, setTieneLlamamiento] = useState(false)
  const [form, setForm] = useState({
    nombre: '', apellido: '', fecha_nacimiento: '',
    telefono: '', llamamiento: '', llamamiento_personalizado: '',
  })
  const [errores, setErrores] = useState({})

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setErrores(prev => ({ ...prev, [name]: '' }))
  }

  function handleLlamamientoToggle(e) {
    const checked = e.target.checked
    setTieneLlamamiento(checked)
    if (!checked) {
      setForm(prev => ({ ...prev, llamamiento: '', telefono: '', llamamiento_personalizado: '' }))
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const v = validarFormulario(form)
    setErrores(v)
    if (Object.keys(v).length > 0) return
    await onRegister(form)
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-warm-50 dark:bg-slate-950">
      <div className="flex-1 flex flex-col justify-center px-6 max-w-sm mx-auto w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-church-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-church-600/20 dark:shadow-church-600/40">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Barrio Buenaventura</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Comunidad y fe en unidad</p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm rounded-xl px-4 py-3 mb-4">
            {error}
          </div>
        )}

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm dark:shadow-slate-900/50 p-6">
          <p className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-4">Regístrate para ser parte de la comunidad</p>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <Input
              label="Nombre"
              name="nombre"
              placeholder="Tu nombre"
              value={form.nombre}
              onChange={handleChange}
              error={errores.nombre}
              autoComplete="given-name"
            />
            <Input
              label="Apellido"
              name="apellido"
              placeholder="Tu apellido"
              value={form.apellido}
              onChange={handleChange}
              error={errores.apellido}
              autoComplete="family-name"
            />
            <Input
              label="Fecha de Nacimiento"
              name="fecha_nacimiento"
              type="date"
              value={form.fecha_nacimiento}
              onChange={handleChange}
              error={errores.fecha_nacimiento}
            />

            <div className="flex items-center gap-3 pt-1">
              <input
                type="checkbox"
                id="tieneLlamamiento"
                checked={tieneLlamamiento}
                onChange={handleLlamamientoToggle}
                className="w-4 h-4 rounded border-gray-300 dark:border-slate-600 text-church-600 focus:ring-church-500 dark:bg-slate-700"
              />
              <label htmlFor="tieneLlamamiento" className="text-sm text-gray-700 dark:text-slate-300 font-medium">
                ¿Tienes un llamamiento?
              </label>
            </div>

            {tieneLlamamiento && (
              <>
                <Select
                  label="Llamamiento"
                  name="llamamiento"
                  placeholder="Selecciona tu llamamiento"
                  options={LLAMAMIENTOS}
                  value={form.llamamiento}
                  onChange={handleChange}
                />
                {form.llamamiento === 'Otro' && (
                  <Input
                    label="Especifica tu llamamiento"
                    name="llamamiento_personalizado"
                    placeholder="Ej: Director de música"
                    value={form.llamamiento_personalizado}
                    onChange={handleChange}
                  />
                )}
                {esLlamamientoPredefinido(form.llamamiento) && (
                  <>
                    <Input
                      label="Teléfono"
                      name="telefono"
                      type="tel"
                      placeholder="+593 99 999 9999"
                      value={form.telefono}
                      onChange={handleChange}
                      error={errores.telefono}
                    />
                    <p className="text-xs text-church-600 dark:text-church-400 bg-church-50 dark:bg-church-950 rounded-lg px-3 py-2">
                      El teléfono es importante para que la presidencia pueda contactarte rápidamente.
                    </p>
                  </>
                )}
              </>
            )}

            <Button type="submit" fullWidth disabled={loading}>
              {loading ? 'Registrando...' : 'Registrarme'}
            </Button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-slate-600" /></div>
            <div className="relative flex justify-center"><span className="bg-white dark:bg-slate-800 px-3 text-xs text-gray-400 dark:text-slate-500">o</span></div>
          </div>

          <Button variant="ghost" fullWidth onClick={onGuest}>
            Entrar como invitado
          </Button>
        </div>

        <p className="text-center text-xs text-gray-400 dark:text-slate-500 mt-6">
          Tu sesión quedará abierta en este dispositivo
        </p>
      </div>
    </div>
  )
}
