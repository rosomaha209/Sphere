from .models import CustomUser
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework.validators import UniqueValidator


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            'id', 'email', 'first_name', 'last_name', 'date_of_birth', 'phone_number',
            'date_joined', 'is_active', 'is_staff', 'profile_pic', 'city', 'about_me',
            'gender', 'friends'
        ]
        extra_kwargs = {
            'friends': {'read_only': True},
        }

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['profile_pic'] = instance.profile_pic.url if instance.profile_pic else None
        representation['friends'] = CustomUserSerializer(instance.friends.all(), many=True).data
        return representation

