export default function MatchResultCard({ result }) {
    const {
        scholarship,
        eligible,
        match_score,
        reasons,
        friendly_tips,
    } = result;

    const {
        name,
        provider,
        link,
        requirements,
        benefits,
        category,
        min_gwa_percent,
        max_family_income,
        year_levels,
        course_keywords,
        region,
    } = scholarship;

    return (
        <div
            className={`rounded border p-4 ${
                eligible ? "border-green-300 bg-green-50" : "border-gray-200 bg-white"
            }`}
        >
            <div className="flex items-start justify-between gap-2">
                <div>
                    <h4 className="font-semibold text-gray-900">{name}</h4>
                    <p className="text-xs text-gray-500">
                        {provider}
                        {category ? ` · ${category}` : ""}
                    </p>
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

            <div className="mt-3 rounded bg-white/70 p-3 text-xs text-gray-700">
                <p className="font-medium text-gray-800">Eligibility criteria</p>
                <ul className="mt-1 list-inside list-disc space-y-0.5">
                    {min_gwa_percent != null && (
                        <li>Minimum GWA: {min_gwa_percent}</li>
                    )}
                    {max_family_income != null && (
                        <li>
                            Max family income: ₱{Number(max_family_income).toLocaleString()}
                        </li>
                    )}
                    {year_levels?.length > 0 && (
                        <li>Year levels: {year_levels.join(", ")}</li>
                    )}
                    {course_keywords?.length > 0 && (
                        <li>Priority courses: {course_keywords.join(", ")}</li>
                    )}
                    {region && region.toLowerCase() !== "any" && (
                        <li>Region: {region}</li>
                    )}
                </ul>
            </div>

            {requirements?.length > 0 && (
                <div className="mt-3">
                    <p className="text-xs font-medium text-gray-800">Requirements</p>
                    <ul className="mt-1 list-inside list-disc text-xs text-gray-600">
                        {requirements.map((req, i) => (
                            <li key={i}>{req}</li>
                        ))}
                    </ul>
                </div>
            )}

            {benefits && (
                <div className="mt-3">
                    <p className="text-xs font-medium text-gray-800">Benefits</p>
                    <p className="mt-1 text-xs text-gray-600">{benefits}</p>
                </div>
            )}

            {reasons?.length > 0 && (
                <ul className="mt-3 list-inside list-disc text-xs text-gray-600">
                    {reasons.map((r, i) => (
                        <li key={i}>{r}</li>
                    ))}
                </ul>
            )}

            {friendly_tips?.length > 0 && (
                <div className="mt-3 rounded bg-blue-50 p-2">
                    <p className="text-xs font-medium text-blue-800">
                        To improve eligibility:
                    </p>
                    <ul className="mt-1 list-inside list-disc text-xs text-blue-700">
                        {friendly_tips.map((t, i) => (
                            <li key={i}>{t}</li>
                        ))}
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
