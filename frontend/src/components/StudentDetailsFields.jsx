const YEAR_LEVELS = [
    "Grade 12", "1st year", "2nd year", "3rd year", "4th year",
];

export default function StudentDetailsFields({ fields, onChange }) {
    const update = (key) => (e) => onChange({ ...fields, [key]: e.target.value });

    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
            GWA (optional override)
            </label>
            <input
            type="number"
            step="0.01"
            value={fields.gwa}
            onChange={update("gwa")}
            placeholder="e.g. 1.75"
            className="rounded border border-gray-300 p-2 text-sm"
            />
        </div>

        <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
            Family Annual Income (₱)
            </label>
            <input
            type="number"
            value={fields.family_income}
            onChange={update("family_income")}
            placeholder="e.g. 250000"
            className="rounded border border-gray-300 p-2 text-sm"
            />
        </div>

        <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
            Year Level
            </label>
            <select
            value={fields.year_level}
            onChange={update("year_level")}
            className="rounded border border-gray-300 p-2 text-sm"
            >
            <option value="">-- select --</option>
            {YEAR_LEVELS.map((yl) => (
                <option key={yl} value={yl}>{yl}</option>
            ))}
            </select>
        </div>

        <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
            Region
            </label>
            <input
            type="text"
            value={fields.region}
            onChange={update("region")}
            placeholder="e.g. Region I"
            className="rounded border border-gray-300 p-2 text-sm"
            />
        </div>

        <div className="flex flex-col gap-1 sm:col-span-2">
            <label className="text-sm font-medium text-gray-700">
            Course / Strand Interest
            </label>
            <input
            type="text"
            value={fields.course_interest}
            onChange={update("course_interest")}
            placeholder="e.g. BS Computer Science"
            className="rounded border border-gray-300 p-2 text-sm"
            />
        </div>
        </div>
    );
}