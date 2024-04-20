"""
URL configuration for Sphere project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView

from users.views import UserRegisterView, UserLoginView, UserLogoutView, UserProfileView, LogoutAPIView, \
    CurrentUserView, RegistrationAPIView, UserEditAPIView, UserEditView, LoginAPIView

urlpatterns = [
    path('', UserProfileView.as_view(), name='profile'),
    path('admin/', admin.site.urls),
    path('register/', UserRegisterView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('logout2/', UserLogoutView.as_view(), name='logout2'),
    path('logout/', LogoutAPIView.as_view(), name='logout'),

    path('profile/', UserProfileView.as_view(), name='profile'),
    path('edit-profile/', UserEditView.as_view(), name='edit-profile'),
    path('users/', include('users.urls')),
    path('messaging/', include('messaging.urls')),
    path('posts/', include('posts.urls')),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenObtainPairView.as_view(), name='token_refresh'),
    path('token/verify/', TokenObtainPairView.as_view(), name='token_verify'),
    path('users/current/', CurrentUserView.as_view(), name='current-user'),
    path('api-registration/', RegistrationAPIView.as_view(), name='api-registration'),
    path('api-edit-profile/', UserEditAPIView.as_view(), name='api-edit-profile'),
    path('api-login/', LoginAPIView.as_view(), name='api-login'),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
