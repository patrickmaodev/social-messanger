/**
 * API Configuration and Endpoints
 * Centralized configuration for all API interactions
 */

// Base API Configuration
// Try different IP configurations if registration fails:
// Option 1: Current IP (192.168.1.66)
// Option 2: localhost (if testing on same machine)
// Option 3: 127.0.0.1 (if testing on same machine)
export const API_CONFIG = {
  BASE_URL: 'http://192.168.1.66:8001/api/v1',
  // BASE_URL: 'http://localhost:8001/api/v1',  // Uncomment if testing on same machine
  // BASE_URL: 'http://127.0.0.1:8001/api/v1', // Alternative localhost
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
};

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    REGISTER: '/users/register/',
    LOGIN: '/users/login/',
    TOKEN_REFRESH: '/users/token/refresh/',
    LOGOUT: '/users/logout/',
  },
  
  // User Management
  USERS: {
    LIST: '/users/users/',
    LIST_ALL: '/users/users/all/',
    PROFILE: (id: number) => `/users/users/${id}/profile/`,
    UPDATE_PROFILE: (id: number) => `/users/users/${id}/`,
  },
  
  // Friend Management
  FRIENDS: {
    REQUESTS: '/friends/friend-requests/',
    FRIENDS_LIST: (id: number) => `/friends/friend-requests/friends/${id}/`,
    ACCEPT_REQUEST: '/friends/friend-requests/accept/',
    CANCEL_REQUEST: '/friends/friend-requests/cancel/',
    REMOVE_FRIEND: '/friends/friend-requests/remove/',
  },
  
  // Messaging
  MESSAGES: {
    LIST: '/messages/messages/',
    SEND: '/messages/messages/',
    CONVERSATION: (senderId: number, recipientId: number) => `/messages/messages/${senderId}/${recipientId}/`,
    USER_CHATS: (id: number) => `/messages/messages/chats/${id}/`,
    DELETE: '/messages/messages/delete/',
    USER_DETAIL: (id: number) => `/messages/messages/user/${id}/`,
    MARK_READ: (id: number) => `/messages/messages/${id}/mark-read/`,
  },
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

// API Response Messages
export const API_MESSAGES = {
  SUCCESS: {
    USER_REGISTERED: 'User registered successfully',
    LOGIN_SUCCESS: 'Login successful',
    MESSAGE_SENT: 'Message sent successfully',
    FRIEND_REQUEST_SENT: 'Friend request sent',
    FRIEND_REQUEST_ACCEPTED: 'Friend request accepted',
    FRIEND_REMOVED: 'Friend removed successfully',
  },
  ERROR: {
    INVALID_CREDENTIALS: 'Invalid credentials',
    USER_NOT_FOUND: 'User not found',
    UNAUTHORIZED: 'Authentication required',
    FORBIDDEN: 'Access denied',
    VALIDATION_ERROR: 'Validation error',
    NETWORK_ERROR: 'Network error',
    SERVER_ERROR: 'Server error',
  },
};
