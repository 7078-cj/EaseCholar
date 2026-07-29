import { useState } from 'react'
import useProfileStore from '../store/useProfileStore'
import { REGIONS, YEAR_LEVELS, INCOME_OPTIONS } from '../utils/constants'
import TopBar from '../components/layout/TopBar'
import ProgressBar from '../components/layout/ProgressBar'
import BottomBar from '../components/layout/BottomBar'
import Button from '../components/ui/Button'
import TextInput from '../components/ui/TextInput'
import SelectInput from '../components/ui/SelectInput'
import RadioCard from '../components/ui/RadioCard'
import CheckboxCard from '../components/ui/CheckboxCard'
import FieldLabel from '../components/ui/FieldLabel'
import InfoBanner from '../components/ui/InfoBanner'

const TOTAL_STEPS = 4

const STEP_TITLES = ['Basic Information', 'Academic Information', 'Financial Information', 'Study Preference']

const STEP_SUBTITLES = [
  'Your name, region, and citizenship help us find regionally targeted scholarships.',
  'Your school, GPA, and year level are the most important factors for eligibility matching.',
  'Family income determines eligibility for need-based scholarships — the most common type.',
  'Tell us your academic track so we can surface the right scholarships for you.',
]

export default function ProfileWizard({ onComplete, onBack }) {
  const [step, setStep] = useState(1)
  const profile = useProfileStore((s) => s.profile)
  const updateField = useProfileStore((s) => s.updateField)
  const isStepValid = useProfileStore((s) => s.isStepValid)

  const canProceed = isStepValid(step)

  const next = () => {
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1)
      window.scrollTo(0, 0)
    } else {
      onComplete()
    }
  }

  const prev = () => {
    if (step > 1) {
      setStep((s) => s - 1)
      window.scrollTo(0, 0)
    } else {
      onBack()
    }
  }

  return (
    <div className="min-h-screen bg-bg">
      <TopBar onBack={prev} right={<span className="text-[13px] font-medium text-ink-faint">{step}/{TOTAL_STEPS}</span>} />

      <div className="mx-auto max-w-[560px] px-5 pb-32 pt-8">
        <ProgressBar current={step} total={TOTAL_STEPS} />

        <div className="mb-8 animate-fadeIn">
          <h1 className="font-display text-[clamp(24px,5vw,32px)] font-extrabold tracking-tight text-ink">
            {STEP_TITLES[step - 1]}
          </h1>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{STEP_SUBTITLES[step - 1]}</p>
        </div>

        <div key={step} className="flex flex-col gap-6 animate-fadeIn">
          {step === 1 && (
            <>
              <div>
                <FieldLabel label="Full Name" hint="Used for identity verification and record matching." />
                <TextInput value={profile.name} onChange={(v) => updateField('name', v)} placeholder="e.g. Juan dela Cruz" />
              </div>

              <div>
                <FieldLabel label="Region / Province" hint="Used to check regional quota and localized scholarship eligibility." />
                <SelectInput
                  value={profile.region}
                  onChange={(v) => updateField('region', v)}
                  options={REGIONS.map((r) => ({ label: r, value: r }))}
                  placeholder="Select your region..."
                />
              </div>

              <CheckboxCard
                checked={profile.citizenship}
                onClick={() => updateField('citizenship', !profile.citizenship)}
                title="I am a Filipino citizen"
                description="Most government scholarships require Filipino citizenship. This filters out scholarships you would not qualify for."
              />
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <FieldLabel label="Current or Aspiring School" hint="Helps us find scholarships tied to specific universities or institutions." />
                <TextInput
                  value={profile.school}
                  onChange={(v) => updateField('school', v)}
                  placeholder="e.g. University of the Philippines Diliman"
                />
                <p className="mt-1.5 text-xs text-ink-faint">Optional — leave blank if not yet enrolled</p>
              </div>

              <div>
                <FieldLabel label="Incoming Year Level" hint="Determines which scholarships you are currently eligible to apply for." />
                <SelectInput
                  value={profile.yearLevel}
                  onChange={(v) => updateField('yearLevel', v)}
                  options={YEAR_LEVELS.map((y) => ({ label: y, value: y }))}
                  placeholder="Select year level..."
                />
              </div>

              <div>
                <FieldLabel
                  label="Course / Program"
                  hint="Used to match you with priority course scholarships (e.g. CHED priority list, DOST STEM programs)."
                />
                <TextInput value={profile.course} onChange={(v) => updateField('course', v)} placeholder="e.g. BS Computer Science, BS Nursing" />
                <p className="mt-1.5 text-xs text-ink-faint">Optional — but improves match accuracy significantly</p>
              </div>

              <div>
                <FieldLabel label="GPA / General Average" hint="Evaluated against grade cutoffs for each scholarship. Validated via COR or SF9." />
                <TextInput
                  value={profile.gpa}
                  onChange={(v) => updateField('gpa', v)}
                  placeholder="e.g. 92.5"
                  type="number"
                  inputMode="decimal"
                />
                <p className="mt-1.5 text-xs text-ink-faint">Enter your grade on a 100-point scale</p>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div>
                <FieldLabel
                  label="Annual Family Income Bracket"
                  hint="Used for financial need assessment. This is validated against your ITR or Certificate of Indigency if you upload it."
                />
                <div className="flex flex-col gap-2.5">
                  {INCOME_OPTIONS.map((opt) => (
                    <RadioCard
                      key={opt.value}
                      selected={profile.incomeBracket === opt.value}
                      onClick={() => updateField('incomeBracket', opt.value)}
                      title={opt.label}
                    />
                  ))}
                </div>
              </div>

              <InfoBanner tone="warn">
                Your income bracket is only used to match scholarships — we never share this information. You can
                optionally upload an ITR to confirm this and improve your match accuracy.
              </InfoBanner>
            </>
          )}

          {step === 4 && (
            <>
              <div>
                <FieldLabel label="Academic Track" hint="Determines whether we show you undergraduate or graduate scholarships." />
                <div className="flex flex-col gap-2.5">
                  <RadioCard
                    selected={profile.track === 'undergraduate'}
                    onClick={() => updateField('track', 'undergraduate')}
                    title="Undergraduate"
                    description="Bachelor's degree programs (1st–5th year)"
                  />
                  <RadioCard
                    selected={profile.track === 'masters'}
                    onClick={() => updateField('track', 'masters')}
                    title="Master's / Graduate"
                    description="Postgraduate and master's degree programs"
                  />
                </div>
              </div>

              <InfoBanner tone="success" title="Almost there!">
                Next, you'll upload your report card so we can verify your GWA — after that, your results are ready
                immediately.
              </InfoBanner>
            </>
          )}
        </div>
      </div>

      <BottomBar>
        <Button variant="primary" size="lg" disabled={!canProceed} onClick={next} className="w-full">
          {step === TOTAL_STEPS ? 'Continue to Document Upload →' : `Continue to Step ${step + 1} →`}
        </Button>
      </BottomBar>
    </div>
  )
}