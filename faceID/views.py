import face_recognition
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import UserProfile
from .serializers import UserSerializer
import numpy as np
from rest_framework_simplejwt.tokens import RefreshToken


@api_view(['POST'])
def register_face(request):
    try:
        # Отримуємо дані користувача
        user_data = request.data['user']
        user_serializer = UserSerializer(data=user_data)
        if user_serializer.is_valid():
            user = user_serializer.save()

            # Отримуємо фото користувача
            image_file = request.FILES['image']
            image = face_recognition.load_image_file(image_file)
            face_encodings = face_recognition.face_encodings(image)

            if len(face_encodings) > 0:
                face_encoding = face_encodings[0]
                UserProfile.objects.create(user=user, face_encoding=face_encoding.tolist())
                return Response({"message": "User registered successfully"})
            else:
                user.delete()
                return Response({"error": "No face detected"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)




@api_view(['POST'])
def login_face(request):
    try:
        image_file = request.FILES['image']
        image = face_recognition.load_image_file(image_file)
        face_encodings = face_recognition.face_encodings(image)

        if len(face_encodings) > 0:
            face_encoding = face_encodings[0]
            users = UserProfile.objects.all()

            for user_profile in users:
                known_face_encoding = np.array(user_profile.face_encoding)
                matches = face_recognition.compare_faces([known_face_encoding], face_encoding)
                if matches[0]:
                    user = user_profile.user
                    refresh = RefreshToken.for_user(user)
                    return Response({
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                    })

            return Response({"error": "No matching face found"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"error": "No face detected"}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
