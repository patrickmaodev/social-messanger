from django.contrib import admin
from .models import Message


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('sender', 'recipient', 'message_type', 'created_at')
    list_filter = ('message_type', 'created_at')
    search_fields = ('sender__full_name', 'recipient__full_name', 'content')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('-created_at',)
