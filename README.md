# Movie Booking System
## ChickenGang KTPM - Monorepo

[![Backend](https://img.shields.io/badge/Backend-Spring%20Boot%203.5.6-green)](./backend)
[![Frontend](https://img.shields.io/badge/Frontend-React%20Native%200.72-blue)](./frontend)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

---

## 🎯 Tổng Quan

**Movie Booking System** là một hệ thống đặt vé xem phim hoàn chỉnh, bao gồm:
- **Backend**: REST API được phát triển bằng Spring Boot
- **Frontend**: Mobile app được phát triển bằng React Native
- **Documentation**: Tài liệu kỹ thuật đầy đủ

---

## 🏗️ Kiến Trúc Hệ Thống

### Monorepo Structure
```
Chickengang_KTPM/
├── backend/          # Spring Boot Backend API
├── frontend/         # React Native Mobile App
├── docs/             # Documentation
├── scripts/          # Build & Deploy Scripts
└── .github/          # CI/CD Workflows
```

### Technology Stack

#### Backend
- **Framework**: Spring Boot 3.5.6
- **Language**: Java 17
- **Database**: MySQL 8.0
- **ORM**: Spring Data JPA + Hibernate
- **Security**: Spring Security + JWT
- **Build Tool**: Maven

#### Frontend
- **Framework**: React Native 0.72.6
- **Language**: TypeScript
- **State Management**: TanStack Query
- **Navigation**: React Navigation 6
- **Forms**: React Hook Form + Yup
- **Storage**: React Native Keychain

---

## 🚀 Quick Start

### Prerequisites
- **Java 17+** (for backend)
- **Node.js 16+** (for frontend)
- **MySQL 8.0+** (for database)
- **React Native CLI** (for mobile development)

### Backend Setup
```bash
cd backend

# Install dependencies
./mvnw clean install

# Run application
./mvnw spring-boot:run

# Access API at http://localhost:8080/api/v1
```

### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Setup environment
cp env.example .env

# Run on Android
npm run android

# Run on iOS (macOS only)
npm run ios
```

### Database Setup
```sql
CREATE DATABASE moviebooking CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'movieuser'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON moviebooking.* TO 'movieuser'@'localhost';
FLUSH PRIVILEGES;
```

---

## 📁 Project Structure

### Backend
```
backend/
├── src/
│   ├── main/java/com/chickengang/moviebooking/
│   │   ├── controller/       # REST Controllers
│   │   ├── service/          # Business Logic
│   │   ├── repository/       # Data Access
│   │   ├── model/            # Entity Models
│   │   ├── dto/              # Data Transfer Objects
│   │   ├── security/         # Security Components
│   │   └── exception/        # Exception Handling
│   └── main/resources/
│       └── application.properties
└── pom.xml
```

### Frontend
```
frontend/
├── src/
│   ├── components/           # UI Components
│   ├── screens/              # Screen Components
│   ├── navigation/           # Navigation Config
│   ├── hooks/                # Custom Hooks
│   ├── services/             # API Services
│   ├── types/                # TypeScript Types
│   ├── utils/                # Utilities
│   └── theme/                # Theme Config
├── package.json
└── tsconfig.json
```

---

## 📚 Documentation

Xem chi tiết tại thư mục [`docs/`](./docs/):

- [**System Architecture**](./docs/System_Architecture_Analysis.md) - Phân tích kiến trúc hệ thống
- [**API Documentation**](./docs/API_Documentation.md) - Tài liệu API endpoints
- [**Frontend Guide**](./docs/Frontend_Development_Guide.md) - Hướng dẫn phát triển Frontend
- [**Deployment Guide**](./docs/Deployment_Guide.md) - Hướng dẫn triển khai
- [**Restructuring Guide**](./docs/Project_Restructuring_Guide.md) - Hướng dẫn tái cấu trúc

---

## 🎨 Features

### Implemented ✅
- User authentication (Login/Register)
- JWT-based security
- Movie CRUD operations
- User management
- RESTful API design
- Mobile app structure
- TanStack Query integration
- Secure token storage

### In Progress 🔄
- Movie booking system
- Seat selection
- Payment integration
- Push notifications

### Planned 📅
- Admin dashboard
- Movie recommendations
- User reviews
- Email notifications
- Analytics dashboard

---

## 🔐 Security

- **Authentication**: JWT (JSON Web Tokens)
- **Password Encryption**: BCrypt
- **Token Storage**: React Native Keychain (iOS/Android)
- **API Security**: Spring Security
- **Role-based Access Control**: ADMIN/CUSTOMER roles

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
./mvnw test
```

### Frontend Tests
```bash
cd frontend
npm test
```

---

## 📦 Build & Deployment

### Backend Production Build
```bash
cd backend
./mvnw clean package
java -jar target/moviebooking-backend-0.0.1-SNAPSHOT.jar
```

### Frontend Production Build
```bash
cd frontend
# Android
npm run build:android

# iOS
npm run build:ios
```

---

## 🔧 Configuration

### Backend Configuration
```properties
# application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/moviebooking
spring.datasource.username=movieuser
spring.datasource.password=password
app.jwt.access.expiration-in-seconds=900
```

### Frontend Configuration
```bash
# .env
API_BASE_URL=http://localhost:8080/api/v1
JWT_ACCESS_TOKEN_KEY=access_token
JWT_REFRESH_TOKEN_KEY=refresh_token
```

---

## 🌳 Git Flow Workflow

Dự án sử dụng [Git Flow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow):

```bash
# Feature development
git flow feature start feature-name
git flow feature finish feature-name

# Release
git flow release start 1.0.0
git flow release finish 1.0.0

# Hotfix
git flow hotfix start critical-fix
git flow hotfix finish critical-fix
```

### Branch Structure
- `main` - Production releases
- `develop` - Integration branch
- `feature/*` - New features
- `release/*` - Release preparation
- `hotfix/*` - Critical fixes

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git flow feature start amazing-feature`)
3. Commit your changes (`git commit -m 'feat: Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Message Convention
```
type(scope): description

feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Format code
refactor: Refactor code
test: Add tests
chore: Update dependencies
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 👥 Team

**ChickenGang KTPM Team**
- Backend Development
- Frontend Development
- UI/UX Design
- DevOps & Infrastructure

---

## 📞 Support

- **Documentation**: [`docs/`](./docs/)
- **Issues**: [GitHub Issues](https://github.com/chickengang/movie-booking/issues)
- **Email**: support@chickengang.com

---

## 🗺️ Roadmap

### Phase 1: Core Features (Current)
- ✅ Authentication & Authorization
- ✅ Movie Management
- ✅ User Management
- 🔄 Movie Booking System

### Phase 2: Enhancement
- Payment Gateway Integration
- Seat Selection System
- Push Notifications
- Email Notifications

### Phase 3: Advanced Features
- Movie Recommendations
- User Reviews & Ratings
- Admin Dashboard
- Analytics & Reports

### Phase 4: Optimization
- Performance Optimization
- Caching Strategy
- Load Balancing
- Microservices Migration

---

**Made with ❤️ by ChickenGang KTPM Team**

---

## 🔗 Links

- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)
- [Documentation](./docs/README.md)
- [API Docs](./docs/API_Documentation.md)
- [Architecture](./docs/System_Architecture_Analysis.md)