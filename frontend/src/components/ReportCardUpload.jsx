export default function ReportCardUpload({ file, onFileChange }) {
    return (
        <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">
            Report Card / Grade Slip
        </label>
        <input
            type="file"
            accept="image/*"
            onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
            className="rounded border border-gray-300 p-2 text-sm"
        />
        {file && (
            <p className="text-xs text-gray-500">Selected: {file.name}</p>
        )}
        </div>
    );
}