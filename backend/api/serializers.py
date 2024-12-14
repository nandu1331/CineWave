from rest_framework import serializers
from .models import MovieList, Profile

class MovieListSerializer(serializers.ModelSerializer):
    class Meta:
        model = MovieList
        fields = ['user', 'profile', 'item_id', 'title', 'poster_path', 'added_date', 'media_type']
        read_only_fields = ['user', 'profile']

class ProfileSerializer(serializers.ModelSerializer):
    movie_lists = MovieListSerializer(many=True, read_only=True)

    class Meta:
        model = Profile
        fields = ['id', 'user', 'name', 'avatar', 'preferences', 'movie_lists']
        read_only_fields = ['user']
    
    def validate(self, data):
        # Debugging - print the received data in the serializer
        print("Validation data:", data)

        # Perform the standard validation
        return data