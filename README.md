# 🎬 ChickenGang Movie Booking System

<div align="center">

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active-success.svg)]()
[![Java](https://img.shields.io/badge/Java-17-orange.svg)]()
[![React](https://img.shields.io/badge/React-18-61DAFB.svg)]()
[![Docker](https://img.shields.io/badge/Docker-Ready-2CA5E0.svg)]()

**A modern, microservices-based cinema booking platform**

[Quick Start](#-quick-start) • [Documentation](#-documentation) • [Features](#-features) • [Tech Stack](#️-tech-stack)

</div>

---

## 📖 Overview

**ChickenGang Movie Booking System** là ứng dụng đặt vé xem phim hiện đại, được xây dựng với kiến trúc microservices. Hệ thống kết hợp **Spring Boot** backend mạnh mẽ và **React** frontend linh hoạt, cung cấp trải nghiệm đặt vé liền mạch với chọn ghế real-time và xử lý thanh toán bảo mật.

### ✨ Highlights

- 🎯 **Clean Architecture** - Kiến trúc rõ ràng, dễ mở rộng
- 🔒 **Secure** - Xác thực JWT stateless
- 📱 **Responsive** - Giao diện tương thích mọi thiết bị
- 🐳 **Containerized** - Triển khai dễ dàng với Docker

---

## 🛠️ Tech Stack

<table>
<tr>
<td align="center" width="140">

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)

**Frontend**

</td>
<td align="center" width="140">

![Spring](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring&logoColor=white)

**Backend**

</td>
<td align="center" width="140">

![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)

**Database**

</td>
<td align="center" width="140">

![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)

**Container**

</td>
<td align="center" width="140">

![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)

**Security**

</td>
</tr>
</table>

---

## 📁 Project Structure

```
Chickengang_KTPM/
├── 📂 backend/            # Spring Boot REST API
├── 📂 frontend/           # React + TypeScript Web App
├── 📂 docs/               # Documentation & Design Specs
│   ├── 📂 review-checklists/   # Test Review Checklists
│   └── 📂 test_template/       # Test Cases & Reports
├── 📂 functional_tests/   # E2E & Functional Tests (Selenium)
├── 📂 performance/        # Performance Testing (k6)
├── 📂 test_data/          # Test Data Sets
└── 🐳 docker-compose.yml  # Container Orchestration
```

---

## ⚡ Quick Start

### Prerequisites

- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)
- **Optional**: Java 17, Node.js 18+ (for local development)

### 🚀 One-Command Start

```bash
# Clone repository
git clone https://github.com/tiendat1631/Chickengang_KTPM.git
cd Chickengang_KTPM

# Start all services
docker-compose up -d
```

### 🌐 Access Points

| Service       | URL                              | Description            |
|:-------------|:---------------------------------|:-----------------------|
| **Frontend** | <http://localhost:3000>            | React Web Application  |
| **Backend**  | <http://localhost:8080/api/v1>     | REST API Endpoints     |

---

## 📚 Documentation

### 🏗️ Architecture & Design

| Document | Description |
|:---------|:------------|
| [**Architecture Design**](./docs/Architecture_Design.md) | Thiết kế kiến trúc hệ thống và các thành phần |
| [**Database Design**](./docs/Database_Design.md) | Thiết kế cơ sở dữ liệu, ERD và schema |
| [**Screen Design**](./docs/Screen_Design.md) | Thiết kế giao diện màn hình |
| [**Use Cases**](./docs/UseCase.md) | Yêu cầu chức năng và tương tác actor |

### 🧪 Testing & Quality

| Document | Description |
|:---------|:------------|
| [**Test Plan**](./docs/Test_Plan.md) | Chiến lược và phạm vi kiểm thử |
| [**Test Summary**](./docs/Test_Summary.md) | Tổng hợp kết quả kiểm thử |
| [**Bug Report**](./docs/Bug_Report.md) | Báo cáo lỗi phát hiện |
| [**Review Checklists**](./docs/review-checklists/) | Test Review Checklists (CSV) |
| [**Test Cases & Reports**](./docs/test_template/) | Test Cases theo Module |

### 📖 Development Guides

| Document | Description |
|:---------|:------------|
| [**Backend Guide**](./backend/README.md) | Hướng dẫn phát triển Backend |
| [**Frontend Guide**](./frontend/README.md) | Hướng dẫn phát triển Frontend |
| [**Functional Tests**](./functional_tests/README.md) | Hướng dẫn chạy Functional Tests |

---

## 🎯 Features

### 👤 User Features

- 🔐 Đăng ký / Đăng nhập với JWT authentication
- 🎬 Xem danh sách & chi tiết phim
- 🎟️ Đặt vé và chọn ghế
- 💳 Thanh toán đơn giản
- 📋 Quản lý hồ sơ cá nhân

### 🛡️ Admin Features

- 📊 Dashboard quản lý
- 🎥 Quản lý phim (CRUD)
- 📅 Quản lý lịch chiếu
- 📝 Quản lý đặt vé

---

## 🧪 Testing

```bash
# Backend Unit Tests
cd backend && ./mvnw test

# Frontend Tests
cd frontend && npm test

# Functional Tests (Selenium)
cd functional_tests && pytest

# Performance Tests (k6)
cd performance && k6 run load_test.js
```

---

## 👥 Team

<div align="center">

**ChickenGang KTPM Team**

Made with ❤️ for Software Engineering Course

</div>

---

<div align="center">

⭐ Star this repo if you find it helpful!

</div>
