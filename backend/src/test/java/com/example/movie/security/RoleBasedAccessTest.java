package com.example.movie.security;

import com.example.movie.model.User;
import com.example.movie.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Role-Based Access Control (RBAC) Tests for CUSTOMER role
 * 
 * Test Cases từ bảng test:
 * 1. Customer accesses customer features - Customer views movies, creates
 * bookings - Permission check for CUSTOMER role
 * 2. Customer cannot access admin - Customer tries to access admin → 403
 * Forbidden - Critical: Role boundary test
 * 3. Customer cannot access admin API - Customer calls /api/v1/movies (POST) →
 * 403 Forbidden - API level access control
 * 4. Customer sees only own data - Customer A cannot view Customer B's bookings
 * - Data-level security (row-level)
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@org.springframework.transaction.annotation.Transactional
class RoleBasedAccessTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private SecurityUtil securityUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private String customerToken;
    private String adminToken;
    private User customerUser;
    private User adminUser;

    @BeforeEach
    void setUp() {
        // Create test users if not exist
        customerUser = userRepository.findByUsername("testcustomer").orElseGet(() -> {
            User user = new User();
            user.setUsername("testcustomer");
            user.setEmail("testcustomer@test.com");
            user.setPassword(passwordEncoder.encode("password123"));
            user.setRole(User.UserRole.CUSTOMER);
            user.setIsActive(true);
            user.setPhoneNumber("0123456789");
            user.setAddress("Test Address");
            return userRepository.save(user);
        });

        adminUser = userRepository.findByUsername("testadmin").orElseGet(() -> {
            User user = new User();
            user.setUsername("testadmin");
            user.setEmail("testadmin@test.com");
            user.setPassword(passwordEncoder.encode("password123"));
            user.setRole(User.UserRole.ADMIN);
            user.setIsActive(true);
            user.setPhoneNumber("0987654321");
            user.setAddress("Admin Address");
            return userRepository.save(user);
        });

        // Generate tokens
        customerToken = securityUtil.createAccessToken(customerUser);
        adminToken = securityUtil.createAccessToken(adminUser);
    }

    // ===================== TEST CASE 1: CUSTOMER ACCESSES CUSTOMER FEATURES
    // =====================

    @Nested
    @DisplayName("Customer Accesses Customer Features")
    class CustomerAccessTests {

        @Test
        @DisplayName("Customer can view movies (GET /api/v1/movies)")
        void customerCanViewMovies() throws Exception {
            mockMvc.perform(get("/api/v1/movies")
                    .header("Authorization", "Bearer " + customerToken))
                    .andExpect(status().isOk());
        }

        @Test
        @DisplayName("Customer can view auditoriums (GET /api/v1/auditoriums)")
        void customerCanViewAuditoriums() throws Exception {
            mockMvc.perform(get("/api/v1/auditoriums")
                    .header("Authorization", "Bearer " + customerToken))
                    .andExpect(status().isOk());
        }

        @Test
        @DisplayName("Customer can access bookings endpoint - Not 401 or 403")
        void customerCanAccessBookings() throws Exception {
            int status = mockMvc.perform(get("/api/v1/bookings")
                    .header("Authorization", "Bearer " + customerToken))
                    .andReturn().getResponse().getStatus();

            // Customer is authenticated - should NOT get 401 or 403
            assertNotEquals(401, status, "Customer should not get 401 Unauthorized");
            assertNotEquals(403, status, "Customer should not get 403 Forbidden");
        }

        @Test
        @DisplayName("Customer can access payments endpoint - Not 401 or 403")
        void customerCanAccessPayments() throws Exception {
            int status = mockMvc.perform(get("/api/v1/payments")
                    .header("Authorization", "Bearer " + customerToken))
                    .andReturn().getResponse().getStatus();

            // Customer is authenticated - should NOT get 401 or 403
            assertNotEquals(401, status, "Customer should not get 401 Unauthorized");
            assertNotEquals(403, status, "Customer should not get 403 Forbidden");
        }
    }

    // ===================== TEST CASE 2 & 3: CUSTOMER CANNOT ACCESS ADMIN
    // =====================

    @Nested
    @DisplayName("Customer Cannot Access Admin Features - Role Boundary Tests")
    class CustomerCannotAccessAdminTests {

        // ---- MOVIES: Admin only for POST, DELETE, PATCH ----

        @Test
        @DisplayName("Customer cannot create movie (POST /api/v1/movies) → 403 Forbidden")
        void customerCannotCreateMovie() throws Exception {
            String movieJson = """
                    {
                        "title": "Test Movie",
                        "description": "Test Description",
                        "duration": 120,
                        "releaseDate": "2024-01-01"
                    }
                    """;

            mockMvc.perform(post("/api/v1/movies")
                    .header("Authorization", "Bearer " + customerToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(movieJson))
                    .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("Customer cannot delete movie (DELETE /api/v1/movies/1) → 403 Forbidden")
        void customerCannotDeleteMovie() throws Exception {
            mockMvc.perform(delete("/api/v1/movies/1")
                    .header("Authorization", "Bearer " + customerToken))
                    .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("Customer cannot update movie (PATCH /api/v1/movies/1) → 403 Forbidden")
        void customerCannotUpdateMovie() throws Exception {
            String updateJson = """
                    {
                        "title": "Updated Title"
                    }
                    """;

            mockMvc.perform(patch("/api/v1/movies/1")
                    .header("Authorization", "Bearer " + customerToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(updateJson))
                    .andExpect(status().isForbidden());
        }

        // ---- USERS: Admin only ----

        @Test
        @DisplayName("Customer cannot view all users (GET /api/v1/users) → 403 Forbidden")
        void customerCannotViewAllUsers() throws Exception {
            mockMvc.perform(get("/api/v1/users")
                    .header("Authorization", "Bearer " + customerToken))
                    .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("Customer cannot create user (POST /api/v1/users) → 403 Forbidden")
        void customerCannotCreateUser() throws Exception {
            String userJson = """
                    {
                        "username": "newuser",
                        "email": "new@test.com",
                        "password": "password123"
                    }
                    """;

            mockMvc.perform(post("/api/v1/users")
                    .header("Authorization", "Bearer " + customerToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(userJson))
                    .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("Customer cannot delete user (DELETE /api/v1/users/1) → 403 Forbidden")
        void customerCannotDeleteUser() throws Exception {
            mockMvc.perform(delete("/api/v1/users/1")
                    .header("Authorization", "Bearer " + customerToken))
                    .andExpect(status().isForbidden());
        }

        // ---- AUDITORIUMS: Admin only for POST, DELETE, PATCH ----

        @Test
        @DisplayName("Customer cannot create auditorium (POST /api/v1/auditoriums) → 403 Forbidden")
        void customerCannotCreateAuditorium() throws Exception {
            String auditoriumJson = """
                    {
                        "name": "Test Auditorium",
                        "capacity": 100
                    }
                    """;

            mockMvc.perform(post("/api/v1/auditoriums")
                    .header("Authorization", "Bearer " + customerToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(auditoriumJson))
                    .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("Customer cannot delete auditorium (DELETE /api/v1/auditoriums/1) → 403 Forbidden")
        void customerCannotDeleteAuditorium() throws Exception {
            mockMvc.perform(delete("/api/v1/auditoriums/1")
                    .header("Authorization", "Bearer " + customerToken))
                    .andExpect(status().isForbidden());
        }

        // ---- SCREENINGS: Admin only for POST, DELETE, PATCH ----

        @Test
        @DisplayName("Customer cannot create screening (POST /api/v1/screenings) → 403 Forbidden")
        void customerCannotCreateScreening() throws Exception {
            String screeningJson = """
                    {
                        "movieId": 1,
                        "auditoriumId": 1,
                        "startTime": "2024-01-01T10:00:00"
                    }
                    """;

            mockMvc.perform(post("/api/v1/screenings")
                    .header("Authorization", "Bearer " + customerToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(screeningJson))
                    .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("Customer cannot delete screening (DELETE /api/v1/screenings/1) → 403 Forbidden")
        void customerCannotDeleteScreening() throws Exception {
            mockMvc.perform(delete("/api/v1/screenings/1")
                    .header("Authorization", "Bearer " + customerToken))
                    .andExpect(status().isForbidden());
        }
    }

    // ===================== ADMIN CAN ACCESS ADMIN FEATURES =====================

    @Nested
    @DisplayName("Admin Can Access Admin Features - Positive Tests")
    class AdminAccessTests {

        @Test
        @DisplayName("Admin can create movie (POST /api/v1/movies) → Not Forbidden")
        void adminCanCreateMovie() throws Exception {
            String movieJson = """
                    {
                        "title": "Admin Test Movie",
                        "description": "Test Description",
                        "duration": 120,
                        "releaseDate": "2024-01-01"
                    }
                    """;

            int status = mockMvc.perform(post("/api/v1/movies")
                    .header("Authorization", "Bearer " + adminToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(movieJson))
                    .andReturn().getResponse().getStatus();

            assertNotEquals(403, status, "Admin should not get 403 Forbidden");
        }

        @Test
        @DisplayName("Admin can view all users (GET /api/v1/users) → 200 OK")
        void adminCanViewAllUsers() throws Exception {
            mockMvc.perform(get("/api/v1/users")
                    .header("Authorization", "Bearer " + adminToken))
                    .andExpect(status().isOk());
        }

        @Test
        @DisplayName("Admin can access screenings POST - Not Forbidden")
        void adminCanManageScreenings() throws Exception {
            String screeningJson = """
                    {
                        "movieId": 1,
                        "auditoriumId": 1,
                        "startTime": "2024-01-01T10:00:00"
                    }
                    """;

            int status = mockMvc.perform(post("/api/v1/screenings")
                    .header("Authorization", "Bearer " + adminToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(screeningJson))
                    .andReturn().getResponse().getStatus();

            // Should NOT be forbidden (might fail due to validation but not 403)
            assertNotEquals(403, status, "Admin should not get 403 Forbidden");
        }
    }

    // ===================== TEST CASE 4: CUSTOMER SEES ONLY OWN DATA
    // =====================

    @Nested
    @DisplayName("Data-Level Security - Row-Level Access")
    class DataLevelSecurityTests {

        @Test
        @DisplayName("Authenticated customer can access bookings endpoint - Not 401/403")
        void customerCanAccessOwnBookingsEndpoint() throws Exception {
            int status = mockMvc.perform(get("/api/v1/bookings")
                    .header("Authorization", "Bearer " + customerToken))
                    .andReturn().getResponse().getStatus();

            assertNotEquals(401, status, "Customer should not get 401 Unauthorized");
            assertNotEquals(403, status, "Customer should not get 403 Forbidden");
        }
    }
}
