export default function Card({ children, className = '', padding = true, ...props }) {
  return (
    <div className={`bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm dark:shadow-slate-900/50 ${padding ? 'p-5' : ''} ${className}`} {...props}>
      {children}
    </div>
  )
}
