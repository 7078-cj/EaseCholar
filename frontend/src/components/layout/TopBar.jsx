function BackButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 py-2 text-sm font-medium text-ink-soft transition-colors hover:text-ink"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
      Back
    </button>
  )
}

export default function TopBar({ onBack, right }) {
  return (
    <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-line-soft bg-white/95 px-5 backdrop-blur-md">
      {onBack ? <BackButton onClick={onBack} /> : <div className="w-14" />}
      <span className="font-display text-base font-bold text-ink">EaseKolar</span>
      <div className="min-w-14 text-right">{right}</div>
    </div>
  )
}