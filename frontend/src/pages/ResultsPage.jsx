import { useMemo, useState } from 'react'
import useMatchStore from '../store/useMatchStore'
import TopBar from '../components/layout/TopBar'
import ScholarshipCard from '../components/results/ScholarshipCard'
import BottomSheet from '../components/ui/BottomSheet'
import InfoBanner from '../components/ui/InfoBanner'
import Button from '../components/ui/Button'

const STATUS_TABS = [
  { key: 'all', label: 'All' },
  { key: 'eligible', label: 'Eligible' },
  { key: 'missing', label: 'Missing Requirements' },
  { key: 'not-eligible', label: 'Not Eligible' },
]

// Only sorts backed by data the backend actually returns — no fabricated
// deadline/amount fields (the Scholarship model doesn't have them yet).
const SORT_OPTIONS = [
  { key: 'match', label: 'Highest Match' },
  { key: 'location', label: 'Location (Region)' },
  { key: 'name', label: 'Scholarship Name (A–Z)' },
]

export default function ResultsPage({ onSelect, onBack, onAddDocuments }) {
  const results = useMatchStore((s) => s.results)
  const status = useMatchStore((s) => s.status)
  const needsReview = useMatchStore((s) => s.needsReview)
  const reviewMessage = useMatchStore((s) => s.reviewMessage)

  const [statusFilter, setStatusFilter] = useState('all')
  const [sortKey, setSortKey] = useState('match')
  const [sheetOpen, setSheetOpen] = useState(false)

  const filtered = useMemo(() => {
    let list = statusFilter === 'all' ? results : results.filter((r) => r.status === statusFilter)
    list = [...list].sort((a, b) => {
      if (sortKey === 'match') return b.matchPercent - a.matchPercent
      if (sortKey === 'location') return (a.region || '').localeCompare(b.region || '')
      if (sortKey === 'name') return a.name.localeCompare(b.name)
      return 0
    })
    return list
  }, [results, statusFilter, sortKey])

  const closest = useMemo(() => [...results].sort((a, b) => b.matchPercent - a.matchPercent).slice(0, 3), [results])

  return (
    <div className="min-h-screen bg-bg">
      <TopBar
        onBack={onBack}
        right={
          <button onClick={() => setSheetOpen(true)} className="flex items-center gap-1 text-[13px] font-semibold text-primary">
            Sort
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M3 6h18M6 12h12M10 18h4" />
            </svg>
          </button>
        }
      />

      <div className="mx-auto max-w-[1200px] px-5 pb-16 pt-6">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">Your Scholarship Matches</h1>
        <p className="mt-1 text-sm text-ink-soft">
          {results.length} scholarship{results.length !== 1 ? 's' : ''} checked against your profile
        </p>

        {needsReview && reviewMessage && (
          <div className="mt-4">
            <InfoBanner tone="warn" title="Double-check your details">
              {reviewMessage}
            </InfoBanner>
          </div>
        )}

        {/* Status filter chips — horizontally scrollable, never wraps the layout */}
        <div className="no-scrollbar mt-5 flex gap-2 overflow-x-auto pb-1">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`shrink-0 rounded-full border px-3.5 py-2 text-[13px] font-semibold transition-colors ${
                statusFilter === tab.key ? 'border-primary bg-primary text-white' : 'border-line bg-white text-ink-soft'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {status === 'loading' && <p className="mt-10 text-center text-sm text-ink-soft">Loading your matches...</p>}

        {status === 'success' && filtered.length === 0 && results.length > 0 && (
          <div className="mt-10 rounded-2xl border border-line-soft bg-white p-6 text-center">
            <p className="text-sm font-semibold text-ink">No scholarships in this filter yet</p>
            <p className="mt-1 text-sm text-ink-soft">Try a different tab, or view all results.</p>
            <Button variant="secondary" size="md" className="mt-4" onClick={() => setStatusFilter('all')}>
              View all results
            </Button>
          </div>
        )}

        {status === 'success' && results.length === 0 && (
          <div className="mt-10 rounded-2xl border border-line-soft bg-white p-6 text-center">
            <p className="text-sm font-semibold text-ink">No exact matches yet</p>
            <p className="mt-1 text-sm text-ink-soft">
              We couldn't find scholarships in our database right now. Check back soon, or refine your profile.
            </p>
          </div>
        )}

        {filtered.length > 0 && (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((s) => (
              <ScholarshipCard key={s.id} scholarship={s} onViewDetails={onSelect} onAddDocuments={onAddDocuments} />
            ))}
          </div>
        )}
      </div>

      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="Sort by">
        <div className="flex flex-col gap-1">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => {
                setSortKey(opt.key)
                setSheetOpen(false)
              }}
              className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-left text-[15px] font-medium ${
                sortKey === opt.key ? 'bg-primary-soft text-primary' : 'text-ink'
              }`}
            >
              {opt.label}
              {sortKey === opt.key && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </BottomSheet>
    </div>
  )
}