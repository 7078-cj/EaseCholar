from rest_framework import serializers
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
       model = User
       fields = ('id', 'username', 'email', 'password')
       extra_kwargs = {'password': {'write_only': True}}
       
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            
        )
        return user

from rest_framework import serializers

from .models import Scholarship


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