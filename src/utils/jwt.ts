/**
 * JWT Token Utilities
 * Handles JWT token decoding and validation
 */

import { Buffer } from 'buffer';

interface JWTPayload {
  user_id?: number;
  userId?: number;
  email?: string;
  name?: string;
  exp: number;
  iat: number;
  [key: string]: any;
}

interface TokenVerificationResult {
  isValid: boolean;
  decodedToken: JWTPayload | null;
}

/**
 * Decode JWT token without external libraries
 * @param token - JWT token to decode
 * @returns Decoded payload or null if invalid
 */
export const decodeJWT = (token: string): JWTPayload | null => {
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

/**
 * Check if the token is expired
 * @param token - JWT token to check
 * @returns True if expired, false otherwise
 */
export const isTokenExpired = (token: string): boolean => {
  const decodedToken = decodeJWT(token);
  if (!decodedToken) {
    console.error("Invalid token");
    return true;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  return decodedToken.exp < currentTime;
};

/**
 * Verify token validity and expiration
 * @param token - JWT token to verify
 * @returns Object with isValid flag and decodedToken
 */
export const verifyToken = (token: string): TokenVerificationResult => {
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

/**
 * Extract user ID from JWT token
 * @param token - JWT token
 * @returns User ID or null if not found
 */
export const getUserIdFromToken = (token: string): number | null => {
  const { decodedToken } = verifyToken(token);
  return decodedToken?.user_id || decodedToken?.userId || null;
};

/**
 * Check if token will expire soon (within 5 minutes)
 * @param token - JWT token to check
 * @returns True if expiring soon, false otherwise
 */
export const isTokenExpiringSoon = (token: string): boolean => {
  const decodedToken = decodeJWT(token);
  if (!decodedToken) {
    return true;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  const fiveMinutes = 5 * 60; // 5 minutes in seconds
  
  return (decodedToken.exp - currentTime) < fiveMinutes;
};
