import { getFraseDelDia } from '../lib/frases'

export default function MensajeSemanal() {
  const frase = getFraseDelDia()

  return (
    <section className="relative py-20 overflow-hidden bg-bv-950">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-bv-300/5 rounded-full blur-[150px]" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gold-400/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(124,183,243,0.03)_0%,_transparent_70%)]" />
      </div>

      <div className="relative z-10 max-w-lg mx-auto px-6 text-center">
        <p className="text-[10px] text-bv-300/40 uppercase tracking-[0.2em] font-medium mb-6">Escritura de hoy</p>

        <div className="relative">
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-bv-300/10" aria-hidden="true">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311C9.591 11.69 11 13.166 11 15c0 1.933-1.567 3.5-3.5 3.5-1.271 0-2.404-.655-2.917-1.179zM14.583 17.321C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311C19.591 11.69 21 13.166 21 15c0 1.933-1.567 3.5-3.5 3.5-1.271 0-2.404-.655-2.917-1.179z" />
            </svg>
          </div>

          <blockquote>
            <p className="text-xl sm:text-2xl text-white/85 font-medium leading-relaxed text-balance" style={{ letterSpacing: '-0.01em' }}>
              "{frase.texto}"
            </p>
            <footer className="text-sm text-bv-300/50 mt-5 tracking-wide">
              — {frase.referencia}
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  )
}
