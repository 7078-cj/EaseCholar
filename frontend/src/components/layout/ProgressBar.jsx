export default function ProgressBar({ current, total }) {
  const pct = Math.round((current / total) * 100)
  return (
    <div className="mb-8">
      <div className="mb-2 flex justify-between">
        <span className="text-[13px] font-medium text-ink-soft">
          Step {current} of {total}
        </span>
        <span className="text-[13px] font-semibold text-primary">{pct}% complete</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-line">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-primary-light transition-all duration-400 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}