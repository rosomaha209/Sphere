from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .serializers import MessageSerializer, ChatSerializer, CustomUserSerializer
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404

from messaging.models import Chat, Message


class ChatViewSet(viewsets.ModelViewSet):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    permission_classes = [IsAuthenticated]  # Забезпечуємо доступ тільки аутентифікованим користувачам

    def get_queryset(self):
        """
        Цей метод повертає запити (queryset), які містять тільки чати, учасником яких є поточний користувач.
        """
        # Поточний користувач береться з запиту
        current_user = self.request.user
        # Фільтрація чатів, де поточний користувач є учасником
        return Chat.objects.filter(participants=current_user)

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def get_queryset(self):
        """
        Опціонально фільтрує повернені повідомлення тільки тими, що належать до зазначеного чату.
        """
        queryset = super().get_queryset()
        chat_id = self.request.query_params.get('chat_id')
        if chat_id is not None:
            queryset = queryset.filter(chat_id=chat_id)
        return queryset

    @action(detail=True, methods=['get'])
    def participants(self, request, pk=None):
        """
        Повертає список учасників для чату.
        """
        chat = get_object_or_404(Chat, pk=pk)
        participants = chat.participants.all()
        serializer = CustomUserSerializer(participants, many=True)
        return Response(serializer.data)
