# Deployment Guide
## Movie Booking System

---

## 1. Tổng Quan Deployment

### 1.1 Môi Trường Deployment
- **Development**: Local development với MySQL local
- **Staging**: Testing environment với production-like setup
- **Production**: Production environment với high availability

### 1.2 Yêu Cầu Hệ Thống

#### 1.2.1 Minimum Requirements
- **Java**: JDK 17 hoặc cao hơn
- **Memory**: 2GB RAM
- **Storage**: 10GB free space
- **Database**: MySQL 8.0+
- **OS**: Linux (Ubuntu 20.04+), Windows 10+, macOS 10.15+

#### 1.2.2 Recommended Requirements
- **Java**: JDK 17 LTS
- **Memory**: 4GB RAM
- **Storage**: 50GB SSD
- **Database**: MySQL 8.0 với replication
- **OS**: Ubuntu 22.04 LTS

---

## 2. Chuẩn Bị Môi Trường

### 2.1 Cài Đặt Java

#### Ubuntu/Debian:
```bash
# Update package list
sudo apt update

# Install OpenJDK 17
sudo apt install openjdk-17-jdk

# Verify installation
java -version
javac -version
```

#### CentOS/RHEL:
```bash
# Install OpenJDK 17
sudo yum install java-17-openjdk-devel

# Verify installation
java -version
```

#### Windows:
1. Download JDK 17 từ Oracle hoặc OpenJDK
2. Run installer và follow instructions
3. Set JAVA_HOME environment variable
4. Add Java bin directory to PATH

### 2.2 Cài Đặt MySQL

#### Ubuntu/Debian:
```bash
# Install MySQL Server
sudo apt install mysql-server

# Start MySQL service
sudo systemctl start mysql
sudo systemctl enable mysql

# Secure installation
sudo mysql_secure_installation
```

#### CentOS/RHEL:
```bash
# Install MySQL Server
sudo yum install mysql-server

# Start MySQL service
sudo systemctl start mysqld
sudo systemctl enable mysqld

# Get temporary password
sudo grep 'temporary password' /var/log/mysqld.log

# Secure installation
sudo mysql_secure_installation
```

### 2.3 Cấu Hình Database

```sql
-- Create database
CREATE DATABASE moviebooking CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user
CREATE USER 'movieuser'@'localhost' IDENTIFIED BY 'secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON moviebooking.* TO 'movieuser'@'localhost';
FLUSH PRIVILEGES;
```

---

## 3. Build và Package Application

### 3.1 Build với Maven

```bash
# Clean và compile
mvn clean compile

# Run tests
mvn test

# Package application
mvn package

# Skip tests nếu cần
mvn package -DskipTests
```

### 3.2 Build Output
JAR file sẽ được tạo tại: `target/movie-0.0.1-SNAPSHOT.jar`

### 3.3 Verify Build
```bash
# Check JAR file
ls -la target/movie-0.0.1-SNAPSHOT.jar

# Test run
java -jar target/movie-0.0.1-SNAPSHOT.jar
```

---

## 4. Configuration Management

### 4.1 Application Properties

#### Development (application-dev.properties):
```properties
spring.application.name=movie
spring.profiles.active=dev

# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/moviebooking
spring.datasource.username=movieuser
spring.datasource.password=secure_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# JWT Configuration
app.jwt.refresh.expiration-in-seconds=2592000
app.jwt.access.expiration-in-seconds=900
app.jwt.base64-secretkey=your-secret-key-here

# Logging
logging.level.com.example.movie=DEBUG
logging.level.org.springframework.security=INFO
```

#### Production (application-prod.properties):
```properties
spring.application.name=movie
spring.profiles.active=prod

# Database Configuration
spring.datasource.url=jdbc:mysql://prod-db-server:3306/moviebooking
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# Connection Pool
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.connection-timeout=30000

# JPA Configuration
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# JWT Configuration
app.jwt.refresh.expiration-in-seconds=2592000
app.jwt.access.expiration-in-seconds=900
app.jwt.base64-secretkey=${JWT_SECRET_KEY}

# Logging
logging.level.com.example.movie=INFO
logging.level.org.springframework.security=WARN
logging.file.name=/var/log/movie-booking/application.log
logging.pattern.file=%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n
```

### 4.2 Environment Variables

Tạo file `.env` cho production:
```bash
# Database
DB_USERNAME=movieuser
DB_PASSWORD=very_secure_password

# JWT
JWT_SECRET_KEY=your-very-long-secret-key-here

# Server
SERVER_PORT=8080
SERVER_CONTEXT_PATH=/api/v1
```

---

## 5. Deployment Methods

### 5.1 Standalone JAR Deployment

#### 5.1.1 Copy Files
```bash
# Create application directory
sudo mkdir -p /opt/movie-booking
sudo chown $USER:$USER /opt/movie-booking

# Copy JAR file
cp target/movie-0.0.1-SNAPSHOT.jar /opt/movie-booking/

# Copy configuration
cp src/main/resources/application-prod.properties /opt/movie-booking/
```

#### 5.1.2 Create Systemd Service
```bash
sudo tee /etc/systemd/system/movie-booking.service > /dev/null <<EOF
[Unit]
Description=Movie Booking Application
After=network.target mysql.service

[Service]
Type=simple
User=movieuser
Group=movieuser
WorkingDirectory=/opt/movie-booking
ExecStart=/usr/bin/java -jar -Dspring.profiles.active=prod movie-0.0.1-SNAPSHOT.jar
Restart=always
RestartSec=10
Environment=JAVA_OPTS=-Xms512m -Xmx1024m

[Install]
WantedBy=multi-user.target
EOF
```

#### 5.1.3 Start Service
```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable service
sudo systemctl enable movie-booking

# Start service
sudo systemctl start movie-booking

# Check status
sudo systemctl status movie-booking

# View logs
sudo journalctl -u movie-booking -f
```

### 5.2 Docker Deployment

#### 5.2.1 Create Dockerfile
```dockerfile
FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy JAR file
COPY target/movie-0.0.1-SNAPSHOT.jar app.jar

# Create non-root user
RUN groupadd -r movieuser && useradd -r -g movieuser movieuser
RUN chown -R movieuser:movieuser /app
USER movieuser

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# Run application
ENTRYPOINT ["java", "-jar", "app.jar"]
```

#### 5.2.2 Build Docker Image
```bash
# Build image
docker build -t movie-booking:latest .

# Tag for registry
docker tag movie-booking:latest your-registry/movie-booking:latest
```

#### 5.2.3 Docker Compose
```yaml
version: '3.8'

services:
  app:
    image: movie-booking:latest
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=prod
      - DB_USERNAME=movieuser
      - DB_PASSWORD=secure_password
      - JWT_SECRET_KEY=your-secret-key
    depends_on:
      - mysql
    restart: unless-stopped

  mysql:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=root_password
      - MYSQL_DATABASE=moviebooking
      - MYSQL_USER=movieuser
      - MYSQL_PASSWORD=secure_password
    volumes:
      - mysql_data:/var/lib/mysql
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "3306:3306"
    restart: unless-stopped

volumes:
  mysql_data:
```

#### 5.2.4 Deploy với Docker Compose
```bash
# Start services
docker-compose up -d

# Check logs
docker-compose logs -f app

# Scale application
docker-compose up -d --scale app=3
```

### 5.3 Kubernetes Deployment

#### 5.3.1 Deployment Manifest
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: movie-booking
  labels:
    app: movie-booking
spec:
  replicas: 3
  selector:
    matchLabels:
      app: movie-booking
  template:
    metadata:
      labels:
        app: movie-booking
    spec:
      containers:
      - name: movie-booking
        image: movie-booking:latest
        ports:
        - containerPort: 8080
        env:
        - name: SPRING_PROFILES_ACTIVE
          value: "prod"
        - name: DB_USERNAME
          valueFrom:
            secretKeyRef:
              name: movie-secrets
              key: db-username
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: movie-secrets
              key: db-password
        - name: JWT_SECRET_KEY
          valueFrom:
            secretKeyRef:
              name: movie-secrets
              key: jwt-secret
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /actuator/health
            port: 8080
          initialDelaySeconds: 60
          periodSeconds: 30
        readinessProbe:
          httpGet:
            path: /actuator/health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: movie-booking-service
spec:
  selector:
    app: movie-booking
  ports:
  - port: 80
    targetPort: 8080
  type: LoadBalancer
```

#### 5.3.2 Deploy to Kubernetes
```bash
# Create secrets
kubectl create secret generic movie-secrets \
  --from-literal=db-username=movieuser \
  --from-literal=db-password=secure_password \
  --from-literal=jwt-secret=your-secret-key

# Deploy application
kubectl apply -f movie-booking-deployment.yaml

# Check deployment
kubectl get deployments
kubectl get pods
kubectl get services
```

---

## 6. Monitoring và Logging

### 6.1 Application Monitoring

#### 6.1.1 Spring Boot Actuator
Thêm dependency vào `pom.xml`:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

#### 6.1.2 Actuator Endpoints
```properties
# Enable all endpoints
management.endpoints.web.exposure.include=*

# Health check
management.endpoint.health.show-details=always

# Metrics
management.endpoint.metrics.enabled=true
```

#### 6.1.3 Health Check URLs
- Health: `http://localhost:8080/actuator/health`
- Info: `http://localhost:8080/actuator/info`
- Metrics: `http://localhost:8080/actuator/metrics`

### 6.2 Logging Configuration

#### 6.2.1 Logback Configuration
Tạo file `logback-spring.xml`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <include resource="org/springframework/boot/logging/logback/defaults.xml"/>
    
    <springProfile name="!prod">
        <include resource="org/springframework/boot/logging/logback/console-appender.xml"/>
    </springProfile>
    
    <springProfile name="prod">
        <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
            <file>/var/log/movie-booking/application.log</file>
            <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
                <fileNamePattern>/var/log/movie-booking/application.%d{yyyy-MM-dd}.%i.log</fileNamePattern>
                <maxFileSize>100MB</maxFileSize>
                <maxHistory>30</maxHistory>
                <totalSizeCap>3GB</totalSizeCap>
            </rollingPolicy>
            <encoder>
                <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</pattern>
            </encoder>
        </appender>
        
        <root level="INFO">
            <appender-ref ref="FILE"/>
        </root>
    </springProfile>
</configuration>
```

### 6.3 External Monitoring

#### 6.3.1 Prometheus Integration
```xml
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-prometheus</artifactId>
</dependency>
```

#### 6.3.2 Grafana Dashboard
- Import Spring Boot dashboard từ Grafana Labs
- Configure Prometheus data source
- Monitor key metrics: CPU, Memory, Response Time, Error Rate

---

## 7. Security Considerations

### 7.1 Network Security
- Sử dụng HTTPS trong production
- Configure firewall rules
- Implement rate limiting
- Use VPN cho database access

### 7.2 Application Security
- Rotate JWT secret keys regularly
- Implement proper password policies
- Use environment variables cho sensitive data
- Regular security updates

### 7.3 Database Security
- Use strong passwords
- Enable SSL connections
- Regular backups
- Access control và audit logging

---

## 8. Backup và Recovery

### 8.1 Database Backup
```bash
# Daily backup script
#!/bin/bash
BACKUP_DIR="/backup/mysql"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="moviebooking"

mkdir -p $BACKUP_DIR

mysqldump -u root -p$MYSQL_ROOT_PASSWORD \
  --single-transaction \
  --routines \
  --triggers \
  $DB_NAME > $BACKUP_DIR/moviebooking_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/moviebooking_$DATE.sql

# Remove old backups (keep 30 days)
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete
```

### 8.2 Application Backup
```bash
# Backup application files
tar -czf /backup/app/movie-booking_$(date +%Y%m%d).tar.gz \
  /opt/movie-booking/
```

### 8.3 Recovery Procedures
1. Stop application
2. Restore database từ backup
3. Restore application files
4. Update configuration nếu cần
5. Start application
6. Verify functionality

---

## 9. Performance Tuning

### 9.1 JVM Tuning
```bash
# Production JVM options
JAVA_OPTS="-Xms1g -Xmx2g \
  -XX:+UseG1GC \
  -XX:MaxGCPauseMillis=200 \
  -XX:+UseStringDeduplication \
  -XX:+OptimizeStringConcat"
```

### 9.2 Database Tuning
```sql
-- MySQL configuration
[mysqld]
innodb_buffer_pool_size = 1G
innodb_log_file_size = 256M
innodb_flush_log_at_trx_commit = 2
query_cache_size = 64M
max_connections = 200
```

### 9.3 Application Tuning
```properties
# Connection pool
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.connection-timeout=30000
spring.datasource.hikari.idle-timeout=600000
spring.datasource.hikari.max-lifetime=1800000

# JPA tuning
spring.jpa.properties.hibernate.jdbc.batch_size=20
spring.jpa.properties.hibernate.order_inserts=true
spring.jpa.properties.hibernate.order_updates=true
```

---

## 10. Troubleshooting

### 10.1 Common Issues

#### 10.1.1 Application Won't Start
```bash
# Check logs
sudo journalctl -u movie-booking -f

# Check Java version
java -version

# Check port availability
netstat -tlnp | grep 8080
```

#### 10.1.2 Database Connection Issues
```bash
# Test database connection
mysql -h localhost -u movieuser -p moviebooking

# Check MySQL status
sudo systemctl status mysql

# Check MySQL logs
sudo tail -f /var/log/mysql/error.log
```

#### 10.1.3 Memory Issues
```bash
# Check memory usage
free -h
top -p $(pgrep java)

# Check JVM heap
jstat -gc $(pgrep java) 5s
```

### 10.2 Performance Issues
- Monitor slow queries trong MySQL
- Check application logs cho errors
- Monitor system resources
- Use profiling tools như JProfiler

### 10.3 Security Issues
- Check failed login attempts
- Monitor unusual traffic patterns
- Review access logs
- Update dependencies regularly

---

## 11. Maintenance

### 11.1 Regular Tasks
- **Daily**: Check application logs và health
- **Weekly**: Review performance metrics
- **Monthly**: Security updates và dependency updates
- **Quarterly**: Capacity planning và performance review

### 11.2 Update Procedures
1. Test updates trong staging environment
2. Create backup trước khi update
3. Deploy updates during maintenance window
4. Monitor application sau khi update
5. Rollback nếu có issues

### 11.3 Scaling Procedures
- **Horizontal Scaling**: Add more application instances
- **Vertical Scaling**: Increase server resources
- **Database Scaling**: Read replicas và connection pooling
- **Caching**: Implement Redis cho session và data caching
