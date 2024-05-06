from django.db import models
from users.models import CustomUser


class Post(models.Model):
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='posts')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)


class Like(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='likes')
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='likes')

    class Meta:
        unique_together = ('post', 'user')  # Унікальне обмеження для пари пост-користувач


class CommentPermission(models.Model):
    target_user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='comment_permissions')
    can_comment = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.target_user.email}: {'Can comment' if self.can_comment else 'Cannot comment'}"

