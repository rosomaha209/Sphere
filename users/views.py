from django.contrib import messages
from django.contrib.auth import authenticate
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.views import LoginView, LogoutView
from django.urls import reverse_lazy
from django.views import generic
from django.views.generic import TemplateView, UpdateView
from rest_framework import viewsets, status, permissions, generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError

from users.forms import UserRegisterForm, UserEditForm
from users.models import CustomUser
from .serializers import CustomUserSerializer

from rest_framework_simplejwt.tokens import RefreshToken


class RegistrationAPIView(APIView):
    def post(self, request):
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'user_id': user.id,
                'email': user.email,
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginAPIView(APIView):
    def post(self, request):
        data = request.data
        username = data.get('username', None)
        password = data.get('password', None)
        if username is None or password is None:
            return Response({'error': 'Нужен и логин, и пароль'},
                            status=status.HTTP_400_BAD_REQUEST)
        user = authenticate(username=username, password=password)
        if user is None:
            return Response({'error': 'Неверные данные'},
                            status=status.HTTP_401_UNAUTHORIZED)
        refresh = RefreshToken.for_user(user)
        refresh.payload.update({
            'user_id': user.id,
            'username': user.username
        })
        print(user.id,"user id")
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'userId': user.id,
        }, status=status.HTTP_200_OK)


class LogoutAPIView(APIView):
    permission_classes = [IsAuthenticated]  # Забезпечення доступу тільки для авторизованих користувачів

    def post(self, request):
        refresh_token = request.data.get('refresh_token')  
        if not refresh_token:
            return Response({'error': 'Необходим Refresh token'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()  
        except TokenError as e:
            return Response({'error': 'Неверный Refresh token'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'success': 'Выход успешен'}, status=status.HTTP_200_OK)


class UserEditAPIView(generics.RetrieveUpdateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        """
        Перевизначаємо метод, щоб користувачі могли редагувати тільки свій профіль.
        """
        return self.request.user

    def partial_update(self, request, *args, **kwargs):
        print('працює вюха редагування')
        print(request.FILES)  # Це покаже файли, що надійшли
        print(request.data)  # Логування вхідних даних
        kwargs['partial'] = True  # Вказуємо, що оновлення буде частковим
        return self.update(request, *args, **kwargs)


class UserProfileView(LoginRequiredMixin, TemplateView):
    template_name = 'users/profile.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['user'] = self.request.user
        return context


class UserEditView(LoginRequiredMixin, UpdateView):
    model = CustomUser
    form_class = UserEditForm
    template_name = 'users/edit_profile.html'
    success_url = reverse_lazy('profile')  # Переадресація після успішного редагування

    def get_object(self):
        return self.request.user


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = CustomUserSerializer(request.user)
        return Response(serializer.data)


class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # Припускаємо, що кожен користувач може редагувати лише свій профіль
        return self.request.user

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            self.perform_update(serializer)
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer


class UserRegisterView(generic.CreateView):
    form_class = UserRegisterForm
    template_name = 'users/register.html'
    success_url = reverse_lazy('profile')

    def form_valid(self, form):
        response = super().form_valid(form)
        messages.success(self.request, "Registration successful.")
        return response

    def form_invalid(self, form):
        for field, errors in form.errors.items():
            for error in errors:
                messages.error(self.request, f"{form[field].label}: {error}")
        return super().form_invalid(form)


class UserLoginView(LoginView):
    template_name = 'users/login.html'
    redirect_authenticated_user = True
    next_page = reverse_lazy('profile')  # Перенаправлення після входу


class UserLogoutView(LogoutView):
    next_page = reverse_lazy('login')  # Перенаправлення після виходу
