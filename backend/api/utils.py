from pathlib import Path
import os
import json
import environ
from google import genai
from google.genai import types
from google.genai.errors import ClientError

BASE_DIR = Path(__file__).resolve().parent.parent

env = environ.Env()
environ.Env.read_env(os.path.join(BASE_DIR, ".env"))

client = genai.Client(api_key=env("GEMINI_AI_KEY"))

GEMINI_MODELS = [
    "gemini-2.5-flash-lite",
    "gemini-2.5-flash",
    "gemini-flash-latest",
]


def _call_gemini(prompt):
    last_error = None

    for model in GEMINI_MODELS:
        try:
            response = client.models.generate_content(
                model=model,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                ),
            )

            return response.text

        except ClientError as e:
            if getattr(e, "code", None) == 404:
                last_error = e
                continue
            raise

    raise last_error


def generate(prompt):
    try:
        text = _call_gemini(prompt)

        if not text:
            return {
                "success": False,
                "error": "Gemini returned an empty response.",
            }

        return {
            "success": True,
            "result": json.loads(text),
        }

    except json.JSONDecodeError:
        return {
            "success": False,
            "error": "Gemini returned invalid JSON.",
            "raw_text": text,
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e),
        }

def student_record_prompt(raw_text):
    return f"""
You are extracting academic record data from OCR'd text of a Philippine
report card or transcript. The OCR text may be noisy, out of order, or
contain misrecognized characters -- do your best to infer the correct
values, but never invent a number that isn't reasonably supported by the text.

Return ONLY valid JSON in this exact schema:

{{
    "gwa": null,
    "year_level": "",
    "strand_or_course": "",
    "subjects": [{{"name": "", "grade": null}}],
    "confidence": "high|medium|low"
}}

Rules:
- If a General Weighted Average / GWA is explicitly printed, use it.
- If not, and individual subject final grades are clearly readable, compute
  the average yourself and use that as "gwa".
- If neither is possible, gwa must be null -- do not guess.
- year_level examples: "Grade 12", "1st year", "3rd year"
- confidence: "low" if the OCR text looks garbled, incomplete, or you had
  to guess significantly; "high" only if the GWA was explicitly and
  clearly stated.

OCR TEXT:
{raw_text}
"""


def tips_phrasing_prompt(students_gaps):
    """
    students_gaps: list of {"scholarship_name": str, "tips": [str, ...]}
    Rewrites each scholarship's raw gap facts into short, encouraging,
    actionable tips -- WITHOUT inventing any new facts or numbers.
    """

    blocks = []
    for i, entry in enumerate(students_gaps, start=1):
        facts = "\n".join(f"  - {t}" for t in entry["tips"]) or "  - (none)"
        blocks.append(
            f"=== ITEM {i} ===\nSCHOLARSHIP: {entry['scholarship_name']}\nGAP FACTS:\n{facts}"
        )

    items_text = "\n\n".join(blocks)

    return f"""
You are helping rephrase scholarship eligibility gap facts into short,
encouraging, actionable tips for a Filipino student.

STRICT RULES:
- Do NOT invent, add, or change any number, requirement, or fact.
- Only rephrase what is explicitly given in each item's GAP FACTS.
- If GAP FACTS is "(none)", the tip should say the student already meets
  all listed requirements for that scholarship.
- Keep each item to 1-3 short sentences, friendly and direct tone.

Return ONLY a valid JSON array with exactly {len(students_gaps)} objects,
in the SAME ORDER as the items below:

[
  {{"tips": ["...", "..."]}}
]

{items_text}
"""