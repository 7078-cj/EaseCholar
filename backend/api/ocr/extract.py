import io
import logging

import numpy as np
from PIL import Image, UnidentifiedImageError

from ..utils import generate, student_record_prompt

logger = logging.getLogger(__name__)

_reader = None

MAX_IMAGE_BYTES = 8 * 1024 * 1024  # 8MB safety cap for hackathon/demo use


def get_reader():
    """Lazily load EasyOCR's model (slow the first time) and reuse it
    across calls instead of reloading per request."""

    global _reader

    if _reader is None:
        import easyocr
        _reader = easyocr.Reader(["en"])  # add other langs if needed

    return _reader


def _load_image_as_array(uploaded_file):
    """Read a Django UploadedFile straight from memory into a numpy array
    EasyOCR can consume -- no disk write involved."""

    uploaded_file.seek(0)
    raw_bytes = uploaded_file.read()

    if not raw_bytes:
        raise ValueError("Uploaded file is empty.")

    if len(raw_bytes) > MAX_IMAGE_BYTES:
        raise ValueError("Uploaded image is too large.")

    try:
        image = Image.open(io.BytesIO(raw_bytes))
        image.load()  # force-decode now so corrupt files fail here, not later
    except UnidentifiedImageError as exc:
        raise ValueError("File is not a readable image.") from exc

    # EasyOCR expects RGB.
    image = image.convert("RGB")

    return np.array(image)


def ocr_extract_text(uploaded_file):
    """Run EasyOCR on an in-memory uploaded image and return the
    recognized text as a single newline-joined string."""

    reader = get_reader()

    try:
        image_array = _load_image_as_array(uploaded_file)
    except ValueError as exc:
        logger.warning("Rejected uploaded image: %s", exc)
        return ""

    try:
        lines = reader.readtext(image_array, detail=0, paragraph=True)
    except Exception:
        logger.exception("EasyOCR failed on uploaded image")
        return ""

    return "\n".join(lines)


def extract_student_record(uploaded_file):
    """
    Full pipeline: uploaded image (in-memory) -> OCR text -> LLM-structured
    student record. Nothing is written to disk.

    uploaded_file: a Django UploadedFile, e.g. request.FILES["report_card"]

    Returns:
        {
            "success": bool,
            "data": {...} | None,   # matches student_record_prompt schema
            "raw_text": str,
            "error": str | None,
        }
    """

    raw_text = ocr_extract_text(uploaded_file)

    if not raw_text.strip():
        return {
            "success": False,
            "data": None,
            "raw_text": raw_text,
            "error": "No text could be detected in the uploaded image.",
        }

    prompt = student_record_prompt(raw_text)
    result = generate(prompt)

    if not result["success"]:
        return {
            "success": False,
            "data": None,
            "raw_text": raw_text,
            "error": result["error"],
        }

    data = result["result"]

    # Belt-and-suspenders: never trust a missing confidence field to mean
    # "high" -- default to "low" so the UI flags it for review.
    if isinstance(data, dict) and "confidence" not in data:
        data["confidence"] = "low"

    return {
        "success": True,
        "data": data,
        "raw_text": raw_text,
        "error": None,
    }