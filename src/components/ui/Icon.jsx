export default function Icon({ children, size = 20, fill = false, className = '' }) {
  return (
    <span
      className={`material-symbols-outlined inline-flex items-center justify-center select-none ${fill ? 'fill' : ''} ${className}`}
      style={{ fontSize: size, width: size, height: size }}
      aria-hidden="true"
    >
      {children}
    </span>
  )
}
