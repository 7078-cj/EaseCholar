import logging
import time

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
        logger.debug("extract_scholarships called with 0 pages, nothing to do")
        return []

    results = []
    batches = list(_chunk(pages, BATCH_SIZE))
    logger.debug(
        "Split %d page(s) into %d batch(es) (BATCH_SIZE=%s)",
        len(pages), len(batches), BATCH_SIZE,
    )

    for batch_num, batch in enumerate(batches, start=1):
        logger.debug(
            "Batch %d/%d: %d page(s) -> urls=%s",
            batch_num, len(batches), len(batch),
            [p["url"] for p in batch],
        )

        prompt = batch_scholarship_prompt(batch)
        logger.debug(
            "Batch %d/%d: prompt length = %d chars",
            batch_num, len(batches), len(prompt),
        )

        call_started = time.monotonic()
        result = generate(prompt)
        call_elapsed = time.monotonic() - call_started
        logger.debug(
            "Batch %d/%d: generate() took %.2fs, success=%s",
            batch_num, len(batches), call_elapsed, result["success"],
        )

        if not result["success"]:
            logger.error(
                "LLM extraction failed on batch %d/%d: %s",
                batch_num, len(batches), result["error"],
            )
            continue

        extracted = result["result"]
        logger.debug(
            "Batch %d/%d: raw extracted type=%s, len=%s",
            batch_num, len(batches),
            type(extracted).__name__,
            len(extracted) if isinstance(extracted, list) else "n/a",
        )

        if not isinstance(extracted, list) or len(extracted) != len(batch):
            logger.warning(
                "Extraction count mismatch on batch %d/%d: got %s for %s pages",
                batch_num, len(batches),
                len(extracted) if isinstance(extracted, list) else "non-list",
                len(batch),
            )

        for i, (page, item) in enumerate(zip(batch, extracted or [])):
            if not isinstance(item, dict):
                logger.debug(
                    "Batch %d/%d item %d: skipped, expected dict got %s (url=%s)",
                    batch_num, len(batches), i, type(item).__name__, page["url"],
                )
                continue

            item["provider"] = page["provider"]
            item["link"] = page["url"]
            item["source_name"] = get_provider_for_url(page["url"])

            logger.debug(
                "Batch %d/%d item %d: extracted name=%r provider=%s url=%s",
                batch_num, len(batches), i,
                item.get("name"), item["provider"], item["link"],
            )

            results.append(item)

    logger.debug("extract_scholarships finished: %d item(s) extracted total", len(results))
    return results


def save_scholarships(items):
    logger.debug("save_scholarships called with %d item(s)", len(items))

    saved = 0
    skipped = 0

    for item in items:
        link = item.get("link")

        if not link:
            logger.debug("Skipping item with no link: name=%r", item.get("name"))
            skipped += 1
            continue

        criteria = item.get("criteria", {}) or {}
        defaults = {
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
        }

        logger.debug("Upserting scholarship link=%s defaults=%s", link, defaults)

        try:
            obj, created = Scholarship.objects.update_or_create(
                link=link,
                defaults=defaults,
            )
        except Exception:
            logger.exception("Failed to save scholarship for link=%s", link)
            skipped += 1
            continue

        logger.debug(
            "%s scholarship id=%s link=%s",
            "Created" if created else "Updated", obj.id, link,
        )

        saved += 1

    logger.debug(
        "save_scholarships finished: saved=%d skipped=%d (of %d total)",
        saved, skipped, len(items),
    )

    return saved


def run_scrape_and_save():
    """Full pipeline: discover -> fetch -> extract -> save to DB.
    This is what both the startup hook and the weekly scheduler call."""

    started_at = timezone.now()
    logger.info("Scholarship scrape started at %s", started_at)
    logger.debug("Configured sources: %s", [s["name"] for s in SOURCES])

    step_started = time.monotonic()
    urls = discover_all_sources(SOURCES)
    logger.debug("discover_all_sources took %.2fs", time.monotonic() - step_started)
    logger.info("Discovered %d URL(s) across %d source(s)", len(urls), len(SOURCES))
    logger.debug("Discovered URLs: %s", urls)

    step_started = time.monotonic()
    pages = collect_pages(urls)
    logger.debug("collect_pages took %.2fs", time.monotonic() - step_started)
    logger.info("Fetched %d usable page(s)", len(pages))

    failed_urls = set(urls) - {p["url"] for p in pages}
    if failed_urls:
        logger.warning("%d URL(s) failed to fetch/parse: %s", len(failed_urls), failed_urls)

    step_started = time.monotonic()
    items = extract_scholarships(pages)
    logger.debug("extract_scholarships took %.2fs", time.monotonic() - step_started)

    step_started = time.monotonic()
    saved = save_scholarships(items)
    logger.debug("save_scholarships took %.2fs", time.monotonic() - step_started)

    elapsed = timezone.now() - started_at
    logger.info(
        "Scholarship scrape finished: %d saved/updated (started %s, took %s)",
        saved, started_at, elapsed,
    )

    return saved