const API = import.meta.env.VITE_API_URL;

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
        // Response body wasn't JSON (e.g. a 500 with an HTML error page) --
        // fall through and let the status check below produce the error.
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
     * Uploads a report card image + optional student fields, and returns the
     * OCR extraction + ranked scholarship matches in one call.
     *
     * @param {File} reportCardFile
     * @param {Object} studentFields - { gwa, family_income, year_level, course_interest, region }
     */
    export async function extractAndMatch(reportCardFile, studentFields = {}) {
    const formData = new FormData();
    formData.append("report_card", reportCardFile);

    Object.entries(studentFields).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
        formData.append(key, value);
        }
    });

    return postFormData("ocr/extract-and-match/", formData);
    }