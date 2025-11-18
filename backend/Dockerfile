# Stage 1: Build ứng dụng (Build .jar)
FROM maven:3-eclipse-temurin-22 AS build
WORKDIR /app

# Chỉ copy pom.xml để tải dependencies (tận dụng cache)
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy phần còn lại của source code và build
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Run ứng dụng
FROM eclipse-temurin:22-jre
WORKDIR /app

# Copy file .jar đã build từ stage 1
COPY --from=build /app/target/*.jar app.jar

# Expose cổng 8080
EXPOSE 8080

# Đặt profile là 'docker' để nó đọc file application-docker.properties
ENTRYPOINT ["java", "-Dspring.profiles.active=docker", "-jar", "app.jar"]