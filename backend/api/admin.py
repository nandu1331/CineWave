from django.contrib import admin
from .models import MovieList

# Register your models here.
class MovieListAdmin(admin.ModelAdmin):
    list_display = ("movie_id", "title", "poster_path", "added_date")

admin.site.register(MovieList, MovieListAdmin)
