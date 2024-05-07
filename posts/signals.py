from django.db.models.signals import post_save
from django.dispatch import receiver
from users.models import CustomUser
from .models import CommentPermission


@receiver(post_save, sender=CustomUser)
def create_user_comment_permission(sender, instance, created, **kwargs):
    if created:
        CommentPermission.objects.create(target_user=instance, can_comment=True)
