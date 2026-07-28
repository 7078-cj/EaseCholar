export default function MatchBadge({ percent }) {
  const color = percent >= 90 ? 'text-success' : percent >= 75 ? 'text-primary' : 'text-ink-faint'
  return (
    <div className="flex items-baseline gap-1">
      <span className={`font-display text-xl font-extrabold ${color}`}>{percent}%</span>
      <span className="text-xs font-medium text-ink-soft">match</span>
    </div>
  )
}