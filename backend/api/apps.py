from django.apps import AppConfig
import os
import sys
import threading


class ApiConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "api"

    def ready(self):
        # Avoid double-start in development
        if os.environ.get("RUN_MAIN") != "true":
            return

        # Skip during management commands
        if any(cmd in sys.argv for cmd in ("makemigrations", "migrate", "shell", "test")):
            return

        from .webscrape.pipeline import run_scrape_and_save
        from .webscrape.scheduler import start_background_scheduler

        # Start scheduler in a background thread
        threading.Thread(
            target=start_background_scheduler,
            args=(run_scrape_and_save,),
            daemon=True,
            name="ScraperScheduler",
        ).start()