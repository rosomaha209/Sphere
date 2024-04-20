from django.http import Http404
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Post, Comment, Like
from .serializers import PostSerializer, CommentSerializer, LikeSerializer


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer


class LikeViewSet(viewsets.ModelViewSet):
    queryset = Like.objects.all()
    serializer_class = LikeSerializer

    # permission_classes = [IsAuthenticated]
    def get_queryset(self):
        queryset = super().get_queryset()
        post_id = self.request.query_params.get('post_id')
        if post_id is not None:
            queryset = queryset.filter(post__id=post_id)
        return queryset

    @action(detail=False, methods=['post'], url_path='toggle')
    def toggle_like(self, request):
        post_id = request.data.get('post_id')
        user = request.user

        if not post_id:
            return Response({"message": "Post ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Перевірка, чи пост з таким ID існує
        post = get_object_or_404(Post, id=post_id)

        try:
            like = Like.objects.get(post=post, user=user)
            like.delete()
            return Response({"message": "Like removed"}, status=status.HTTP_204_NO_CONTENT)
        except Like.DoesNotExist:
            Like.objects.create(post=post, user=user)
            return Response({"message": "Like added"}, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'], url_path='check')
    def check_like(self, request):
        post_id = request.query_params.get('post_id')
        if not post_id:
            return Response({"message": "Post ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        user = request.user

        # Перевірка, чи пост з таким ID існує
        post = get_object_or_404(Post, id=post_id)

        liked = Like.objects.filter(post=post, user=user).exists()
        return Response({"liked": liked})