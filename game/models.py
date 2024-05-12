# models.py
from users.models import CustomUser as Player
from django.db import models


class Game(models.Model):
    player_x = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='games_as_x')
    player_o = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='games_as_o', null=True, blank=True)
    winner = models.ForeignKey(Player, on_delete=models.SET_NULL, related_name='won_games', null=True, blank=True)



class Move(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    position = models.IntegerField()
