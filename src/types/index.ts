/**
 * TypeScript type definitions for the Social Messenger app
 */

// User Types
export interface User {
  id: number;
  email: string;
  full_name: string;
  profile_picture?: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserRegistrationData {
  full_name: string;
  email: string;
  password: string;
  password_confirm: string;
  profile_picture?: string;
}

export interface UserLoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

// Friend Request Types
export interface FriendRequest {
  id: number;
  sender: User;
  receiver: User;
  status: FriendRequestStatus;
  message?: string;
  created_at: string;
  updated_at: string;
}

export type FriendRequestStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled';

export interface FriendRequestAction {
  selected_user_id: number;
}

// Message Types
export interface Message {
  id: number;
  sender: User;
  recipient: User;
  message_type: MessageType;
  content?: string;
  attachment_url?: string;
  is_read: boolean;
  read_at?: string;
  created_at: string;
  updated_at: string;
}

export type MessageType = 'text' | 'image' | 'file' | 'system';

export interface MessageCreateData {
  recipient: number;
  message_type: MessageType;
  content?: string;
  attachment_url?: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  status: number;
  success: boolean;
}

export interface PaginatedResponse<T> {
  count: number;
  next?: string;
  previous?: string;
  results: T[];
}

export interface ApiError {
  status: number;
  message: string;
  data?: any;
}

// Navigation Types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Login: undefined;
  Register: undefined;
  ChatMessage: { recipientId: number; recipientName: string };
  UserDiscovery: undefined;
  FriendRequests: undefined;
  PendingRequests: undefined;
};

export type MainTabParamList = {
  Chats: undefined;
  Friends: undefined;
  Profile: undefined;
};

// Store Types
export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface MessageState {
  messages: Message[];
  conversations: Conversation[];
  isLoading: boolean;
  error: string | null;
}

export interface Conversation {
  id: string;
  participant: User;
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: string;
}

// Hook Types
export interface UseApiOptions {
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  retry?: number;
  staleTime?: number;
  cacheTime?: number;
}

// Form Types
export interface FormField {
  value: string;
  error?: string;
  touched: boolean;
}

export interface FormState {
  [key: string]: FormField;
}

// Notification Types
export interface NotificationData {
  type: 'message' | 'friend_request' | 'system';
  title: string;
  body: string;
  data?: any;
}

// File Upload Types
export interface FileUploadResult {
  url: string;
  filename: string;
  size: number;
  type: string;
}

// Theme Types
export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
    warning: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  typography: {
    h1: number;
    h2: number;
    h3: number;
    body: number;
    caption: number;
  };
}
