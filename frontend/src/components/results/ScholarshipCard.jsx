import { useState } from 'react'
import EligibilityBadge from './EligibilityBadge'
import MatchBadge from './MatchBadge'
import Button from '../ui/Button'

export default function ScholarshipCard({ scholarship, onViewDetails, onAddDocuments }) {
  const [expanded, setExpanded] = useState(false)
  const s = scholarship

  return (
    <div className="flex h-full flex-col rounded-2xl border border-line-soft bg-white p-5 transition-shadow hover:shadow-md hover:shadow-ink/5">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
            {s.typeLabel}
          </p>
          <h3 className="mt-0.5 line-clamp-2 font-display text-[17px] font-bold leading-snug text-ink">{s.name}</h3>
          <p className="mt-0.5 truncate text-[13px] text-ink-soft">{s.provider}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <MatchBadge percent={s.matchPercent} />
          <EligibilityBadge status={s.status} />
        </div>
      </div>

      {/* Status message — grows to fill available space so footers align across cards */}
      <div className="flex-1">
        {s.status === 'not-eligible' && s.notEligibleReason && (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink-soft">{s.notEligibleReason}</p>
        )}

        {s.status === 'missing' && s.missingInputs.length > 0 && (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-warn-text">
            Missing: {s.missingInputs.map((m) => m.label).join(', ')}
          </p>
        )}

        {s.status === 'eligible' && (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink-soft">{s.whyMatch}</p>
        )}

        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-3 flex items-center gap-1 text-[13px] font-semibold text-primary"
        >
          Why this match?
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            className={`transition-transform ${expanded ? 'rotate-180' : ''}`}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
        {expanded && (
          <p className="mt-2 rounded-xl bg-bg px-3.5 py-3 text-[13px] leading-relaxed text-ink-soft animate-fadeIn">
            {s.whyMatch}
          </p>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {s.status === 'missing' && (
          <Button variant="primary" size="md" onClick={() => onAddDocuments?.(s)} className="flex-1">
            Add documents now
          </Button>
        )}
        <Button
          variant={s.status === 'missing' ? 'secondary' : 'primary'}
          size="md"
          onClick={() => onViewDetails(s)}
          className={s.status === 'missing' ? 'flex-1' : 'w-full'}
        >
          View details
        </Button>
      </div>
    </div>
  )
}