"""
Scholarship Matching Engine
-----------------------------
Compares a student's profile (from OCR + manual input) against a list of
scholarships with structured criteria. Produces a ranked list with:
    - match_score (0-100)
    - eligible: True/False
    - reasons_met: why they qualify
    - reasons_not_met: exactly which criteria they fail, and why

Course/keyword matching uses TF-IDF + cosine similarity (lightweight,
no internet/model download needed) rather than heavy embedding models,
since eligibility criteria are mostly structured rules, not free text
requiring deep semantic understanding. Swap in real embeddings (e.g.
sentence-transformers or an API) later if you need fuzzier course matching.
"""

import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def course_similarity(student_course, keyword_list):
    """
    Returns True if the student's course text is similar enough to any
    of a scholarship's course_keywords, using TF-IDF cosine similarity.
    Falls back to simple substring matching for short keyword lists.
    """
    if not keyword_list or not student_course:
        return False, 0.0

    # Quick substring check first (cheap, catches obvious matches)
    course_lower = student_course.lower()
    for kw in keyword_list:
        if kw.lower() in course_lower:
            return True, 1.0

    # TF-IDF similarity as a fuzzier fallback
    documents = [student_course] + keyword_list
    vectorizer = TfidfVectorizer().fit_transform(documents)
    vectors = vectorizer.toarray()
    student_vec = vectors[0:1]
    keyword_vecs = vectors[1:]

    similarities = cosine_similarity(student_vec, keyword_vecs)[0]
    best_score = max(similarities) if len(similarities) > 0 else 0.0

    return best_score > 0.3, float(best_score)


def evaluate_scholarship(student, scholarship):
    """
    Checks one scholarship's criteria against the student profile.
    Returns a dict with score, eligibility, and reasons.
    """
    criteria = scholarship.get("criteria", {})
    total_checks = 0
    passed_checks = 0
    reasons_met = []
    reasons_not_met = []

    # --- GWA check ---
    min_gwa = criteria.get("min_gwa_percent")
    if min_gwa is not None:
        total_checks += 1
        student_gwa = student.get("gwa_percent")
        if student_gwa is None:
            reasons_not_met.append(
                f"GWA required (min {min_gwa}%) but no GWA found on your record — please confirm manually."
            )
        elif student_gwa >= min_gwa:
            passed_checks += 1
            reasons_met.append(f"Your GWA ({student_gwa}%) meets the minimum requirement ({min_gwa}%).")
        else:
            reasons_not_met.append(
                f"Your GWA ({student_gwa}%) is below the required minimum ({min_gwa}%)."
            )

    # --- Family income check ---
    max_income = criteria.get("max_family_income")
    if max_income is not None:
        total_checks += 1
        student_income = student.get("family_income")
        if student_income is None:
            reasons_not_met.append(
                f"Family income cap applies (max ₱{max_income:,}) but no income info was provided."
            )
        elif student_income <= max_income:
            passed_checks += 1
            reasons_met.append(f"Your family income (₱{student_income:,}) is within the limit (₱{max_income:,}).")
        else:
            reasons_not_met.append(
                f"Your family income (₱{student_income:,}) exceeds the maximum allowed (₱{max_income:,})."
            )

    # --- Year level check ---
    year_levels = criteria.get("year_levels")
    if year_levels and "any" not in [y.lower() for y in year_levels]:
        total_checks += 1
        student_year = (student.get("year_level") or "").lower()
        if not student_year:
            reasons_not_met.append(f"Required year level: {', '.join(year_levels)} — but your year level wasn't detected.")
        elif student_year in [y.lower() for y in year_levels]:
            passed_checks += 1
            reasons_met.append(f"Your year level ({student_year}) matches the requirement.")
        else:
            reasons_not_met.append(
                f"This scholarship requires {', '.join(year_levels)}, but you're in {student_year}."
            )

    # --- Course keyword check ---
    course_keywords = criteria.get("course_keywords")
    if course_keywords:
        total_checks += 1
        student_course = student.get("course")
        matched, score = course_similarity(student_course, course_keywords)
        if matched:
            passed_checks += 1
            reasons_met.append(f"Your course ('{student_course}') matches this scholarship's target field.")
        else:
            reasons_not_met.append(
                f"Your course ('{student_course}') doesn't appear to match the required field(s): {', '.join(course_keywords)}."
            )

    # If a scholarship has no hard criteria at all (open to all), treat as fully eligible
    if total_checks == 0:
        return {
            "name": scholarship["name"],
            "match_score": 100,
            "eligible": True,
            "reasons_met": ["Open to all students — no specific eligibility restrictions listed."],
            "reasons_not_met": [],
        }

    score = round((passed_checks / total_checks) * 100)
    eligible = (passed_checks == total_checks)

    return {
        "name": scholarship["name"],
        "match_score": score,
        "eligible": eligible,
        "reasons_met": reasons_met,
        "reasons_not_met": reasons_not_met,
    }


def match_all(student, scholarships):
    """Evaluate a student against every scholarship, sorted best-match first."""
    results = [evaluate_scholarship(student, s) for s in scholarships]
    results.sort(key=lambda r: r["match_score"], reverse=True)
    return results


def print_report(results):
    """Pretty console report — swap this out for a JSON API response or UI render."""
    print("\n=== SCHOLARSHIP MATCH REPORT ===\n")
    for r in results:
        status = "✅ ELIGIBLE" if r["eligible"] else "⚠️ NOT FULLY ELIGIBLE"
        print(f"{r['name']} — {r['match_score']}% match — {status}")
        for reason in r["reasons_met"]:
            print(f"   ✔ {reason}")
        for reason in r["reasons_not_met"]:
            print(f"   ✘ {reason}")
        print()


if __name__ == "__main__":
    # Example student profile (normally built via ocr_profile_extractor.py)
    student = {
        "gwa_percent": 90,
        "year_level": "3rd year",
        "course": "BS Statistics",
        "family_income": 420000,
        "region": "Region IV-A",
    }

    with open("scholarships_structured.json", "r", encoding="utf-8") as f:
        scholarships = json.load(f)

    results = match_all(student, scholarships)
    print_report(results)

    # Also save as JSON for use in a web/app frontend
    with open("match_results.json", "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)