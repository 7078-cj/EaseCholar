const CONFIG = {
  eligible: {
    bg: 'bg-success-soft',
    text: 'text-success-text',
    border: 'border-success-border',
    label: 'Eligible',
    icon: <path d="M20 6L9 17l-5-5" />,
  },
  missing: {
    bg: 'bg-warn-soft',
    text: 'text-warn-text',
    border: 'border-warn-border',
    label: 'Missing Requirements',
    icon: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4M12 16h.01" />
      </>
    ),
  },
  'not-eligible': {
    bg: 'bg-danger-soft',
    text: 'text-danger-text',
    border: 'border-danger-border',
    label: 'Not Eligible',
    icon: <path d="M18 6L6 18M6 6l12 12" />,
  },
}

export default function EligibilityBadge({ status, className = '' }) {
  const c = CONFIG[status]
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold ${c.bg} ${c.text} ${c.border} ${className}`}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        {c.icon}
      </svg>
      {c.label}
    </span>
  )
}