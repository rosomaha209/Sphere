from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_http_methods
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from users.models import CustomUser
from .models import Post, Comment, Like, CommentPermission
from .serializers import PostSerializer, CommentSerializer, LikeSerializer, CommentPermissionSerializer


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    def perform_create(self, serializer):
        user = self.request.user
        if not isinstance(user, CustomUser) or not self.can_comment(user):
            # Якщо користувач не є екземпляром CustomUser або не має дозволу коментувати
            raise PermissionDenied("You do not have permission to comment on this post.")
        else:
            # Встановлюємо користувача як автора перед збереженням
            serializer.save(author=user)

    def can_comment(self, user):
        # Перевіряємо, чи є дозвіл коментувати для даного користувача
        permission = CommentPermission.objects.filter(target_user=user).first()
        return permission.can_comment if permission else False

    def get_queryset(self):
        # Фільтруємо коментарі за `post_id`
        queryset = super().get_queryset()
        post_id = self.request.query_params.get('post_id')
        if post_id:
            queryset = queryset.filter(post_id=post_id)
        return queryset


class CommentPermissionViewSet(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_id = request.query_params.get('user_id')
        if not user_id:
            return Response({'error': 'Missing user_id parameter'}, status=status.HTTP_400_BAD_REQUEST)

        permissions = CommentPermission.objects.filter(target_user_id=user_id)
        permission = permissions.first()
        if permission:
            serializer = CommentPermissionSerializer(permission)
            return Response(serializer.data)
        else:
            return Response({'can_comment': False}, status=status.HTTP_200_OK)


class CommentPermissionViewSet2(viewsets.ModelViewSet):
    queryset = CommentPermission.objects.all()
    serializer_class = CommentPermissionSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        user_id = self.request.query_params.get('user_id')
        if user_id:
            queryset = queryset.filter(target_user__id=user_id)
        return queryset


class LikeViewSet(viewsets.ModelViewSet):
    queryset = Like.objects.all()
    serializer_class = LikeSerializer

    # permission_classes = [IsAuthenticated]
    def get_queryset(self):
        queryset = super().get_queryset()
        post_id = self.request.query_params.get('post_id')
        if post_id:
            queryset = queryset.filter(post__id=post_id)
        return queryset

    @action(detail=False, methods=['get', 'post'], url_path='like_status')
    def like_status(self, request):
        post_id = request.query_params.get('post_id') if request.method == 'GET' else request.data.get('post_id')
        if not post_id:
            return Response({"message": "Post ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        post = get_object_or_404(Post, id=post_id)
        user = request.user

        if request.method == 'POST':
            try:
                like = Like.objects.get(post=post, user=user)
                like.delete()
                message = "Like removed"
            except Like.DoesNotExist:
                Like.objects.create(post=post, user=user)
                message = "Like added"
            likes_count = Like.objects.filter(post=post).count()
            liked = not Like.objects.filter(post=post, user=user).exists()
            return Response({"message": message, "likesCount": likes_count, "liked": liked})

        liked = Like.objects.filter(post=post, user=user).exists()
        likes_count = Like.objects.filter(post=post).count()
        return Response({"liked": liked, "likesCount": likes_count})
