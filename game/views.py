# views.py
from django.db import transaction
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from rest_framework import viewsets, permissions
from rest_framework.decorators import api_view
from rest_framework.response import Response

from users.models import CustomUser as Player
from .models import Game, Move
from .serializers import GameSerializer, MoveSerializer


class GameViewSet(viewsets.ModelViewSet):
    queryset = Game.objects.all()
    serializer_class = GameSerializer

    def perform_create(self, serializer):
        # За замовчуванням, переможець та гравець O відсутні
        serializer.save(player_x=self.request.user)


class MoveViewSet(viewsets.ModelViewSet):
    queryset = Move.objects.all()
    serializer_class = MoveSerializer

    def get_queryset(self):
        game_id = self.request.query_params.get('game')
        if game_id is not None:
            return Move.objects.filter(game__id=game_id)
        return Move.objects.none()

    def perform_create(self, serializer):
        serializer.save(player=self.request.user)


@csrf_exempt
@require_http_methods(["PATCH"])
def update_winner(request, pk):
    try:
        player = Player.objects.get(pk=pk)
        player.game_wins += 1
        player.save()
        return JsonResponse({'status': 'success', 'game_wins': player.game_wins})
    except Player.DoesNotExist:
        return JsonResponse({'error': 'Player not found'}, status=404)