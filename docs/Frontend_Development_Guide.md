# Frontend Development Guide
## Movie Booking System - React Native

---

## 🎯 Tổng Quan

Frontend của Movie Booking System được phát triển bằng **React Native** với **TypeScript**, sử dụng **TanStack Query** cho server state management và **React Navigation** cho routing.

---

## 🏗️ Kiến Trúc Frontend

### 1. Technology Stack
- **Framework**: React Native 0.72.6
- **Language**: TypeScript với strict mode
- **State Management**: TanStack Query (React Query)
- **Navigation**: React Navigation 6
- **Forms**: React Hook Form + Yup validation
- **Storage**: React Native Keychain (secure storage)
- **HTTP Client**: Axios với interceptors
- **Styling**: React Native StyleSheet

### 2. Project Structure
```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Basic UI components (Button, Input, etc.)
│   │   └── layout/         # Layout components (Header, Footer, etc.)
│   ├── pages/              # Screen components
│   │   ├── auth/           # Authentication screens
│   │   ├── movies/         # Movie-related screens
│   │   └── profile/        # User profile screens
│   ├── hooks/              # Custom React hooks
│   │   ├── useAuth.ts      # Authentication hooks
│   │   ├── useMovies.ts    # Movie-related hooks
│   │   └── useQueryClient.ts # Query client configuration
│   ├── services/           # API services
│   │   ├── api.ts          # Axios client configuration
│   │   ├── authService.ts  # Authentication API calls
│   │   └── movieService.ts # Movie API calls
│   ├── utils/              # Utility functions
│   │   ├── auth.ts         # Authentication utilities
│   │   ├── validation.ts   # Validation schemas
│   │   └── constants.ts    # App constants
│   ├── types/              # TypeScript type definitions
│   │   ├── auth.ts         # Authentication types
│   │   ├── movie.ts        # Movie types
│   │   └── common.ts       # Common types
│   └── assets/             # Static assets
│       ├── images/          # Images and icons
│       ├── fonts/           # Custom fonts
│       └── animations/      # Animation files
├── android/               # Android-specific code
├── ios/                   # iOS-specific code
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🚀 Setup và Installation

### 1. Prerequisites
```bash
# Node.js 16+
node --version

# React Native CLI
npm install -g react-native-cli

# Android Studio (for Android)
# Xcode (for iOS - macOS only)
```

### 2. Installation Steps
```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Setup environment
cp env.example .env
# Edit .env with your configuration

# 4. iOS setup (macOS only)
cd ios && pod install && cd ..

# 5. Start Metro bundler
npm start

# 6. Run on device/emulator
npm run android  # or npm run ios
```

### 3. Environment Configuration
```bash
# .env file
API_BASE_URL=http://localhost:8080/api/v1
API_TIMEOUT=30000
JWT_ACCESS_TOKEN_KEY=access_token
JWT_REFRESH_TOKEN_KEY=refresh_token
APP_NAME=Movie Booking
ENVIRONMENT=development
```

---

## 🔧 Development Workflow

### 1. Git Flow Workflow
Dự án sử dụng [Git Flow workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow):

```bash
# Create feature branch
git flow feature start feature-name

# Work on feature
# ... make changes ...

# Finish feature
git flow feature finish feature-name
```

### 2. Branch Naming Convention
- `feature/feature-name`: New features
- `bugfix/bug-description`: Bug fixes
- `hotfix/critical-fix`: Critical production fixes
- `release/version-number`: Release preparation

### 3. Commit Message Convention
```
type(scope): description

feat(auth): Add login screen with validation
fix(movies): Resolve movie list pagination issue
docs(readme): Update installation instructions
refactor(api): Simplify API client configuration
```

---

## 📱 Component Development

### 1. Component Structure
```typescript
// components/ui/Button.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, styles[variant], disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.text, styles[`${variant}Text`]]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  primary: {
    backgroundColor: '#007AFF',
  },
  secondary: {
    backgroundColor: '#F2F2F7',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#007AFF',
  },
});
```

### 2. Screen Component
```typescript
// pages/auth/LoginScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';

export const LoginScreen: React.FC = () => {
  const { login, isLoggingIn } = useAuth();

  const handleLogin = () => {
    login({
      email: 'user@example.com',
      password: 'password123',
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Button
        title={isLoggingIn ? 'Signing In...' : 'Sign In'}
        onPress={handleLogin}
        disabled={isLoggingIn}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
});
```

---

## 🔐 Authentication Implementation

### 1. JWT Token Management
```typescript
// utils/auth.ts
import * as Keychain from 'react-native-keychain';

export const storeTokens = async (accessToken: string, refreshToken: string) => {
  await Keychain.setInternetCredentials('access_token', 'user', accessToken);
  await Keychain.setInternetCredentials('refresh_token', 'user', refreshToken);
};

export const getToken = async (): Promise<string | null> => {
  const credentials = await Keychain.getInternetCredentials('access_token');
  return credentials ? credentials.password : null;
};
```

### 2. API Client với Interceptors
```typescript
// services/api.ts
import axios from 'axios';
import { getToken, removeToken } from '@/utils/auth';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  timeout: 30000,
});

// Request interceptor - Add JWT token
apiClient.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - Handle 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await removeToken();
      // Navigate to login screen
    }
    return Promise.reject(error);
  }
);
```

---

## 📊 State Management với TanStack Query

### 1. Query Client Configuration
```typescript
// hooks/useQueryClient.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

export const queryKeys = {
  movies: {
    all: ['movies'] as const,
    list: (page: number, size: number) => ['movies', 'list', { page, size }] as const,
    detail: (id: number) => ['movies', 'detail', id] as const,
  },
};
```

### 2. Custom Hooks
```typescript
// hooks/useMovies.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './useQueryClient';

export const useMovies = (page: number = 0, size: number = 10) => {
  return useQuery({
    queryKey: queryKeys.movies.list(page, size),
    queryFn: async () => {
      const response = await apiClient.get(`/movies?page=${page}&size=${size}`);
      return response.data.data;
    },
  });
};

export const useAddMovie = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: MovieRequest) => apiClient.post('/movies', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.movies.all });
    },
  });
};
```

---

## 🎨 Styling Guidelines

### 1. StyleSheet Best Practices
```typescript
import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#007AFF',
  },
  // Responsive design
  responsiveContainer: {
    width: width * 0.9,
    maxWidth: 400,
  },
});
```

### 2. Theme System
```typescript
// utils/theme.ts
export const theme = {
  colors: {
    primary: '#007AFF',
    secondary: '#5856D6',
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    background: '#FFFFFF',
    surface: '#F2F2F7',
    text: '#000000',
    textSecondary: '#8E8E93',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  typography: {
    h1: { fontSize: 32, fontWeight: 'bold' },
    h2: { fontSize: 24, fontWeight: 'bold' },
    body: { fontSize: 16, fontWeight: 'normal' },
    caption: { fontSize: 12, fontWeight: 'normal' },
  },
};
```

---

## 🧪 Testing Strategy

### 1. Unit Testing
```typescript
// __tests__/components/Button.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '@/components/ui/Button';

describe('Button Component', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <Button title="Test Button" onPress={() => {}} />
    );
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <Button title="Test Button" onPress={mockOnPress} />
    );
    
    fireEvent.press(getByText('Test Button'));
    expect(mockOnPress).toHaveBeenCalled();
  });
});
```

### 2. Integration Testing
```typescript
// __tests__/hooks/useAuth.test.tsx
import { renderHook, act } from '@testing-library/react-hooks';
import { useAuth } from '@/hooks/useAuth';

describe('useAuth Hook', () => {
  it('should login successfully', async () => {
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      result.current.login({
        email: 'test@example.com',
        password: 'password123',
      });
    });
    
    expect(result.current.isAuthenticated).toBe(true);
  });
});
```

---

## 🚀 Build và Deployment

### 1. Development Build
```bash
# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

### 2. Production Build
```bash
# Android
npm run build:android

# iOS
npm run build:ios
```

### 3. Environment Configuration
```bash
# Development
ENVIRONMENT=development
API_BASE_URL=http://localhost:8080/api/v1

# Production
ENVIRONMENT=production
API_BASE_URL=https://api.moviebooking.com/api/v1
```

---

## 📚 Best Practices

### 1. Code Organization
- Sử dụng TypeScript strict mode
- Tách biệt business logic và UI components
- Sử dụng custom hooks cho reusable logic
- Implement proper error boundaries

### 2. Performance
- Sử dụng React.memo cho expensive components
- Implement lazy loading cho screens
- Optimize images và assets
- Sử dụng FlatList cho large lists

### 3. Security
- Store sensitive data trong Keychain
- Validate all user inputs
- Implement proper error handling
- Use HTTPS cho production

### 4. Accessibility
- Add accessibility labels
- Support screen readers
- Implement proper focus management
- Test với accessibility tools

---

## 🔗 Integration với Backend

### 1. API Endpoints
- Authentication: `/api/v1/auth/*`
- Movies: `/api/v1/movies/*`
- Users: `/api/v1/users/*`

### 2. Error Handling
```typescript
// services/api.ts
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
    } else if (error.response?.status >= 500) {
      // Handle server errors
    }
    return Promise.reject(error);
  }
);
```

### 3. Data Synchronization
- Sử dụng TanStack Query cho caching
- Implement optimistic updates
- Handle offline scenarios
- Sync data khi app comes online

---

## 📖 Resources

- [React Native Documentation](https://reactnative.dev/)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [React Navigation Documentation](https://reactnavigation.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Native Keychain](https://github.com/oblador/react-native-keychain)

---

## 🤝 Contributing

1. Follow Git Flow workflow
2. Write TypeScript với strict mode
3. Add tests cho new features
4. Follow established code style
5. Update documentation khi cần thiết

---

**Last Updated**: January 2024  
**Version**: 1.0.0  
**Maintainer**: Frontend Development Team
