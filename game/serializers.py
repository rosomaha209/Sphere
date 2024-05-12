from rest_framework import serializers

from game.models import Game, Move
from users.models import CustomUser


class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'first_name', 'last_name', 'profile_pic']


class GameSerializer(serializers.ModelSerializer):
    player_x_info = PlayerSerializer(source='player_x', read_only=True)
    player_o_info = PlayerSerializer(source='player_o', read_only=True)
    winner_info = PlayerSerializer(source='winner', read_only=True)

    class Meta:
        model = Game
        fields = ['id', 'player_x', 'player_x_info', 'player_o', 'player_o_info', 'winner', 'winner_info']


class MoveSerializer(serializers.ModelSerializer):
    player_info = PlayerSerializer(source='player', read_only=True)

    class Meta:
        model = Move
        fields = ['id', 'game', 'player', 'player_info', 'position']