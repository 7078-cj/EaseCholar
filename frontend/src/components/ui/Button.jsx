const VARIANTS = {
  primary:
    'bg-primary text-white hover:bg-primary-dark disabled:bg-line disabled:text-ink-faint',
  secondary:
    'bg-white text-ink border border-line hover:border-primary/50 disabled:opacity-50',
  soft: 'bg-primary-soft text-primary hover:bg-primary/10 disabled:opacity-50',
  ghost: 'bg-transparent text-ink-soft hover:text-ink',
  danger: 'bg-danger-soft text-danger hover:bg-danger/10',
}

const SIZES = {
  md: 'px-4 py-2.5 text-sm rounded-xl',
  lg: 'px-5 py-4 text-base rounded-2xl',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'lg',
  className = '',
  as: Comp = 'button',
  ...props
}) {
  return (
    <Comp
      className={`inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:active:scale-100 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {children}
    </Comp>
  )
}