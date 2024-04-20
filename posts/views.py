from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

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

    @action(detail=False, methods=['post'], url_path='toggle')
    def toggle_like(self, request):
        post_id = request.data.get('post_id')
        user = request.user

        if not post_id:
            return Response({"message": "Post ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Try to find the like and delete it if it exists
            like = Like.objects.get(post=post_id, user=user)
            like.delete()
            return Response({"message": "Like removed"}, status=status.HTTP_204_NO_CONTENT)
        except Like.DoesNotExist:
            # If it doesn't exist, create a new like
            Like.objects.create(post_id=post_id, user=user)
            return Response({"message": "Like added"}, status=status.HTTP_201_CREATED)