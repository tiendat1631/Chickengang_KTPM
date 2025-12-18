package com.example.movie.controller;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Authorization Integration Tests
 * 
 * Test Cases từ bảng Test:
 * 1. Logout clears session - After logout → Cannot access protected pages
 * without login
 * 2. Authorization check - Protected endpoints require valid JWT token
 * 
 * Với client-side logout (JWT stateless), sau khi xóa token:
 * - Client không còn token để gửi
 * - Request không có header Authorization
 * - Server trả về 401 Unauthorized
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthorizationIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    // ===================== LOGOUT CLEARS SESSION TESTS =====================
    // Những test này mô phỏng trạng thái sau khi user logout (không có token)

    /**
     * Test Case: Logout clears session
     * Mô tả: Sau khi logout (client xóa token), không thể truy cập protected pages
     * Kết quả mong đợi: Trả về 401 Unauthorized
     */
    @Test
    @DisplayName("Logout Clears Session - Cannot access bookings endpoint without token")
    void shouldReturn401_WhenAccessingBookingsWithoutToken() throws Exception {
        // Không gửi Authorization header = tương đương sau khi logout
        mockMvc.perform(get("/api/v1/bookings")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Logout Clears Session - Cannot access payments endpoint without token")
    void shouldReturn401_WhenAccessingPaymentsWithoutToken() throws Exception {
        mockMvc.perform(get("/api/v1/payments")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Logout Clears Session - Cannot create booking without token")
    void shouldReturn401_WhenCreatingBookingWithoutToken() throws Exception {
        String bookingJson = """
                {
                    "screeningId": 1,
                    "seatIds": [1, 2]
                }
                """;

        mockMvc.perform(post("/api/v1/bookings")
                .contentType(MediaType.APPLICATION_JSON)
                .content(bookingJson))
                .andExpect(status().isUnauthorized());
    }

    // ===================== AUTHORIZATION CHECK TESTS =====================

    @Test
    @DisplayName("Authorization Check - Cannot create movie without token (ADMIN only)")
    void shouldReturn401_WhenCreatingMovieWithoutToken() throws Exception {
        String movieJson = """
                {
                    "title": "Test Movie",
                    "description": "Test Description"
                }
                """;

        mockMvc.perform(post("/api/v1/movies")
                .contentType(MediaType.APPLICATION_JSON)
                .content(movieJson))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Authorization Check - Cannot delete movie without token (ADMIN only)")
    void shouldReturn401_WhenDeletingMovieWithoutToken() throws Exception {
        mockMvc.perform(delete("/api/v1/movies/1"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Authorization Check - Cannot access user management without token (ADMIN only)")
    void shouldReturn401_WhenAccessingUsersWithoutToken() throws Exception {
        mockMvc.perform(get("/api/v1/users"))
                .andExpect(status().isUnauthorized());
    }

    // ===================== INVALID TOKEN TESTS =====================

    @Test
    @DisplayName("Invalid Token - Cannot access protected endpoint with invalid JWT")
    void shouldReturn401_WhenAccessingWithInvalidToken() throws Exception {
        String invalidToken = "invalid.jwt.token";

        mockMvc.perform(get("/api/v1/bookings")
                .header("Authorization", "Bearer " + invalidToken)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Invalid Token - Cannot access protected endpoint with malformed JWT")
    void shouldReturn401_WhenAccessingWithMalformedToken() throws Exception {
        // Token có format JWT nhưng signature không valid
        String malformedToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

        mockMvc.perform(get("/api/v1/payments")
                .header("Authorization", "Bearer " + malformedToken)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    // ===================== PUBLIC ENDPOINTS TESTS =====================

    @Test
    @DisplayName("Public Access - Auth login endpoint should be accessible without token")
    void shouldNotReturn401_WhenAccessingLoginEndpoint() throws Exception {
        String loginJson = """
                {
                    "username": "nonexistentuser",
                    "password": "password"
                }
                """;

        // Login endpoint là public - sẽ trả về 404 (user not found), không phải 401
        mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson))
                .andExpect(status().isNotFound());
    }
}
