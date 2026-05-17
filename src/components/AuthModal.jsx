import { useState } from 'react'
import Button from './ui/Button'
import Input from './ui/Input'
import Select from './ui/Select'
import { LLAMAMIENTOS, esLlamamientoPredefinido } from '../lib/session'
import { validarNombre, validarTelefono, validarLlamamientoPersonalizado, sanitizarNombre } from '../lib/validacion'

function validarFormulario(datos) {
  const errores = {}
  const errNombre = validarNombre(datos.nombre, 'nombre')
  if (errNombre) errores.nombre = errNombre
  const errApellido = validarNombre(datos.apellido, 'apellido')
  if (errApellido) errores.apellido = errApellido
  if (!datos.fecha_nacimiento) errores.fecha_nacimiento = 'La fecha de nacimiento es obligatoria'
  if (datos.llamamiento && esLlamamientoPredefinido(datos.llamamiento)) {
    const errTel = validarTelefono(datos.telefono)
    if (errTel) errores.telefono = errTel
  }
  if (datos.llamamiento === 'Otro') {
    const errLlam = validarLlamamientoPersonalizado(datos.llamamiento_personalizado)
    if (errLlam) errores.llamamiento_personalizado = errLlam
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

  function sanitizeAndSet(name, raw) {
    const soloLetras = raw.replace(/[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]/g, '')
    setForm(prev => ({ ...prev, [name]: soloLetras }))
    setErrores(prev => ({ ...prev, [name]: '' }))
  }

  function handleChange(e) {
    const { name, value } = e.target
    if (name === 'nombre' || name === 'apellido') {
      sanitizeAndSet(name, value)
    } else if (name === 'llamamiento_personalizado') {
      sanitizeAndSet(name, value)
    } else {
      setForm(prev => ({ ...prev, [name]: value }))
      setErrores(prev => ({ ...prev, [name]: '' }))
    }
  }

  function handleBlur(e) {
    const { name, value } = e.target
    if (name === 'nombre') {
      const err = validarNombre(value, 'nombre')
      setErrores(prev => ({ ...prev, nombre: err }))
    }
    if (name === 'apellido') {
      const err = validarNombre(value, 'apellido')
      setErrores(prev => ({ ...prev, apellido: err }))
    }
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
    const formData = {
      ...form,
      nombre: sanitizarNombre(form.nombre),
      apellido: sanitizarNombre(form.apellido),
      llamamiento_personalizado: sanitizarNombre(form.llamamiento_personalizado),
    }
    const v = validarFormulario(formData)
    setErrores(v)
    if (Object.keys(v).length > 0) return
    await onRegister(formData)
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-warm-50 dark:bg-slate-950">
      <div className="flex-1 flex flex-col justify-center px-6 max-w-sm mx-auto w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-church-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-church-600/20 dark:shadow-church-600/40 overflow-hidden">
            <img src="/icono-barrio-sin fondo.svg" alt="Barrio Buenaventura" className="w-full h-full object-cover" />
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
              onBlur={handleBlur}
              error={errores.nombre}
              autoComplete="given-name"
            />
            <Input
              label="Apellido"
              name="apellido"
              placeholder="Tu apellido"
              value={form.apellido}
              onChange={handleChange}
              onBlur={handleBlur}
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
                    error={errores.llamamiento_personalizado}
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
