from django.conf import settings
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
    author_profile_pic = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = ['id', 'chat', 'author', 'author_profile_pic', 'content', 'timestamp']

    def get_author_profile_pic(self, obj):
        return obj.author.get_profile_pic()
