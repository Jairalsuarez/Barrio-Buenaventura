import { useState } from 'react'

const MISIONEROS_NUMERO = '+593987321144'

export default function NuevosSection() {
  const [interes, setInteres] = useState(false)
  const [respondio, setRespondio] = useState(false)

  return (
    <section id="section-nuevos" className="py-16 bg-gradient-to-b from-[#faf8f5] to-white">
      <div className="max-w-lg mx-auto px-6">
        <div className="text-center mb-6">
          <p className="eyebrow mb-3">Bienvenido</p>
          <h2 className="section-title">¿Eres nuevo o estás regresando?</h2>
        </div>

        <div className="card-premium p-6 sm:p-8 text-center">
          {!respondio ? (
            <>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-bv-100 to-bv-50 flex items-center justify-center mx-auto mb-5">
                <span className="material-symbols-outlined text-bv-600" style={{ fontSize: 30 }}>volunteer_activism</span>
              </div>
              <p className="text-gray-600 dark:text-slate-300 text-sm leading-relaxed mb-6 text-balance">
                Hola, somos los misioneros del Barrio Buenaventura y nos encantaría conocerte. 
                Nuestras reuniones son abiertas para todos. Es un espacio para encontrar paz, 
                propósito y una comunidad que te acoge sin importar de dónde vengas.
              </p>
              <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
                <button onClick={() => { setInteres(true); setRespondio(true) }} className="btn-primary">
                  Sí, quiero saber más
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
                <button onClick={() => setRespondio(true)} className="btn-secondary">
                  No, gracias
                </button>
              </div>
            </>
          ) : interes ? (
            <>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center mx-auto mb-5">
                <span className="material-symbols-outlined text-emerald-600" style={{ fontSize: 30 }}>favorite</span>
              </div>
              <p className="font-bold text-bv-900 dark:text-white text-lg mb-2">Qué alegría tenerte aquí</p>
              <p className="text-gray-500 dark:text-slate-400 text-sm mb-6">
                Tu deseo de conocer el evangelio es una inspiración. Los misioneros están listos para acompañarte.
              </p>
              <div className="flex gap-2.5 justify-center">
                <a href={`tel:${MISIONEROS_NUMERO}`} className="btn-primary !bg-emerald-600 hover:!bg-emerald-700">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Llamar
                </a>
                <a href={`https://wa.me/${MISIONEROS_NUMERO.replace(/\+/g, '').replace(/\s/g, '')}`} target="_blank" rel="noopener noreferrer" className="btn-primary">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
                  </svg>
                  WhatsApp
                </a>
              </div>
            </>
          ) : (
            <p className="text-gray-400 text-sm">Gracias por visitarnos. Siempre serás bienvenido.</p>
          )}
        </div>
      </div>
    </section>
  )
}
