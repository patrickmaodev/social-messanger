# Social Messenger API Documentation

## Overview

This is a RESTful API built with Django REST Framework for the Social Messenger application. The API provides endpoints for user authentication, friend management, and messaging functionality.

## Base URL

```
http://localhost:8000/api/
```

## Authentication

The API uses JWT (JSON Web Token) authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_access_token>
```

## API Endpoints

### Authentication

#### Register User
- **POST** `/auth/register/`
- **Description**: Register a new user
- **Authentication**: Not required
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword",
    "password_confirm": "securepassword",
    "image": "https://example.com/image.jpg"
  }
  ```
- **Response**:
  ```json
  {
    "message": "User registered successfully",
    "user": {
      "id": 1,
      "email": "john@example.com",
      "name": "John Doe",
      "image": "https://example.com/image.jpg"
    },
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
  }
  ```

#### Login User
- **POST** `/auth/login/`
- **Description**: Authenticate user and get JWT tokens
- **Authentication**: Not required
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "securepassword"
  }
  ```
- **Response**:
  ```json
  {
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "user": {
      "id": 1,
      "email": "john@example.com",
      "name": "John Doe",
      "image": "https://example.com/image.jpg"
    }
  }
  ```

#### Refresh Token
- **POST** `/auth/token/refresh/`
- **Description**: Get new access token using refresh token
- **Authentication**: Not required
- **Request Body**:
  ```json
  {
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
  }
  ```

### Users

#### List Users (Excluding Friends)
- **GET** `/auth/users/`
- **Description**: Get list of users excluding current user and friends
- **Authentication**: Required
- **Query Parameters**:
  - `search`: Search by name or email
  - `ordering`: Order by name, email, or date_joined
- **Response**:
  ```json
  {
    "count": 10,
    "next": null,
    "previous": null,
    "results": [
      {
        "id": 2,
        "email": "jane@example.com",
        "name": "Jane Doe",
        "image": "https://example.com/jane.jpg"
      }
    ]
  }
  ```

#### Get All Users
- **GET** `/auth/users/all/`
- **Description**: Get all users excluding current user
- **Authentication**: Required

#### Get User Profile
- **GET** `/auth/users/{user_id}/profile/`
- **Description**: Get detailed user profile
- **Authentication**: Required

### Friend Requests

#### List Friend Requests
- **GET** `/friends/friend-requests/`
- **Description**: Get all friend requests for current user
- **Authentication**: Required

#### Send Friend Request
- **POST** `/friends/friend-requests/`
- **Description**: Send a friend request to another user
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "receiver": 2
  }
  ```

#### Get Friends List
- **GET** `/friends/friend-requests/friends/{user_id}/`
- **Description**: Get friends and pending requests for a user
- **Authentication**: Required
- **Response**:
  ```json
  {
    "friends": [
      {
        "id": 2,
        "email": "jane@example.com",
        "name": "Jane Doe",
        "image": "https://example.com/jane.jpg"
      }
    ],
    "pendingRequests": [
      {
        "requestId": 1,
        "senderId": 3,
        "name": "Bob Smith",
        "email": "bob@example.com",
        "image": "https://example.com/bob.jpg"
      }
    ]
  }
  ```

#### Accept Friend Request
- **POST** `/friends/friend-requests/accept/`
- **Description**: Accept a pending friend request
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "selected_user_id": 3
  }
  ```

#### Cancel Friend Request
- **POST** `/friends/friend-requests/cancel/`
- **Description**: Cancel a sent friend request
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "selected_user_id": 2
  }
  ```

#### Remove Friend
- **POST** `/friends/friend-requests/remove/`
- **Description**: Remove a friend (change status to pending)
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "selected_user_id": 2
  }
  ```

### Messages

#### List Messages
- **GET** `/messages/messages/`
- **Description**: Get all messages for current user
- **Authentication**: Required

#### Send Message
- **POST** `/messages/messages/`
- **Description**: Send a text or image message
- **Authentication**: Required
- **Request Body** (Text Message):
  ```json
  {
    "recipient": 2,
    "message_type": "text",
    "message": "Hello, how are you?"
  }
  ```
- **Request Body** (Image Message):
  ```
  Form Data:
  - recipient: 2
  - message_type: image
  - imageFile: [file]
  ```

#### Get Messages Between Users
- **GET** `/messages/messages/{sender_id}/{recipient_id}/`
- **Description**: Get conversation between two users
- **Authentication**: Required
- **Response**:
  ```json
  [
    {
      "messageId": 1,
      "sender": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com"
      },
      "recipientId": 2,
      "messageType": "text",
      "content": "Hello!",
      "imageUrl": null,
      "timestamp": "2024-01-01T12:00:00Z"
    }
  ]
  ```

#### Get User Chats
- **GET** `/messages/messages/chats/{user_id}/`
- **Description**: Get all chats for a user
- **Authentication**: Required

#### Delete Messages
- **POST** `/messages/messages/delete/`
- **Description**: Delete multiple messages
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "messages": [1, 2, 3]
  }
  ```

#### Get User Details
- **GET** `/messages/messages/user/{user_id}/`
- **Description**: Get user details by ID
- **Authentication**: Required

## Error Responses

### 400 Bad Request
```json
{
  "field_name": ["Error message"]
}
```

### 401 Unauthorized
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### 403 Forbidden
```json
{
  "detail": "You do not have permission to perform this action."
}
```

### 404 Not Found
```json
{
  "detail": "Not found."
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error"
}
```

## Rate Limiting

- Anonymous users: 100 requests per hour
- Authenticated users: 1000 requests per hour

## Pagination

List endpoints support pagination with the following parameters:
- `page`: Page number
- `page_size`: Number of items per page (max 100)

## Filtering and Search

Many endpoints support:
- **Search**: Use `search` parameter for text search
- **Ordering**: Use `ordering` parameter (prefix with `-` for descending)
- **Filtering**: Use field-specific filters

## File Upload

For image messages, use `multipart/form-data` content type and include the image file in the request.

## Security Features

- JWT token authentication
- Password hashing with Django's built-in system
- Input validation and sanitization
- CSRF protection
- CORS configuration
- Rate limiting
- Permission-based access control
