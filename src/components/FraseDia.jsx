import Card from './ui/Card'
import { getFraseDelDia } from '../lib/frases'

export default function FraseDia() {
  const frase = getFraseDelDia()

  return (
    <section className="px-5 py-5 max-w-sm mx-auto">
      <Card className="!p-6 !border-church-100 dark:!border-slate-700">
        <div className="flex gap-4">
          <div className="flex-shrink-0 text-church-300 dark:text-church-600 leading-none" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311C9.591 11.69 11 13.166 11 15c0 1.933-1.567 3.5-3.5 3.5-1.271 0-2.404-.655-2.917-1.179zM14.583 17.321C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311C19.591 11.69 21 13.166 21 15c0 1.933-1.567 3.5-3.5 3.5-1.271 0-2.404-.655-2.917-1.179z" />
            </svg>
          </div>
          <div>
            <p className="text-gray-700 dark:text-slate-300 text-sm leading-relaxed">{frase.texto}</p>
            <p className="text-church-600 dark:text-church-400 text-xs mt-2 font-medium">{frase.referencia}</p>
          </div>
        </div>
      </Card>
    </section>
  )
}
