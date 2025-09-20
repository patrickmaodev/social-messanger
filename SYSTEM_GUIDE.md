# 🚀 Social Messenger - Complete System Guide

## 📋 System Overview

**Social Messenger** is a full-stack mobile messaging application with:
- **Frontend**: React Native + Expo (TypeScript)
- **Backend**: Django REST API + PostgreSQL + Redis
- **Infrastructure**: Docker + Docker Compose
- **Package Management**: Yarn (frontend) + pip (backend)

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐
│   Frontend      │    │    Backend       │
│   (React Native)│◄──►│   (Django API)   │
│                 │    │                  │
│ • Expo CLI      │    │ • Django 4.2     │
│ • TypeScript    │    │ • PostgreSQL 15  │
│ • Yarn          │    │ • Redis 7        │
│ • Metro Bundler │    │ • Docker         │
└─────────────────┘    └──────────────────┘
```

## 🔧 Prerequisites

### **System Requirements**
- **Node.js**: v20.19.4+ (managed via NVM)
- **Python**: 3.11+
- **Docker**: Latest version
- **Docker Compose**: v2.0+

### **Installation Commands**
```bash
# Install Node.js via NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install 20.19
nvm use 20.19

# Install Yarn
npm install -g yarn

# Install Docker (Ubuntu)
sudo apt update
sudo apt install docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
```

## 🚀 Quick Start

### **1. Start Backend (Docker)**
```bash
cd backend
docker-compose up --build
```

**Services:**
- **Django API**: http://localhost:8001
- **PostgreSQL**: localhost:5434
- **Redis**: localhost:6380
- **Admin Panel**: http://localhost:8001/admin

### **2. Start Frontend (Local)**
```bash
# Load NVM and use correct Node.js version
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 20.19

# Install dependencies and start
yarn install
npx expo start
```

**Frontend URLs:**
- **Development Server**: http://localhost:19000
- **QR Code**: Scan with Expo Go app
- **Web**: Press 'w' in terminal
- **Android**: Press 'a' in terminal
- **iOS**: Press 'i' in terminal

## 📁 Project Structure

```
social-messanger/
├── backend/                 # Django Backend
│   ├── accounts/           # User management
│   ├── friends/            # Friend requests
│   ├── messages/           # Chat messaging
│   ├── social_messenger/   # Django project
│   ├── docker-compose.yml  # Docker services
│   ├── Dockerfile         # Backend container
│   └── requirements.txt   # Python dependencies
├── src/                    # React Native Frontend
│   ├── components/        # Reusable components
│   ├── screens/          # App screens
│   ├── navigation/       # Navigation setup
│   ├── services/         # API services
│   ├── store/           # State management
│   ├── config/          # Configuration
│   └── types/           # TypeScript types
├── assets/               # Static assets
├── package.json         # Frontend dependencies
└── app.json            # Expo configuration
```

## 🔌 API Configuration

### **Backend API Endpoints**
```typescript
// Base URL
const API_BASE_URL = 'http://192.168.1.3:8001/api/v1'

// Authentication
POST /users/register/          # User registration
POST /users/login/             # User login
POST /users/token/refresh/     # Token refresh

// User Management
GET  /users/users/             # List users
GET  /users/users/all/         # List all users
GET  /users/users/{id}/        # User profile

// Friend Management
GET  /friends/friend-requests/ # Friend requests
POST /friends/friend-requests/ # Send friend request
POST /friends/friend-requests/accept/ # Accept request
POST /friends/friend-requests/remove/ # Remove friend

// Messaging
GET  /messages/messages/       # List messages
POST /messages/messages/       # Send message
GET  /messages/messages/{sender}/{recipient}/ # Conversation
```

### **Frontend API Client**
```typescript
// src/config/api.ts
export const API_CONFIG = {
  BASE_URL: 'http://192.168.1.3:8001/api/v1',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};
```

## 🐳 Docker Configuration

### **Backend Services**
```yaml
# backend/docker-compose.yml
services:
  db:
    image: postgres:15
    ports: ["5434:5432"]
    environment:
      POSTGRES_DB: social_messenger
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres

  redis:
    image: redis:7-alpine
    ports: ["6380:6379"]

  web:
    build: .
    ports: ["8001:8000"]
    command: python social_messenger/manage.py runserver 0.0.0.0:8000
    depends_on: [db, redis]
```

### **Port Configuration**
- **PostgreSQL**: 5434 (external) → 5432 (internal)
- **Redis**: 6380 (external) → 6379 (internal)
- **Django**: 8001 (external) → 8000 (internal)

## 📱 Frontend Development

### **Technology Stack**
- **Framework**: React Native with Expo
- **Language**: TypeScript
- **State Management**: Zustand
- **Data Fetching**: React Query
- **Navigation**: React Navigation v7
- **Forms**: React Hook Form + Yup
- **UI Components**: Native Base + Custom
- **Package Manager**: Yarn

### **Key Dependencies**
```json
{
  "expo": "~54.0.0",
  "react": "18.3.1",
  "react-native": "0.76.3",
  "@react-navigation/native": "^6.1.18",
  "@tanstack/react-query": "^5.17.0",
  "zustand": "^4.4.7",
  "react-hook-form": "^7.48.2",
  "yup": "^1.4.0",
  "axios": "^1.6.2"
}
```

### **Development Commands**
```bash
# Start development server
npx expo start

# Run on specific platforms
npx expo start --android
npx expo start --ios
npx expo start --web

# Clear cache
npx expo start --clear

# Install dependencies
yarn install

# Clean install
yarn install:clean
```

## 🗄️ Database Schema

### **User Model**
```python
class User(AbstractUser):
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=150)
    profile_picture = models.URLField(blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

### **Friend Request Model**
```python
class FriendRequest(models.Model):
    sender = models.ForeignKey('accounts.User', related_name='sent_friend_requests')
    receiver = models.ForeignKey('accounts.User', related_name='received_friend_requests')
    status = models.CharField(choices=RequestStatus.choices, default='pending')
    message = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
```

### **Message Model**
```python
class Message(models.Model):
    sender = models.ForeignKey('accounts.User', related_name='sent_messages')
    recipient = models.ForeignKey('accounts.User', related_name='received_messages')
    message_type = models.CharField(choices=MessageType.choices, default='text')
    content = models.TextField(blank=True, null=True)
    attachment_url = models.URLField(blank=True, null=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
```

## 🔐 Authentication

### **JWT Configuration**
```python
# Django Settings
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
}
```

### **Frontend Auth Flow**
```typescript
// Login
const response = await apiClient.post('/users/login/', {
  email: 'user@example.com',
  password: 'password123'
});

// Store tokens
await AsyncStorage.setItem('access_token', response.data.access);
await AsyncStorage.setItem('refresh_token', response.data.refresh);
```

## 🚨 Troubleshooting

### **Common Issues**

#### **1. Node.js Version Issues**
```bash
# Check current version
node --version

# Switch to correct version
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 20.19
```

#### **2. Port Conflicts**
```bash
# Check port usage
ss -tulpn | grep -E ':(5434|6380|8001)'

# Kill processes using ports
sudo lsof -ti:8001 | xargs kill -9
```

#### **3. Docker Issues**
```bash
# Reset Docker containers
cd backend
docker-compose down -v
docker-compose up --build

# Check container logs
docker-compose logs web
docker-compose logs db
```

#### **4. Frontend Issues**
```bash
# Clear Expo cache
npx expo start --clear

# Clear Yarn cache
yarn cache clean

# Reinstall dependencies
rm -rf node_modules yarn.lock
yarn install
```

#### **5. Database Issues**
```bash
# Reset database
cd backend
docker-compose down -v
docker-compose up --build

# Access database
docker-compose exec db psql -U postgres -d social_messenger
```

## 📊 Development Workflow

### **Daily Development**
1. **Start Backend**: `cd backend && docker-compose up --build`
2. **Start Frontend**: `npx expo start`
3. **Test on Device**: Scan QR code with Expo Go
4. **Debug**: Use React Native Debugger or browser dev tools

### **Code Changes**
1. **Frontend**: Hot reloading enabled
2. **Backend**: Auto-reload with Django development server
3. **Database**: Migrations run automatically on startup

### **Testing**
```bash
# Frontend tests
yarn test

# Backend tests
cd backend
python social_messenger/manage.py test

# API testing
curl http://localhost:8001/api/v1/users/
```

## 🔄 Deployment

### **Backend Deployment**
```bash
# Production Docker setup
cd backend
docker-compose -f docker-compose.prod.yml up --build
```

### **Frontend Deployment**
```bash
# Build for production
npx expo build:android
npx expo build:ios

# Or use EAS Build
npx eas build --platform all
```

## 📚 Additional Resources

### **Documentation**
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Docker Compose](https://docs.docker.com/compose/)

### **Useful Commands**
```bash
# Check system status
docker ps
yarn --version
node --version

# View logs
docker-compose logs -f web
npx expo logs

# Database operations
python social_messenger/manage.py makemigrations
python social_messenger/manage.py migrate
python social_messenger/manage.py createsuperuser
```

## ✅ System Status

### **Current Configuration**
- ✅ **Node.js**: v20.19.5 (via NVM)
- ✅ **Expo SDK**: 54.0.0 (Latest)
- ✅ **React Native**: 0.76.3 (Latest)
- ✅ **React**: 18.3.1 (Latest)
- ✅ **Docker**: Running
- ✅ **Backend**: Django + PostgreSQL + Redis
- ✅ **Frontend**: React Native + Expo (Upgraded)
- ✅ **Ports**: 5434, 6380, 8001 (conflict-free)

### **Ready to Use**
Your Social Messenger system is fully configured and ready for development! 🎉

---

**Last Updated**: September 2024  
**Version**: 1.0.0  
**Maintainer**: Development Team
