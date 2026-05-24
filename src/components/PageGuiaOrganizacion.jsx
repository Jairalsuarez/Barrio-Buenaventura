import { useMemo, useState } from 'react'

const SEMINARIO_URL = 'https://www.churchofjesuschrist.org/study/books-and-lessons/seminary?lang=spa'
const INSTITUTO_URL = 'https://www.churchofjesuschrist.org/study/books-and-lessons/institute?lang=spa'

function getRecomendacion({ edad, sexo, estadoCivil }) {
  const age = Number(edad)
  const esHombre = sexo === 'hombre'
  const esMujer = sexo === 'mujer'
  const esSoltero = estadoCivil === 'soltero'

  if (!Number.isFinite(age) || age < 0) return null

  if (age < 2) {
    return {
      titulo: 'Con tu familia',
      subtitulo: 'Aún no hay una organización formal para esta edad.',
      detalle: 'Los niños más pequeños suelen permanecer con sus padres o cuidadores durante las reuniones.',
      extras: []
    }
  }

  if (age < 3) {
    return {
      titulo: 'Guardería',
      subtitulo: 'Para niños pequeños.',
      detalle: 'Si el barrio cuenta con guardería disponible, esta es la mejor opción para esta etapa.',
      extras: []
    }
  }

  if (age <= 11) {
    return {
      titulo: 'Primaria',
      subtitulo: 'Para niños de 3 a 11 años.',
      detalle: 'Alli aprenden sobre Jesucristo con clases, canciones y actividades apropiadas para su edad.',
      extras: []
    }
  }

  if (age <= 17) {
    const titulo = esMujer ? 'Mujeres Jóvenes' : esHombre ? 'Cuórum del Sacerdocio Aarónico' : 'Jóvenes'
    const detalle = esMujer
      ? 'Es la organización dominical para jovencitas.'
      : esHombre
        ? 'Es la organización dominical para jóvenes varones.'
        : 'Un líder puede ayudarte a ubicar la clase de jóvenes que corresponda.'

    return {
      titulo,
      subtitulo: 'Para jóvenes de 12 a 17 años.',
      detalle,
      extras: age >= 14 ? [
        {
          titulo: 'Tambien te recomendamos Seminario',
          texto: 'Si estás en edad de Seminario, pregunta por la clase local y revisa los recursos oficiales.',
          url: SEMINARIO_URL,
          label: 'Ver recursos de Seminario'
        }
      ] : []
    }
  }

  const organizacionAdultos = esMujer ? 'Sociedad de Socorro' : esHombre ? 'Cuórum de Élderes' : 'Clase de adultos'
  const detalleAdultos = esMujer
    ? 'Es la organización dominical para mujeres adultas.'
    : esHombre
      ? 'Es la organización dominical para hombres adultos.'
      : 'Un líder puede ayudarte a encontrar la clase dominical para adultos que corresponda.'

  const extras = []
  if (age <= 35) {
    extras.push({
      titulo: esSoltero ? 'También puedes participar con JAS' : 'También puedes asistir a Instituto',
      texto: esSoltero
        ? 'Como joven adulto soltero, puedes participar en actividades de JAS y se recomienda asistir a Instituto.'
        : 'Los jóvenes adultos también son bienvenidos a Instituto.',
      url: INSTITUTO_URL,
      label: 'Ver recursos de Instituto'
    })
  }

  return {
    titulo: organizacionAdultos,
    subtitulo: age <= 35 && esSoltero ? 'Tu organización dominical, con apoyo de JAS.' : 'Tu organización dominical.',
    detalle: detalleAdultos,
    extras
  }
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

  const puedeCalcular = edad !== '' && sexo && estadoCivil

  function handleSubmit(e) {
    e.preventDefault()
    if (puedeCalcular) setSubmitted(true)
  }

  return (
    <div className="min-h-dvh bg-[#faf7f2] dark:bg-[#0f0f14]">
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
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8c6a43]/70 dark:text-[#c6a27b]/70">
            Domingos
          </p>
          <h2 className="mt-2 text-3xl font-extrabold leading-tight tracking-[-0.04em] text-[#1e293b] dark:text-white">
            Encuentra tu organización
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#64748b] dark:text-slate-400">
            Responde unas preguntas rápidas y te diremos a qué clase u organización puedes asistir.
          </p>
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
              <OptionButton active={sexo === 'mujer'} onClick={() => { setSexo('mujer'); setSubmitted(false) }}>Mujer</OptionButton>
              <OptionButton active={sexo === 'hombre'} onClick={() => { setSexo('hombre'); setSubmitted(false) }}>Hombre</OptionButton>
            </div>
          </div>

          <div>
            <p className="block text-xs font-bold uppercase tracking-[0.14em] text-[#8c6a43]/70 dark:text-[#c6a27b]/70">
              Estado civil
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <OptionButton active={estadoCivil === 'soltero'} onClick={() => { setEstadoCivil('soltero'); setSubmitted(false) }}>Soltero/a</OptionButton>
              <OptionButton active={estadoCivil === 'casado'} onClick={() => { setEstadoCivil('casado'); setSubmitted(false) }}>Casado/a</OptionButton>
            </div>
          </div>

          <button
            type="submit"
            disabled={!puedeCalcular}
            className="w-full rounded-2xl bg-[#1e293b] px-5 py-4 text-sm font-bold text-white shadow-lg shadow-slate-900/10 transition-all active:scale-[0.98] disabled:opacity-35 disabled:cursor-not-allowed dark:bg-[#c6a27b] dark:text-[#121216]"
          >
            Ver recomendación
          </button>
        </form>

        {submitted && recomendacion && (
          <section className="mt-7 rounded-2xl border border-[#e4dcd0] bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/8">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8c6a43]/70 dark:text-[#c6a27b]/70">
              Recomendación
            </p>
            <h3 className="mt-2 text-2xl font-extrabold tracking-[-0.03em] text-[#1e293b] dark:text-white">
              {recomendacion.titulo}
            </h3>
            <p className="mt-1 text-sm font-semibold text-[#8c6a43] dark:text-[#c6a27b]">
              {recomendacion.subtitulo}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[#64748b] dark:text-slate-400">
              {recomendacion.detalle}
            </p>

            {recomendacion.extras.length > 0 && (
              <div className="mt-5 space-y-3">
                {recomendacion.extras.map((extra) => (
                  <a
                    key={extra.titulo}
                    href={extra.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-xl border border-[#e4dcd0] bg-[#faf7f2] p-4 transition-colors hover:border-[#8c6a43]/35 dark:border-white/10 dark:bg-black/10"
                  >
                    <span className="block text-sm font-bold text-[#1e293b] dark:text-white">{extra.titulo}</span>
                    <span className="mt-1 block text-xs leading-relaxed text-[#64748b] dark:text-slate-400">{extra.texto}</span>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#8c6a43] dark:text-[#c6a27b]">
                      {extra.label}
                      <span className="material-symbols-outlined text-sm">open_in_new</span>
                    </span>
                  </a>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  )
}
