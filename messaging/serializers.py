from django.conf import settings
from rest_framework import serializers
from .models import Chat, Message
from users.models import CustomUser
from users.serializers import CustomUserSerializer


class ChatSerializer(serializers.ModelSerializer):
    participants = serializers.PrimaryKeyRelatedField(many=True, queryset=CustomUser.objects.all(), required=False)
    creator = serializers.ReadOnlyField(source='creator.id')

    class Meta:
        model = Chat
        fields = ['id', 'name', 'participants', 'creator']

    def validate(self, data):
        # Перевіряємо, чи існує список учасників і чи він не порожній
        if not data.get('participants') or not isinstance(data['participants'], list):
            raise serializers.ValidationError("Participants list is required and must be a list of user IDs.")
        return data

    def create(self, validated_data):
        participants = validated_data.pop('participants', [])
        chat = Chat.objects.create(**validated_data)
        chat.participants.set(participants)
        return chat


class MessageSerializer(serializers.ModelSerializer):
    author = CustomUserSerializer(read_only=True)
    author_profile_pic = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = ['id', 'chat', 'author', 'author_profile_pic', 'content', 'timestamp']

    def get_author_profile_pic(self, obj):
        return obj.author.get_profile_pic()
