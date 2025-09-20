# Social Messenger Django Backend

A Django REST API backend for the Social Messenger application, replacing the Node.js backend.

## Features

- **User Authentication**: JWT-based authentication with registration and login
- **Friend Management**: Send, accept, cancel, and remove friend requests
- **Messaging**: Text and image messaging between friends
- **File Upload**: Support for image sharing in messages
- **Docker Support**: Containerized development environment

## Technology Stack

- Django 4.2.7
- Django REST Framework 3.14.0
- PostgreSQL 15
- Redis 7
- JWT Authentication
- Docker & Docker Compose

## Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Git

### Setup

1. **Clone and navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create environment file**:
   ```bash
   cp env.example .env
   ```
   Edit `.env` file with your configuration.

3. **Build and start services**:
   ```bash
   docker-compose up --build
   ```

4. **Run migrations**:
   ```bash
   docker-compose exec web python manage.py migrate
   ```

5. **Create superuser** (optional):
   ```bash
   docker-compose exec web python manage.py createsuperuser
   ```

The API will be available at `http://localhost:8000`

## API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login

### Users
- `GET /api/auth/user/<user_id>/` - Get user details
- `GET /api/auth/users/<user_id>/` - Get users (excluding friends)
- `GET /api/auth/all-users/<user_id>/` - Get all users (excluding current user)

### Friends
- `GET /api/friends/friends/<user_id>/` - Get friends and pending requests
- `POST /api/friends/friend-request/` - Send friend request
- `GET /api/friends/requesting-friends-requests/<user_id>/` - Get sent requests
- `GET /api/friends/requested-friends-requests/<user_id>/` - Get received requests
- `GET /api/friends/friend-requests/<user_id>/` - Get all friend requests
- `POST /api/friends/cancel-friend-request/` - Cancel friend request
- `POST /api/friends/accept-friend-request/` - Accept friend request
- `POST /api/friends/remove-friend/` - Remove friend

### Messages
- `POST /api/messages/` - Send message (supports file upload)
- `GET /api/messages/user/<user_id>/` - Get user details
- `GET /api/messages/<sender_id>/<recipient_id>/` - Get messages between users
- `POST /api/messages/deleteMessages/` - Delete messages
- `GET /api/messages/chats/<user_id>/` - Get user's chats

## Development

### Running Tests
```bash
docker-compose exec web python manage.py test
```

### Accessing Django Admin
Visit `http://localhost:8000/admin/` and login with your superuser credentials.

### Database Access
```bash
docker-compose exec db psql -U postgres -d social_messenger
```

## Environment Variables

- `SECRET_KEY`: Django secret key
- `DEBUG`: Debug mode (True/False)
- `DB_NAME`: Database name
- `DB_USER`: Database user
- `DB_PASSWORD`: Database password
- `DB_HOST`: Database host
- `DB_PORT`: Database port
- `REDIS_URL`: Redis connection URL

## Migration from Node.js

This Django backend provides the same API endpoints as the original Node.js backend, making it a drop-in replacement. The main differences:

1. **Authentication**: Uses Django's built-in JWT system instead of custom JWT
2. **Database**: PostgreSQL instead of MongoDB
3. **File Upload**: Django's file handling instead of Multer
4. **Validation**: Django REST Framework serializers for input validation

## Security Improvements

- Password hashing with Django's built-in system
- Input validation and sanitization
- CSRF protection
- CORS configuration
- Environment-based configuration
