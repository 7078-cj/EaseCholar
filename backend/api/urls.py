from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .Views.user_views import extract_and_match,test


urlpatterns = [
    path('find/', extract_and_match),
    path('test/', test)    
]