export default function RadioCard({ selected, onClick, title, description, className = '' }) {
  return (
    <div
      role="radio"
      aria-checked={selected}
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
      className={`flex cursor-pointer items-start gap-3 rounded-2xl border-[1.5px] px-4 py-3.5 transition-all ${
        selected ? 'border-primary bg-primary-soft' : 'border-line bg-white hover:border-primary/40'
      } ${className}`}
    >
      <div
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
          selected ? 'border-primary bg-primary' : 'border-line-soft border-ink-faint/40'
        }`}
      >
        {selected && <div className="h-2 w-2 rounded-full bg-white" />}
      </div>
      <div>
        <p className="text-[15px] font-semibold leading-snug text-ink">{title}</p>
        {description && <p className="mt-0.5 text-[13px] leading-relaxed text-ink-soft">{description}</p>}
      </div>
    </div>
  )
}