import { useState } from 'react'

const ANUNCIOS = [
  {
    titulo: 'Bienvenidos al Barrio',
    contenido: 'Reunión cada domingo 9:00 AM en la capilla. Todos son bienvenidos.',
    fecha: 'Permanente',
    color: 'bg-white',
    detalle: 'La Capilla Barrio Buenaventura abre sus puertas todos los domingos a las 9:00 AM. Te esperamos para compartir la reunión sacramental, donde podrás encontrar paz, comunidad y palabras de inspiración. No importa si es tu primera vez o si vienes de otro barrio — aquí siempre serás bienvenido. Ven con tu familia, trae a tus amigos, y siente el amor de Cristo en cada himno y cada mensaje. La capilla está ubicada en Buena Fe, con estacionamiento disponible y un ambiente cálido y familiar. ¡Te esperamos!',
  },
  {
    titulo: 'Clase de Seminario',
    contenido: 'Lunes a viernes 6:00 AM en el Centro de Estaca.',
    fecha: 'Diario',
    color: 'bg-white',
    detalle: 'El Seminario es un programa de estudio de las Escrituras para jóvenes de 14 a 18 años. Las clases se imparten de lunes a viernes a las 6:00 AM en el Centro de Estaca. Es una oportunidad única para fortalecer tu testimonio, estudiar las Escrituras en profundidad y compartir con otros jóvenes de tu edad. Cada día cubrimos un pasaje diferente, con discusiones guiadas por maestros dedicados. No importa si asistes presencial o virtualmente — lo importante es dar ese tiempo al Señor cada mañana. ¡Despierta tu fe con el Seminario!',
  },
  {
    titulo: 'Noche de Hogar',
    contenido: 'Los lunes por la noche son para la familia.',
    fecha: 'Cada lunes',
    color: 'bg-white',
    detalle: 'La Noche de Hogar es un momento sagrado que la Iglesia nos invita a reservar cada lunes para fortalecer a nuestra familia. Pueden incluir una oración, una canción, una lección basada en las Escrituras o en palabras de los profetas modernos, una actividad familiar y un refrigerio. No necesita ser complicado — lo esencial es estar juntos, aprender del Evangelio y crear recuerdos espirituales en el hogar. Muchas familias del barrio comparten sus experiencias y actividades. Si deseas ideas o recursos para tu noche de hogar, habla con tus líderes del barrio.',
  },
  {
    titulo: 'Historia Familiar',
    contenido: 'Miércoles de 4:00 a 7:00 PM en el centro de genealogía.',
    fecha: 'Miércoles',
    color: 'bg-white',
    detalle: 'Cada miércoles, el centro de historia familiar del barrio abre sus puertas de 4:00 a 7:00 PM para ayudarte a descubrir tus raíces y conectar con tus antepasados. Contamos con voluntarios capacitados que te guiarán en el uso de FamilySearch y otras herramientas de investigación genealógica. Ya seas principiante o avanzado, aquí encontrarás apoyo para encontrar registros, construir tu árbol familiar y preparar nombres para ordenanzas del templo. Trae tu laptop o usa las nuestras. ¡Descubre la alegría de conectar con tus antepasados!',
  },
]

export default function TableroAnuncios() {
  const [selected, setSelected] = useState(null)

  if (selected !== null) {
    const a = ANUNCIOS[selected]
    return (
      <div className="py-8">
        <button
          onClick={() => setSelected(null)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8c6a43] hover:text-[#a0784d] transition-colors dark:text-[#c6a27b]"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Volver a anuncios
        </button>
        <div className="mt-4">
          <span className="text-[11px] uppercase tracking-wider text-[#8c6a43]/60 dark:text-[#c6a27b]/60 font-semibold">{a.fecha}</span>
          <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.03em] text-[#1e293b] dark:text-white">{a.titulo}</h2>
          <div className="mt-5 rounded-2xl bg-white dark:bg-white/8 border border-[#e4dcd0] dark:border-white/10 p-5 shadow-sm">
            <p className="text-sm leading-relaxed text-[#64748b] dark:text-slate-300 whitespace-pre-line">{a.detalle}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <section className="py-16">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-extrabold tracking-[-0.03em] text-[#1e293b] dark:text-white">Anuncios</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {ANUNCIOS.map((a, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className="group relative bg-white dark:bg-white/8 rounded-2xl border border-[#e4dcd0] dark:border-white/10 p-5 text-left shadow-sm hover:border-[#8c6a43]/30 hover:shadow-md active:scale-[0.98] transition-all"
          >
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10">
              <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
                <circle cx="8" cy="8" r="6" fill="#d8c3a5" stroke="white" strokeWidth="2" />
                <circle cx="8" cy="8" r="2.5" fill="white" />
                <line x1="8" y1="14" x2="8" y2="20" stroke="#d8c3a5" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-[10px] uppercase tracking-wider text-[#8c6a43]/60 dark:text-[#c6a27b]/60 font-semibold">{a.fecha}</span>
            <h3 className="text-sm font-bold text-[#1e293b] dark:text-white mt-1.5">{a.titulo}</h3>
            <p className="text-xs text-[#64748b] dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">{a.contenido}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-[#8c6a43] dark:text-[#c6a27b] opacity-0 group-hover:opacity-100 transition-opacity">
              Ver más
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}
