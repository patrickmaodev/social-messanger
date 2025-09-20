from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Custom User model extending Django's AbstractUser"""
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=100)
    image = models.URLField(max_length=500, blank=True, null=True)
    
    # Remove username field since we're using email
    username = None
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']
    
    def __str__(self):
        return self.email
    
    class Meta:
        db_table = 'users'
