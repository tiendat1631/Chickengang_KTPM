# Movie Booking System
## ChickenGang KTPM - Monorepo

[![Backend](https://img.shields.io/badge/Backend-Spring%20Boot%203.5.6-green)](./backend)
[![Frontend](https://img.shields.io/badge/Frontend-React%20Web%2018-blue)](./frontend)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

---

## 🎯 Tổng Quan

**Movie Booking System** là một hệ thống đặt vé xem phim hoàn chỉnh, bao gồm:
- **Backend**: REST API được phát triển bằng Spring Boot
- **Frontend**: Web app được phát triển bằng React + TypeScript
- **Documentation**: Tài liệu kỹ thuật đầy đủ trong folder `docs/`

---

## 🏗️ Kiến Trúc Hệ Thống

### Monorepo Structure
```
Chickengang_KTPM/
├── backend/          # Spring Boot Backend API
├── frontend/         # React Web Application
├── docs/             # 📚 Documentation Hub
└── README.md         # This file
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
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **State Management**: TanStack Query
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form

---

## 🚀 Quick Start

### Prerequisites
- **Java 17+** (for backend)
- **Node.js 16+** (for frontend)
- **MySQL 8.0+** (for database)

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

# Run development server
npm run dev

# Access at http://localhost:3000
```

### Database Setup
```sql
CREATE DATABASE moviebooking CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'movieuser'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON moviebooking.* TO 'movieuser'@'localhost';
FLUSH PRIVILEGES;
```

---

## 📚 Documentation

**Tất cả tài liệu chi tiết được tổ chức trong folder [`docs/`](./docs/):**

- [**📚 Documentation Hub**](./docs/README.md) - Tổng hợp tất cả tài liệu
- [**🏗️ System Architecture**](./docs/System_Architecture_Analysis.md) - Phân tích kiến trúc hệ thống
- [**📡 API Documentation**](./docs/API_Documentation.md) - Tài liệu API endpoints
- [**🎨 Frontend Guide**](./docs/Frontend_Development_Guide.md) - Hướng dẫn phát triển Frontend
- [**🚀 Deployment Guide**](./docs/Deployment_Guide.md) - Hướng dẫn triển khai
- [**🔧 Restructuring Guide**](./docs/Project_Restructuring_Guide.md) - Hướng dẫn tái cấu trúc

---

## 🎨 Features

### Implemented ✅
- User authentication (Login/Register)
- JWT-based security
- Movie CRUD operations
- User management
- RESTful API design
- React Web application
- TanStack Query integration
- Responsive design với Tailwind CSS

### In Progress 🔄
- Movie booking system
- Seat selection
- Payment integration

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
- **Token Storage**: localStorage (Web)
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
java -jar target/movie-0.0.1-SNAPSHOT.jar
```

### Frontend Production Build
```bash
cd frontend
npm run build
# Creates optimized build in dist/
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

## 🔗 Quick Links

- [📚 Documentation Hub](./docs/README.md)
- [🏗️ Backend README](./backend/README.md)
- [🎨 Frontend README](./frontend/README.md)
- [📡 API Documentation](./docs/API_Documentation.md)
- [🏗️ System Architecture](./docs/System_Architecture_Analysis.md)