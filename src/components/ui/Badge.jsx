export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-200',
    gold: 'bg-gold-100 dark:bg-gold-950 text-gold-800 dark:text-gold-300',
    church: 'bg-church-100 dark:bg-church-950 text-church-800 dark:text-church-300',
    warm: 'bg-warm-100 dark:bg-warm-950 text-warm-800 dark:text-warm-300',
    success: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300',
    danger: 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300',
  }
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}
