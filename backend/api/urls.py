# backend/api/urls.py
from django.urls import path
from . import views

urlpatterns = [
    # Add your API endpoints here
    # Example:
    # path('profile/', views.UserProfileView.as_view(), name='user-profile'),
    path('test/', views.TestView.as_view(), name='test-view'),
    path('register/', views.register_user, name='register'),
    path('user/info/', views.get_user_info, name='user_info'),
    path('mylist/', views.get_movie_list, name='get_movie_list'),
    path('mylist/add/', views.add_to_list, name='add_to_list'),
    path('mylist/remove/<int:item_id>/', views.remove_from_list, name='remove_from_list'),
]
