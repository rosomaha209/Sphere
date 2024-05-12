

from django.urls import include, path
from rest_framework.routers import DefaultRouter
from . import views
from .views import MoveViewSet

router = DefaultRouter()
router.register(r'games', views.GameViewSet)
router.register(r'moves', MoveViewSet)


urlpatterns = [
    path('', include(router.urls)),
]
