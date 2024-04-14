from django.conf import settings
from django.db import models
from users.models import CustomUser


class Chat(models.Model):
    participants = models.ManyToManyField(CustomUser, related_name='chats')
    name = models.CharField(max_length=255, blank=True, null=True)  # Додано поле для назви чату
    created_at = models.DateTimeField(auto_now_add=True)
    creator = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='created_chats')

    def __str__(self):
        return self.name if self.name else "{}".format(self.pk)


class Message(models.Model):
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.author.email + " " + self.timestamp.strftime("%d-%m-%Y %H:%M:%S")
