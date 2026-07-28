import logging

from .extract import ocr_extract_text
from ..utils import (
    generate,
    itr_prompt,
    indigency_prompt,
    identity_prompt,
    academic_record_prompt,
)

logger = logging.getLogger(__name__)

DOCUMENT_EXTRACTORS = {
    "itr": itr_prompt,
    "certificate_of_indigency": indigency_prompt,
    "national_id": identity_prompt,
    "cor_or_tor": academic_record_prompt,
}


def extract_document(uploaded_file, document_type):
    """
    OCR + LLM extraction for optional supporting documents.

    document_type: one of itr, certificate_of_indigency, national_id, cor_or_tor
    """

    prompt_fn = DOCUMENT_EXTRACTORS.get(document_type)
    if prompt_fn is None:
        return {
            "success": False,
            "document_type": document_type,
            "data": None,
            "raw_text": "",
            "error": f"Unknown document type: {document_type}",
        }

    raw_text = ocr_extract_text(uploaded_file)

    if not raw_text.strip():
        return {
            "success": False,
            "document_type": document_type,
            "data": None,
            "raw_text": raw_text,
            "error": "No text could be detected in the uploaded image.",
        }

    prompt = prompt_fn(raw_text)
    result = generate(prompt)

    if not result["success"]:
        return {
            "success": False,
            "document_type": document_type,
            "data": None,
            "raw_text": raw_text,
            "error": result["error"],
        }

    data = result["result"]
    if isinstance(data, dict) and "confidence" not in data:
        data["confidence"] = "low"

    return {
        "success": True,
        "document_type": document_type,
        "data": data,
        "raw_text": raw_text,
        "error": None,
    }


def extract_optional_documents(files):
    """
    Process all optional document uploads from request.FILES.

    files: dict-like mapping field name -> uploaded file
    Returns dict keyed by document type with extraction results (or None if not uploaded).
    """

    results = {}

    for doc_type in DOCUMENT_EXTRACTORS:
        uploaded = files.get(doc_type)
        if uploaded is None:
            results[doc_type] = None
            continue

        try:
            results[doc_type] = extract_document(uploaded, doc_type)
        except Exception:
            logger.exception("Failed to extract document: %s", doc_type)
            results[doc_type] = {
                "success": False,
                "document_type": doc_type,
                "data": None,
                "raw_text": "",
                "error": "Document extraction failed unexpectedly.",
            }

    return results
