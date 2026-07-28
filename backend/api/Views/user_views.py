import logging

from rest_framework import status
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response

from ..ocr.extract import extract_student_record
from ..matching.scoring import rank_scholarships
from ..models import Scholarship

logger = logging.getLogger(__name__)


def _to_float(value):
    if value in (None, ""):
        return None
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


@api_view(["POST"])
@parser_classes([MultiPartParser])
def extract_and_match(request):
    """
    POST multipart/form-data with:
        - 'report_card': image file (required)
        - 'family_income', 'year_level', 'course_interest', 'region':
            optional text fields. If provided, these OVERRIDE whatever OCR
            extracts for the equivalent value (OCR can't read income/course
            preference from a report card anyway, so these are normally
            supplied by the student directly in the form).
        - 'gwa': optional override for the OCR-extracted GWA, in case the
            student wants to correct a misread value without a separate
            confirm step.

    Runs OCR -> LLM extraction -> rule-based matching -> ranked results,
    all in a single request/response cycle.
    """

    uploaded_file = request.FILES.get("report_card")

    if uploaded_file is None:
        return Response(
            {"error": "No file provided under 'report_card'."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    extraction = extract_student_record(uploaded_file)

    if not extraction["success"]:
        return Response(
            {"error": extraction["error"], "raw_text": extraction["raw_text"]},
            status=status.HTTP_422_UNPROCESSABLE_ENTITY,
        )

    extracted_data = extraction["data"] or {}

    # Build the student profile used for matching. Explicit form fields
    # (if the student supplied/corrected them) take priority over OCR.
    student = {
        "gwa": _to_float(request.data.get("gwa")) or extracted_data.get("gwa"),
        "family_income": _to_float(request.data.get("family_income")),
        "year_level": request.data.get("year_level") or extracted_data.get("year_level"),
        "course_interest": request.data.get("course_interest")
            or extracted_data.get("strand_or_course", ""),
        "region": request.data.get("region", ""),
    }

    scholarships = Scholarship.objects.all()

    if not scholarships.exists():
        logger.warning("No scholarships in the database to match against.")

    ranked = rank_scholarships(student, scholarships, use_llm_tips=True)

    confidence = extracted_data.get("confidence", "low")
    needs_review = confidence != "high"

    return Response(
        {
            "extracted": extracted_data,
            "raw_text": extraction["raw_text"],
            "needs_review": needs_review,
            "review_message": (
                "We're not fully confident about some extracted values "
                "(e.g. GWA) -- please double-check them."
                if needs_review else None
            ),
            "student_used_for_matching": student,
            "results": ranked,
            "total_scholarships_checked": scholarships.count(),
            "eligible_count": sum(1 for r in ranked if r["eligible"]),
        },
        status=status.HTTP_200_OK,
    )

@api_view(["GET"])
def test(request):
    return Response("Hello")