from django.conf import settings
from .models import CustomUser
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework.validators import UniqueValidator


class CustomUserSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    profile_pic = serializers.SerializerMethodField()  # Отримання URL зображення профілю

    class Meta:
        model = CustomUser
        fields = [
            'id', 'email', 'first_name', 'last_name', 'date_of_birth', 'phone_number',
            'date_joined', 'is_active', 'is_staff', 'profile_pic', 'city', 'about_me',
            'gender', 'friends', 'password1', 'password2'
        ]
        extra_kwargs = {
            'friends': {'read_only': True},
            'date_joined': {'read_only': True},
            'is_active': {'read_only': True},
            'is_staff': {'read_only': True},
        }

    def get_profile_pic(self, obj):
        if obj.profile_pic:
            return f'{settings.SITE_URL}{obj.profile_pic.url}'
        return None

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['profile_pic'] = self.get_profile_pic(instance)  # Виклик методу для зображення
        # Додати інформацію про друзів, якщо потрібно
        if hasattr(instance, 'friends'):
            representation['friends'] = CustomUserSerializer(instance.friends.all(), many=True).data
        return representation

    def validate(self, data):
        if data.get('password1') != data.get('password2'):
            raise serializers.ValidationError({"password2": "Passwords must match."})
        return data

    def update(self, instance, validated_data):
        # Забираємо profile_pic з validated_data, якщо воно є, щоб зберегти його окремо
        profile_pic = validated_data.pop('profile_pic', None)

        # Оновлюємо інші поля екземпляра з validated_data
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        # Якщо profile_pic було видалено із validated_data, зберігаємо його
        if profile_pic:
            instance.profile_pic = profile_pic

        # Зберігаємо змінені дані у базу
        instance.save()
        return instance

    def create(self, validated_data):
        user = CustomUser(
            email=validated_data['email'],
            first_name=validated_data.get('first_name'),
            last_name=validated_data.get('last_name'),
            phone_number=validated_data.get('phone_number'),
            date_of_birth=validated_data.get('date_of_birth'),
            city=validated_data.get('city'),
            about_me=validated_data.get('about_me'),
            gender=validated_data.get('gender'),
        )
        user.set_password(validated_data['password1'])
        user.save()
        return user
