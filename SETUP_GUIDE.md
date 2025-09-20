# Social Messenger - Modern React Native Setup Guide

## 🚀 Overview

This is a modern React Native application built with Expo CLI, featuring:
- **TypeScript** for type safety
- **React Query** for data fetching and caching
- **Zustand** for state management
- **Modern API client** with automatic token refresh
- **Proper error handling** and user feedback
- **Offline support** with data persistence
- **Professional naming conventions** and file structure

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

## 🛠️ Installation & Setup

### 1. Install Dependencies

```bash
# Install all dependencies
npm install

# Or with yarn
yarn install
```

### 2. Install Additional Dependencies

```bash
# Install missing dependencies for the modern setup
npm install @tanstack/react-query zustand react-native-gesture-handler react-native-reanimated
npm install @react-native-async-storage/async-storage expo-notifications
npm install --save-dev @types/react @types/react-native @types/uuid typescript
npm install --save-dev eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser
npm install --save-dev eslint-config-expo eslint-plugin-react eslint-plugin-react-hooks
```

### 3. Configure Babel

The `babel.config.js` is already configured with:
- Module resolver for path aliases
- Reanimated plugin
- Expo preset

### 4. Configure TypeScript

The `tsconfig.json` is configured with:
- Path aliases for clean imports
- Strict type checking
- Expo TypeScript base configuration

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Common components (LoadingScreen, ErrorBoundary)
│   ├── forms/          # Form components
│   └── navigation/     # Navigation components
├── screens/            # Screen components
│   ├── auth/          # Authentication screens
│   ├── chat/          # Chat-related screens
│   ├── friends/       # Friend management screens
│   └── profile/       # Profile screens
├── services/          # API services
│   ├── apiClient.ts   # Main API client
│   └── authService.ts # Authentication service
├── store/             # State management (Zustand)
│   ├── authStore.ts   # Authentication store
│   └── messageStore.ts # Message store
├── hooks/             # Custom hooks
│   ├── useApi.ts      # API hooks with React Query
│   └── useAuth.ts     # Authentication hooks
├── navigation/        # Navigation configuration
│   ├── AuthNavigator.tsx
│   └── MainNavigator.tsx
├── config/            # Configuration files
│   ├── api.js         # API configuration
│   └── constants.js   # App constants
├── utils/             # Utility functions
│   └── jwt.js         # JWT utilities
├── types/             # TypeScript type definitions
│   └── index.ts       # All type definitions
└── contexts/          # React contexts
    └── ThemeContext.tsx
```

## 🔧 Key Features

### 1. Modern API Client (`src/services/apiClient.ts`)

- **Automatic token refresh** when access token expires
- **Request/Response interceptors** for authentication
- **Error handling** with proper error formatting
- **TypeScript support** with generic types
- **File upload support** for images and documents

### 2. State Management with Zustand

- **Authentication store** (`src/store/authStore.ts`)
- **Message store** (`src/store/messageStore.ts`)
- **Persistent storage** with AsyncStorage
- **TypeScript integration** for type safety

### 3. Data Fetching with React Query

- **Custom hooks** for all API operations
- **Automatic caching** and background updates
- **Optimistic updates** for better UX
- **Error handling** and retry logic
- **Real-time data** with polling

### 4. TypeScript Integration

- **Comprehensive type definitions** in `src/types/index.ts`
- **Type-safe API calls** with proper error handling
- **Navigation types** for route parameters
- **Form validation types** for better UX

## 🚀 Running the Application

### Development Mode

```bash
# Start the development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web
```

### Production Build

```bash
# Build for production
expo build:android
expo build:ios
```

## 📱 Key Components

### 1. App.tsx
- **QueryClient setup** with React Query
- **Navigation container** with proper theming
- **Error boundary** for crash handling
- **Authentication flow** management

### 2. Authentication Flow
- **Login/Register screens** with form validation
- **Automatic token management** with refresh
- **Persistent authentication** across app restarts
- **Secure storage** of user credentials

### 3. Navigation Structure
- **Stack navigation** for main app flow
- **Tab navigation** for main sections
- **Type-safe navigation** with TypeScript
- **Proper back button handling**

## 🔐 Security Features

- **JWT token authentication** with automatic refresh
- **Secure storage** of sensitive data
- **Input validation** on both client and server
- **Error handling** without exposing sensitive information
- **CORS configuration** for API security

## 📊 Performance Optimizations

- **React Query caching** for API responses
- **Optimistic updates** for immediate feedback
- **Image optimization** with Expo Image
- **Lazy loading** of screens and components
- **Memory management** with proper cleanup

## 🧪 Testing

```bash
# Run tests
npm test

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix
```

## 📝 Environment Configuration

Create a `.env` file in the root directory:

```env
API_BASE_URL=http://192.168.1.3:8000/api/v1
APP_NAME=Social Messenger
APP_VERSION=1.0.0
```

## 🐛 Debugging

- **React Query DevTools** for API debugging
- **Zustand DevTools** for state debugging
- **Expo DevTools** for general debugging
- **Console logging** with proper error handling

## 📚 Documentation

- **API Documentation** in `backend/API_DOCUMENTATION.md`
- **Naming Conventions** in `NAMING_CONVENTIONS.md`
- **TypeScript types** in `src/types/index.ts`
- **Component documentation** with JSDoc comments

## 🔄 Migration from Old Structure

If migrating from the old structure:

1. **Update imports** to use new path aliases
2. **Replace old API calls** with new hooks
3. **Update state management** to use Zustand stores
4. **Migrate to TypeScript** for better type safety
5. **Update navigation** to use new structure

## 🚀 Next Steps

1. **Implement remaining screens** using the new structure
2. **Add push notifications** for real-time messaging
3. **Implement offline support** with data synchronization
4. **Add unit tests** for critical functionality
5. **Set up CI/CD** for automated deployment

This modern setup provides a solid foundation for building a scalable, maintainable React Native application with professional-grade architecture and best practices.
