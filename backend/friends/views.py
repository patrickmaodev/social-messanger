from rest_framework import status, viewsets, permissions
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.db.models import Q
from .models import FriendRequest
from .serializers import (
    FriendRequestSerializer,
    FriendRequestCreateSerializer,
    FriendRequestActionSerializer
)

User = get_user_model()


class FriendRequestViewSet(viewsets.ModelViewSet):
    """ViewSet for friend request operations"""
    serializer_class = FriendRequestSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filter friend requests based on current user"""
        current_user = self.request.user
        return FriendRequest.objects.filter(
            Q(sender=current_user) | Q(receiver=current_user)
        ).select_related('sender', 'receiver')
    
    def create(self, request, *args, **kwargs):
        """Send a friend request"""
        serializer = FriendRequestCreateSerializer(
            data=request.data, 
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        
        try:
            friend_request = serializer.save()
            return Response({
                'message': 'Friend request sent',
                'selectedUserId': friend_request.receiver.id,
                'requestStatus': 'pending'
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(
                {'message': str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=False, methods=['get'], url_path='friends/(?P<user_id>[^/.]+)')
    def friends_list(self, request, user_id=None):
        """Get friends and pending requests for a user"""
        try:
            user = User.objects.get(id=user_id)
            
            # Get accepted friend requests
            sent_requests = FriendRequest.objects.filter(
                sender=user,
                status='accepted'
            ).select_related('receiver')
            
            received_requests = FriendRequest.objects.filter(
                receiver=user,
                status='accepted'
            ).select_related('sender')
            
            # Combine friends
            friends = []
            for request in sent_requests:
                friends.append(request.receiver)
            for request in received_requests:
                friends.append(request.sender)
            
            # Get pending requests
            pending_requests = FriendRequest.objects.filter(
                receiver=user,
                status='pending'
            ).select_related('sender')
            
            from accounts.serializers import UserSerializer
            
            return Response({
                'friends': UserSerializer(friends, many=True).data,
                'pendingRequests': [
                    {
                        'requestId': req.id,
                        'senderId': req.sender.id,
                        'name': req.sender.name,
                        'email': req.sender.email,
                        'image': req.sender.image
                    }
                    for req in pending_requests
                ]
            })
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['post'], url_path='accept')
    def accept_friend_request(self, request):
        """Accept a friend request"""
        serializer = FriendRequestActionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        current_user = request.user
        selected_user_id = serializer.validated_data['selected_user_id']
        
        try:
            friend_request = FriendRequest.objects.get(
                sender_id=selected_user_id,
                receiver=current_user,
                status='pending'
            )
            friend_request.status = 'accepted'
            friend_request.save()
            
            return Response({
                'message': 'Friend request accepted successfully',
                'selectedUserId': selected_user_id
            })
        except FriendRequest.DoesNotExist:
            return Response(
                {'message': 'No pending friend request found to accept'}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['post'], url_path='cancel')
    def cancel_friend_request(self, request):
        """Cancel a pending friend request"""
        serializer = FriendRequestActionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        current_user = request.user
        selected_user_id = serializer.validated_data['selected_user_id']
        
        try:
            friend_request = FriendRequest.objects.get(
                sender=current_user,
                receiver_id=selected_user_id,
                status='pending'
            )
            friend_request.delete()
            
            return Response({
                'message': 'Friend request canceled successfully',
                'selectedUserId': selected_user_id
            })
        except FriendRequest.DoesNotExist:
            return Response(
                {'message': 'No pending friend request found to cancel'}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['post'], url_path='remove')
    def remove_friend(self, request):
        """Remove a friend (change status from accepted to pending)"""
        serializer = FriendRequestActionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        current_user = request.user
        selected_user_id = serializer.validated_data['selected_user_id']
        
        try:
            friend_request = FriendRequest.objects.get(
                sender_id=selected_user_id,
                receiver=current_user,
                status='accepted'
            )
            friend_request.status = 'pending'
            friend_request.save()
            
            return Response({
                'message': 'Friend removed successfully',
                'selectedUserId': selected_user_id
            })
        except FriendRequest.DoesNotExist:
            return Response(
                {'message': 'No accepted friend found for that option'}, 
                status=status.HTTP_404_NOT_FOUND
            )
