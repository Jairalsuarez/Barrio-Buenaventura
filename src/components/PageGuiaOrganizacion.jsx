import { useMemo, useState, useEffect } from 'react'

const SEMINARIO_URL = 'https://www.churchofjesuschrist.org/study/books-and-lessons/seminary?lang=spa'
const INSTITUTO_URL = 'https://www.churchofjesuschrist.org/study/books-and-lessons/institute?lang=spa'

const PRESIDENTES = {
  'Guardería': { nombre: 'Hermana María Pérez', telefono: '099 999 0001' },
  'Primaria': { nombre: 'Hermana Ana Gómez', telefono: '099 999 0002' },
  'Mujeres Jóvenes': { nombre: 'Hermana Laura Martínez', telefono: '099 999 0003' },
  'Cuórum del Sacerdocio Aarónico': { nombre: 'Hermano Carlos López', telefono: '099 999 0004' },
  'Sociedad de Socorro': { nombre: 'Hermana Rosa Castillo', telefono: '099 999 0005' },
  'Cuórum de Élderes': { nombre: 'Hermano Pedro Sánchez', telefono: '099 999 0006' },
}

function createConfetti() {
  const colors = ['#8c6a43', '#c6a27b', '#e4dcd0', '#7a8f6b', '#f59e0b', '#ef4444', '#3b82f6', '#a855f7']
  const particles = []
  for (let i = 0; i < 80; i++) {
    const color = colors[Math.floor(Math.random() * colors.length)]
    const left = Math.random() * 100
    const delay = Math.random() * 0.5
    const duration = 1.5 + Math.random() * 2
    const size = 6 + Math.random() * 8
    const rotation = Math.random() * 720 - 360
    particles.push({ color, left, delay, duration, size, rotation })
  }
  return particles
}

function Confetti({ active }) {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    if (active) {
      setParticles(createConfetti())
      const timer = setTimeout(() => setParticles([]), 4000)
      return () => clearTimeout(timer)
    } else {
      setParticles([])
    }
  }, [active])

  if (particles.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute top-0 animate-confetti-fall"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 0.6,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}
    </div>
  )
}

function getRecomendacion({ edad, sexo, estadoCivil }) {
  const age = Number(edad)
  const esHombre = sexo === 'hombre'
  const esMujer = sexo === 'mujer'
  const esSoltero = estadoCivil === 'soltero'

  if (!Number.isFinite(age) || age < 0) return null

  if (age < 2) {
    return { titulo: 'Con tu familia', presidente: null }
  }

  if (age < 3) {
    return { titulo: 'Guardería', presidente: PRESIDENTES['Guardería'] }
  }

  if (age <= 11) {
    return { titulo: 'Primaria', presidente: PRESIDENTES['Primaria'] }
  }

  if (age <= 17) {
    const titulo = esMujer ? 'Mujeres Jóvenes' : esHombre ? 'Cuórum del Sacerdocio Aarónico' : 'Jóvenes'
    return { titulo, presidente: PRESIDENTES[titulo] || null }
  }

  const titulo = esMujer ? 'Sociedad de Socorro' : esHombre ? 'Cuórum de Élderes' : 'Clase de adultos'
  return { titulo, presidente: PRESIDENTES[titulo] || null }
}

function OptionButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-3 py-3 text-sm font-semibold transition-all active:scale-[0.98] ${
        active
          ? 'border-[#8c6a43] bg-[#8c6a43] text-white shadow-sm shadow-[#8c6a43]/20'
          : 'border-[#e4dcd0] bg-white text-[#1e293b] hover:border-[#8c6a43]/35 dark:border-white/10 dark:bg-white/8 dark:text-white'
      }`}
    >
      {children}
    </button>
  )
}

export default function PageGuiaOrganizacion({ onBack }) {
  const [edad, setEdad] = useState('')
  const [sexo, setSexo] = useState('')
  const [estadoCivil, setEstadoCivil] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const recomendacion = useMemo(
    () => getRecomendacion({ edad, sexo, estadoCivil }),
    [edad, sexo, estadoCivil]
  )

  const puedeCalcular = edad !== '' && sexo && (Number(edad) >= 12 ? estadoCivil : true)

  function handleSubmit(e) {
    e.preventDefault()
    if (puedeCalcular) setSubmitted(true)
  }

  return (
    <div className="min-h-dvh bg-[#faf7f2] dark:bg-[#0f0f14]">
      <Confetti active={submitted} />
      <div className="max-w-lg mx-auto px-5 pb-8">
        <div className="page-header">
          <button onClick={onBack} className="page-back" aria-label="Volver">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <h1 className="page-title">Guía de organización</h1>
        </div>

        <section className="mt-4">
          <h2 className="text-3xl font-extrabold leading-tight tracking-[-0.04em] text-[#1e293b] dark:text-white">
            Encuentra tu organización
          </h2>
        </section>

        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <div>
            <label htmlFor="edad" className="block text-xs font-bold uppercase tracking-[0.14em] text-[#8c6a43]/70 dark:text-[#c6a27b]/70">
              Edad
            </label>
            <input
              id="edad"
              type="number"
              min="0"
              max="120"
              inputMode="numeric"
              value={edad}
              onChange={(e) => {
                setEdad(e.target.value)
                setSubmitted(false)
              }}
              placeholder="Ej. 18"
              className="mt-2 w-full rounded-2xl border border-[#e4dcd0] bg-white px-4 py-4 text-base font-semibold text-[#1e293b] outline-none transition-all placeholder:text-[#94a3b8] focus:border-[#8c6a43]/50 focus:ring-4 focus:ring-[#8c6a43]/10 dark:border-white/10 dark:bg-white/8 dark:text-white"
            />
          </div>

          <div>
            <p className="block text-xs font-bold uppercase tracking-[0.14em] text-[#8c6a43]/70 dark:text-[#c6a27b]/70">
              Sexo
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {Number(edad) < 12 && edad !== '' ? (
                <>
                  <OptionButton active={sexo === 'mujer'} onClick={() => { setSexo('mujer'); setSubmitted(false) }}>Niña</OptionButton>
                  <OptionButton active={sexo === 'hombre'} onClick={() => { setSexo('hombre'); setSubmitted(false) }}>Niño</OptionButton>
                </>
              ) : (
                <>
                  <OptionButton active={sexo === 'mujer'} onClick={() => { setSexo('mujer'); setSubmitted(false) }}>Mujer</OptionButton>
                  <OptionButton active={sexo === 'hombre'} onClick={() => { setSexo('hombre'); setSubmitted(false) }}>Hombre</OptionButton>
                </>
              )}
            </div>
          </div>

          {(!edad || Number(edad) >= 12) && (
            <div>
              <p className="block text-xs font-bold uppercase tracking-[0.14em] text-[#8c6a43]/70 dark:text-[#c6a27b]/70">
                Estado civil
              </p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <OptionButton active={estadoCivil === 'soltero'} onClick={() => { setEstadoCivil('soltero'); setSubmitted(false) }}>Soltero/a</OptionButton>
                <OptionButton active={estadoCivil === 'casado'} onClick={() => { setEstadoCivil('casado'); setSubmitted(false) }}>Casado/a</OptionButton>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={!puedeCalcular}
            className="w-full rounded-2xl bg-[#1e293b] px-5 py-4 text-sm font-bold text-white shadow-lg shadow-slate-900/10 transition-all active:scale-[0.98] disabled:opacity-35 disabled:cursor-not-allowed dark:bg-[#c6a27b] dark:text-[#121216]"
          >
            Ver recomendación
          </button>
        </form>

        {submitted && recomendacion && (
          <section className="mt-7 rounded-2xl border-2 border-[#c6a27b]/30 bg-white p-6 shadow-lg shadow-[#8c6a43]/10 text-center dark:border-[#c6a27b]/20 dark:bg-white/8">
            <span className="text-4xl">🎉</span>
            <h3 className="mt-3 text-2xl font-extrabold tracking-[-0.03em] text-[#1e293b] dark:text-white">
              ¡Felicidades!
            </h3>
            <p className="mt-1 text-lg font-bold text-[#8c6a43] dark:text-[#c6a27b]">
              Perteneces a {recomendacion.titulo}
            </p>

            {recomendacion.presidente && (
              <div className="mt-5 rounded-xl bg-[#faf7f2] p-4 text-left dark:bg-black/10">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#8c6a43]/60 dark:text-[#c6a27b]/60">
                  Presidente de la organización
                </p>
                <p className="mt-1 text-sm font-semibold text-[#1e293b] dark:text-white">
                  {recomendacion.presidente.nombre}
                </p>
                <a
                  href={`tel:${recomendacion.presidente.telefono}`}
                  className="mt-1 inline-flex items-center gap-1.5 text-sm font-bold text-[#8c6a43] hover:text-[#a0784d] dark:text-[#c6a27b]"
                >
                  <span className="material-symbols-outlined text-base">call</span>
                  {recomendacion.presidente.telefono}
                </a>
              </div>
            )}
            <button
              onClick={() => { setSubmitted(false); setEdad(''); setSexo(''); setEstadoCivil('') }}
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-[#8c6a43] hover:text-[#a0784d] transition-colors dark:text-[#c6a27b]"
            >
              <span className="material-symbols-outlined text-base">refresh</span>
              Volver a intentar
            </button>
          </section>
        )}
      </div>
    </div>
  )
}
