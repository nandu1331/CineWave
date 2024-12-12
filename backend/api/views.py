# backend/api/views.py
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.db import IntegrityError

class TestView(APIView):
    def get(self, request):
        return Response({"message": "API is working!"}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    try:
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')
        
        # Validate input
        if not username or not password:
            return Response(
                {'error': 'Username and password are required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # Create user
        user = User.objects.create_user(
            username=username,
            password=password,
            email=email
        )
        
        return Response(
            {'message': 'User created successfully'}, 
            status=status.HTTP_201_CREATED
        )
            
    except IntegrityError:
        return Response(
            {'error': 'Username already exists'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_info(request):
    user = request.user
    return Response({
        'username': user.username,
        'email': user.email,
        'id': user.id,
    })

from .models import Profile
from .serializers import ProfileSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profiles(request):
    profiles = Profile.objects.filter(user=request.user)
    serializer = ProfileSerializer(profiles, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_profile(request):
    data = request.data
    data['user'] = request.user.id
    serializer = ProfileSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request, profile_id):
    try:
        profile = Profile.objects.get(id=profile_id, user=request.user)
    except Profile.DoesNotExist:
        return Response({"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = ProfileSerializer(Profile, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_profile(request, profile_id):
    try:
        profile = Profile.objects.get(id=profile_id, user=request.user)
        profile.delete()
        return Response({"message": "Profile deleted successfully"}, status=status.HTTP_200_OK)
    except Profile.DoesNotExist:
        return Response({"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)


from .models import MovieList
from .serializers import MovieListSerializer
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_movie_list(request):
    movies = MovieList.objects.filter(user=request.user)
    serializer = MovieListSerializer(movies, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_list(request):
    movie_data = {
        'user': request.user.id,
        'item_id': request.data.get('item_id'),
        'title': request.data.get('title'),
        'poster_path': request.data.get('poster_path'),
        'media_type' : request.data.get('media_type')
    }
    
    try:
        movie = MovieList.objects.get(user=request.user, item_id=movie_data['item_id'])
        return Response({'message': 'Movie already in list'}, status=status.HTTP_400_BAD_REQUEST)
    except MovieList.DoesNotExist:
        serializer = MovieListSerializer(data=movie_data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_from_list(request, item_id):
    try:
        item = MovieList.objects.get(user=request.user, item_id=item_id)
        item.delete()
        return Response({'message': 'Movie removed from list'}, status=status.HTTP_200_OK)
    except MovieList.DoesNotExist:
        return Response({'message': 'Movie not found in list'}, status=status.HTTP_404_NOT_FOUND)