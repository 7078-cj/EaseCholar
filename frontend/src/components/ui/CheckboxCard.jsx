export default function CheckboxCard({ checked, onClick, title, description }) {
  return (
    <div
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
      className="flex cursor-pointer items-start gap-3.5 rounded-2xl border-[1.5px] border-line bg-white px-5 py-4 transition-all hover:border-primary/40"
    >
      <div
        className={`mt-0.5 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-md border-2 transition-all ${
          checked ? 'border-primary bg-primary' : 'border-line-soft border-ink-faint/40'
        }`}
      >
        {checked && (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        )}
      </div>
      <div>
        <p className="text-[15px] font-semibold text-ink">{title}</p>
        {description && <p className="mt-0.5 text-[13px] leading-relaxed text-ink-soft">{description}</p>}
      </div>
    </div>
  )
}