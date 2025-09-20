from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Message(models.Model):
    """Model representing a message between users"""
    
    class MessageType(models.TextChoices):
        TEXT = 'text', 'Text Message'
        IMAGE = 'image', 'Image Message'
        FILE = 'file', 'File Attachment'
        SYSTEM = 'system', 'System Message'
    
    sender = models.ForeignKey(
        'accounts.User',
        on_delete=models.CASCADE,
        related_name='sent_messages',
        verbose_name='Sender',
        help_text='User who sent the message'
    )
    recipient = models.ForeignKey(
        'accounts.User',
        on_delete=models.CASCADE,
        related_name='received_messages',
        verbose_name='Recipient',
        help_text='User who received the message'
    )
    message_type = models.CharField(
        max_length=10,
        choices=MessageType.choices,
        default=MessageType.TEXT,
        verbose_name='Message Type',
        help_text='Type of message content'
    )
    content = models.TextField(
        blank=True,
        null=True,
        verbose_name='Message Content',
        help_text='Text content of the message'
    )
    attachment_url = models.URLField(
        blank=True,
        null=True,
        verbose_name='Attachment URL',
        help_text='URL to attached file or image'
    )
    is_read = models.BooleanField(
        default=False,
        verbose_name='Is Read',
        help_text='Whether the message has been read by recipient'
    )
    read_at = models.DateTimeField(
        blank=True,
        null=True,
        verbose_name='Read At',
        help_text='When the message was read'
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
        db_table = 'messages'
        verbose_name = 'Message'
        verbose_name_plural = 'Messages'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['sender', 'recipient', 'created_at']),
            models.Index(fields=['recipient', 'is_read']),
        ]
    
    def __str__(self):
        content_preview = self.content[:50] if self.content else f"[{self.get_message_type_display()}]"
        return f"{self.sender.full_name} -> {self.recipient.full_name}: {content_preview}"
    
    @property
    def message(self):
        """Backward compatibility property"""
        return self.content
    
    @property
    def image_url(self):
        """Backward compatibility property"""
        return self.attachment_url if self.message_type == self.MessageType.IMAGE else None
    
    @property
    def timestamp(self):
        """Backward compatibility property"""
        return self.created_at
    
    def mark_as_read(self):
        """Mark message as read"""
        if not self.is_read:
            self.is_read = True
            from django.utils import timezone
            self.read_at = timezone.now()
            self.save(update_fields=['is_read', 'read_at'])
