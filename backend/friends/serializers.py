from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import FriendRequest

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'name', 'email', 'image')


class FriendRequestSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    receiver = UserSerializer(read_only=True)
    
    class Meta:
        model = FriendRequest
        fields = ('id', 'sender', 'receiver', 'status', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')


class FriendRequestCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = FriendRequest
        fields = ('receiver',)
    
    def create(self, validated_data):
        sender = self.context['request'].user
        receiver = validated_data['receiver']
        
        # Check if request already exists
        existing_request = FriendRequest.objects.filter(
            sender=sender, 
            receiver=receiver
        ).first()
        
        if existing_request:
            if existing_request.status == 'pending':
                raise serializers.ValidationError('Friend request already sent')
            elif existing_request.status == 'accepted':
                raise serializers.ValidationError('You are already friends')
        
        return FriendRequest.objects.create(sender=sender, **validated_data)


class FriendRequestActionSerializer(serializers.Serializer):
    selected_user_id = serializers.IntegerField()
    
    def validate_selected_user_id(self, value):
        try:
            User.objects.get(id=value)
        except User.DoesNotExist:
            raise serializers.ValidationError('User not found')
        return value
