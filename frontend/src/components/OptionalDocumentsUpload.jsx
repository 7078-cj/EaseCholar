const DOCUMENT_SECTIONS = [
    {
        title: "Financial documents",
        description:
            "Upload both when available — the Certificate of Indigency supplements your ITR.",
        documents: [
            {
                key: "itr",
                label: "BIR Income Tax Return (ITR) or Tax Exemption Certificate",
                hint: "Latest filed ITR of parent/guardian, or a Certificate of Tax Exemption.",
            },
            {
                key: "certificate_of_indigency",
                label: "Certificate of Indigency",
                hint: "Issued by your Barangay — proof of financial need.",
            },
        ],
    },
    {
        title: "Identity verification",
        description: null,
        documents: [
            {
                key: "national_id",
                label: "National ID (PhilID) or PSA / NSO Birth Certificate",
                hint: "Clear photocopy or scan used for identity and citizenship verification.",
            },
        ],
    },
    {
        title: "Academic records",
        description: null,
        documents: [
            {
                key: "cor_or_tor",
                label: "Certificate of Registration (COR) or Transcript of Records",
                hint: "Most recent academic record showing your general average.",
            },
        ],
    },
];

function DocumentRow({ doc, file, onFileChange }) {
    return (
        <div className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900">{doc.label}</p>
                <p className="mt-0.5 text-xs text-gray-500">{doc.hint}</p>
                {file && (
                    <p className="mt-1 text-xs text-teal-700">Selected: {file.name}</p>
                )}
            </div>
            <label className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800">
                <span>Upload</span>
                <input
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => onFileChange(doc.key, e.target.files?.[0] ?? null)}
                />
            </label>
        </div>
    );
}

export default function OptionalDocumentsUpload({ files, onFileChange }) {
    return (
        <div className="flex flex-col gap-4">
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                Finish your profile first — optional documents improve matching accuracy
                and auto-fill income or academic details via OCR.
            </div>

            {DOCUMENT_SECTIONS.map((section) => (
                <div
                    key={section.title}
                    className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                >
                    <h3 className="text-sm font-semibold text-gray-900">{section.title}</h3>
                    {section.description && (
                        <p className="mt-1 text-xs text-gray-500">{section.description}</p>
                    )}
                    <div className="mt-3 flex flex-col gap-3">
                        {section.documents.map((doc) => (
                            <DocumentRow
                                key={doc.key}
                                doc={doc}
                                file={files[doc.key]}
                                onFileChange={onFileChange}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
