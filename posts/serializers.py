from rest_framework import serializers

from users.models import CustomUser
from .models import Post, Comment, Like


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'


class LikeSerializer(serializers.ModelSerializer):
    post_id = serializers.PrimaryKeyRelatedField(
        source='post',
        queryset=Post.objects.all()
    )
    user_id = serializers.PrimaryKeyRelatedField(
        source='user',
        queryset=CustomUser.objects.all()
    )

    class Meta:
        model = Like
        fields = ['post_id', 'user_id']  # Уточнюйте тільки ті поля, які ви очікуєте отримати
