from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Message(models.Model):
    MESSAGE_TYPE_CHOICES = [
        ('text', 'Text'),
        ('image', 'Image'),
    ]
    
    sender = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='sent_messages'
    )
    recipient = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='received_messages'
    )
    message_type = models.CharField(
        max_length=10, 
        choices=MESSAGE_TYPE_CHOICES, 
        default='text'
    )
    message = models.TextField(blank=True, null=True)
    image_url = models.URLField(blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['timestamp']
        db_table = 'messages'
    
    def __str__(self):
        return f"{self.sender.name} -> {self.recipient.name}: {self.message[:50]}..."
