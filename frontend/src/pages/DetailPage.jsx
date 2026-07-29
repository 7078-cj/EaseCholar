import { Circle, Check, X, CircleAlert } from 'lucide-react'
import useDocumentsStore from '../store/useDocumentsStore'
import TopBar from '../components/layout/TopBar'
import BottomBar from '../components/layout/BottomBar'
import Button from '../components/ui/Button'
import EligibilityBadge from '../components/results/EligibilityBadge'
import MatchBadge from '../components/results/MatchBadge'

function Section({ title, children }) {
  return (
    <div className="border-b border-line-soft py-6 last:border-none">
      <h2 className="mb-3 font-display text-base font-bold text-ink">{title}</h2>
      {children}
    </div>
  )
}

const DOC_KEYWORD_MAP = [
  { pattern: /itr|income tax/i, label: 'BIR ITR or Tax Exemption Certificate', storeKey: 'itr' },
  { pattern: /indigen/i, label: 'Certificate of Indigency', storeKey: 'certificate_of_indigency' },
  { pattern: /national id|philid|birth certificate|psa/i, label: 'National ID or PSA Birth Certificate', storeKey: 'national_id' },
  { pattern: /transcript|tor|certificate of registration|\bcor\b|sf9|report card/i, label: 'Transcript / COR / Report Card', storeKey: 'cor_or_tor' },
]

/** Heuristically pulls document mentions out of the scraped `requirements` list
 * and cross-references what the student already uploaded to EaseKolar. */
function useDocumentsNeeded(requirements) {
  const reportCard = useDocumentsStore((s) => s.reportCard)
  const optional = useDocumentsStore((s) => s.optional)

  const found = new Map()
  for (const req of requirements || []) {
    for (const rule of DOC_KEYWORD_MAP) {
      if (rule.pattern.test(req) && !found.has(rule.label)) {
        const uploaded = rule.storeKey === 'cor_or_tor' ? !!(optional.cor_or_tor || reportCard) : !!optional[rule.storeKey]
        found.set(rule.label, uploaded)
      }
    }
  }
  return Array.from(found.entries()).map(([label, uploaded]) => ({ label, uploaded }))
}

const NOT_ELIGIBLE_BOX = {
  bg: 'bg-danger-soft',
  text: 'text-danger-text',
  border: 'border-danger-border',
}

export default function DetailPage({ scholarship: s, onBack }) {
  const documentsNeeded = useDocumentsNeeded(s.requirements)
  const uploadedCount = documentsNeeded.filter((d) => d.uploaded).length

  return (
    <div className="min-h-screen bg-bg">
      <TopBar onBack={onBack} right={null} />

      <div className="mx-auto max-w-[720px] px-5 pb-32 pt-6">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">{s.typeLabel}</p>
        <h1 className="mt-1 font-display text-2xl font-extrabold leading-snug tracking-tight text-ink">{s.name}</h1>
        <p className="mt-1 text-sm text-ink-soft">{s.provider}</p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <MatchBadge percent={s.matchPercent} />
          <EligibilityBadge status={s.status} />
        </div>

        <Section title="Overview">
          <p className="text-[14px] leading-relaxed text-ink-soft">
            {s.benefits
              ? `${s.provider} offers this ${s.typeLabel?.toLowerCase() || 'scholarship'} covering ${s.benefits.slice(0, 180)}${s.benefits.length > 180 ? '…' : ''}`
              : `A ${s.typeLabel?.toLowerCase() || 'scholarship'} opportunity from ${s.provider}.`}
          </p>
          {s.region && <p className="mt-2 text-[13px] text-ink-faint">Region: {s.region}</p>}
        </Section>

        <Section title="Eligibility">
          <ul className="flex flex-col gap-2.5">
            {s.gpaRequirement != null && (
              <li className="flex items-start gap-2.5 text-[14px] text-ink">
                <Dot /> Minimum GWA of <strong className="mx-1">{s.gpaRequirement}</strong>
              </li>
            )}
            {s.incomeRequirement != null && (
              <li className="flex items-start gap-2.5 text-[14px] text-ink">
                <Dot /> Annual family income at or below ₱{Number(s.incomeRequirement).toLocaleString()}
              </li>
            )}
            {s.yearLevels?.length > 0 && (
              <li className="flex items-start gap-2.5 text-[14px] text-ink">
                <Dot /> Open to: {s.yearLevels.join(', ')}
              </li>
            )}
            {s.courseKeywords?.length > 0 && (
              <li className="flex items-start gap-2.5 text-[14px] text-ink">
                <Dot /> Priority courses: {s.courseKeywords.join(', ')}
              </li>
            )}
            {s.requirements?.map((req, i) => (
              <li key={i} className="flex items-start gap-2.5 text-[14px] text-ink">
                <Dot /> {req}
              </li>
            ))}
          </ul>

          {s.status === 'not-eligible' && s.notEligibleReason && (
            <div className={`mt-4 flex items-start gap-2.5 rounded-xl border px-3.5 py-3 ${NOT_ELIGIBLE_BOX.bg} ${NOT_ELIGIBLE_BOX.border}`}>
              <CircleAlert size={16} strokeWidth={2.25} className={`mt-0.5 shrink-0 ${NOT_ELIGIBLE_BOX.text}`} />
              <p className={`text-[13px] leading-relaxed ${NOT_ELIGIBLE_BOX.text}`}>{s.notEligibleReason}</p>
            </div>
          )}
        </Section>

        <Section title="Documents You'll Likely Need">
          <div className="mb-3 flex items-start justify-between gap-3">
            <p className="text-[13px] leading-relaxed text-ink-faint">
              Based on this scholarship's listing — reflects what the provider is likely to ask for, not a guarantee,
              since EaseKolar doesn't control the external application form.
            </p>
            {documentsNeeded.length > 0 && (
              <span className="shrink-0 whitespace-nowrap rounded-full bg-bg px-2.5 py-1 text-[11px] font-semibold text-ink-faint">
                {uploadedCount}/{documentsNeeded.length}
              </span>
            )}
          </div>
          {documentsNeeded.length === 0 ? (
            <p className="text-[14px] text-ink-soft">No specific document requirements were listed for this scholarship.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {documentsNeeded.map((d) => (
                <li key={d.label} className="flex items-center gap-2.5 text-[14px]">
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                      d.uploaded ? 'bg-success' : 'border-[1.5px] border-line-soft'
                    }`}
                  >
                    {d.uploaded && <Check size={11} strokeWidth={3} className="text-white" />}
                  </span>
                  <span className={d.uploaded ? 'text-ink' : 'text-ink-soft'}>{d.label}</span>
                  {!d.uploaded && (
                    <span className="ml-auto flex items-center gap-1 text-xs font-medium text-warn-text">
                      <X size={12} strokeWidth={2.5} />
                      Not uploaded
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Section>

        {s.benefits && (
          <Section title="Benefits">
            <p className="text-[14px] leading-relaxed text-ink-soft">{s.benefits}</p>
          </Section>
        )}

        <Section title="Deadline">
          <p className="text-[14px] leading-relaxed text-ink-soft">
            Deadlines change often — check the official page below for the current date.
          </p>
        </Section>
      </div>

      <BottomBar>
        <Button as="a" href={s.officialUrl} target="_blank" rel="noopener noreferrer" variant="primary" size="lg" className="w-full">
          Visit Official Website →
        </Button>
      </BottomBar>
    </div>
  )
}

function Dot() {
  return <Circle size={6} strokeWidth={0} className="mt-2 shrink-0 fill-primary text-primary" />
}