import { getFraseDelDia } from '../lib/frases'

export default function PageEscritura({ onBack }) {
  const frase = getFraseDelDia()

  return (
    <div className="min-h-dvh bg-[#faf7f2] dark:bg-[#0f0f14]">
      <div className="max-w-lg mx-auto px-5">
        <div className="page-header">
          <button onClick={onBack} className="page-back" aria-label="Volver">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <h1 className="page-title">Escritura del día</h1>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1e293b] to-[#1a2424] p-8 my-6">
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#8c6a43]/8 rounded-full blur-[60px]" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-[40px]" />
          <div className="relative z-10">
            <span className="text-5xl font-serif text-[#8c6a43]/30 leading-none">&ldquo;</span>
            <p className="text-lg sm:text-xl text-white/85 leading-relaxed -mt-3 font-light" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {frase.texto}
            </p>
            <p className="text-sm text-[#8c6a43] mt-4 font-medium">
              — {frase.referencia}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
