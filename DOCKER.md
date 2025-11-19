# Docker Deployment Guide

Hướng dẫn triển khai Movie Booking System sử dụng Docker và Docker Compose.

## Yêu cầu

- Docker Engine 20.10+
- Docker Compose 2.0+
- ít nhất 2GB RAM
- ít nhất 5GB dung lượng ổ đĩa

## Cấu trúc

Dự án sử dụng 3 containers:
- **db**: MySQL 8.0 database
- **backend**: Spring Boot API (port 8080)
- **frontend**: React app với Nginx (port 3000)

## Quick Start

### 1. Tạo file .env

Copy file `.env.example` thành `.env` và cập nhật các giá trị nếu cần:

```bash
cp .env.example .env
```

Hoặc tạo file `.env` với nội dung:

```env
MYSQL_DATABASE=moviebooking
MYSQL_USER=movieuser
MYSQL_PASSWORD=password
MYSQL_ROOT_PASSWORD=rootpassword
```

### 2. Build và chạy containers

```bash
# Build và start tất cả services
docker-compose up -d

# Xem logs
docker-compose logs -f

# Xem logs của một service cụ thể
docker-compose logs -f backend
```

### 3. Truy cập ứng dụng

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api/v1
- **Database**: localhost:3306

### 4. Dừng containers

```bash
# Dừng tất cả services
docker-compose down

# Dừng và xóa volumes (xóa dữ liệu database)
docker-compose down -v
```

## Các lệnh hữu ích

### Kiểm tra trạng thái

```bash
# Xem trạng thái các containers
docker-compose ps

# Xem health status
docker-compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"
```

### Rebuild containers

```bash
# Rebuild tất cả images
docker-compose build --no-cache

# Rebuild một service cụ thể
docker-compose build --no-cache backend

# Rebuild và restart
docker-compose up -d --build
```

### Xem logs

```bash
# Tất cả services
docker-compose logs -f

# Một service cụ thể
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db

# Last 100 lines
docker-compose logs --tail=100 backend
```

### Execute commands trong containers

```bash
# Vào container backend
docker-compose exec backend sh

# Vào container database
docker-compose exec db mysql -u movieuser -p moviebooking

# Chạy lệnh trong container
docker-compose exec backend java -version
```

### Database operations

```bash
# Backup database
docker-compose exec db mysqldump -u movieuser -p moviebooking > backup.sql

# Restore database
docker-compose exec -T db mysql -u movieuser -p moviebooking < backup.sql
```

## Cấu hình

### Environment Variables

Các biến môi trường có thể được cấu hình trong file `.env`:

- `MYSQL_DATABASE`: Tên database (mặc định: moviebooking)
- `MYSQL_USER`: Database user (mặc định: movieuser)
- `MYSQL_PASSWORD`: Database password (mặc định: password)
- `MYSQL_ROOT_PASSWORD`: MySQL root password (mặc định: rootpassword)

### Ports

- **Frontend**: 3000 (có thể thay đổi trong docker-compose.yml)
- **Backend**: 8080 (có thể thay đổi trong docker-compose.yml)
- **Database**: 3306 (có thể thay đổi trong docker-compose.yml)

### Volumes

- `mysql-data`: Persistent storage cho MySQL data
- Database sẽ tự động khởi tạo với dữ liệu mẫu từ `backend/src/main/resources/data.sql`

## Troubleshooting

### Container không start

```bash
# Kiểm tra logs
docker-compose logs [service-name]

# Kiểm tra health status
docker-compose ps
```

### Database connection errors

1. Đảm bảo database container đã healthy:
   ```bash
   docker-compose ps db
   ```

2. Kiểm tra environment variables trong `.env`

3. Đảm bảo backend đợi database sẵn sàng (đã có `depends_on` với `condition: service_healthy`)

### Port đã được sử dụng

Nếu port 3000, 8080, hoặc 3306 đã được sử dụng:

1. Dừng service đang sử dụng port đó
2. Hoặc thay đổi port mapping trong `docker-compose.yml`:
   ```yaml
   ports:
     - "3001:80"  # Thay đổi 3000 thành 3001
   ```

### Frontend không kết nối được với Backend

1. Kiểm tra CORS configuration trong `backend/src/main/java/com/example/movie/security/SecurityConfig.java`
2. Đảm bảo frontend container có thể truy cập backend qua service name `backend:8080`
3. Kiểm tra network:
   ```bash
   docker network inspect chickengang_ktpm_moviebooking-network
   ```

### Rebuild từ đầu

```bash
# Dừng và xóa tất cả
docker-compose down -v

# Xóa images
docker-compose rm -f
docker rmi $(docker images | grep moviebooking | awk '{print $3}')

# Rebuild
docker-compose build --no-cache
docker-compose up -d
```

## Development

### Local development với Docker

Để phát triển local nhưng sử dụng database trong Docker:

1. Chỉ start database:
   ```bash
   docker-compose up -d db
   ```

2. Cập nhật `application.properties` để kết nối đến `localhost:3306`

3. Chạy backend và frontend local như bình thường

### Hot reload

Docker setup hiện tại không hỗ trợ hot reload. Để phát triển:
- Sử dụng local development (như trên)
- Hoặc mount volumes và sử dụng dev tools (cần cấu hình thêm)

## Production Considerations

### Security

- Thay đổi tất cả passwords mặc định
- Sử dụng secrets management (Docker secrets, environment variables từ secure source)
- Không expose database port ra ngoài trong production
- Sử dụng HTTPS cho frontend và backend

### Performance

- Tối ưu hóa Docker images (đã sử dụng multi-stage builds)
- Sử dụng resource limits (đã cấu hình trong docker-compose.yml)
- Monitor resource usage:
  ```bash
  docker stats
  ```

### Backup

- Backup database thường xuyên
- Backup volumes:
  ```bash
  docker run --rm -v chickengang_ktpm_mysql-data:/data -v $(pwd):/backup alpine tar czf /backup/mysql-backup.tar.gz /data
  ```

## Health Checks

Tất cả services đều có health checks:

- **Database**: `mysqladmin ping`
- **Backend**: `/actuator/health` endpoint
- **Frontend**: `/health` endpoint (nginx)

Kiểm tra health status:
```bash
docker-compose ps
```

## Cleanup

```bash
# Xóa containers, networks (giữ volumes)
docker-compose down

# Xóa containers, networks, và volumes
docker-compose down -v

# Xóa tất cả (containers, networks, volumes, images)
docker-compose down -v --rmi all
```

---

**Made with ❤️ by ChickenGang KTPM Team**

