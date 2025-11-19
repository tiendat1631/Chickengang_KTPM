# Backend - Spring Boot API

REST API backend cho Movie Booking System.

## 🚀 Quick Start

```bash
# Build & Run
./mvnw clean install
./mvnw spring-boot:run

# API Base URL
http://localhost:8080/api/v1
```

## 📚 Documentation

Chi tiết tại [docs/](../docs/README.md):
- [API Documentation](../docs/API_Documentation.md)
- [System Architecture](../docs/System_Architecture_Analysis.md)
- [Deployment Guide](../docs/Deployment_Guide.md)

## 🔧 Configuration

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/moviebooking
spring.datasource.username=movieuser
spring.datasource.password=password

# JWT
app.jwt.access.expiration-in-seconds=900
app.jwt.refresh.expiration-in-seconds=2592000
```

## 🛠️ Technology Stack

- **Framework**: Spring Boot 3.5.6
- **Language**: Java 17
- **Database**: MySQL 8.0
- **Security**: Spring Security + JWT
- **Build Tool**: Maven

## 📡 API Endpoints

- `POST /api/v1/auth/register` - Register user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/movies/{id}` - Get movie
- `POST /api/v1/movies` - Add movie (Admin)
- `PATCH /api/v1/movies/{id}` - Update movie (Admin)
- `DELETE /api/v1/movies/{id}` - Delete movie (Admin)

## 🧪 Testing

```bash
# Run tests
./mvnw test

# Run with coverage
./mvnw test jacoco:report
```

## 📦 Build

```bash
# Production build
./mvnw clean package
java -jar target/movie-0.0.1-SNAPSHOT.jar
```

## 🐳 Docker

Xem hướng dẫn chi tiết tại [DOCKER.md](../DOCKER.md)

### Quick Start với Docker

```bash
# Từ root directory
docker-compose up -d

# Backend sẽ chạy tại http://localhost:8080
```

### Docker Development

Để phát triển local nhưng sử dụng database trong Docker:

```bash
# Chỉ start database
docker-compose up -d db

# Cập nhật application.properties để sử dụng localhost:3306
# Chạy backend local như bình thường
./mvnw spring-boot:run
```

---

**Made with ❤️ by ChickenGang KTPM Team**