from django.contrib import admin
from .models import Chat, Message


class ChatAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'created_at']
    search_fields = ['id']


class MessageAdmin(admin.ModelAdmin):
    list_display = ['chat', 'author', 'content', 'timestamp']
    list_filter = ['chat', 'author']
    search_fields = ['content', 'author__email']  # Для пошуку за email автора використовуйте два підкреслення


# Реєстрація моделей
admin.site.register(Chat, ChatAdmin)
admin.site.register(Message, MessageAdmin)
