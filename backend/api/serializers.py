from rest_framework import serializers
from django.contrib.auth.models import User

from .models import Scholarship


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email", "password")
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )
        return user


class ScholarshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Scholarship
        fields = [
            "id",
            "name",
            "category",
            "provider",
            "min_gwa_percent",
            "max_family_income",
            "year_levels",
            "course_keywords",
            "region",
            "benefits",
            "requirements",
            "link",
            "source_name",
            "last_scraped_at",
            "first_seen_at",
        ]
        read_only_fields = ["last_scraped_at", "first_seen_at"]


class ScholarshipMatchResultSerializer(serializers.Serializer):
    """Match scoring fields plus full scholarship details for the frontend."""

    scholarship = ScholarshipSerializer()
    eligible = serializers.BooleanField()
    match_score = serializers.FloatField()
    reasons = serializers.ListField(child=serializers.CharField())
    tips = serializers.ListField(child=serializers.CharField())
    friendly_tips = serializers.ListField(child=serializers.CharField())
