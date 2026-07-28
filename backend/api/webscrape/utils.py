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