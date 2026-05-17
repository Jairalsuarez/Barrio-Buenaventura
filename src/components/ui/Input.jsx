export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">{label}</label>}
      <input
        className={`w-full rounded-xl border bg-white dark:bg-slate-800 px-4 py-3 text-sm outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-church-400 focus:ring-2 focus:ring-church-400/20 dark:text-slate-100 ${error ? 'border-red-400 ring-red-400/20' : 'border-gray-200 dark:border-slate-600'} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
