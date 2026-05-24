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
    <div className="min-h-dvh flex flex-col bg-[#faf7f2] dark:bg-[#0f0f14] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#8c6a43]/10 blur-3xl" />
        <div className="absolute bottom-[-120px] right-[-90px] h-72 w-72 rounded-full bg-[#c6a27b]/16 blur-3xl" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-7 relative z-10">
        <img src="/icono-barrio-sin fondo.svg" alt="" className="h-44 w-44 object-contain mb-7 drop-shadow-sm" />

        <h1 className="text-[2rem] font-extrabold text-[#1e293b] dark:text-white text-center leading-[1.05] tracking-[-0.04em]">
          Bienvenido
        </h1>

        <form onSubmit={handleSubmit} className="w-full max-w-[330px] mt-7 space-y-3">
          <label htmlFor="nombre" className="block text-xs font-bold uppercase tracking-[0.14em] text-[#8c6a43]/70 dark:text-[#c6a27b]/70">
            Tu nombre
          </label>
          <input
            id="nombre"
            type="text"
            value={nombre}
            onChange={handleChange}
            placeholder="Ej. Maria"
            maxLength={30}
            autoFocus
            className="w-full rounded-2xl border border-[#e4dcd0] bg-white px-4 py-4 text-base font-semibold text-[#1e293b] outline-none transition-all placeholder:text-[#94a3b8] focus:border-[#8c6a43]/50 focus:ring-4 focus:ring-[#8c6a43]/10 dark:border-white/10 dark:bg-white/8 dark:text-white dark:placeholder:text-slate-500"
          />
          {showWarning && (
            <p className="text-[11px] text-[#8c6a43] dark:text-[#c6a27b] text-center">Solo se permite 1 nombre</p>
          )}
          <button
            type="submit"
            disabled={!nombre.trim()}
            className="w-full py-4 rounded-2xl bg-[#1e293b] text-white font-bold text-sm shadow-lg shadow-slate-900/10 transition-all hover:bg-[#2a3a4f] active:scale-[0.98] disabled:opacity-35 disabled:cursor-not-allowed dark:bg-[#c6a27b] dark:text-[#121216]"
          >
            Entrar
          </button>
        </form>
      </div>

      <div className="pb-8 text-center relative z-10">
        <p className="mx-auto max-w-[300px] px-6 text-[10px] leading-relaxed text-[#8c6a43]/50 dark:text-[#c6a27b]/50">
          Esta no es una pagina oficial de la Iglesia de Jesucristo de los Santos de los Ultimos Dias.
        </p>
      </div>
    </div>
  )
}
