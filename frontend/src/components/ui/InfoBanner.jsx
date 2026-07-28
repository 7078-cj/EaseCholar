const TONES = {
  warn: { bg: 'bg-warn-soft', border: 'border-warn-border', text: 'text-warn-deep', icon: 'text-warn' },
  success: { bg: 'bg-success-soft', border: 'border-success-border', text: 'text-success-deep', icon: 'text-success' },
  info: { bg: 'bg-primary-soft', border: 'border-primary/20', text: 'text-primary-dark', icon: 'text-primary' },
}

export default function InfoBanner({ tone = 'info', title, children }) {
  const t = TONES[tone]
  return (
    <div className={`flex gap-3 rounded-2xl border px-4 py-3.5 ${t.bg} ${t.border}`}>
      <svg
        className={`mt-0.5 shrink-0 ${t.icon}`}
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4M12 16h.01" />
      </svg>
      <div className={`text-[13px] leading-relaxed ${t.text}`}>
        {title && <p className="mb-0.5 font-semibold">{title}</p>}
        {children}
      </div>
    </div>
  )
}