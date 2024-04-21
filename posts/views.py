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
