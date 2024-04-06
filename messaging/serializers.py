from rest_framework import serializers
from .models import Chat, Message
from users.models import CustomUser
from users.serializers import CustomUserSerializer


class ChatSerializer(serializers.ModelSerializer):
    participants = CustomUserSerializer(many=True, read_only=True)

    class Meta:
        model = Chat
        fields = ['id', 'name', 'participants']


class MessageSerializer(serializers.ModelSerializer):
    author = CustomUserSerializer(read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'chat', 'author', 'content', 'timestamp']
