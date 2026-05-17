import Card from './ui/Card'
import { getFraseDelDia } from '../lib/frases'

export default function FraseDia() {
  const frase = getFraseDelDia()

  return (
    <section className="px-5 py-6 max-w-sm mx-auto">
      <Card className="!bg-gradient-to-br from-church-900 to-church-950 !border-none text-center relative overflow-hidden animate-fade-scale">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold-400 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-church-400 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10">
          <span className="text-2xl block mb-2">📖</span>
          <p className="text-white text-sm leading-relaxed italic">&ldquo;{frase.texto}&rdquo;</p>
          <p className="text-gold-400 text-xs mt-3 font-medium">{frase.referencia}</p>
        </div>
      </Card>
    </section>
  )
}
