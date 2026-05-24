import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import Button from './ui/Button'
import Input from './ui/Input'
import Select from './ui/Select'
import { LLAMAMIENTOS, esLlamamientoPredefinido } from '../lib/session'
import { validarNombreCompleto, validarTelefono, validarLlamamientoPersonalizado, sanitizarNombre } from '../lib/validacion'

export default function AuthModal({ onRegister, onLoginExisting, onGuest, loading, error }) {
  const [step, setStep] = useState('nombre')
  const [nombreCompleto, setNombreCompleto] = useState('')
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [fechaNacimiento, setFechaNacimiento] = useState('')
  const [tieneLlamamiento, setTieneLlamamiento] = useState(false)
  const [llamamiento, setLlamamiento] = useState('')
  const [llamamientoPersonalizado, setLlamamientoPersonalizado] = useState('')
  const [telefono, setTelefono] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const [checking, setChecking] = useState(false)

  function handleNombreChange(raw) {
    const soloValido = raw.replace(/[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]/g, '')
    setNombreCompleto(soloValido)
    setErrMsg('')
  }

  async function handleNombreContinue() {
    const err = validarNombreCompleto(nombreCompleto)
    if (err) {
      setErrMsg(err)
      return
    }
    const partes = sanitizarNombre(nombreCompleto).split(' ')
    const nombreVal = partes[0]
    const apellidoVal = partes[1]

    setChecking(true)
    setErrMsg('')
    try {
      const nombreUpper = nombreVal.charAt(0).toUpperCase() + nombreVal.slice(1).toLowerCase()
      const apellidoUpper = apellidoVal.charAt(0).toUpperCase() + apellidoVal.slice(1).toLowerCase()
      const { data, error: searchErr } = await supabase
        .from('usuarios')
        .select('*')
        .eq('nombre', nombreUpper)
        .eq('apellido', apellidoUpper)
        .limit(1)
        .maybeSingle()

      if (searchErr) throw searchErr

      if (data) {
        onLoginExisting(data)
        return
      }

      setNombre(nombreVal)
      setApellido(apellidoVal)
      setStep('cumpleanos')
    } catch (e) {
      setErrMsg('Error al verificar. Intenta de nuevo.')
    } finally {
      setChecking(false)
    }
  }

  function handleCumpleanosContinue() {
    if (!fechaNacimiento) {
      setErrMsg('La fecha de nacimiento es obligatoria')
      return
    }
    const fecha = new Date(fechaNacimiento)
    const hoy = new Date()
    if (fecha > hoy) {
      setErrMsg('La fecha no puede ser futura')
      return
    }
    setErrMsg('')
    setStep('llamamiento')
  }

  function handleLlamamientoToggle(e) {
    const checked = e.target.checked
    setTieneLlamamiento(checked)
    if (!checked) {
      setLlamamiento('')
      setTelefono('')
      setLlamamientoPersonalizado('')
    }
  }

  async function handleRegistrar() {
    const formData = {
      nombre: sanitizarNombre(nombre),
      apellido: sanitizarNombre(apellido),
      fecha_nacimiento: fechaNacimiento,
      telefono: telefono || null,
      llamamiento: llamamiento || null,
      llamamiento_personalizado: llamamientoPersonalizado
        ? sanitizarNombre(llamamientoPersonalizado)
        : null,
    }

    if (llamamiento && esLlamamientoPredefinido(llamamiento)) {
      const errTel = validarTelefono(telefono)
      if (errTel) {
        setErrMsg(errTel)
        return
      }
    }
    if (llamamiento === 'Otro') {
      const errLlam = validarLlamamientoPersonalizado(llamamientoPersonalizado)
      if (errLlam) {
        setErrMsg(errLlam)
        return
      }
    }

    setErrMsg('')
    await onRegister(formData)
  }

  const bgLogos = [
    '-top-20 -right-20 w-72 h-72 -rotate-12',
    '-bottom-32 -left-20 w-96 h-96 rotate-45',
    'top-1/2 -right-16 w-48 h-48 rotate-[30deg]',
    'top-1/3 -left-16 w-40 h-40 -rotate-[60deg]',
    'bottom-1/4 right-1/4 w-32 h-32 rotate-[15deg]',
  ]

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-warm-50 dark:bg-slate-950 overflow-y-auto">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {bgLogos.map((pos, i) => (
          <img
            key={i}
            src="/icono-barrio-sin fondo.svg"
            alt=""
            className={`absolute ${pos} opacity-[0.08] dark:opacity-[0.06]`}
            aria-hidden="true"
          />
        ))}
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 max-w-sm mx-auto w-full relative">
        <div className="text-center mb-8">
          <h1 className={`font-bold text-gray-900 dark:text-white transition-all duration-500 ${step === 'nombre' ? 'text-2xl' : 'text-lg'}`}>
            Barrio Buenaventura
          </h1>

        </div>

        {(error || errMsg) && (
          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm rounded-xl px-4 py-3 mb-4">
            {error || errMsg}
          </div>
        )}

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm dark:shadow-slate-900/50 p-6 transition-all duration-300">
          {step === 'nombre' && (
            <div className="animate-fade-up">
              <Input
                label="¿Cuál es tu nombre?"
                name="nombreCompleto"
                placeholder="Ej: Juan Pérez"
                value={nombreCompleto}
                onChange={(e) => handleNombreChange(e.target.value)}
                autoComplete="name"
                autoFocus
              />
              <div className="mt-4">
                <Button fullWidth onClick={handleNombreContinue} disabled={checking}>
                  {checking ? 'Verificando...' : 'Continuar'}
                </Button>
              </div>
              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-slate-600" /></div>
                <div className="relative flex justify-center"><span className="bg-white dark:bg-slate-800 px-3 text-xs text-gray-400 dark:text-slate-500">o</span></div>
              </div>
              <Button variant="ghost" fullWidth onClick={onGuest}>
                Entrar como invitado
              </Button>
            </div>
          )}

          {step === 'cumpleanos' && (
            <div className="animate-fade-up">
              <Input
                label="¿Cuál es tu fecha de nacimiento?"
                name="fecha_nacimiento"
                type="date"
                value={fechaNacimiento}
                onChange={(e) => { setFechaNacimiento(e.target.value); setErrMsg('') }}
                autoFocus
              />
              <div className="flex gap-2 mt-4">
                <Button variant="ghost" onClick={() => setStep('nombre')}>Atrás</Button>
                <div className="flex-1"><Button fullWidth onClick={handleCumpleanosContinue}>Continuar</Button></div>
              </div>
            </div>
          )}

          {step === 'llamamiento' && (
            <div className="animate-fade-up">
              <p className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-4">Casi listo. Cuéntanos un poco más:</p>

              <div className="flex items-center gap-3 mb-4">
                <input
                  type="checkbox"
                  id="tieneLlamamiento"
                  checked={tieneLlamamiento}
                  onChange={handleLlamamientoToggle}
                  className="w-4 h-4 rounded border-gray-300 dark:border-slate-600 text-warm-600 focus:ring-warm-500 dark:bg-slate-700"
                />
                <label htmlFor="tieneLlamamiento" className="text-sm text-gray-700 dark:text-slate-300 font-medium">
                  ¿Tienes un llamamiento?
                </label>
              </div>

              {tieneLlamamiento && (
                <div className="space-y-3.5">
                  <Select
                    label="Llamamiento"
                    name="llamamiento"
                    placeholder="Selecciona tu llamamiento"
                    options={LLAMAMIENTOS}
                    value={llamamiento}
                    onChange={(e) => { setLlamamiento(e.target.value); setErrMsg('') }}
                  />
                  {llamamiento === 'Otro' && (
                    <Input
                      label="Especifica tu llamamiento"
                      name="llamamiento_personalizado"
                      placeholder="Ej: Director de música"
                      value={llamamientoPersonalizado}
                      onChange={(e) => setLlamamientoPersonalizado(e.target.value)}
                    />
                  )}
                  {esLlamamientoPredefinido(llamamiento) && (
                    <>
                      <Input
                        label="Teléfono"
                        name="telefono"
                        type="tel"
                        placeholder="+593 99 999 9999"
                        value={telefono}
                        onChange={(e) => { setTelefono(e.target.value); setErrMsg('') }}
                      />
                      <p className="text-xs text-warm-600 dark:text-warm-400 bg-warm-50 dark:bg-warm-950 rounded-lg px-3 py-2">
                        El teléfono es importante para que los miembros puedan ponerse en contacto con el líder que corresponda.
                      </p>
                    </>
                  )}
                </div>
              )}

              <div className="flex gap-2 mt-4">
                <Button variant="ghost" onClick={() => setStep('cumpleanos')}>Atrás</Button>
                <div className="flex-1"><Button fullWidth onClick={handleRegistrar} disabled={loading}>
                  {loading ? 'Registrando...' : 'Registrarme'}
                </Button></div>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 dark:text-slate-500 mt-6">
          Tu sesión quedará abierta en este dispositivo
        </p>
      </div>
    </div>
  )
}
