import logging

from django.utils import timezone

from .config import SOURCES, get_provider_for_url
from .discover import discover_all_sources
from .parser import collect_pages
from .prompts import batch_scholarship_prompt
from api.models import Scholarship
from .utils import generate

logger = logging.getLogger(__name__)

BATCH_SIZE = None  # None = one prompt for everything; set e.g. 15 for big runs


def _chunk(items, size):
    if not size:
        yield items
        return
    for i in range(0, len(items), size):
        yield items[i : i + size]


def extract_scholarships(pages):
    if not pages:
        return []

    results = []

    for batch in _chunk(pages, BATCH_SIZE):
        prompt = batch_scholarship_prompt(batch)
        result = generate(prompt)

        if not result["success"]:
            logger.error("LLM extraction failed: %s", result["error"])
            continue

        extracted = result["result"]

        if not isinstance(extracted, list) or len(extracted) != len(batch):
            logger.warning(
                "Extraction count mismatch: got %s for %s pages",
                len(extracted) if isinstance(extracted, list) else "non-list",
                len(batch),
            )

        for page, item in zip(batch, extracted or []):
            if not isinstance(item, dict):
                continue
            item["provider"] = page["provider"]
            item["link"] = page["url"]
            item["source_name"] = get_provider_for_url(page["url"])
            results.append(item)

    return results


def save_scholarships(items):
    saved = 0

    for item in items:
        criteria = item.get("criteria", {}) or {}

        Scholarship.objects.update_or_create(
            link=item.get("link"),
            defaults={
                "name": item.get("name") or "Unknown Scholarship",
                "category": item.get("category") or "",
                "provider": item.get("provider") or "Unknown",
                "min_gwa_percent": criteria.get("min_gwa_percent"),
                "max_family_income": criteria.get("max_family_income"),
                "year_levels": criteria.get("year_levels") or [],
                "course_keywords": criteria.get("course_keywords") or [],
                "region": criteria.get("region") or "any",
                "benefits": item.get("benefits") or "",
                "requirements": item.get("requirements") or [],
                "source_name": item.get("source_name") or "",
            },
        )
        saved += 1

    return saved


def run_scrape_and_save():
    """Full pipeline: discover -> fetch -> extract -> save to DB.
    This is what both the startup hook and the weekly scheduler call."""

    started_at = timezone.now()
    logger.info("Scholarship scrape started at %s", started_at)

    urls = discover_all_sources(SOURCES)
    logger.info("Discovered %d URL(s) across %d source(s)", len(urls), len(SOURCES))

    pages = collect_pages(urls)
    logger.info("Fetched %d usable page(s)", len(pages))

    items = extract_scholarships(pages)
    saved = save_scholarships(items)

    logger.info(
        "Scholarship scrape finished: %d saved/updated (started %s, took %s)",
        saved,
        started_at,
        timezone.now() - started_at,
    )

    return saved