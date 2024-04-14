from django.contrib.auth import get_user_model
from rest_framework import viewsets, status, serializers
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .serializers import MessageSerializer, ChatSerializer, CustomUserSerializer
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404

from messaging.models import Chat, Message

User = get_user_model()


class ChatViewSet(viewsets.ModelViewSet):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        current_user = self.request.user
        if current_user.is_superuser:
            return Chat.objects.all()  # Суперюзер бачить усі чати
        return Chat.objects.filter(participants=current_user).distinct()

    def perform_create(self, serializer):
        print("Receiving data for new chat:", self.request.data)  # Логування вхідних даних
        try:
            serializer.save(creator=self.request.user)
            print("Chat created successfully!")
        except Exception as e:
            print("Error creating chat:", e)
            raise serializers.ValidationError({"detail": str(e)})

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.creator == request.user or request.user.is_superuser:
            self.perform_destroy(instance)
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"error": "You do not have permission to delete this chat"},
                            status=status.HTTP_403_FORBIDDEN)

    @action(detail=True, methods=['get'])
    def participants(self, request, *args, **kwargs):
        chat = self.get_object()  # Використання self.get_object() забезпечує використання вбудованих перевірок доступу
        participants = chat.participants.all()
        serializer = CustomUserSerializer(participants, many=True)
        return Response(serializer.data)


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
