from rest_framework import serializers

from users.models import CustomUser
from users.serializers import CustomUserSerializer
from .models import Post, Comment, Like, CommentPermission


class PostSerializer(serializers.ModelSerializer):
    author = CustomUserSerializer(read_only=True)  # Використання серіалізатора користувача для поля автора

    class Meta:
        model = Post
        fields = ['id', 'author', 'content', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']  # Автоматичні поля дати створення/оновлення

    def create(self, validated_data):
        # Припускаємо, що `request.user` доступний через контекст запиту
        user = self.context['request'].user
        post = Post.objects.create(author=user, **validated_data)
        return post

    def update(self, instance, validated_data):
        instance.content = validated_data.get('content', instance.content)
        instance.save()
        return instance


class CommentSerializer(serializers.ModelSerializer):
    author = CustomUserSerializer(read_only=True)  # Додаємо інформацію про автора коментаря

    class Meta:
        model = Comment
        fields = ['id', 'post', 'author', 'content', 'created_at']
        read_only_fields = ['created_at']


class CommentPermissionSerializer(serializers.ModelSerializer):
    target_user = CustomUserSerializer(read_only=True)  # Повертає деталі користувача

    class Meta:
        model = CommentPermission
        fields = ['id', 'target_user', 'can_comment']

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
