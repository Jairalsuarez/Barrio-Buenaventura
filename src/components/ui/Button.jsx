export default function Button({ children, variant = 'primary', fullWidth, className = '', disabled, ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none'
  const variants = {
    primary: 'bg-warm-600 text-white shadow-md shadow-warm-600/20 hover:bg-warm-700',
    secondary: 'bg-white dark:bg-slate-800 text-warm-800 dark:text-warm-200 border border-warm-200 dark:border-slate-600 shadow-sm hover:bg-warm-50 dark:hover:bg-slate-700',
    danger: 'bg-red-500 text-white shadow-sm hover:bg-red-600',
    ghost: 'text-warm-700 dark:text-warm-300 hover:bg-warm-100 dark:hover:bg-slate-700',
    gold: 'bg-gold-500 text-white shadow-md shadow-gold-500/20 hover:bg-gold-600',
    warm: 'bg-warm-500 text-white shadow-md shadow-warm-500/20 hover:bg-warm-600',
  }
  return (
    <button className={`${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`} disabled={disabled} {...props}>
      {children}
    </button>
  )
}
