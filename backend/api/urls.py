# backend/api/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('test/', views.TestView.as_view(), name='test-view'),
    path('register/', views.register_user, name='register'),
    path('user/info/', views.get_user_info, name='user_info'),
    path('mylist/', views.get_movie_list, name='get_movie_list'),
    path('mylist/add/', views.add_to_list, name='add_to_list'),
    path('mylist/remove/<int:item_id>/', views.remove_from_list, name='remove_from_list'),

    path('profiles/', views.get_profiles, name='get_profiles'),
    path('profiles/create/', views.create_profile, name='create_profile'),
    path('profiles/<int:profile_id>/update/', views.update_profile, name='update_profile'),
    path('profiles/<int:profile_id>/delete/', views.delete_profile, name='delete_profile'),
]
