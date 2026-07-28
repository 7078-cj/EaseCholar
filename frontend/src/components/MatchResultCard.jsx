export default function MatchResultCard({ result }) {
    const { name, provider, eligible, match_score, reasons, friendly_tips, link } = result;

    return (
        <div
        className={`rounded border p-4 ${
            eligible ? "border-green-300 bg-green-50" : "border-gray-200 bg-white"
        }`}
        >
        <div className="flex items-start justify-between gap-2">
            <div>
            <h4 className="font-semibold text-gray-900">{name}</h4>
            <p className="text-xs text-gray-500">{provider}</p>
            </div>
            <span
            className={`shrink-0 rounded-full px-2 py-1 text-xs font-medium ${
                eligible
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            >
            {match_score}% match
            </span>
        </div>

        {reasons?.length > 0 && (
            <ul className="mt-2 list-inside list-disc text-xs text-gray-600">
            {reasons.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
        )}

        {friendly_tips?.length > 0 && (
            <div className="mt-3 rounded bg-blue-50 p-2">
            <p className="text-xs font-medium text-blue-800">To improve eligibility:</p>
            <ul className="mt-1 list-inside list-disc text-xs text-blue-700">
                {friendly_tips.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
            </div>
        )}

        <a
            href={link}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-block text-xs font-medium text-blue-600 hover:underline"
        >
            View scholarship details →
        </a>
        </div>
    );
}