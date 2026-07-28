from django.urls import path
from .Views.user_views import extract_and_match,test


urlpatterns = [
    path('find/', extract_and_match),
    path('test/', test)    
]