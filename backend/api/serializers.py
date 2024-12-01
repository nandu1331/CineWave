from rest_framework import serializers
from .models import MovieList

class MovieListSerializer(serializers.ModelSerializer):
    class Meta:
        model = MovieList
        fields = ['user', 'item_id', 'title', 'poster_path', 'added_date', 'media_type']