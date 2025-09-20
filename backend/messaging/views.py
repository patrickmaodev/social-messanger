from rest_framework import status, viewsets, permissions
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from django.db.models import Q
from .models import Message
from .serializers import MessageSerializer, MessageCreateSerializer, MessageListSerializer

User = get_user_model()


class MessageViewSet(viewsets.ModelViewSet):
    """ViewSet for message operations"""
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    def get_queryset(self):
        """Filter messages based on current user"""
        current_user = self.request.user
        return Message.objects.filter(
            Q(sender=current_user) | Q(recipient=current_user)
        ).select_related('sender', 'recipient').order_by('-timestamp')
    
    def create(self, request, *args, **kwargs):
        """Create a new message (supports file upload)"""
        serializer = MessageCreateSerializer(
            data=request.data, 
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        message = serializer.save()
        
        return Response({
            'message': 'Message sent successfully'
        }, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'], url_path='user/(?P<user_id>[^/.]+)')
    def user_detail(self, request, user_id=None):
        """Get user details by ID"""
        try:
            user = User.objects.get(id=user_id)
            from accounts.serializers import UserDetailSerializer
            serializer = UserDetailSerializer(user)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['get'], url_path='(?P<sender_id>[^/.]+)/(?P<recipient_id>[^/.]+)')
    def messages_between_users(self, request, sender_id=None, recipient_id=None):
        """Get messages between two users"""
        try:
            # Verify that the current user is one of the participants
            current_user = request.user
            if current_user.id not in [int(sender_id), int(recipient_id)]:
                return Response(
                    {'error': 'Unauthorized access'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            messages = Message.objects.filter(
                Q(sender_id=sender_id, recipient_id=recipient_id) |
                Q(sender_id=recipient_id, recipient_id=sender_id)
            ).select_related('sender').order_by('timestamp')
            
            formatted_messages = []
            for message in messages:
                formatted_messages.append({
                    'messageId': message.id,
                    'sender': {
                        'id': message.sender.id,
                        'name': message.sender.name,
                        'email': message.sender.email
                    },
                    'recipientId': message.recipient.id,
                    'messageType': message.message_type,
                    'content': message.message,
                    'imageUrl': message.image_url,
                    'timestamp': message.timestamp,
                })
            
            return Response(formatted_messages)
        except Exception as e:
            return Response(
                {'error': 'Internal Server Error'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['post'], url_path='delete')
    def delete_messages(self, request):
        """Delete multiple messages"""
        message_ids = request.data.get('messages', [])
        
        if not isinstance(message_ids, list) or len(message_ids) == 0:
            return Response(
                {'message': 'Invalid request body!'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Only allow users to delete their own messages
            current_user = request.user
            deleted_count = Message.objects.filter(
                id__in=message_ids,
                sender=current_user
            ).delete()[0]
            
            return Response({
                'message': f'{deleted_count} message(s) deleted successfully'
            })
        except Exception as e:
            return Response(
                {'error': 'Internal Server Error'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'], url_path='chats/(?P<user_id>[^/.]+)')
    def user_chats(self, request, user_id=None):
        """Get all chats for a user"""
        try:
            current_user = request.user
            if current_user.id != int(user_id):
                return Response(
                    {'error': 'Unauthorized access'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            messages = Message.objects.filter(
                Q(sender_id=user_id) | Q(recipient_id=user_id)
            ).select_related('sender', 'recipient').order_by('timestamp')
            
            return Response({'messages': MessageListSerializer(messages, many=True).data})
        except Exception as e:
            return Response(
                {'error': 'Internal Server Error'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
