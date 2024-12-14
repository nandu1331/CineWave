from django.contrib import admin
from .models import Profile, MovieList

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'name', 'avatar')
    search_fields = ('name', 'user__username')

@admin.register(MovieList)
class MovieListAdmin(admin.ModelAdmin):
    list_display = ('id', 'profile', 'item_id', 'title', 'added_date', 'media_type')
    search_fields = ('title', 'profile__name')
    list_filter = ('media_type', 'added_date')
