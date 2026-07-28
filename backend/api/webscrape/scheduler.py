import logging
import threading
import time

logger = logging.getLogger(__name__)

WEEK_SECONDS = 7 * 24 * 60 * 60  # scraper runs on a 7-day (weekly) interval


def _scheduler_loop(run_fn, interval_seconds=WEEK_SECONDS):
    """Runs run_fn() immediately, then again every `interval_seconds`
    (default: weekly) for as long as the process stays alive."""

    while True:
        try:
            run_fn()
        except Exception:
            logger.exception("Scheduled scrape run failed")

        next_run_days = interval_seconds / 86400
        logger.info(
            "Next scholarship scrape scheduled in %.0f day(s) (%.0f seconds)",
            next_run_days,
            interval_seconds,
        )
        time.sleep(interval_seconds)


def start_background_scheduler(run_fn, interval_seconds=WEEK_SECONDS):
    """Starts the weekly scrape loop in a daemon thread so it doesn't block
    the Django process or prevent clean shutdown.

    NOTE: this is a hackathon-MVP scheduler. It only works reliably with a
    single long-lived process. In production (multiple gunicorn workers,
    container restarts, etc.) replace this with Celery Beat or a system
    cron job calling the `scrape_scholarships` management command instead.
    """

    thread = threading.Thread(
        target=_scheduler_loop,
        args=(run_fn, interval_seconds),
        daemon=True,
        name="scholarship-scraper-scheduler",
    )
    thread.start()

    logger.info(
        "Started weekly scholarship scraper scheduler (interval=%.0f days)",
        interval_seconds / 86400,
    )

    return thread