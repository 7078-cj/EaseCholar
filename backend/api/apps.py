from django.apps import AppConfig
import os

class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

    def ready(self):
        # Avoid double-start: Django's autoreloader calls ready() twice in
        # dev (runserver). RUN_MAIN is only set in the actual server process.
        if os.environ.get("RUN_MAIN") != "true":
            return

        # Avoid running during management commands like migrate/makemigrations
        # that also trigger app loading but shouldn't kick off a scrape.
        import sys
        if any(cmd in sys.argv for cmd in ("makemigrations", "migrate", "shell", "test")):
            return

        from .webscrape.pipeline import run_scrape_and_save
        from .webscrape.scheduler import start_background_scheduler

        start_background_scheduler(run_scrape_and_save)
