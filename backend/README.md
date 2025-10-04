# Movie Booking Backend
## Spring Boot REST API

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.6-brightgreen)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-17-orange)](https://www.oracle.com/java/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue)](https://www.mysql.com/)

---

## 🎯 Overview

REST API backend cho Movie Booking System, được phát triển bằng Spring Boot với JWT authentication và MySQL database.

---

## 🏗️ Architecture

### Layered Architecture
```
com.example.movie/
├── controller/          # REST Controllers (Presentation Layer)
├── service/            # Business Logic Layer
│   └── impl/          # Service Implementations
├── repository/         # Data Access Layer
├── model/             # Entity Models
├── dto/               # Data Transfer Objects
├── mapper/            # Entity-DTO Mappers
├── security/          # Security Components
├── exception/         # Exception Handling
└── util/             # Utility Classes
```

---

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Maven 3.6+
- MySQL 8.0+

### Setup Database
```sql
CREATE DATABASE moviebooking CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'movieuser'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON moviebooking.* TO 'movieuser'@'localhost';
FLUSH PRIVILEGES;
```

### Configuration
Update `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/moviebooking
spring.datasource.username=movieuser
spring.datasource.password=password
```

### Build & Run
```bash
# Build project
./mvnw clean install

# Run application
./mvnw spring-boot:run

# Run tests
./mvnw test

# Package JAR
./mvnw package
```

### Access API
- Base URL: `http://localhost:8080/api/v1`
- Swagger UI: `http://localhost:8080/swagger-ui.html` (if configured)

---

## 📡 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user

### Movies
- `GET /api/v1/movies/{id}` - Get movie by ID
- `POST /api/v1/movies` - Add new movie (Admin)
- `PATCH /api/v1/movies/{id}` - Update movie (Admin)
- `DELETE /api/v1/movies/{id}` - Delete movie (Admin)

### Users
- `GET /api/v1/users/{id}` - Get user by ID
- `PATCH /api/v1/users/{id}` - Update user

See full API documentation at [../docs/API_Documentation.md](../docs/API_Documentation.md)

---

## 🔐 Security

### JWT Authentication
- **Access Token**: 15 minutes
- **Refresh Token**: 30 days
- **Algorithm**: HS256
- **Storage**: Secure in client (React Native Keychain)

### Password Encryption
- **Algorithm**: BCrypt
- **Strength**: 10 rounds

### Role-Based Access Control
- **ADMIN**: Full access to all resources
- **CUSTOMER**: Limited access based on ownership

---

## 📦 Dependencies

- Spring Boot Web
- Spring Data JPA
- Spring Security
- Spring Boot OAuth2 Resource Server
- MySQL Connector
- Lombok
- Spring Boot Validation

---

## 🗄️ Database Schema

### User Table
```sql
CREATE TABLE user (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(255) UNIQUE NOT NULL,
    role ENUM('ADMIN', 'CUSTOMER') NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    address VARCHAR(255) NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    date_of_birth DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Movie Table
```sql
CREATE TABLE movie (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    director VARCHAR(255) NOT NULL,
    actors VARCHAR(255) NOT NULL,
    genres VARCHAR(255) NOT NULL,
    release_date DATE NOT NULL,
    duration VARCHAR(255) NOT NULL,
    language VARCHAR(255) NOT NULL,
    rated VARCHAR(255) NOT NULL,
    description TEXT NOT NULL
);
```

---

## 🧪 Testing

### Run All Tests
```bash
./mvnw test
```

### Test Coverage
```bash
./mvnw test jacoco:report
```

### Integration Tests
```bash
./mvnw verify
```

---

## 🚀 Deployment

### Development
```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

### Production
```bash
# Build JAR
./mvnw clean package

# Run JAR
java -jar target/movie-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
```

### Docker (Future)
```dockerfile
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

---

## 📊 Performance

### Database Connection Pooling
- **HikariCP** (default in Spring Boot)
- **Max Pool Size**: 10
- **Connection Timeout**: 30000ms

### Caching (Future Enhancement)
- Redis for session management
- Query result caching
- Static content caching

---

## 🔧 Configuration

### Application Properties
```properties
# Server
server.port=8080

# Database
spring.datasource.url=jdbc:mysql://localhost:3306/moviebooking
spring.datasource.username=movieuser
spring.datasource.password=password

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# JWT
app.jwt.access.expiration-in-seconds=900
app.jwt.refresh.expiration-in-seconds=2592000
app.jwt.base64-secretkey=your-secret-key

# Logging
logging.level.com.example.movie=DEBUG
```

---

## 🐛 Troubleshooting

### Common Issues

**Database Connection Failure**
```bash
# Check MySQL service
sudo systemctl status mysql

# Test connection
mysql -u movieuser -p moviebooking
```

**Port Already in Use**
```bash
# Change port in application.properties
server.port=8081
```

**JWT Token Issues**
```bash
# Regenerate secret key
app.jwt.base64-secretkey=new-secret-key
```

---

## 📚 Documentation

- [System Architecture](../docs/System_Architecture_Analysis.md)
- [API Documentation](../docs/API_Documentation.md)
- [Deployment Guide](../docs/Deployment_Guide.md)

---

## 🤝 Contributing

1. Create feature branch from `develop`
2. Follow code style guidelines
3. Write unit tests
4. Update documentation
5. Submit pull request

---

## 📄 License

MIT License - See [LICENSE](../LICENSE) file for details

---

**Made with ❤️ by ChickenGang KTPM Team**
