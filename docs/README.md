# Movie Booking System - Documentation

Thư mục này chứa tài liệu kỹ thuật đầy đủ cho hệ thống Movie Booking System.

---

## 📚 Danh Sách Tài Liệu

### 1. [System Architecture Analysis](./System_Architecture_Analysis.md)
**Tài liệu phân tích thiết kế hệ thống kiến trúc**

- Tổng quan hệ thống và công nghệ sử dụng
- Kiến trúc phân lớp (Layered Architecture)
- Các thành phần chính (Models, Controllers, Services)
- Cấu hình bảo mật với JWT
- Thiết kế database
- Sơ đồ kiến trúc và luồng dữ liệu
- Đánh giá khả năng mở rộng và cải thiện

### 2. [API Documentation](./API_Documentation.md)
**Tài liệu API chi tiết**

- Tổng quan API và authentication
- Authentication APIs (Register, Login)
- Movie Management APIs (CRUD operations)
- User Management APIs
- Error handling và response formats
- Testing với cURL và Postman
- Rate limiting và versioning

### 3. [Deployment Guide](./Deployment_Guide.md)
**Hướng dẫn triển khai hệ thống**

- Yêu cầu hệ thống và chuẩn bị môi trường
- Cài đặt Java, MySQL, và dependencies
- Build và package application
- Configuration management
- Deployment methods (Standalone, Docker, Kubernetes)
- Monitoring và logging
- Security considerations
- Backup và recovery procedures
- Performance tuning
- Troubleshooting và maintenance

---

## 🏗️ Kiến Trúc Tổng Quan

```
┌─────────────────────────────────────┐
│           Client Layer              │
│    (Web/Mobile Applications)        │
├─────────────────────────────────────┤
│           API Gateway                │
│         (REST Endpoints)             │
├─────────────────────────────────────┤
│        Application Layer             │
│    (Controllers + Services)         │
├─────────────────────────────────────┤
│         Security Layer               │
│      (JWT Authentication)          │
├─────────────────────────────────────┤
│         Data Access Layer            │
│       (Repositories + JPA)          │
├─────────────────────────────────────┤
│         Database Layer               │
│           (MySQL 8.0)               │
└─────────────────────────────────────┘
```

---

## 🚀 Quick Start

### 1. Prerequisites
- Java 17+
- MySQL 8.0+
- Maven 3.6+

### 2. Setup Database
```sql
CREATE DATABASE moviebooking CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'movieuser'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON moviebooking.* TO 'movieuser'@'localhost';
```

### 3. Build và Run
```bash
# Build application
mvn clean package

# Run application
java -jar target/movie-0.0.1-SNAPSHOT.jar
```

### 4. Test API
```bash
# Register user
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","phoneNumber":"0123456789","username":"testuser","address":"123 Test St"}'

# Login
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

---

## 📋 Features

### ✅ Implemented
- User registration và authentication
- JWT-based security
- Movie CRUD operations
- User management
- RESTful API design
- Database integration với JPA
- Exception handling
- Input validation

### 🔄 In Progress
- Booking system
- Payment integration
- Seat management
- Showtime scheduling

### 📅 Planned
- Email notifications
- Admin dashboard
- Mobile app
- Caching layer
- API rate limiting

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Spring Boot 3.5.6 |
| **Language** | Java 17 |
| **Database** | MySQL 8.0 |
| **ORM** | Spring Data JPA + Hibernate |
| **Security** | Spring Security + JWT |
| **Build Tool** | Maven |
| **Validation** | Spring Boot Validation |
| **Utilities** | Lombok |

---

## 📊 Project Structure

```
src/main/java/com/example/movie/
├── controller/          # REST Controllers
│   ├── AuthController.java
│   ├── MovieController.java
│   └── UserController.java
├── service/            # Business Logic
│   ├── AuthService.java
│   ├── MovieService.java
│   ├── UserService.java
│   └── impl/          # Service Implementations
├── repository/         # Data Access Layer
│   ├── MovieRepository.java
│   └── UserRepository.java
├── model/             # Entity Models
│   ├── Movie.java
│   └── User.java
├── dto/               # Data Transfer Objects
│   ├── auth/          # Authentication DTOs
│   ├── movie/         # Movie DTOs
│   ├── user/          # User DTOs
│   └── response/      # Response DTOs
├── security/          # Security Configuration
│   ├── SecurityConfig.java
│   ├── JwtConfig.java
│   ├── JwtAuthenticationFilter.java
│   └── SecurityUtil.java
├── exception/         # Custom Exceptions
│   └── GlobalExceptionHandler.java
└── Mapper/           # Entity-DTO Mappers
    └── MovieMapper.java
```

---

## 🔐 Security Features

- **JWT Authentication**: Stateless authentication với access/refresh tokens
- **Password Encryption**: BCrypt hashing
- **Role-based Access Control**: ADMIN và CUSTOMER roles
- **Input Validation**: Comprehensive validation cho tất cả inputs
- **SQL Injection Protection**: JPA/Hibernate protection
- **CORS Configuration**: Cross-origin request handling

---

## 📈 Performance Considerations

### Current
- Single database instance
- No caching layer
- Stateless JWT authentication
- Connection pooling với HikariCP

### Future Improvements
- Redis caching
- Database replication
- Load balancing
- Microservices architecture
- CDN integration

---

## 🧪 Testing

### Test Coverage
- Unit tests cho service layer
- Integration tests cho controllers
- Security tests cho authentication
- Database tests với H2 in-memory

### Test Commands
```bash
# Run all tests
mvn test

# Run with coverage
mvn test jacoco:report

# Run specific test class
mvn test -Dtest=AuthServiceTest
```

---

## 📝 Contributing

### Development Workflow
1. Fork repository
2. Create feature branch
3. Implement changes
4. Add tests
5. Update documentation
6. Submit pull request

### Code Standards
- Follow Java naming conventions
- Use meaningful variable names
- Add Javadoc comments
- Write unit tests
- Follow Spring Boot best practices

---

## 📞 Support

### Documentation Issues
- Create issue trong repository
- Provide detailed description
- Include error messages và logs

### Technical Questions
- Check existing documentation
- Review code comments
- Contact development team

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

---

## 🔗 Related Links

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Security Documentation](https://spring.io/projects/spring-security)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [JWT.io](https://jwt.io/) - JWT Debugger
- [Postman Collection](./MovieBookingAPI.postman_collection.json)

---

**Last Updated**: January 2024  
**Version**: 1.0.0  
**Maintainer**: Development Team
