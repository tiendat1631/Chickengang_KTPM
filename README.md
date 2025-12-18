# 🎬 ChickenGang Movie Booking System

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active-success.svg)]()

## 📚 Overview

**ChickenGang Movie Booking System** is a modern, microservices-based application designed to streamline the cinema experience. Built with a robust **Spring Boot** backend and a dynamic **React** frontend, it provides seamless booking flows, real-time seat selection, and secure payment processing.

The project emphasizes a clean architecture, scalability, and a premium user experience.

## 🛠️ Stack Overview

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | ![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB) | User Interface & Client Logic |
| **Backend** | ![Spring Boot](https://img.shields.io/badge/Spring_Boot-F2F4F9?style=flat&logo=spring-boot&logoColor=green) | REST API & Business Logic |
| **Database** | ![MySQL](https://img.shields.io/badge/MySQL-005C84?style=flat&logo=mysql&logoColor=white) | Relational Data Storage |
| **Container** | ![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=flat&logo=docker&logoColor=white) | Containerization & Orchestration |
| **Build** | ![Vite](https://img.shields.io/badge/Vite-B73C9D?style=flat&logo=vite&logoColor=white) | Frontend Tooling |
| **Security** | ![JWT](https://img.shields.io/badge/JWT-black?style=flat&logo=JSON%20web%20tokens) | Stateless Authentication |

## 🛠️ Project Directory Structure

```bash
Chickengang_KTPM/
├── backend/                # Spring Boot REST API
├── docs/                   # Documentation & Design specs
├── frontend/               # React Frontend Application
├── functional_tests/       # E2E & Functional Tests
├── performance/            # Performance Testing Scripts
└── docker-compose.yml      # Container Orchestration
```

## ⚡ Installation

### Prerequisites

* [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)
* **Optional**: Java 17, Node.js 18+ (for local logic without Docker)

### Quick Start

1. **Clone the repository**

    ```bash
    git clone https://github.com/tiendat1631/Chickengang_KTPM.git
    cd Chickengang_KTPM
    ```

2. **Start Services**

    ```bash
    docker-compose up -d
    ```

3. **Access the Application**
    * Frontend: `http://localhost:3000`
    * Backend API: `http://localhost:8080/api/v1`

## 📺 Demo

*(Add screenshots of your application here to showcase the UI)*

## 📚 Documentation

Detailed documentation is available in the `docs/` folder:

* [**Backend Guide**](./backend/README.md)
* [**Frontend Guide**](./frontend/README.md)
* [**System Architecture**](./docs/System_Architecture_Analysis.md)
* [**API Documentation**](./docs/API_Documentation.md)

---

**Made with ❤️ by ChickenGang KTPM Team**
