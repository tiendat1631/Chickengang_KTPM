# Movie Booking System - Documentation Hub

Thư mục tập trung tất cả documentation cho hệ thống Movie Booking System.

---

## 📚 **Tài Liệu Chính**

### 🏗️ **Architecture & Design**
- [**System Architecture Analysis**](./System_Architecture_Analysis.md) - Phân tích kiến trúc hệ thống
- [**Project Restructuring Guide**](./Project_Restructuring_Guide.md) - Hướng dẫn tái cấu trúc dự án

### 🔧 **Development Guides**
- [**Frontend Development Guide**](./Frontend_Development_Guide.md) - Hướng dẫn phát triển Frontend
- [**API Documentation**](./API_Documentation.md) - Tài liệu API chi tiết

### 🚀 **Deployment & Operations**
- [**Deployment Guide**](./Deployment_Guide.md) - Hướng dẫn triển khai hệ thống

---

## 🎯 **Quick Reference**

### **Backend (Spring Boot)**
```bash
# Setup & Run
cd backend
./mvnw clean install
./mvnw spring-boot:run

# API Base URL
http://localhost:8080/api/v1
```

### **Frontend (React Web)**
```bash
# Setup & Run
cd frontend
npm install
npm run dev

# Development Server
http://localhost:3000
```

### **Database (MySQL)**
```sql
CREATE DATABASE moviebooking CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'movieuser'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON moviebooking.* TO 'movieuser'@'localhost';
```

---

## 📁 **Project Structure Overview**

```
Chickengang_KTPM/
├── backend/                 # Spring Boot API
│   ├── src/main/java/      # Java source code
│   ├── src/main/resources/ # Configuration files
│   └── pom.xml             # Maven configuration
├── frontend/               # React Web App
│   ├── src/                # React source code
│   ├── package.json        # Node.js dependencies
│   └── vite.config.ts      # Vite configuration
├── docs/                   # 📚 Documentation Hub
│   ├── README.md           # This file
│   ├── System_Architecture_Analysis.md
│   ├── API_Documentation.md
│   ├── Frontend_Development_Guide.md
│   ├── Deployment_Guide.md
│   └── Project_Restructuring_Guide.md
└── README.md               # Main project README
```

---

## 🛠️ **Technology Stack**

| Component | Technology | Version |
|-----------|------------|---------|
| **Backend** | Spring Boot | 3.5.6 |
| **Language** | Java | 17 |
| **Database** | MySQL | 8.0 |
| **Frontend** | React | 18 |
| **Build Tool** | Vite | 5.0+ |
| **Language** | TypeScript | 5.2+ |
| **State Management** | TanStack Query | 5.8+ |
| **Styling** | Tailwind CSS | 3.3+ |

---

## 🔐 **Security Features**

- **JWT Authentication** - Stateless authentication với access/refresh tokens
- **Password Encryption** - BCrypt hashing
- **Role-based Access Control** - ADMIN và CUSTOMER roles
- **Input Validation** - Comprehensive validation cho tất cả inputs
- **CORS Configuration** - Cross-origin request handling

---

## 📊 **Current Status**

### ✅ **Implemented Features**
- User authentication (Login/Register)
- JWT-based security
- Movie CRUD operations
- User management
- RESTful API design
- React Web application
- TanStack Query integration
- Responsive design với Tailwind CSS

### 🔄 **In Progress**
- Movie booking system
- Seat selection
- Payment integration

### 📅 **Planned**
- Admin dashboard
- Movie recommendations
- User reviews
- Email notifications
- Analytics dashboard

---

## 🧪 **Testing**

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

## 📦 **Build & Deployment**

### Backend Production
```bash
cd backend
./mvnw clean package
java -jar target/movie-0.0.1-SNAPSHOT.jar
```

### Frontend Production
```bash
cd frontend
npm run build
# Creates optimized build in dist/
```

---

## 🤝 **Contributing**

1. Follow Git Flow workflow
2. Create feature branches from `develop`
3. Use TypeScript cho Frontend, Java cho Backend
4. Write tests cho new features
5. Update documentation khi cần thiết
6. Follow established code style

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

## 📞 **Support & Resources**

### Documentation
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [TanStack Query Documentation](https://tanstack.com/query)

### Project Resources
- [GitHub Repository](https://github.com/chickengang/movie-booking)
- [API Postman Collection](./MovieBookingAPI.postman_collection.json)
- [Database Schema](./database-schema.sql)

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Maintainer**: ChickenGang KTPM Team