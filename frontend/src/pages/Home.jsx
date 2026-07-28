import { useState } from "react";
import { extractAndMatch } from "../../api/scholar";
import ReportCardUpload from "../components/ReportCardUpload";
import StudentDetailsFields from "../components/StudentDetailsFields";
import ExtractionSummary from "../components/ExtractionSummary";
import MatchResultsList from "../components/MatchResultsList";

const EMPTY_FIELDS = {
    gwa: "",
    family_income: "",
    year_level: "",
    course_interest: "",
    region: "",
};

export default function ScholarshipMatchTestPage() {
    const [file, setFile] = useState(null);
    const [fields, setFields] = useState(EMPTY_FIELDS);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [response, setResponse] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();

        if (!file) {
        setError("Please select a report card image first.");
        return;
        }

        setLoading(true);
        setError(null);
        setResponse(null);

        try {
        const data = await extractAndMatch(file, fields);
        setResponse(data);
        } catch (err) {
        setError(err.message);
        } finally {
        setLoading(false);
        }
    }

    return (
        <div className="mx-auto max-w-2xl p-6">
        <h1 className="mb-4 text-xl font-bold text-gray-900">
            Scholarship Match — Test Page
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <ReportCardUpload file={file} onFileChange={setFile} />
            <StudentDetailsFields fields={fields} onChange={setFields} />

            <button
            type="submit"
            disabled={loading}
            className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
            {loading ? "Processing..." : "Extract & Match"}
            </button>
        </form>

        {error && (
            <div className="mt-4 rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700">
            {error}
            </div>
        )}

        {response && (
            <div className="mt-6 flex flex-col gap-6">
            <ExtractionSummary
                extracted={response.extracted}
                needsReview={response.needs_review}
                reviewMessage={response.review_message}
                rawText={response.raw_text}
            />

            <MatchResultsList
                results={response.results}
                eligibleCount={response.eligible_count}
                totalChecked={response.total_scholarships_checked}
            />
            </div>
        )}
        </div>
    );
}