from django.db import models

# Create your models here.
from django.db import models


class Scholarship(models.Model):
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=255, blank=True)
    provider = models.CharField(max_length=255)

    # Criteria — kept as JSON since fields vary a lot per scholarship
    min_gwa_percent = models.FloatField(null=True, blank=True)
    max_family_income = models.FloatField(null=True, blank=True)
    year_levels = models.JSONField(default=list, blank=True)
    course_keywords = models.JSONField(default=list, blank=True)
    region = models.CharField(max_length=100, default="any")

    benefits = models.TextField(blank=True)
    requirements = models.JSONField(default=list, blank=True)

    link = models.URLField(unique=True)
    source_name = models.CharField(max_length=100, blank=True)  # e.g. "CHED", "DOST-SEI", "DLSU"

    last_scraped_at = models.DateTimeField(auto_now=True)
    first_seen_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name