const DOCUMENT_LABELS = {
    itr: "BIR ITR / Tax Exemption",
    certificate_of_indigency: "Certificate of Indigency",
    national_id: "National ID / Birth Certificate",
    cor_or_tor: "COR / Transcript of Records",
};

function DocumentCard({ docType, result }) {
    if (!result) return null;

    const label = DOCUMENT_LABELS[docType] || docType;

    if (!result.success) {
        return (
            <div className="rounded border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                <p className="font-medium">{label}</p>
                <p className="mt-1">{result.error || "Extraction failed."}</p>
            </div>
        );
    }

    const data = result.data || {};

    return (
        <div className="rounded border border-gray-200 bg-white p-3">
            <p className="text-xs font-semibold text-gray-800">{label}</p>
            <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                {Object.entries(data).map(([key, value]) => {
                    if (value === null || value === "" || key === "subjects") return null;
                    const display =
                        typeof value === "boolean" ? (value ? "Yes" : "No") : String(value);
                    return (
                        <div key={key} className="contents">
                            <dt className="capitalize text-gray-500">
                                {key.replace(/_/g, " ")}
                            </dt>
                            <dd className="text-gray-800">{display}</dd>
                        </div>
                    );
                })}
            </dl>
            {data.confidence && (
                <p className="mt-2 text-xs text-gray-500 capitalize">
                    Confidence: {data.confidence}
                </p>
            )}
        </div>
    );
}

export default function DocumentsExtractionSummary({ documentsExtracted }) {
    if (!documentsExtracted) return null;

    const uploaded = Object.entries(documentsExtracted).filter(([, v]) => v !== null);
    if (uploaded.length === 0) return null;

    return (
        <div className="rounded border border-gray-200 bg-gray-50 p-4">
            <h3 className="mb-3 text-sm font-semibold text-gray-800">
                Optional Documents — OCR Results
            </h3>
            <div className="flex flex-col gap-3">
                {uploaded.map(([docType, result]) => (
                    <DocumentCard key={docType} docType={docType} result={result} />
                ))}
            </div>
        </div>
    );
}
