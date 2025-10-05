# API Documentation
## Movie Booking System

---

## 1. Tổng Quan API

### 1.1 Base URL
```
http://localhost:8080/api/v1
```

### 1.2 Authentication
Hệ thống sử dụng JWT (JSON Web Token) cho authentication. Sau khi đăng nhập thành công, client cần gửi token trong header:

```
Authorization: Bearer <access_token>
```

### 1.3 Response Format
Tất cả API responses đều tuân theo format chuẩn:

```json
{
  "status": "OK",
  "data": <response_data>,
  "message": "Success message",
  "errors": null
}
```

### 1.4 HTTP Status Codes
- `200 OK`: Request thành công
- `201 Created`: Resource được tạo thành công
- `400 Bad Request`: Dữ liệu đầu vào không hợp lệ
- `401 Unauthorized`: Chưa xác thực hoặc token không hợp lệ
- `403 Forbidden`: Không có quyền truy cập
- `404 Not Found`: Resource không tồn tại
- `500 Internal Server Error`: Lỗi server

---

## 2. Authentication APIs

### 2.1 Đăng Ký Tài Khoản

**Endpoint**: `POST /auth/register`

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "phoneNumber": "0123456789",
  "username": "username",
  "address": "123 Main Street",
  "dateOfBirth": "1990-01-01"
}
```

**Response** (201 Created):
```json
{
  "status": "CREATED",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "phoneNumber": "0123456789",
    "role": "CUSTOMER",
    "isActive": true,
    "address": "123 Main Street",
    "username": "username",
    "dateOfBirth": "1990-01-01",
    "createdAt": "2024-01-01T10:00:00",
    "updatedAt": "2024-01-01T10:00:00"
  },
  "message": "register successfully",
  "errors": null
}
```

**Validation Rules**:
- `email`: Required, valid email format, unique
- `password`: Required, minimum 6 characters
- `phoneNumber`: Required, unique
- `username`: Required, unique
- `address`: Required
- `dateOfBirth`: Optional, valid date format

### 2.2 Đăng Nhập

**Endpoint**: `POST /auth/login`

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response** (200 OK):
```json
{
  "status": "OK",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": 90000,
    "user": {
      "id": 1,
      "email": "user@example.com",
      "username": "username",
      "role": "CUSTOMER"
    }
  },
  "message": "login successfully",
  "errors": null
}
```

**Token Information**:
- `accessToken`: Token để truy cập các API protected (15 phút)
- `refreshToken`: Token để refresh access token (30 ngày)
- `expiresIn`: Thời gian hết hạn của access token (seconds)

---

## 3. Movie APIs

### 3.1 Thêm Phim Mới

**Endpoint**: `POST /movies`

**Authentication**: Required (ADMIN only)

**Request Body**:
```json
{
  "title": "The Matrix",
  "director": "The Wachowskis",
  "actors": "Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss",
  "genres": "Action, Sci-Fi",
  "releaseDate": "1999-03-31",
  "duration": "136 minutes",
  "language": "English",
  "rated": "R",
  "description": "A computer hacker learns about the true nature of reality..."
}
```

**Response** (201 Created):
```json
{
  "status": "CREATED",
  "data": {
    "id": 1,
    "title": "The Matrix",
    "director": "The Wachowskis",
    "actors": "Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss",
    "genres": "Action, Sci-Fi",
    "releaseDate": "1999-03-31",
    "duration": "136 minutes",
    "language": "English",
    "rated": "R",
    "description": "A computer hacker learns about the true nature of reality..."
  },
  "message": "add success",
  "errors": null
}
```

### 3.2 Lấy Thông Tin Phim

**Endpoint**: `GET /movies/{id}`

**Authentication**: Not required

**Path Parameters**:
- `id`: Movie ID (Long)

**Response** (200 OK):
```json
{
  "status": "OK",
  "data": {
    "id": 1,
    "title": "The Matrix",
    "director": "The Wachowskis",
    "actors": "Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss",
    "genres": "Action, Sci-Fi",
    "releaseDate": "1999-03-31",
    "duration": "136 minutes",
    "language": "English",
    "rated": "R",
    "description": "A computer hacker learns about the true nature of reality..."
  },
  "message": "get success",
  "errors": null
}
```

### 3.3 Cập Nhật Phim

**Endpoint**: `PATCH /movies/{id}`

**Authentication**: Required (ADMIN only)

**Path Parameters**:
- `id`: Movie ID (Long)

**Request Body** (Partial update):
```json
{
  "title": "The Matrix Reloaded",
  "description": "Updated description..."
}
```

**Response** (200 OK):
```json
{
  "status": "OK",
  "data": {
    "id": 1,
    "title": "The Matrix Reloaded",
    "director": "The Wachowskis",
    "actors": "Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss",
    "genres": "Action, Sci-Fi",
    "releaseDate": "1999-03-31",
    "duration": "136 minutes",
    "language": "English",
    "rated": "R",
    "description": "Updated description..."
  },
  "message": "update success",
  "errors": null
}
```

### 3.4 Xóa Phim

**Endpoint**: `DELETE /movies/{id}`

**Authentication**: Required (ADMIN only)

**Path Parameters**:
- `id`: Movie ID (Long)

**Response** (200 OK):
```json
{
  "status": "OK",
  "data": null,
  "message": "delete success",
  "errors": null
}
```

---

## 4. User APIs

### 4.1 Lấy Danh Sách Người Dùng

**Endpoint**: `GET /users`

**Authentication**: Required (ADMIN only)

**Query Parameters**:
- `page`: Page number (default: 0)
- `size`: Page size (default: 10)
- `sort`: Sort field (default: id)

**Response** (200 OK):
```json
{
  "status": "OK",
  "data": {
    "content": [
      {
        "id": 1,
        "email": "user@example.com",
        "phoneNumber": "0123456789",
        "role": "CUSTOMER",
        "isActive": true,
        "address": "123 Main Street",
        "username": "username",
        "dateOfBirth": "1990-01-01",
        "createdAt": "2024-01-01T10:00:00",
        "updatedAt": "2024-01-01T10:00:00"
      }
    ],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 10,
      "sort": {
        "sorted": false
      }
    },
    "totalElements": 1,
    "totalPages": 1,
    "first": true,
    "last": true
  },
  "message": "get users successfully",
  "errors": null
}
```

### 4.2 Lấy Thông Tin Người Dùng

**Endpoint**: `GET /users/{id}`

**Authentication**: Required (ADMIN hoặc chính user đó)

**Path Parameters**:
- `id`: User ID (Long)

**Response** (200 OK):
```json
{
  "status": "OK",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "phoneNumber": "0123456789",
    "role": "CUSTOMER",
    "isActive": true,
    "address": "123 Main Street",
    "username": "username",
    "dateOfBirth": "1990-01-01",
    "createdAt": "2024-01-01T10:00:00",
    "updatedAt": "2024-01-01T10:00:00"
  },
  "message": "get user successfully",
  "errors": null
}
```

### 4.3 Cập Nhật Thông Tin Người Dùng

**Endpoint**: `PATCH /users/{id}`

**Authentication**: Required (ADMIN hoặc chính user đó)

**Path Parameters**:
- `id`: User ID (Long)

**Request Body**:
```json
{
  "address": "456 New Street",
  "phoneNumber": "0987654321"
}
```

**Response** (200 OK):
```json
{
  "status": "OK",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "phoneNumber": "0987654321",
    "role": "CUSTOMER",
    "isActive": true,
    "address": "456 New Street",
    "username": "username",
    "dateOfBirth": "1990-01-01",
    "createdAt": "2024-01-01T10:00:00",
    "updatedAt": "2024-01-01T11:00:00"
  },
  "message": "update user successfully",
  "errors": null
}
```

---

## 5. Error Responses

### 5.1 Validation Errors (400 Bad Request)
```json
{
  "status": "BAD_REQUEST",
  "data": null,
  "message": "Validation failed",
  "errors": {
    "email": "Email is required",
    "password": "Password must be at least 6 characters"
  }
}
```

### 5.2 Authentication Errors (401 Unauthorized)
```json
{
  "status": "UNAUTHORIZED",
  "data": null,
  "message": "Invalid credentials",
  "errors": null
}
```

### 5.3 Authorization Errors (403 Forbidden)
```json
{
  "status": "FORBIDDEN",
  "data": null,
  "message": "Access denied",
  "errors": null
}
```

### 5.4 Not Found Errors (404 Not Found)
```json
{
  "status": "NOT_FOUND",
  "data": null,
  "message": "User not found",
  "errors": null
}
```

### 5.5 Server Errors (500 Internal Server Error)
```json
{
  "status": "INTERNAL_SERVER_ERROR",
  "data": null,
  "message": "An unexpected error occurred",
  "errors": null
}
```

---

## 6. Rate Limiting

Hiện tại hệ thống chưa implement rate limiting. Khuyến nghị implement trong tương lai để:
- Bảo vệ API khỏi abuse
- Đảm bảo fair usage
- Prevent DDoS attacks

---

## 7. API Versioning

Hệ thống sử dụng URL versioning với pattern `/api/v1/`. Để maintain backward compatibility:
- Version mới sẽ sử dụng `/api/v2/`
- Version cũ sẽ được maintain trong thời gian transition
- Deprecation notice sẽ được thông báo trước khi remove version cũ

---

## 8. Testing APIs

### 8.1 Using cURL

**Register User**:
```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "phoneNumber": "0123456789",
    "username": "testuser",
    "address": "123 Test Street",
    "dateOfBirth": "1990-01-01"
  }'
```

**Login**:
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Get Movie**:
```bash
curl -X GET http://localhost:8080/api/v1/movies/1 \
  -H "Authorization: Bearer <access_token>"
```

### 8.2 Using Postman

1. Import collection từ file `MovieBookingAPI.postman_collection.json`
2. Set environment variables:
   - `base_url`: http://localhost:8080/api/v1
   - `access_token`: JWT token từ login response
3. Run requests theo thứ tự: Register → Login → Protected APIs

---

## 9. SDK và Client Libraries

Hiện tại hệ thống chưa cung cấp SDK. Khuyến nghị tạo:
- JavaScript/TypeScript SDK cho web applications
- Java SDK cho Android applications
- Swift SDK cho iOS applications
- Python SDK cho backend integrations

---

## 10. Webhooks

Hiện tại hệ thống chưa hỗ trợ webhooks. Có thể implement trong tương lai cho:
- User registration events
- Movie update notifications
- Booking status changes
- Payment confirmations
