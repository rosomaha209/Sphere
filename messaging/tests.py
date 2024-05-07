from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from django.utils import timezone
from rest_framework.test import APITestCase, APIClient

from users.models import CustomUser
from .models import Chat, Message


class ChatModelTest(TestCase):
    def setUp(self):
        # Створимо двох користувачів
        self.user1 = CustomUser.objects.create_user(
            email='user1@example.com',
            password='password123',
        )
        self.user2 = CustomUser.objects.create_user(
            email='user2@example.com',
            password='password123',
        )

        # Створимо чат
        self.chat = Chat.objects.create(
            creator=self.user1,
            name="Test Chat"
        )
        self.chat.participants.add(self.user1, self.user2)

    def test_chat_creation(self):
        """Перевірка створення чату"""
        self.assertEqual(self.chat.name, "Test Chat")
        self.assertEqual(self.chat.creator, self.user1)
        self.assertTrue(self.chat.participants.filter(email='user1@example.com').exists())
        self.assertTrue(self.chat.participants.filter(email='user2@example.com').exists())

    def test_chat_str_representation(self):
        """Перевірка рядкового подання чату"""
        self.assertEqual(str(self.chat), "Test Chat")


class MessageModelTest(TestCase):
    def setUp(self):
        # Створимо користувача та чат
        self.user1 = CustomUser.objects.create_user(
            email='user1@example.com',
            password='password123',
        )
        self.chat = Chat.objects.create(
            creator=self.user1,
            name="Test Chat"
        )
        self.chat.participants.add(self.user1)

        # Створимо повідомлення
        self.message = Message.objects.create(
            chat=self.chat,
            author=self.user1,
            content="Hello, World!",
            timestamp=timezone.now()
        )

    def test_message_creation(self):
        """Перевірка створення повідомлення"""
        self.assertEqual(self.message.chat, self.chat)
        self.assertEqual(self.message.author, self.user1)
        self.assertEqual(self.message.content, "Hello, World!")

    def test_message_str_representation(self):
        """Перевірка рядкового подання повідомлення"""
        expected_str = f"{self.user1.email} {self.message.timestamp.strftime('%d-%m-%Y %H:%M:%S')}"
        self.assertEqual(str(self.message), expected_str)


User = get_user_model()


class ChatViewSetTestCase(APITestCase):
    def __init__(self, methodName: str = "runTest"):
        super().__init__(methodName)
        self.chat_data = None

    def setUp(self):
        self.client = APIClient()
        self.superuser = User.objects.create_superuser(first_name='admin', email='admin@example.com',
                                                       password='password123')
        self.user1 = User.objects.create_user(email='user1@example.com', password='password123')
        self.user2 = User.objects.create_user(email='user2@example.com', password='password123')

        # Створюємо тестовий чат
        self.chat = Chat.objects.create(creator=self.user1)
        self.chat.participants.set([self.user1, self.user2])

    def test_get_chat_list_as_superuser(self):
        self.client.force_authenticate(user=self.superuser)
        response = self.client.get(reverse('chat-list'))
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.data), 1)

    def test_create_chat(self):
        self.client.force_authenticate(user=self.user1)
        response = self.client.post('/api/chats/', self.chat_data, format='json')

    def test_delete_chat(self):
        self.client.force_authenticate(user=self.user1)
        response = self.client.delete(reverse('chat-detail', args=[self.chat.pk]))
        self.assertEqual(response.status_code, 204)
        self.assertFalse(Chat.objects.filter(pk=self.chat.pk).exists())
