# backend/api/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class TestView(APIView):
    def get(self, request):
        return Response({"message": "API is working!"}, status=status.HTTP_200_OK)

# backend/api/views.py
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.db import IntegrityError

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
        'movie_id': request.data.get('movie_id'),
        'title': request.data.get('title'),
        'poster_path': request.data.get('poster_path')
    }
    
    try:
        movie = MovieList.objects.get(user=request.user, movie_id=movie_data['movie_id'])
        return Response({'message': 'Movie already in list'}, status=status.HTTP_400_BAD_REQUEST)
    except MovieList.DoesNotExist:
        serializer = MovieListSerializer(data=movie_data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_from_list(request, movie_id):
    try:
        movie = MovieList.objects.get(user=request.user, movie_id=movie_id)
        movie.delete()
        return Response({'message': 'Movie removed from list'}, status=status.HTTP_200_OK)
    except MovieList.DoesNotExist:
        return Response({'message': 'Movie not found in list'}, status=status.HTTP_404_NOT_FOUND)