import logging

from rest_framework import status
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response

from ..ocr.extract import extract_student_record

logger = logging.getLogger(__name__)


@api_view(["POST"])
@parser_classes([MultiPartParser])
def extract_report_card(request):
    """
    POST multipart/form-data with a 'report_card' image field.
    Returns the OCR + LLM-structured record for the frontend to show back
    to the student for confirmation before it's used for matching.
    """

    uploaded_file = request.FILES.get("report_card")

    if uploaded_file is None:
        return Response(
            {"error": "No file provided under 'report_card'."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    result = extract_student_record(uploaded_file)

    if not result["success"]:
        return Response(
            {"error": result["error"], "raw_text": result["raw_text"]},
            status=status.HTTP_422_UNPROCESSABLE_ENTITY,
        )

    return Response(
        {
            "data": result["data"],
            "raw_text": result["raw_text"],
        },
        status=status.HTTP_200_OK,
    )