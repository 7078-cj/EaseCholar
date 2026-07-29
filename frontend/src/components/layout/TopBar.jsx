function BackButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-full py-2 pl-1 pr-3 text-sm font-medium text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink"
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
    <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-white/60 bg-white/70 px-5 shadow-[0_1px_0_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.12)] backdrop-blur-xl backdrop-saturate-150">
      {onBack ? <BackButton onClick={onBack} /> : <div className="w-14" />}
      <span className="font-display text-base font-bold tracking-tight text-ink">EaseKolar</span>
      <div className="min-w-14 text-right">{right}</div>
    </div>
  )
}