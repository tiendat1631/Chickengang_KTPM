package com.example.movie.testutil;

import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@Testcontainers
public abstract class TestContainersConfig {

    // @ServiceConnection tự động cấu hình spring.datasource.url, username, password
    @Container
    @ServiceConnection
    static final MySQLContainer<?> mysql = new MySQLContainer<>("mysql:8.0");

    // Không cần block static { mysql.start() } nữa vì @Testcontainers tự quản lý
    // Không cần @DynamicPropertySource thủ công nữa
}