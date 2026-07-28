def batch_scholarship_prompt(pages):
    """Build a single prompt that asks the model to extract every page's
    scholarship details in one call, returning a JSON array."""

    page_blocks = []

    for i, page in enumerate(pages, start=1):
        page_blocks.append(
            f"""
=== PAGE {i} ===
TITLE: {page['title']}
URL: {page['url']}
PROVIDER: {page['provider']}

HTML:
{page['html']}
"""
        )

    pages_text = "\n".join(page_blocks)

    return f"""
You are an expert information extraction AI.

Below are {len(pages)} scholarship program web pages, each separated by a
"=== PAGE N ===" marker. Extract the scholarship details from EACH page.

Return ONLY a valid JSON array with exactly {len(pages)} objects, one per
page, in the SAME ORDER the pages are listed below. Do not skip, merge, or
reorder pages, even if a page's content looks thin or uncertain -- use
nulls/empty values for that page's object instead of omitting it.

Each object must follow this schema:

{{
    "name": "",
    "category": "",
    "provider": "",
    "criteria": {{
        "min_gwa_percent": null,
        "max_family_income": null,
        "year_levels": [],
        "course_keywords": [],
        "region": "any"
    }},
    "benefits": "",
    "requirements": [],
    "link": ""
}}

Rules

- Never invent information.
- Missing number -> null
- Missing list -> []
- Missing text -> ""
- course_keywords must be a list.
- requirements must be a list.
- year_levels examples:
    ["1st year"]
    ["1st year","2nd year"]
- Copy "provider" and "link" exactly as given for each page.

{pages_text}
"""