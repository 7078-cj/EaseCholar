const API = import.meta.env.VITE_API_URL;

const OPTIONAL_DOCUMENT_KEYS = [
    "itr",
    "certificate_of_indigency",
    "national_id",
    "cor_or_tor",
];

/**
 * Low-level POST helper for multipart/form-data requests.
 * Throws an Error with a readable message on non-2xx responses.
 */
async function postFormData(path, formData) {
    const response = await fetch(`${API}${path}`, {
        method: "POST",
        body: formData,
    });

    let payload = null;
    try {
        payload = await response.json();
    } catch {
        // Response body wasn't JSON — fall through to status check below.
    }

    if (!response.ok) {
        const message =
            payload?.error ||
            `Request failed (${response.status} ${response.statusText})`;
        throw new Error(message);
    }

    return payload;
}

/**
 * Uploads a report card, optional supporting documents, and student fields.
 * Returns OCR extraction + ranked scholarship matches in one call.
 *
 * @param {File} reportCardFile
 * @param {Object} studentFields - { gwa, family_income, year_level, course_interest, region }
 * @param {Object} optionalDocuments - { itr?, certificate_of_indigency?, national_id?, cor_or_tor? }
 */
export async function extractAndMatch(
    reportCardFile,
    studentFields = {},
    optionalDocuments = {}
) {
    const formData = new FormData();
    formData.append("report_card", reportCardFile);

    Object.entries(studentFields).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            formData.append(key, value);
        }
    });

    OPTIONAL_DOCUMENT_KEYS.forEach((key) => {
        const file = optionalDocuments[key];
        if (file) {
            formData.append(key, file);
        }
    });

    return postFormData("find/", formData);
}
