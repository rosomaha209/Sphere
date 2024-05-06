from django.conf import settings
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from users.models import CustomUser


class CustomImageField(serializers.ImageField):
    def to_representation(self, value):
        if not value:
            return None
        return f'{settings.SITE_URL}{value.url}'


class CustomUserSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    profile_pic = CustomImageField(max_length=None, use_url=True, required=False, allow_null=True, default=None)

    class Meta:
        model = CustomUser
        fields = [
            'id', 'email', 'first_name', 'last_name', 'date_of_birth', 'phone_number',
            'date_joined', 'is_active', 'is_staff', 'profile_pic', 'city', 'about_me',
            'gender', 'password1', 'password2'
        ]
        extra_kwargs = {
            'date_joined': {'read_only': True},
            'is_active': {'read_only': True},
            'is_staff': {'read_only': True},
        }

    def validate(self, data):
        if data.get('password1') != data.get('password2'):
            raise serializers.ValidationError({"password2": "Passwords must match."})
        return data

    def create(self, validated_data):
        password1 = validated_data.pop('password1', None)
        password2 = validated_data.pop('password2', None)
        if password1 != password2:
            raise serializers.ValidationError({"password2": "Passwords must match."})
        user = CustomUser.objects.create(**validated_data)
        if password1:
            user.set_password(password1)
        user.save()
        return user

    def update(self, instance, validated_data):
        return super().update(instance, validated_data)
