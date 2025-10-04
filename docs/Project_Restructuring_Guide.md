# Project Restructuring Guide
## Movie Booking System - Clean Architecture

---

## 🎯 Mục Tiêu

Tái cấu trúc dự án thành **Monorepo** với cấu trúc clean và professional, tách biệt rõ ràng giữa Frontend và Backend.

---

## 📁 Cấu Trúc Mới (Clean Architecture)

```
Chickengang_KTPM/
├── backend/                          # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/
│   │   │   │       └── chickengang/
│   │   │   │           └── moviebooking/
│   │   │   │               ├── MovieBookingApplication.java
│   │   │   │               ├── config/              # Configuration classes
│   │   │   │               │   ├── SecurityConfig.java
│   │   │   │               │   ├── JwtConfig.java
│   │   │   │               │   └── CorsConfig.java
│   │   │   │               ├── controller/          # REST Controllers
│   │   │   │               │   ├── AuthController.java
│   │   │   │               │   ├── MovieController.java
│   │   │   │               │   └── UserController.java
│   │   │   │               ├── service/             # Business Logic
│   │   │   │               │   ├── AuthService.java
│   │   │   │               │   ├── MovieService.java
│   │   │   │               │   ├── UserService.java
│   │   │   │               │   └── impl/           # Service Implementations
│   │   │   │               ├── repository/          # Data Access Layer
│   │   │   │               │   ├── MovieRepository.java
│   │   │   │               │   └── UserRepository.java
│   │   │   │               ├── model/               # Entity Models
│   │   │   │               │   ├── Movie.java
│   │   │   │               │   ├── User.java
│   │   │   │               │   └── BaseEntity.java
│   │   │   │               ├── dto/                 # Data Transfer Objects
│   │   │   │               │   ├── auth/
│   │   │   │               │   ├── movie/
│   │   │   │               │   ├── user/
│   │   │   │               │   └── common/
│   │   │   │               ├── mapper/              # Entity-DTO Mappers
│   │   │   │               │   ├── MovieMapper.java
│   │   │   │               │   └── UserMapper.java
│   │   │   │               ├── exception/           # Custom Exceptions
│   │   │   │               │   ├── GlobalExceptionHandler.java
│   │   │   │               │   └── custom/
│   │   │   │               ├── security/            # Security Components
│   │   │   │               │   ├── JwtAuthenticationFilter.java
│   │   │   │               │   ├── SecurityUtil.java
│   │   │   │               │   └── UserPrincipal.java
│   │   │   │               └── util/                # Utility Classes
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       ├── application-dev.properties
│   │   │       ├── application-prod.properties
│   │   │       └── application-test.properties
│   │   └── test/
│   │       └── java/
│   │           └── com/
│   │               └── chickengang/
│   │                   └── moviebooking/
│   │                       ├── controller/
│   │                       ├── service/
│   │                       └── repository/
│   ├── pom.xml
│   ├── mvnw
│   ├── mvnw.cmd
│   ├── README.md
│   └── .gitignore
│
├── frontend/                         # React Native Frontend
│   ├── src/
│   │   ├── components/               # Reusable UI Components
│   │   │   ├── ui/                  # Basic UI components
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   └── Modal.tsx
│   │   │   ├── layout/              # Layout components
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── Container.tsx
│   │   │   └── common/              # Common components
│   │   │       ├── Loading.tsx
│   │   │       ├── ErrorBoundary.tsx
│   │   │       └── Toast.tsx
│   │   ├── screens/                 # Screen Components
│   │   │   ├── auth/
│   │   │   │   ├── LoginScreen.tsx
│   │   │   │   ├── RegisterScreen.tsx
│   │   │   │   └── ForgotPasswordScreen.tsx
│   │   │   ├── movies/
│   │   │   │   ├── MovieListScreen.tsx
│   │   │   │   ├── MovieDetailScreen.tsx
│   │   │   │   └── MovieSearchScreen.tsx
│   │   │   ├── booking/
│   │   │   │   ├── BookingScreen.tsx
│   │   │   │   ├── SeatSelectionScreen.tsx
│   │   │   │   └── PaymentScreen.tsx
│   │   │   └── profile/
│   │   │       ├── ProfileScreen.tsx
│   │   │       ├── BookingHistoryScreen.tsx
│   │   │       └── SettingsScreen.tsx
│   │   ├── navigation/               # Navigation Configuration
│   │   │   ├── AppNavigator.tsx
│   │   │   ├── AuthNavigator.tsx
│   │   │   └── MainNavigator.tsx
│   │   ├── hooks/                    # Custom React Hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useMovies.ts
│   │   │   ├── useBooking.ts
│   │   │   └── useQueryClient.ts
│   │   ├── services/                 # API Services
│   │   │   ├── api.ts               # Axios client
│   │   │   ├── authService.ts
│   │   │   ├── movieService.ts
│   │   │   └── bookingService.ts
│   │   ├── types/                    # TypeScript Types
│   │   │   ├── auth.ts
│   │   │   ├── movie.ts
│   │   │   ├── booking.ts
│   │   │   └── common.ts
│   │   ├── utils/                    # Utility Functions
│   │   │   ├── auth.ts
│   │   │   ├── validation.ts
│   │   │   ├── constants.ts
│   │   │   └── helpers.ts
│   │   ├── theme/                    # Theme Configuration
│   │   │   ├── colors.ts
│   │   │   ├── typography.ts
│   │   │   ├── spacing.ts
│   │   │   └── index.ts
│   │   ├── assets/                   # Static Assets
│   │   │   ├── images/
│   │   │   ├── icons/
│   │   │   ├── fonts/
│   │   │   └── animations/
│   │   └── App.tsx                  # Main App Component
│   ├── android/                      # Android-specific code
│   ├── ios/                          # iOS-specific code
│   ├── __tests__/                    # Test files
│   ├── package.json
│   ├── tsconfig.json
│   ├── babel.config.js
│   ├── metro.config.js
│   ├── .env.example
│   ├── README.md
│   └── .gitignore
│
├── docs/                             # Documentation
│   ├── README.md
│   ├── System_Architecture_Analysis.md
│   ├── API_Documentation.md
│   ├── Frontend_Development_Guide.md
│   ├── Backend_Development_Guide.md
│   ├── Deployment_Guide.md
│   └── Project_Restructuring_Guide.md
│
├── .github/                          # GitHub Actions
│   └── workflows/
│       ├── backend-ci.yml
│       ├── frontend-ci.yml
│       └── deploy.yml
│
├── scripts/                          # Build & Deploy Scripts
│   ├── build-backend.sh
│   ├── build-frontend.sh
│   ├── deploy.sh
│   └── setup-dev.sh
│
├── .gitignore                        # Root gitignore
├── README.md                         # Project README
└── LICENSE                           # License file
```

---

## 🔄 Hướng Dẫn Tái Cấu Trúc

### Bước 1: Backup Dự Án
```bash
# Tạo backup trước khi tái cấu trúc
git add .
git commit -m "backup: Before restructuring"
git branch backup-before-restructure
```

### Bước 2: Tạo Cấu Trúc Backend Mới

```bash
# Tạo thư mục backend
mkdir -p backend/src/{main/{java/com/chickengang/moviebooking,resources},test/java/com/chickengang/moviebooking}

# Di chuyển các file backend
# Manual: Copy các file Java từ src/main/java/com/example/movie/* 
# sang backend/src/main/java/com/chickengang/moviebooking/*

# Di chuyển resources
mv src/main/resources/* backend/src/main/resources/

# Di chuyển test files
mv src/test/* backend/src/test/

# Di chuyển Maven files
mv pom.xml backend/
mv mvnw backend/
mv mvnw.cmd backend/
```

### Bước 3: Update Package Names (Backend)

Đổi tên package từ `com.example.movie` sang `com.chickengang.moviebooking`:

```bash
# Trong mỗi file .java, thay đổi:
# package com.example.movie.* 
# thành: package com.chickengang.moviebooking.*

# import com.example.movie.*
# thành: import com.chickengang.moviebooking.*
```

### Bước 4: Tạo Cấu Trúc Frontend Mới

```bash
# Frontend structure đã tốt, chỉ cần reorganize
mkdir -p frontend/src/{screens,navigation,theme}

# Rename pages -> screens
mv frontend/src/pages/* frontend/src/screens/ 2>/dev/null || true
```

### Bước 5: Update Configuration Files

#### backend/pom.xml
```xml
<groupId>com.chickengang</groupId>
<artifactId>moviebooking-backend</artifactId>
<name>Movie Booking Backend</name>
```

#### frontend/package.json
```json
{
  "name": "moviebooking-frontend",
  "version": "1.0.0"
}
```

### Bước 6: Clean Up

```bash
# Xóa các thư mục cũ không cần thiết
rm -rf src/
rm -rf target/
rm -rf node_modules/ # Nếu có ở root

# Tạo .gitignore files
```

### Bước 7: Tạo Root README

Tạo file `README.md` ở root với thông tin về monorepo.

---

##  🛠️ Scripts Hỗ Trợ

### setup-dev.sh
```bash
#!/bin/bash

echo "Setting up development environment..."

# Backend setup
cd backend
./mvnw clean install
cd ..

# Frontend setup
cd frontend
npm install
cd ..

echo "Setup complete!"
```

### build-all.sh
```bash
#!/bin/bash

echo "Building all projects..."

# Build backend
cd backend
./mvnw clean package
cd ..

# Build frontend
cd frontend
npm run build
cd ..

echo "Build complete!"
```

---

## 📝 Checklist

### Backend
- [ ] Tạo cấu trúc thư mục backend/
- [ ] Di chuyển source code Java
- [ ] Update package names
- [ ] Update pom.xml
- [ ] Di chuyển resources
- [ ] Di chuyển test files
- [ ] Tạo backend/README.md
- [ ] Tạo backend/.gitignore
- [ ] Test build: `mvn clean package`
- [ ] Test run: `mvn spring-boot:run`

### Frontend
- [ ] Reorganize src/ structure
- [ ] Rename pages -> screens
- [ ] Tạo navigation/ folder
- [ ] Tạo theme/ folder
- [ ] Update package.json
- [ ] Update imports
- [ ] Tạo frontend/.gitignore
- [ ] Test build: `npm run build`
- [ ] Test run: `npm start`

### Documentation
- [ ] Update tất cả docs với paths mới
- [ ] Tạo Backend Development Guide
- [ ] Update API Documentation
- [ ] Update Deployment Guide
- [ ] Tạo Contributing Guide

### Root Level
- [ ] Tạo root README.md
- [ ] Tạo root .gitignore
- [ ] Setup GitHub Actions
- [ ] Tạo build scripts
- [ ] Tạo LICENSE file

---

## 🚀 Next Steps

1. **Backup hiện tại**: Commit và tạo branch backup
2. **Thực hiện từng bước**: Theo checklist ở trên
3. **Test từng component**: Đảm bảo backend và frontend đều chạy được
4. **Update documentation**: Cập nhật tất cả docs
5. **Commit changes**: Với message rõ ràng
6. **Push to remote**: Đẩy lên repository

---

## ⚠️ Lưu Ý

1. **Backup trước khi restructure**: Tạo branch backup
2. **Test từng bước**: Đừng di chuyển tất cả cùng lúc
3. **Update imports**: Đảm bảo update tất cả package imports
4. **IDE support**: Sử dụng IDE để refactor package names
5. **Git history**: Sử dụng `git mv` để preserve history

---

## 🔧 Troubleshooting

### Issue: Package not found after rename
**Solution**: Update pom.xml và rebuild project

### Issue: Frontend build fails
**Solution**: Delete node_modules và npm install lại

### Issue: Tests fail after restructure
**Solution**: Update test imports và package names

---

**Created**: January 2024  
**Version**: 1.0.0  
**Status**: Ready for implementation
