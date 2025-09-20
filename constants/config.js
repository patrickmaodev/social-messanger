import { Buffer } from 'buffer';

// API Configuration
export const API_BASE_URL = 'http://192.168.1.3:8000/api';

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  REGISTER: '/auth/register/',
  LOGIN: '/auth/login/',
  TOKEN_REFRESH: '/auth/token/refresh/',
  
  // Users
  USERS: '/auth/users/',
  USERS_ALL: '/auth/users/all/',
  USER_PROFILE: (id) => `/auth/users/${id}/profile/`,
  
  // Friend Requests
  FRIEND_REQUESTS: '/friends/friend-requests/',
  FRIENDS_LIST: (id) => `/friends/friend-requests/friends/${id}/`,
  ACCEPT_FRIEND_REQUEST: '/friends/friend-requests/accept/',
  CANCEL_FRIEND_REQUEST: '/friends/friend-requests/cancel/',
  REMOVE_FRIEND: '/friends/friend-requests/remove/',
  
  // Messages
  MESSAGES: '/messages/messages/',
  MESSAGES_BETWEEN_USERS: (senderId, recipientId) => `/messages/messages/${senderId}/${recipientId}/`,
  USER_CHATS: (id) => `/messages/messages/chats/${id}/`,
  DELETE_MESSAGES: '/messages/messages/delete/',
  USER_DETAIL: (id) => `/messages/messages/user/${id}/`,
};

// Decode JWT without external libraries
const decodeJWT = (token) => {
    try {
        const [header, payload, signature] = token.split('.');
        if (!header || !payload || !signature) {
        throw new Error("Invalid token format");
        }
    
        // Decode the payload from Base64 using Buffer
        const decodedPayload = JSON.parse(Buffer.from(payload, 'base64').toString('utf-8'));
    
        console.log("Decoded Payload:", decodedPayload);
    
        return decodedPayload;
    } catch (error) {
        console.error("Error decoding JWT:", error.message);
        return null;
    }
};

// Check if the token is expired
const isTokenExpired = (token) => {
    const decodedToken = decodeJWT(token);
    if (!decodedToken) {
    console.error("Invalid token");
    return true;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    return decodedToken.exp < currentTime;
};

// Verify token validity and expiration
const verifyToken = (token) => {
    if (!token) {
    console.error("Token not provided");
    return { isValid: false, decodedToken: null };
    }

    const decodedToken = decodeJWT(token);

    if (!decodedToken || isTokenExpired(token)) {
    console.error("Token is invalid or has expired");
    return { isValid: false, decodedToken: null };
    }

    return { isValid: true, decodedToken };
};

export { decodeJWT, isTokenExpired, verifyToken };
