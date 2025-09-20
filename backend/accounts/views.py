from rest_framework import status, generics, viewsets, permissions
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .serializers import (
    UserRegistrationSerializer, 
    UserLoginSerializer, 
    UserSerializer,
    UserDetailSerializer,
    CustomTokenObtainPairSerializer
)

User = get_user_model()


class CustomTokenObtainPairView(TokenObtainPairView):
    """Custom JWT token view that includes user data"""
    serializer_class = CustomTokenObtainPairSerializer


class UserRegistrationView(generics.CreateAPIView):
    """User registration endpoint"""
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token
        
        return Response({
            'message': 'User registered successfully',
            'user': UserSerializer(user).data,
            'access': str(access_token),
            'refresh': str(refresh)
        }, status=status.HTTP_201_CREATED)


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for user operations"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['name', 'email']
    ordering_fields = ['name', 'email', 'date_joined']
    ordering = ['name']
    
    def get_queryset(self):
        """Filter users based on the action"""
        current_user = self.request.user
        
        if self.action == 'list':
            # Get users excluding current user and friends
            from friends.models import FriendRequest
            friend_requests = FriendRequest.objects.filter(
                Q(sender=current_user) | Q(receiver=current_user),
                status='accepted'
            )
            
            friend_ids = []
            for fr in friend_requests:
                if fr.sender == current_user:
                    friend_ids.append(fr.receiver.id)
                else:
                    friend_ids.append(fr.sender.id)
            
            return User.objects.exclude(
                Q(id=current_user.id) | Q(id__in=friend_ids)
            )
        
        return User.objects.exclude(id=current_user.id)
    
    @action(detail=False, methods=['get'], url_path='all')
    def all_users(self, request):
        """Get all users except current user"""
        current_user = request.user
        users = User.objects.exclude(id=current_user.id)
        serializer = self.get_serializer(users, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def profile(self, request, pk=None):
        """Get detailed user profile"""
        user = self.get_object()
        serializer = UserDetailSerializer(user)
        return Response(serializer.data)


