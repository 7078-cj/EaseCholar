import { useState } from 'react'
import useDocumentsStore from '../store/useDocumentsStore'
import { OPTIONAL_DOCUMENTS } from '../utils/constants'
import TopBar from '../components/layout/TopBar'
import BottomBar from '../components/layout/BottomBar'
import Button from '../components/ui/Button'
import FileUploadCard from '../components/ui/FileUploadCard'
import InfoBanner from '../components/ui/InfoBanner'

const BASE_ACCURACY = 55
const REPORT_CARD_ACCURACY = 20
const PER_OPTIONAL_ACCURACY = 6.25 // 4 optional docs share the remaining 25%

export default function DocumentUpload({ onComplete, onBack }) {
  const reportCard = useDocumentsStore((s) => s.reportCard)
  const setReportCard = useDocumentsStore((s) => s.setReportCard)
  const clearReportCard = useDocumentsStore((s) => s.clearReportCard)
  const optional = useDocumentsStore((s) => s.optional)
  const setOptionalDocument = useDocumentsStore((s) => s.setOptionalDocument)
  const clearOptionalDocument = useDocumentsStore((s) => s.clearOptionalDocument)

  const [error, setError] = useState(null)

  const optionalUploadedCount = Object.values(optional).filter(Boolean).length
  const accuracy = Math.round(
    BASE_ACCURACY + (reportCard ? REPORT_CARD_ACCURACY : 0) + optionalUploadedCount * PER_OPTIONAL_ACCURACY
  )

  const handleContinue = () => {
    if (!reportCard) {
      setError('Your report card / academic record photo is required to run the eligibility check.')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    setError(null)
    onComplete()
  }

  return (
    <div className="min-h-screen bg-bg">
      <TopBar onBack={onBack} right={null} />

      <div className="mx-auto max-w-[560px] px-5 pb-36 pt-8">
        <div className="mb-7">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
            Required to match
          </div>
          <h1 className="font-display text-[clamp(24px,5vw,30px)] font-extrabold tracking-tight text-ink">
            Verify Your Academic Record
          </h1>
          <p className="mt-2.5 text-[15px] leading-relaxed text-ink-soft">
            We read your GWA straight from a photo of your report card, SF9, or transcript — that's what powers
            every eligibility check below.
          </p>
        </div>

        {error && (
          <div className="mb-5">
            <InfoBanner tone="warn" title="Almost there">
              {error}
            </InfoBanner>
          </div>
        )}

        <div className="mb-8">
          <FileUploadCard
            label="Official SF9 / Report Card / TOR"
            hint="A clear photo of your latest grades. Front side is enough if GWA is printed there."
            file={reportCard}
            onSelect={setReportCard}
            onRemove={clearReportCard}
            required
          />
        </div>

        {/* Match-accuracy meter */}
        <div className="mb-8 rounded-2xl border border-line-soft bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-ink">Match Accuracy</span>
            <span className="font-display text-xl font-extrabold text-primary">{accuracy}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-line-soft">
            <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${accuracy}%` }} />
          </div>
          <p className="mt-2.5 text-[12px] leading-relaxed text-ink-faint">
            Documents aren't a gate — they only move scholarships from "Missing Requirements" to "Eligible" once we
            can confirm the numbers behind them.
          </p>
        </div>

        <div className="mb-4">
          <h2 className="text-sm font-semibold text-ink">Optional — improves match accuracy further</h2>
        </div>

        <div className="flex flex-col gap-3">
          {OPTIONAL_DOCUMENTS.map((doc) => (
            <FileUploadCard
              key={doc.field}
              label={doc.label}
              hint={doc.hint}
              file={optional[doc.field]}
              onSelect={(file) => setOptionalDocument(doc.field, file)}
              onRemove={() => clearOptionalDocument(doc.field)}
            />
          ))}
        </div>
      </div>

      <BottomBar>
        <Button variant="primary" size="lg" onClick={handleContinue} className="w-full">
          Find My Scholarships →
        </Button>
        {optionalUploadedCount === 0 && (
          <p className="text-center text-xs leading-relaxed text-ink-faint">
            You can always add the optional documents later — some matches may stay in "Missing Requirements" until
            you do.
          </p>
        )}
      </BottomBar>
    </div>
  )
}