/**
 * Application Constants
 * Centralized constants for the entire application
 */

// App Information
export const APP_CONFIG = {
  NAME: 'Social Messenger',
  VERSION: '1.0.0',
  DESCRIPTION: 'A modern social messaging application',
};

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_DATA: 'userData',
  THEME: 'theme',
  LANGUAGE: 'language',
};

// Navigation Routes
export const ROUTES = {
  // Auth Routes
  LOGIN: 'Login',
  REGISTER: 'Register',
  
  // Main Routes
  HOME: 'Home',
  CHATS: 'Chats',
  FRIENDS: 'Friends',
  PROFILE: 'Profile',
  
  // Chat Routes
  CHAT_MESSAGE: 'ChatMessage',
  USER_DISCOVERY: 'UserDiscovery',
  
  // Friend Routes
  FRIEND_REQUESTS: 'FriendRequests',
  PENDING_REQUESTS: 'PendingRequests',
};

// UI Constants
export const UI_CONSTANTS = {
  COLORS: {
    // Social Media Chat App Color Palette
    // Primary (Brand) - vivid blue for navigation bars, primary actions
    PRIMARY: '#3B82F6',
    PRIMARY_PRESSED: '#2563EB',
    
    // Secondary (Accent) - pink/red for likes, FABs, highlights
    SECONDARY: '#F43F5E',
    SECONDARY_PRESSED: '#E11D48',
    
    // Success / Online - green for online status & success
    SUCCESS: '#22C55E',
    SUCCESS_PRESSED: '#15803D',
    
    // Warning - yellow for non-critical alerts
    WARNING: '#FACC15',
    WARNING_PRESSED: '#EAB308',
    
    // Error / Danger - red for errors, failed actions
    DANGER: '#EF4444',
    DANGER_PRESSED: '#B91C1C',
    
    // Backgrounds
    BACKGROUND_LIGHT: '#F9FAFB',
    BACKGROUND_DARK: '#0F172A',
    
    // Chat Bubbles
    CHAT_BUBBLE_YOURS: '#D1FAE5', // Light mint green
    CHAT_BUBBLE_OTHERS: '#E5E7EB', // Soft gray
    CHAT_BUBBLE_SYSTEM_ERROR: '#FEE2E2', // Light red background
    
    // Text Colors
    TEXT_PRIMARY: '#111827', // Dark gray/black, high readability
    TEXT_SECONDARY: '#6B7280', // Muted gray for secondary text
    TEXT_ON_PRIMARY: '#FFFFFF', // White text on primary colors
    TEXT_ON_SUCCESS: '#FFFFFF',
    TEXT_ON_DANGER: '#FFFFFF',
    
    // Legacy compatibility (keeping for gradual migration)
    LIGHT: '#F9FAFB',
    DARK: '#111827',
    WHITE: '#FFFFFF',
    BLACK: '#000000',
    SURFACE: '#FFFFFF',
    BORDER: '#E5E7EB',
    TEXT_SECONDARY_LEGACY: '#6B7280',
    ACCENT: '#F43F5E',
    
    // Alert/Toast Colors
    SUCCESS_BACKGROUND: '#DCFCE7',
    SUCCESS_TEXT: '#166534',
    WARNING_BACKGROUND: '#FEF9C3',
    WARNING_TEXT: '#92400E',
    ERROR_BACKGROUND: '#FEE2E2',
    ERROR_TEXT: '#B91C1C',
    
    // Button Variants
    SECONDARY_BUTTON_BORDER: '#3B82F6',
    SECONDARY_BUTTON_PRESSED_BG: '#DBEAFE',
    
    // Info color (for compatibility)
    INFO: '#3B82F6',
  },
  SPACING: {
    XS: 4,
    SM: 8,
    MD: 16,
    LG: 24,
    XL: 32,
    XXL: 48,
  },
  // Typography System
  FONT_FAMILIES: {
    // Native fonts for system consistency
    SYSTEM: 'System',
    
    // iOS fonts
    SF_PRO_DISPLAY: 'SF Pro Display',
    SF_PRO_TEXT: 'SF Pro Text',
    SF_PRO_ROUNDED: 'SF Pro Rounded',
    
    // Android fonts
    ROBOTO: 'Roboto',
    ROBOTO_CONDENSED: 'Roboto Condensed',
    
    // Modern & Friendly fonts (great for social apps)
    POPPINS: 'Poppins',
    INTER: 'Inter',
    NUNITO: 'Nunito',
    
    // Professional & Sleek fonts
    MONTSERRAT: 'Montserrat',
    LATO: 'Lato',
  },
  
  FONT_WEIGHTS: {
    LIGHT: '300' as const,
    REGULAR: '400' as const,
    MEDIUM: '500' as const,
    SEMIBOLD: '600' as const,
    BOLD: '700' as const,
    EXTRABOLD: '800' as const,
  },
  
  // Recommended font sizes for social messaging app
  FONT_SIZES: {
    // Secondary info (timestamps, "seen", captions)
    XS: 12,
    SM: 13,
    
    // Message text and body content
    BODY: 14,
    MD: 16,
    
    // Buttons and interactive elements
    BUTTON: 15,
    
    // Headers and titles
    LG: 18,
    HEADER: 20,
    XL: 22,
    XXL: 24,
    
    // Large titles
    DISPLAY: 28,
    HERO: 32,
  },
  BORDER_RADIUS: {
    SM: 4,
    MD: 8,
    LG: 12,
    XL: 16,
    ROUND: 50,
  },
};

// Message Types
export const MESSAGE_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  FILE: 'file',
  SYSTEM: 'system',
};

// Friend Request Status
export const FRIEND_REQUEST_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
};

// File Upload
export const FILE_UPLOAD = {
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
  ALLOWED_FILE_TYPES: ['application/pdf', 'text/plain'],
};

// Validation Rules
export const VALIDATION = {
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SPECIAL_CHARS: false,
  },
  EMAIL: {
    REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
  },
};

// Typography Utilities
export const TYPOGRAPHY = {
  // Predefined text styles for consistent usage
  HERO: {
    fontSize: UI_CONSTANTS.FONT_SIZES.HERO,
    fontWeight: UI_CONSTANTS.FONT_WEIGHTS.BOLD as any,
    fontFamily: UI_CONSTANTS.FONT_FAMILIES.SYSTEM,
    lineHeight: UI_CONSTANTS.FONT_SIZES.HERO * 1.2,
  },
  
  DISPLAY: {
    fontSize: UI_CONSTANTS.FONT_SIZES.DISPLAY,
    fontWeight: UI_CONSTANTS.FONT_WEIGHTS.BOLD as any,
    fontFamily: UI_CONSTANTS.FONT_FAMILIES.SYSTEM,
    lineHeight: UI_CONSTANTS.FONT_SIZES.DISPLAY * 1.2,
  },
  
  HEADER: {
    fontSize: UI_CONSTANTS.FONT_SIZES.HEADER,
    fontWeight: UI_CONSTANTS.FONT_WEIGHTS.SEMIBOLD as any,
    fontFamily: UI_CONSTANTS.FONT_FAMILIES.SYSTEM,
    lineHeight: UI_CONSTANTS.FONT_SIZES.HEADER * 1.3,
  },
  
  TITLE: {
    fontSize: UI_CONSTANTS.FONT_SIZES.LG,
    fontWeight: UI_CONSTANTS.FONT_WEIGHTS.SEMIBOLD as any,
    fontFamily: UI_CONSTANTS.FONT_FAMILIES.SYSTEM,
    lineHeight: UI_CONSTANTS.FONT_SIZES.LG * 1.3,
  },
  
  BODY: {
    fontSize: UI_CONSTANTS.FONT_SIZES.BODY,
    fontWeight: UI_CONSTANTS.FONT_WEIGHTS.REGULAR as any,
    fontFamily: UI_CONSTANTS.FONT_FAMILIES.SYSTEM,
    lineHeight: UI_CONSTANTS.FONT_SIZES.BODY * 1.4,
  },
  
  BODY_LARGE: {
    fontSize: UI_CONSTANTS.FONT_SIZES.MD,
    fontWeight: UI_CONSTANTS.FONT_WEIGHTS.REGULAR as any,
    fontFamily: UI_CONSTANTS.FONT_FAMILIES.SYSTEM,
    lineHeight: UI_CONSTANTS.FONT_SIZES.MD * 1.4,
  },
  
  BUTTON: {
    fontSize: UI_CONSTANTS.FONT_SIZES.BUTTON,
    fontWeight: UI_CONSTANTS.FONT_WEIGHTS.SEMIBOLD as any,
    fontFamily: UI_CONSTANTS.FONT_FAMILIES.SYSTEM,
    lineHeight: UI_CONSTANTS.FONT_SIZES.BUTTON * 1.2,
  },
  
  CAPTION: {
    fontSize: UI_CONSTANTS.FONT_SIZES.SM,
    fontWeight: UI_CONSTANTS.FONT_WEIGHTS.MEDIUM as any,
    fontFamily: UI_CONSTANTS.FONT_FAMILIES.SYSTEM,
    lineHeight: UI_CONSTANTS.FONT_SIZES.SM * 1.3,
  },
  
  SMALL: {
    fontSize: UI_CONSTANTS.FONT_SIZES.XS,
    fontWeight: UI_CONSTANTS.FONT_WEIGHTS.REGULAR as any,
    fontFamily: UI_CONSTANTS.FONT_FAMILIES.SYSTEM,
    lineHeight: UI_CONSTANTS.FONT_SIZES.XS * 1.3,
  },
  
  // Social messaging specific styles
  MESSAGE_TEXT: {
    fontSize: UI_CONSTANTS.FONT_SIZES.BODY,
    fontWeight: UI_CONSTANTS.FONT_WEIGHTS.REGULAR as any,
    fontFamily: UI_CONSTANTS.FONT_FAMILIES.SYSTEM,
    lineHeight: UI_CONSTANTS.FONT_SIZES.BODY * 1.4,
  },
  
  MESSAGE_TIMESTAMP: {
    fontSize: UI_CONSTANTS.FONT_SIZES.XS,
    fontWeight: UI_CONSTANTS.FONT_WEIGHTS.MEDIUM as any,
    fontFamily: UI_CONSTANTS.FONT_FAMILIES.SYSTEM,
    lineHeight: UI_CONSTANTS.FONT_SIZES.XS * 1.2,
  },
  
  NAVIGATION_LABEL: {
    fontSize: UI_CONSTANTS.FONT_SIZES.SM,
    fontWeight: UI_CONSTANTS.FONT_WEIGHTS.MEDIUM as any,
    fontFamily: UI_CONSTANTS.FONT_FAMILIES.SYSTEM,
    lineHeight: UI_CONSTANTS.FONT_SIZES.SM * 1.2,
  },
};
