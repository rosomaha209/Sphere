from channels.generic.websocket import AsyncWebsocketConsumer
import json


class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Витягніть game_id з URL-адреси маршруту
        self.game_id = self.scope['url_route']['kwargs']['game_id']
        self.room_group_name = f'game_{self.game_id}'

        # Приєднатися до групи
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        # Прийняти WebSocket-з'єднання
        await self.accept()

    async def disconnect(self, close_code):
        # Від'єднатися від групи
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Отримання повідомлення від WebSocket
    async def receive(self, text_data=None, bytes_data=None):
        data = json.loads(text_data)
        action = data['action']

        if action == 'move':
            move = data['move']
            player = data['player']

            # Обробка ходу в грі (ви можете додати логіку для перевірки ходів і визначення переможця)
            # ...

            # Відправити оновлення ходу всім у групі
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'send_move',
                    'move': move,
                    'player': player
                }
            )

    # Отримати повідомлення від групи і відправити його
    async def send_move(self, event):
        move = event['move']
        player = event['player']

        # Відправити повідомлення клієнту
        await self.send(text_data=json.dumps({
            'move': move,
            'player': player
        }))
