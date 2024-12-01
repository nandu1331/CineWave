from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class MovieList(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    item_id = models.IntegerField()
    title = models.CharField(max_length=200)
    poster_path = models.CharField(max_length=200)
    added_date = models.DateTimeField(auto_now_add=True)
    media_type = models.CharField(max_length=100, null=True)
    
    class Meta:
        unique_together = ('user', 'item_id')