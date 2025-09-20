from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Message

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'name', 'email')


class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    
    class Meta:
        model = Message
        fields = (
            'id', 'sender', 'recipient', 'message_type', 
            'message', 'image_url', 'timestamp'
        )
        read_only_fields = ('id', 'timestamp')


class MessageCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ('recipient', 'message_type', 'message', 'image_url')
    
    def create(self, validated_data):
        sender = self.context['request'].user
        return Message.objects.create(sender=sender, **validated_data)


class MessageListSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    recipient = UserSerializer(read_only=True)
    
    class Meta:
        model = Message
        fields = (
            'id', 'sender', 'recipient', 'message_type', 
            'message', 'image_url', 'timestamp'
        )
