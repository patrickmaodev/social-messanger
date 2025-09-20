# 🚀 Run Commands - Frontend & Backend

## 📋 Prerequisites

Make sure you have the following installed:
- **Node.js** (v18 or higher)
- **Yarn** (`npm install -g yarn`)
- **Docker** and **Docker Compose**
- **Expo CLI** (`yarn global add @expo/cli`)

## 🖥️ Backend Commands (Django + PostgreSQL)

### **Option 1: Using Docker Compose (Recommended)**

```bash
# Navigate to backend directory
cd backend

# Start all services (PostgreSQL, Redis, Django)
docker-compose up --build

# Or run in background
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### **Option 2: Manual Setup (Alternative)**

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp env.example .env

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start Django server
python manage.py runserver 0.0.0.0:8000
```

## 📱 Frontend Commands (React Native + Expo)

### **Install Dependencies First**

```bash
# Navigate to project root
cd /home/patrickdev/projects/social-messanger

# Install all dependencies with Yarn (faster and more efficient)
yarn install

# Clean install (if needed)
yarn install:clean
```

### **Run Frontend**

```bash
# Start Expo development server
yarn start

# Run on specific platform
yarn android    # Android
yarn ios        # iOS
yarn web        # Web

# Clean start (removes node_modules and reinstalls)
yarn start:clean
```

## 🔗 Backend-Frontend Communication Setup

### **1. Backend API Endpoints**

The Django backend runs on: `http://localhost:8001` or `http://192.168.1.3:8001`

**Available API Endpoints:**
- **Authentication**: `http://localhost:8001/api/v1/users/`
- **Friends**: `http://localhost:8001/api/v1/friends/`
- **Messages**: `http://localhost:8001/api/v1/messages/`
- **Admin Panel**: `http://localhost:8001/admin/`

### **2. Frontend API Configuration**

The frontend is configured to connect to: `http://192.168.1.3:8001/api/v1`

**To change the API URL:**
1. Edit `src/config/api.ts`
2. Update `BASE_URL` in `API_CONFIG`

```typescript
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8001/api/v1',  // For localhost
  // OR
  BASE_URL: 'http://192.168.1.3:8001/api/v1',  // For network access
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};
```

## 🚀 Complete Startup Sequence

### **Step 1: Start Backend**

```bash
# Terminal 1 - Backend
cd backend
docker-compose up --build
```

**Wait for these messages:**
```
✅ Database is ready!
✅ Running migrations...
✅ Creating superuser...
✅ Starting Django server...
✅ Django server running on http://0.0.0.0:8000
```

### **Step 2: Start Frontend**

```bash
# Terminal 2 - Frontend
cd /home/patrickdev/projects/social-messanger
yarn install
yarn start
```

**Wait for Expo to start:**
```
✅ Metro waiting on exp://192.168.1.3:19000
✅ Scan the QR code above with Expo Go
```

### **Step 3: Test Connection**

1. **Open Expo Go** on your phone
2. **Scan the QR code** from terminal
3. **Test the app** - try logging in or registering

## 🔧 Troubleshooting

### **Backend Issues**

```bash
# Check if backend is running
curl http://localhost:8000/api/v1/users/

# Check Docker containers
docker-compose ps

# View backend logs
docker-compose logs web

# Reset database
docker-compose down -v
docker-compose up --build
```

### **Frontend Issues**

```bash
# Clear Expo cache
yarn expo start --clear

# Clear Yarn cache
yarn cache clean

# Reinstall dependencies
yarn install:clean

# Or manual clean
rm -rf node_modules yarn.lock
yarn install
```

### **Network Issues**

```bash
# Check if backend is accessible
ping 192.168.1.3

# Test API endpoint
curl http://192.168.1.3:8001/api/v1/users/

# Check firewall settings
sudo ufw status
```

## 📱 Mobile Device Setup

### **For Android:**
1. Enable **Developer Options**
2. Enable **USB Debugging**
3. Connect device via USB
4. Run `yarn android`

### **For iOS:**
1. Install **Xcode**
2. Install **iOS Simulator**
3. Run `yarn ios`

### **For Physical Device:**
1. Install **Expo Go** app
2. Scan QR code from terminal
3. App will load on your device

## 🌐 Network Configuration

### **Local Development:**
- **Backend**: `http://localhost:8001`
- **Frontend**: `http://localhost:19000` (Expo)

### **Network Development:**
- **Backend**: `http://192.168.1.3:8001`
- **Frontend**: `http://192.168.1.3:19000` (Expo)

### **Production:**
- Update `API_CONFIG.BASE_URL` to your production server
- Deploy backend to your hosting service
- Build and deploy frontend

## 📊 Monitoring & Debugging

### **Backend Monitoring:**
```bash
# View real-time logs
docker-compose logs -f web

# Check database
docker-compose exec db psql -U postgres -d social_messenger

# Django shell
docker-compose exec web python manage.py shell
```

### **Frontend Debugging:**
```bash
# Open React Native debugger
npx react-native-debugger

# View network requests
# Open Chrome DevTools -> Network tab

# View console logs
# Shake device -> Debug -> Open Debugger
```

## 🎯 Quick Start Commands

### **One-Command Backend Start:**
```bash
cd backend && docker-compose up --build
```

### **One-Command Frontend Start:**
```bash
cd /home/patrickdev/projects/social-messanger && yarn install && yarn start
```

### **Full Stack Start (Two Terminals):**
```bash
# Terminal 1
cd backend && docker-compose up --build

# Terminal 2 (after backend is ready)
cd /home/patrickdev/projects/social-messanger && yarn start
```

## ✅ Success Indicators

### **Backend Ready:**
- ✅ Docker containers running
- ✅ Database migrations completed
- ✅ Django server on port 8000
- ✅ API endpoints accessible

### **Frontend Ready:**
- ✅ Expo server running
- ✅ QR code displayed
- ✅ Metro bundler active
- ✅ App loads on device/simulator

### **Connection Working:**
- ✅ Frontend can make API calls
- ✅ Authentication works
- ✅ Data loads from backend
- ✅ Real-time features functional

Your Social Messenger app is now ready for development! 🎉
