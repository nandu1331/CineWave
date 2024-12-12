from rest_framework import serializers
from .models import MovieList, Profile

class MovieListSerializer(serializers.ModelSerializer):
    class Meta:
        model = MovieList
        fields = ['user', 'item_id', 'title', 'poster_path', 'added_date', 'media_type']

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['id', 'user', 'name', 'avatar', 'preferences']
        read_only_fields = ['user']
