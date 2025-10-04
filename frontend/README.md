# Movie Booking Frontend

React Native application for the Movie Booking System.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development)

### Installation

1. **Install dependencies**
```bash
npm install
# or
yarn install
```

2. **Setup environment**
```bash
cp env.example .env
# Edit .env with your configuration
```

3. **iOS Setup** (macOS only)
```bash
cd ios && pod install && cd ..
```

4. **Run the application**
```bash
# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Screen components
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API services
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript type definitions
│   └── assets/             # Images, fonts, etc.
├── android/               # Android-specific code
├── ios/                   # iOS-specific code
├── package.json
├── tsconfig.json
└── README.md
```

## 🛠️ Technology Stack

- **Framework**: React Native 0.72.6
- **Language**: TypeScript
- **State Management**: TanStack Query (React Query)
- **Navigation**: React Navigation 6
- **Forms**: React Hook Form + Yup
- **Storage**: React Native Keychain
- **HTTP Client**: Axios
- **Styling**: React Native StyleSheet

## 🔧 Configuration

### Environment Variables
Copy `env.example` to `.env` and configure:

```bash
API_BASE_URL=http://localhost:8080/api/v1
JWT_ACCESS_TOKEN_KEY=access_token
JWT_REFRESH_TOKEN_KEY=refresh_token
```

### API Integration
The app integrates with the Spring Boot backend API:
- Base URL: `http://localhost:8080/api/v1`
- Authentication: JWT Bearer tokens
- Error handling: Global error interceptor

## 📱 Features

### Implemented
- ✅ Authentication (Login/Register)
- ✅ Movie listing and details
- ✅ User profile management
- ✅ Secure token storage
- ✅ TypeScript support
- ✅ API integration with TanStack Query

### Planned
- 🔄 Movie booking system
- 🔄 Seat selection
- 🔄 Payment integration
- 🔄 Push notifications
- 🔄 Offline support

## 🧪 Testing

```bash
# Run tests
npm test

# Run linting
npm run lint

# Type checking
npm run type-check
```

## 📦 Build

### Android
```bash
npm run build:android
```

### iOS
```bash
npm run build:ios
```

## 🔐 Security

- JWT tokens stored securely using React Native Keychain
- Automatic token refresh
- Secure API communication
- Input validation with Yup schemas

## 🚀 Deployment

### Development
- Use Metro bundler for development
- Hot reload enabled
- Debug mode with React Native Debugger

### Production
- Optimized builds
- Code splitting
- Asset optimization

## 📚 API Documentation

See the main project documentation:
- [API Documentation](../docs/API_Documentation.md)
- [System Architecture](../docs/System_Architecture_Analysis.md)

## 🤝 Contributing

1. Follow the Git Flow workflow
2. Create feature branches from `develop`
3. Use TypeScript for all new code
4. Write tests for new features
5. Follow the established code style

## 📄 License

MIT License - see LICENSE file for details.
