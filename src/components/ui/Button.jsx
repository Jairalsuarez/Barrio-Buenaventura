export default function Button({ children, variant = 'primary', fullWidth, className = '', disabled, ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none'
  const variants = {
    primary: 'bg-church-600 text-white shadow-md shadow-church-600/20 hover:bg-church-700',
    secondary: 'bg-white dark:bg-slate-800 text-church-800 dark:text-church-200 border border-church-200 dark:border-slate-600 shadow-sm hover:bg-church-50 dark:hover:bg-slate-700',
    danger: 'bg-red-500 text-white shadow-sm hover:bg-red-600',
    ghost: 'text-church-700 dark:text-church-300 hover:bg-church-100 dark:hover:bg-slate-700',
    gold: 'bg-gold-500 text-white shadow-md shadow-gold-500/20 hover:bg-gold-600',
    warm: 'bg-warm-500 text-white shadow-md shadow-warm-500/20 hover:bg-warm-600',
  }
  return (
    <button className={`${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`} disabled={disabled} {...props}>
      {children}
    </button>
  )
}
