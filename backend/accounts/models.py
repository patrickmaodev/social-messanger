from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


class UserManager(BaseUserManager):
    """Custom user manager for email-based authentication"""
    
    def create_user(self, email, password=None, **extra_fields):
        """Create and return a regular user with an email and password"""
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        """Create and return a superuser with an email and password"""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        
        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    """Custom User model extending Django's AbstractUser"""
    email = models.EmailField(
        unique=True,
        verbose_name='Email Address',
        help_text='Required. Must be a valid email address.'
    )
    full_name = models.CharField(
        max_length=150,
        verbose_name='Full Name',
        help_text='User\'s full name'
    )
    profile_picture = models.URLField(
        max_length=500,
        blank=True,
        null=True,
        verbose_name='Profile Picture',
        help_text='URL to user\'s profile picture'
    )
    is_verified = models.BooleanField(
        default=False,
        verbose_name='Email Verified',
        help_text='Whether the user has verified their email'
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Created At'
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name='Updated At'
    )
    
    # Remove username field since we're using email
    username = None
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']
    
    # Use custom manager
    objects = UserManager()
    
    def __str__(self):
        return f"{self.full_name} ({self.email})"
    
    @property
    def name(self):
        """Backward compatibility property"""
        return self.full_name
    
    @property
    def image(self):
        """Backward compatibility property"""
        return self.profile_picture
    
    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        ordering = ['-created_at']
