export default function FieldLabel({ label, hint }) {
  return (
    <div className="mb-2">
      <label className="block text-[15px] font-semibold text-ink">{label}</label>
      {hint && <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">{hint}</p>}
    </div>
  )
}