package com.example.movie.repository;

import com.example.movie.model.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test") // Kích hoạt application-test.properties (H2 database)
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    /**
     * Test Case: SQL Injection Prevention
     * Mô tả: Thử tấn công bằng chuỗi "admin' OR '1'='1"
     * Tại sao an toàn? Vì Spring Data JPA sử dụng Prepared Statements.
     * Nó sẽ coi toàn bộ chuỗi kia là TÊN user, chứ không phải lệnh SQL.
     */
    @Test
    @DisplayName("Security: Should NOT return user when SQL Injection payload is used as username")
    void shouldPreventSqlInjection_WhenLoginWithMaliciousPayload() {
        // 1. Arrange: Tạo một user "admin" thật trong database H2
        User admin = new User();
        admin.setUsername("admin");
        admin.setEmail("admin@example.com");
        admin.setPassword("encodedPass");
        admin.setRole(User.UserRole.ADMIN);

        // Điền các trường bắt buộc khác (nếu entity của bạn yêu cầu not null)
        admin.setPhoneNumber("0987654321");
        admin.setAddress("Hanoi, Vietnam");
        admin.setIsActive(true);
        // Hibernate tự xử lý createdAt, nhưng set tay cho chắc nếu cần
        admin.setCreatedAt(LocalDateTime.now());
        admin.setUpdatedAt(LocalDateTime.now());

        userRepository.save(admin); // Lưu xuống DB thật (H2)

        // 2. Act: Cố gắng hack
        // Payload này nếu chạy trên câu lệnh SQL nối chuỗi thô sơ sẽ trả về admin.
        // Nhưng ở đây, nó sẽ tìm user có tên là chính xác chuỗi: "admin' OR '1'='1"
        String sqlInjectionPayload = "admin' OR '1'='1";
        Optional<User> result = userRepository.findByUsername(sqlInjectionPayload);

        // 3. Assert
        // Kết quả phải là Rỗng (Empty) -> Nghĩa là DB an toàn, không bị lừa.
        assertTrue(result.isEmpty(), "Hệ thống an toàn: Không tìm thấy user nào với payload độc hại");
    }

}