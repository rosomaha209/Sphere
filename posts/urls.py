from django.urls import include, path
from rest_framework.routers import DefaultRouter
from . import views
from .views import CommentPermissionViewSet2

router = DefaultRouter()
router.register(r'posts', views.PostViewSet)
router.register(r'comments', views.CommentViewSet)
router.register(r'likes', views.LikeViewSet)
router.register(r'comment-permissions2', CommentPermissionViewSet2)


urlpatterns = [
    path('', include(router.urls)),
]
