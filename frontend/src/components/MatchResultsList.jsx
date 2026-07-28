import MatchResultCard from "./MatchResultCard";

export default function MatchResultsList({ results, eligibleCount, totalChecked }) {
    if (!results) return null;

    if (results.length === 0) {
        return (
        <p className="text-sm text-gray-500">
            No scholarships found in the database yet.
        </p>
        );
    }

    return (
        <div className="flex flex-col gap-3">
        <p className="text-sm text-gray-600">
            {eligibleCount} of {totalChecked} scholarships you're eligible for
        </p>
        {results.map((r) => (
            <MatchResultCard key={r.scholarship_id} result={r} />
        ))}
        </div>
    );
}