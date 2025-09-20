from django.contrib import admin
from .models import Message


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('sender', 'recipient', 'message_type', 'timestamp')
    list_filter = ('message_type', 'timestamp')
    search_fields = ('sender__name', 'recipient__name', 'message')
    readonly_fields = ('timestamp',)
    ordering = ('-timestamp',)
