import { getFraseDelDia } from '../lib/frases'

export default function FraseDia() {
  const frase = getFraseDelDia()

  return (
    <section className="py-12 bg-[#faf8f5]">
      <div className="max-w-lg mx-auto px-6">
        <div className="flex gap-3">
          <div className="text-bv-300 flex-shrink-0 leading-none" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311C9.591 11.69 11 13.166 11 15c0 1.933-1.567 3.5-3.5 3.5-1.271 0-2.404-.655-2.917-1.179zM14.583 17.321C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311C19.591 11.69 21 13.166 21 15c0 1.933-1.567 3.5-3.5 3.5-1.271 0-2.404-.655-2.917-1.179z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed">{frase.texto}</p>
            <p className="text-xs text-bv-500 dark:text-bv-300 mt-1.5 font-medium">{frase.referencia}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
