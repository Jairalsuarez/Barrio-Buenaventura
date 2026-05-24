import { useState } from 'react'

export default function NamePrompt({ onSave }) {
  const [nombre, setNombre] = useState('')
  const [showWarning, setShowWarning] = useState(false)

  function handleChange(e) {
    const raw = e.target.value
    if (raw.includes(' ')) {
      setShowWarning(true)
      setTimeout(() => setShowWarning(false), 2500)
    }
    setNombre(raw.replace(/\s/g, ''))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = nombre.trim()
    if (!trimmed) return
    localStorage.setItem('iglesia_bv_name', trimmed)
    onSave(trimmed)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-bv-900 to-bv-950 relative">
      <div className="absolute inset-0 pointer-events-none">
        <img src="/capilla.svg" alt="" className="absolute inset-0 w-full h-full object-cover opacity-20 saturate-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-bv-900/70 via-bv-900/50 to-bv-950/90" />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-6 shadow-xl shadow-black/20">
          <img src="/icono-barrio-sin fondo.svg" alt="" className="w-12 h-12 brightness-0 invert opacity-90" />
        </div>
        <h1 className="text-2xl font-bold text-white text-center leading-tight">
          Bienvenido al<br />Barrio Buenaventura
        </h1>
        <p className="text-sm text-white/50 mt-2">¿Cómo te llamas?</p>
        <form onSubmit={handleSubmit} className="w-full max-w-xs mt-6 space-y-3">
          <input
            type="text"
            value={nombre}
            onChange={handleChange}
            placeholder="Tu nombre"
            maxLength={30}
            autoFocus
            className="w-full rounded-2xl border border-white/10 bg-white/8 backdrop-blur-md px-4 py-3.5 text-sm text-white outline-none transition-all placeholder:text-white/30 focus:border-white/25 focus:ring-2 focus:ring-white/10"
          />
          {showWarning && (
            <p className="text-[11px] text-gold-300/70 text-center">Solo se permite 1 nombre</p>
          )}
          <button
            type="submit"
            disabled={!nombre.trim()}
            className="w-full py-3.5 rounded-2xl bg-white text-bv-900 font-semibold text-sm shadow-lg shadow-black/20 transition-all hover:shadow-xl active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Entrar
          </button>
        </form>
      </div>
      <div className="pb-8 text-center relative z-10">
        <p className="text-[10px] text-white/20">
          Iglesia de Jesucristo de los Santos de los Últimos Días
        </p>
      </div>
    </div>
  )
}
