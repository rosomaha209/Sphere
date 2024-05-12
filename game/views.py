# views.py
from rest_framework import viewsets, permissions
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
