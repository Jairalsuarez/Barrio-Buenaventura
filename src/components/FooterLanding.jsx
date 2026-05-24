export default function FooterLanding() {
  return (
    <footer className="py-6 pb-20 bg-[#faf8f5] dark:bg-slate-950">
      <div className="max-w-lg mx-auto px-6 flex items-center justify-center gap-2">
        <img src="/Logo-Fizzia.svg" alt="Fizzia" className="w-4 h-4 opacity-40" />
        <span className="text-[11px] text-gray-400 dark:text-slate-600">
          Creado por <a href="https://fizzia.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-bv-400 hover:text-bv-600 transition-colors">Fizzia</a>
        </span>
      </div>
    </footer>
  )
}
