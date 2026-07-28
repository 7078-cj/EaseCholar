export default function ExtractionSummary({ extracted, needsReview, reviewMessage, rawText }) {
    if (!extracted) return null;

    return (
        <div className="rounded border border-gray-200 bg-gray-50 p-4">
        <h3 className="mb-2 text-sm font-semibold text-gray-800">
            OCR-Extracted Record
        </h3>

        {needsReview && (
            <div className="mb-3 rounded border border-amber-300 bg-amber-50 p-2 text-xs text-amber-800">
            ⚠ {reviewMessage}
            </div>
        )}

        <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            <dt className="text-gray-500">GWA</dt>
            <dd>{extracted.gwa ?? "—"}</dd>

            <dt className="text-gray-500">Year Level</dt>
            <dd>{extracted.year_level || "—"}</dd>

            <dt className="text-gray-500">Course/Strand</dt>
            <dd>{extracted.strand_or_course || "—"}</dd>

            <dt className="text-gray-500">Confidence</dt>
            <dd className="capitalize">{extracted.confidence || "—"}</dd>
        </dl>

        {rawText && (
            <details className="mt-3">
            <summary className="cursor-pointer text-xs text-gray-500">
                View raw OCR text
            </summary>
            <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap rounded bg-white p-2 text-xs text-gray-600">
                {rawText}
            </pre>
            </details>
        )}
        </div>
  );
}