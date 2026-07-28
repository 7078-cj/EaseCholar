import logging

from rest_framework import status
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response

from ..ocr.extract import extract_student_record
from ..ocr.documents import extract_optional_documents
from ..matching.scoring import rank_scholarships
from ..models import Scholarship
from ..serializers import ScholarshipMatchResultSerializer

logger = logging.getLogger(__name__)

OPTIONAL_DOCUMENT_FIELDS = (
    "itr",
    "certificate_of_indigency",
    "national_id",
    "cor_or_tor",
)


def _to_float(value):
    if value in (None, ""):
        return None
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def _merge_document_extractions(extracted_data, documents_extracted):
    """Merge optional document OCR data into the student profile fields."""

    merged = {
        "gwa": extracted_data.get("gwa"),
        "year_level": extracted_data.get("year_level") or "",
        "strand_or_course": extracted_data.get("strand_or_course") or "",
        "family_income": None,
        "full_name": "",
        "financial_need_verified": False,
    }

    cor = documents_extracted.get("cor_or_tor")
    if cor and cor.get("success") and cor.get("data"):
        cor_data = cor["data"]
        if cor_data.get("gwa") is not None:
            merged["gwa"] = cor_data["gwa"]
        if cor_data.get("year_level"):
            merged["year_level"] = cor_data["year_level"]
        if cor_data.get("strand_or_course"):
            merged["strand_or_course"] = cor_data["strand_or_course"]

    itr = documents_extracted.get("itr")
    if itr and itr.get("success") and itr.get("data"):
        itr_data = itr["data"]
        if itr_data.get("annual_income") is not None:
            merged["family_income"] = itr_data["annual_income"]

    indigency = documents_extracted.get("certificate_of_indigency")
    if indigency and indigency.get("success") and indigency.get("data"):
        ind_data = indigency["data"]
        merged["financial_need_verified"] = bool(ind_data.get("is_valid_indigency"))

    identity = documents_extracted.get("national_id")
    if identity and identity.get("success") and identity.get("data"):
        id_data = identity["data"]
        merged["full_name"] = id_data.get("full_name") or ""

    return merged


@api_view(["POST"])
@parser_classes([MultiPartParser])
def extract_and_match(request):
    """
    POST multipart/form-data with:
        - 'report_card': image file (required)
        - Optional document files (OCR extracted when provided):
            'itr', 'certificate_of_indigency', 'national_id', 'cor_or_tor'
        - 'family_income', 'year_level', 'course_interest', 'region':
            optional text fields. If provided, these OVERRIDE OCR values.
        - 'gwa': optional override for OCR-extracted GWA.

    Runs OCR -> LLM extraction -> rule-based matching -> ranked results.
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

    optional_files = {
        field: request.FILES.get(field)
        for field in OPTIONAL_DOCUMENT_FIELDS
        if request.FILES.get(field) is not None
    }
    documents_extracted = extract_optional_documents(optional_files)

    doc_merged = _merge_document_extractions(extracted_data, documents_extracted)

    student = {
        "gwa": _to_float(request.data.get("gwa")) or doc_merged["gwa"],
        "family_income": _to_float(request.data.get("family_income"))
            or doc_merged["family_income"],
        "year_level": request.data.get("year_level") or doc_merged["year_level"],
        "course_interest": request.data.get("course_interest")
            or doc_merged["strand_or_course"],
        "region": request.data.get("region", ""),
        "full_name": doc_merged["full_name"],
        "financial_need_verified": doc_merged["financial_need_verified"],
    }

    scholarships = Scholarship.objects.all()

    if not scholarships.exists():
        logger.warning("No scholarships in the database to match against.")

    ranked = rank_scholarships(student, scholarships, use_llm_tips=True)

    confidence = extracted_data.get("confidence", "low")
    needs_review = confidence != "high"

    for doc_result in documents_extracted.values():
        if doc_result and doc_result.get("success"):
            doc_conf = (doc_result.get("data") or {}).get("confidence", "low")
            if doc_conf != "high":
                needs_review = True

    serialized_results = ScholarshipMatchResultSerializer(ranked, many=True).data

    return Response(
        {
            "extracted": extracted_data,
            "documents_extracted": documents_extracted,
            "raw_text": extraction["raw_text"],
            "needs_review": needs_review,
            "review_message": (
                "We're not fully confident about some extracted values "
                "(e.g. GWA) -- please double-check them."
                if needs_review
                else None
            ),
            "student_used_for_matching": student,
            "results": serialized_results,
            "total_scholarships_checked": scholarships.count(),
            "eligible_count": sum(1 for r in ranked if r["eligible"]),
        },
        status=status.HTTP_200_OK,
    )


@api_view(["GET"])
def test(request):
    return Response("Hello")
