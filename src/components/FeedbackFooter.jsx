import { useState } from 'react'
import Card from './ui/Card'
import Button from './ui/Button'
import Icon from './ui/Icon'
import { supabase } from '../lib/supabase'
import { validarFeedback } from '../lib/validacion'

const FEEDBACK_KEY = 'iglesia_bv_feedback'

function yaEnvioHoy() {
  const guardado = localStorage.getItem(FEEDBACK_KEY)
  if (!guardado) return false
  return guardado === new Date().toDateString()
}

function marcarEnviadoLocal() {
  localStorage.setItem(FEEDBACK_KEY, new Date().toDateString())
}

export default function FeedbackFooter({ usuarioId }) {
  const [texto, setTexto] = useState('')
  const [enviado, setEnviado] = useState(() => yaEnvioHoy())
  const [enviando, setEnviando] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    const err = validarFeedback(texto)
    if (err) return
    if (enviando) return
    setEnviando(true)
    const { error } = await supabase.from('feedback').insert({
      mensaje: texto.trim(),
      usuario_id: usuarioId || null,
    })
    setEnviando(false)
    if (error) {
      console.error('Error al enviar feedback:', error)
      return
    }
    marcarEnviadoLocal()
    setEnviado(true)
  }

  return (
    <section className="px-5 py-8 max-w-sm mx-auto">
      <Card className="!p-5">
        {!enviado ? (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-warm-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
              </svg>
              <h3 className="font-semibold text-gray-900 dark:text-white">¿Cómo podemos mejorar?</h3>
            </div>
            <textarea
              value={texto}
              onChange={e => setTexto(e.target.value)}
              placeholder="Escribe tu comentario, sugerencia o reporte aquí..."
              rows={3}
              maxLength={2000}
              className="w-full rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-sm outline-none transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:border-warm-400 focus:ring-2 focus:ring-warm-400/20 resize-none dark:text-white"
            />
            <Button type="submit" fullWidth disabled={!texto.trim() || enviando}>
              {enviando ? 'Enviando...' : 'Enviar comentario'}
            </Button>
          </form>
        ) : (
          <div className="text-center py-4 animate-fade-scale">
            <Icon size={36} className="block mb-3 mx-auto" fill>volunteer_activism</Icon>
            <p className="font-semibold text-gray-900 dark:text-white">Gracias por tu feedback</p>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Sirve de mucho para seguir mejorando.</p>
          </div>
        )}
      </Card>
    </section>
  )
}
