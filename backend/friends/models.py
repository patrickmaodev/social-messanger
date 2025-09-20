from django.db import models
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError

User = get_user_model()


class FriendRequest(models.Model):
    """Model representing a friend request between users"""
    
    class RequestStatus(models.TextChoices):
        PENDING = 'pending', 'Pending'
        ACCEPTED = 'accepted', 'Accepted'
        REJECTED = 'rejected', 'Rejected'
        CANCELLED = 'cancelled', 'Cancelled'
    
    sender = models.ForeignKey(
        'accounts.User',
        on_delete=models.CASCADE,
        related_name='sent_friend_requests',
        verbose_name='Sender',
        help_text='User who sent the friend request'
    )
    receiver = models.ForeignKey(
        'accounts.User',
        on_delete=models.CASCADE,
        related_name='received_friend_requests',
        verbose_name='Receiver',
        help_text='User who received the friend request'
    )
    status = models.CharField(
        max_length=10,
        choices=RequestStatus.choices,
        default=RequestStatus.PENDING,
        verbose_name='Status',
        help_text='Current status of the friend request'
    )
    message = models.TextField(
        blank=True,
        null=True,
        verbose_name='Message',
        help_text='Optional message with the friend request'
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Created At'
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name='Updated At'
    )
    
    class Meta:
        db_table = 'friend_requests'
        verbose_name = 'Friend Request'
        verbose_name_plural = 'Friend Requests'
        unique_together = ['sender', 'receiver']
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['sender', 'status']),
            models.Index(fields=['receiver', 'status']),
        ]
    
    def __str__(self):
        return f"{self.sender.full_name} -> {self.receiver.full_name} ({self.get_status_display()})"
    
    def clean(self):
        """Validate that sender and receiver are different"""
        if self.sender == self.receiver:
            raise ValidationError("Users cannot send friend requests to themselves.")
    
    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)
