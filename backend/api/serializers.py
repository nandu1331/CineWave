from rest_framework import serializers
from .models import MovieList

class MovieListSerializer(serializers.ModelSerializer):
    class Meta:
        model = MovieList
        fields = ['user', 'movie_id', 'title', 'poster_path', 'added_date']