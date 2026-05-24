import { useState } from 'react'

const MISIONEROS_NUMERO = '+593987321144'

const INTERESES = [
  'Conocer más sobre Jesucristo',
  'Asistir a la iglesia',
  'Bautizarme',
  'Recibir visitas de los misioneros',
  'Actividades para mi familia',
  'Ayuda espiritual',
  'Matrimonio',
  'Historia familiar',
]

export default function PageNuevos({ onBack }) {
  const [step, setStep] = useState('welcome')
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [intereses, setIntereses] = useState([])
  const [hablarMisioneros, setHablarMisioneros] = useState(null)
  const [enviado, setEnviado] = useState(false)

  function toggleInteres(val) {
    setIntereses(prev => prev.includes(val) ? prev.filter(i => i !== val) : [...prev, val])
  }

  function handleSubmit(e) {
    e.preventDefault()
    setEnviado(true)
    const texto = `🙋 Nuevo visitante!\n\nNombre: ${nombre}\nTeléfono: ${telefono}\nIntereses: ${intereses.join(', ') || 'Ninguno'}\nHablar con misioneros: ${hablarMisioneros === true ? 'Sí' : hablarMisioneros === false ? 'No' : 'No especificado'}${mensaje ? `\n\nMensaje: ${mensaje}` : ''}`
    const url = `https://wa.me/${MISIONEROS_NUMERO.replace(/\+/g, '')}?text=${encodeURIComponent(texto)}`
    window.open(url, '_blank')
  }

  if (enviado) {
    return (
      <div className="min-h-dvh bg-[#faf7f2] dark:bg-[#0f0f14] flex items-center justify-center px-5">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-[#8c6a43]/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#8c6a43]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[#1e293b] dark:text-white">Gracias por escribirnos</h2>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-2">Te responderemos pronto. ¡Bienvenido a la familia!</p>
        </div>
      </div>
    )
  }

  if (step === 'welcome') {
    return (
      <div className="min-h-dvh bg-[#faf7f2] dark:bg-[#0f0f14] flex flex-col">
        <div className="max-w-lg mx-auto px-5 w-full">
          <div className="page-header">
            <button onClick={onBack} className="page-back" aria-label="Volver">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <h1 className="page-title">¿Eres nuevo?</h1>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-12">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#8c6a43] to-[#7a5c3a] flex items-center justify-center mb-6 shadow-lg shadow-[#8c6a43]/20">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#1e293b] dark:text-white">¡Nos alegra que estés aquí!</h2>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-3 max-w-xs leading-relaxed">
              Seas nuevo en el Barrio Buenaventura o estés regresando, queremos conocerte y acompañarte.
            </p>
            <button onClick={() => setStep('form')}
              className="mt-8 px-8 py-3.5 rounded-2xl bg-[#8c6a43] text-white font-semibold text-sm shadow-lg shadow-[#8c6a43]/20 hover:shadow-xl active:scale-[0.98] transition-all">
              Quiero presentarme
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-[#faf7f2] dark:bg-[#0f0f14]">
      <div className="max-w-lg mx-auto px-5">
        <div className="page-header">
          <button onClick={() => setStep('welcome')} className="page-back" aria-label="Volver">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <h1 className="page-title">Cuéntanos de ti</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pb-8 mt-2">
          <div>
            <label className="text-xs font-medium text-[#1e293b]/70 dark:text-white/60 mb-1.5 block">Tu nombre</label>
            <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej: María García" required
              className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#1e1e24] px-4 py-3 text-sm outline-none transition-all focus:border-[#8c6a43] focus:ring-2 focus:ring-[#8c6a43]/20 dark:text-white" />
          </div>
          <div>
            <label className="text-xs font-medium text-[#1e293b]/70 dark:text-white/60 mb-1.5 block">Teléfono (WhatsApp)</label>
            <input type="tel" value={telefono} onChange={e => setTelefono(e.target.value)} placeholder="Ej: +593 99 999 9999" required
              className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#1e1e24] px-4 py-3 text-sm outline-none transition-all focus:border-[#8c6a43] focus:ring-2 focus:ring-[#8c6a43]/20 dark:text-white" />
          </div>
          <div>
            <label className="text-xs font-medium text-[#1e293b]/70 dark:text-white/60 mb-1.5 block">¿Qué te interesa?</label>
            <div className="flex flex-wrap gap-2">
              {INTERESES.map(i => (
                <button key={i} type="button" onClick={() => toggleInteres(i)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${intereses.includes(i) ? 'bg-[#8c6a43] text-white border-[#8c6a43]' : 'bg-white dark:bg-[#1e1e24] text-gray-500 dark:text-slate-400 border-gray-200 dark:border-slate-700 hover:border-[#8c6a43]/40'}`}>
                  {i}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-[#1e293b]/70 dark:text-white/60 mb-1.5 block">¿Deseas hablar con los misioneros?</label>
            <div className="flex gap-2">
              <button type="button" onClick={() => setHablarMisioneros(true)}
                className={`text-xs px-4 py-2 rounded-xl border transition-all flex-1 ${hablarMisioneros === true ? 'bg-[#8c6a43] text-white border-[#8c6a43]' : 'bg-white dark:bg-[#1e1e24] text-gray-500 dark:text-slate-400 border-gray-200 dark:border-slate-700'}`}>
                Sí, quiero
              </button>
              <button type="button" onClick={() => setHablarMisioneros(false)}
                className={`text-xs px-4 py-2 rounded-xl border transition-all flex-1 ${hablarMisioneros === false ? 'bg-[#8c6a43] text-white border-[#8c6a43]' : 'bg-white dark:bg-[#1e1e24] text-gray-500 dark:text-slate-400 border-gray-200 dark:border-slate-700'}`}>
                No, gracias
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-[#1e293b]/70 dark:text-white/60 mb-1.5 block">Mensaje (opcional)</label>
            <textarea value={mensaje} onChange={e => setMensaje(e.target.value)} rows={3} placeholder="Cuéntanos cómo podemos ayudarte..."
              className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#1e1e24] px-4 py-3 text-sm outline-none transition-all focus:border-[#8c6a43] focus:ring-2 focus:ring-[#8c6a43]/20 resize-none dark:text-white" />
          </div>
          <button type="submit" disabled={!nombre.trim() || !telefono.trim()}
            className="w-full py-3.5 rounded-2xl bg-[#8c6a43] text-white font-semibold text-sm shadow-lg shadow-[#8c6a43]/20 hover:shadow-xl active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed">
            Enviar
          </button>
        </form>
      </div>
    </div>
  )
}
