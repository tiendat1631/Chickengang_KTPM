package com.example.movie.config;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.context.annotation.Bean;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.utility.DockerImageName;

@TestConfiguration(proxyBeanMethods = false)
public class TestContainersConfig {

    @Bean
    @ServiceConnection
    public MySQLContainer<?> mysqlContainer() {
        // 1. Cấu hình cứng để tương thích Windows tốt nhất
        // Tắt Ryuk (container dọn dẹp) vì nó hay gây lỗi timeout trên Windows
        System.setProperty("testcontainers.ryuk.disabled", "true");
        // Ép buộc kiểm tra Docker qua TCP nếu Named Pipes lỗi
        System.setProperty("testcontainers.checks.disable", "true");

        return new MySQLContainer<>(DockerImageName.parse("mysql:8.0"))
                .withDatabaseName("test")
                .withUsername("test")
                .withPassword("test")
                .withReuse(true); // Cho phép tái sử dụng container để test nhanh hơn
    }
}