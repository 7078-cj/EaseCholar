import logging

from ..utils import generate, tips_phrasing_prompt

logger = logging.getLogger(__name__)


def score_scholarship(student, scholarship):
    """
    student: dict with keys gwa, family_income, year_level, course_interest, region
    scholarship: a Scholarship model instance

    Returns a dict describing how well the student matches this scholarship,
    including a 0-100 match_score, an eligible flag, human-readable reasons
    for what passed/failed, and factual "tips" describing gaps to close.
    """

    total_checks = 0
    passed_checks = 0
    reasons = []
    tips = []
    hard_fail = False

    # --- GWA ---
    if scholarship.min_gwa_percent is not None:
        total_checks += 1
        gwa = student.get("gwa")

        if gwa is None:
            tips.append("Add your GWA so we can check this scholarship's academic requirement.")
        elif gwa <= scholarship.min_gwa_percent:
            passed_checks += 1
            reasons.append(f"GWA {gwa} meets the required {scholarship.min_gwa_percent}")
        else:
            hard_fail = True
            gap = round(gwa - scholarship.min_gwa_percent, 2)
            reasons.append(f"GWA {gwa} does not meet required {scholarship.min_gwa_percent}")
            tips.append(
                f"Improve your GWA by about {gap} point(s) (currently {gwa}, "
                f"needs to be {scholarship.min_gwa_percent} or better) to qualify."
            )

    # --- Family income ---
    if scholarship.max_family_income is not None:
        total_checks += 1
        income = student.get("family_income")

        if income is None:
            tips.append("Provide your family's annual income to check this need-based requirement.")
        elif income <= scholarship.max_family_income:
            passed_checks += 1
            reasons.append("Family income is within the allowed threshold")
        else:
            hard_fail = True
            reasons.append("Family income exceeds the allowed threshold")
            tips.append(
                f"This scholarship requires family income at or below "
                f"₱{scholarship.max_family_income:,.0f} per year — consider merit-based "
                f"alternatives instead of need-based ones."
            )

    # --- Year level ---
    if scholarship.year_levels:
        total_checks += 1
        year_level = student.get("year_level")

        if year_level and year_level in scholarship.year_levels:
            passed_checks += 1
            reasons.append("Year level matches")
        else:
            hard_fail = True
            reasons.append("Year level does not match")
            tips.append(
                f"This scholarship is only open to: {', '.join(scholarship.year_levels)}. "
                f"Reapply once you reach an eligible year level."
            )

    # --- Course / field of study (soft check, doesn't hard-fail) ---
    if scholarship.course_keywords:
        total_checks += 1
        interest = (student.get("course_interest") or "").lower()

        if any(keyword.lower() in interest for keyword in scholarship.course_keywords):
            passed_checks += 1
            reasons.append("Course matches this scholarship's priority list")
        else:
            reasons.append("Course may not be on the priority list — verify manually")
            tips.append(
                f"This scholarship prioritizes: {', '.join(scholarship.course_keywords)}. "
                f"Double-check your intended course/strand against this list."
            )

    # --- Region ---
    if scholarship.region and scholarship.region.lower() != "any":
        total_checks += 1
        region = student.get("region")

        if region and region.lower() == scholarship.region.lower():
            passed_checks += 1
            reasons.append("Region matches")
        else:
            hard_fail = True
            reasons.append("Region does not match")
            tips.append(
                f"This scholarship is limited to {scholarship.region}. "
                f"Look for an equivalent program available in your region."
            )

    match_score = round((passed_checks / total_checks) * 100, 1) if total_checks else 0.0
    eligible = total_checks > 0 and not hard_fail

    return {
        "scholarship_id": scholarship.id,
        "name": scholarship.name,
        "provider": scholarship.provider,
        "link": scholarship.link,
        "eligible": eligible,
        "match_score": match_score,
        "reasons": reasons,
        "tips": tips,
    }


def rank_scholarships(student, scholarships, use_llm_tips=True):
    """
    Score every scholarship against the student, and return results sorted
    from most eligible/highest match_score to least.

    If use_llm_tips=True, makes ONE batched LLM call to rephrase every
    result's raw "tips" into friendlier wording (adds a "friendly_tips" key).
    Falls back to the raw tips if that call fails.
    """

    results = [score_scholarship(student, s) for s in scholarships]

    # Eligible first, then by descending match_score.
    results.sort(key=lambda r: (not r["eligible"], -r["match_score"]))

    if use_llm_tips and results:
        results = _attach_friendly_tips(results)
    else:
        for r in results:
            r["friendly_tips"] = r["tips"]

    return results


def _attach_friendly_tips(results):
    gaps = [{"scholarship_name": r["name"], "tips": r["tips"]} for r in results]

    prompt = tips_phrasing_prompt(gaps)
    result = generate(prompt)

    if not result["success"] or not isinstance(result["result"], list):
        logger.warning("Falling back to raw tips: %s", result.get("error"))
        for r in results:
            r["friendly_tips"] = r["tips"]
        return results

    phrased = result["result"]

    if len(phrased) != len(results):
        logger.warning(
            "Tips count mismatch: got %d for %d results, falling back to raw tips",
            len(phrased), len(results),
        )
        for r in results:
            r["friendly_tips"] = r["tips"]
        return results

    for r, p in zip(results, phrased):
        r["friendly_tips"] = p.get("tips", r["tips"]) if isinstance(p, dict) else r["tips"]

    return results