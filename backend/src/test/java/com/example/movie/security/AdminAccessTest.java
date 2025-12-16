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
 * Role-Based Access Control (RBAC) Tests for ADMIN role
 * 
 * Test Cases từ bảng test:
 * 1. Admin accesses admin portal - Admin logs in → Access to /admin dashboard -
 * Admin portal access
 * 2. Admin manages movies - Admin can create, update, delete movies - CRUD
 * operations allowed
 * 3. Admin manages screenings - Admin can create, update, delete screenings -
 * Admin-only feature
 * 4. Admin manages users - Admin views all users, can enable/disable accounts -
 * User management feature
 * 5. Admin views all bookings - Admin sees all customer bookings with details -
 * Admin oversight
 * 6. Admin manages payments - Admin confirms/rejects payments, processes
 * refunds - Payment management
 * 7. Admin has full access - Admin can access all features that customers can +
 * admin features - Comprehensive access
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@org.springframework.transaction.annotation.Transactional
class AdminAccessTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private SecurityUtil securityUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private String adminToken;
    private String customerToken;
    private User adminUser;
    private User customerUser;

    @BeforeEach
    void setUp() {
        // Create admin user if not exist
        adminUser = userRepository.findByUsername("admintest").orElseGet(() -> {
            User user = new User();
            user.setUsername("admintest");
            user.setEmail("admintest@test.com");
            user.setPassword(passwordEncoder.encode("admin123"));
            user.setRole(User.UserRole.ADMIN);
            user.setIsActive(true);
            user.setPhoneNumber("0987654321");
            user.setAddress("Admin Address");
            return userRepository.save(user);
        });

        // Create customer for comparison
        customerUser = userRepository.findByUsername("customertest").orElseGet(() -> {
            User user = new User();
            user.setUsername("customertest");
            user.setEmail("customertest@test.com");
            user.setPassword(passwordEncoder.encode("customer123"));
            user.setRole(User.UserRole.CUSTOMER);
            user.setIsActive(true);
            user.setPhoneNumber("0123456789");
            user.setAddress("Customer Address");
            return userRepository.save(user);
        });

        // Generate tokens
        adminToken = securityUtil.createAccessToken(adminUser);
        customerToken = securityUtil.createAccessToken(customerUser);
    }

    // ===================== TEST CASE 1: Admin accesses admin portal
    // =====================
    @Nested
    @DisplayName("Admin Accesses Admin Portal")
    class AdminPortalAccessTests {

        @Test
        @DisplayName("Admin can access admin dashboard → 200 OK")
        void adminCanAccessAdminDashboard() throws Exception {
            mockMvc.perform(get("/api/v1/users")
                    .header("Authorization", "Bearer " + adminToken))
                    .andExpect(status().isOk());
        }

        @Test
        @DisplayName("Customer cannot access admin dashboard → 403 Forbidden")
        void customerCannotAccessAdminDashboard() throws Exception {
            mockMvc.perform(get("/api/v1/users")
                    .header("Authorization", "Bearer " + customerToken))
                    .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("Anonymous user cannot access admin dashboard → 401 Unauthorized")
        void anonymousCannotAccessAdminDashboard() throws Exception {
            mockMvc.perform(get("/api/v1/users"))
                    .andExpect(status().isUnauthorized());
        }
    }

    // ===================== TEST CASE 2: ADMIN MANAGES MOVIES =====================

    @Nested
    @DisplayName("Admin Manages Movies - CRUD Operations")
    class AdminManagesMoviesTests {

        @Test
        @DisplayName("Admin can create movie (POST /api/v1/movies)")
        void adminCanCreateMovie() throws Exception {
            String movieJson = """
                    {
                        "title": "New Admin Movie",
                        "description": "Created by admin",
                        "duration": 120,
                        "releaseDate": "2024-06-01"
                    }
                    """;

            int status = mockMvc.perform(post("/api/v1/movies")
                    .header("Authorization", "Bearer " + adminToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(movieJson))
                    .andReturn().getResponse().getStatus();

            // Should NOT be 403 Forbidden
            assertNotEquals(403, status, "Admin should be able to create movies");
        }

        @Test
        @DisplayName("Admin can update movie (PATCH /api/v1/movies/{id})")
        void adminCanUpdateMovie() throws Exception {
            String updateJson = """
                    {
                        "title": "Updated Movie Title"
                    }
                    """;

            int status = mockMvc.perform(patch("/api/v1/movies/1")
                    .header("Authorization", "Bearer " + adminToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(updateJson))
                    .andReturn().getResponse().getStatus();

            // Should NOT be 403 Forbidden
            assertNotEquals(403, status, "Admin should be able to update movies");
        }

        @Test
        @DisplayName("Admin can delete movie (DELETE /api/v1/movies/{id})")
        void adminCanDeleteMovie() throws Exception {
            int status = mockMvc.perform(delete("/api/v1/movies/999")
                    .header("Authorization", "Bearer " + adminToken))
                    .andReturn().getResponse().getStatus();

            // Should NOT be 403 Forbidden (might be 404 if not found, but not 403)
            assertNotEquals(403, status, "Admin should be able to delete movies");
        }
    }

    // ===================== TEST CASE 3: ADMIN MANAGES SCREENINGS
    // =====================

    @Nested
    @DisplayName("Admin Manages Screenings - Admin-only Feature")
    class AdminManagesScreeningsTests {

        @Test
        @DisplayName("Admin can create screening (POST /api/v1/screenings)")
        void adminCanCreateScreening() throws Exception {
            String screeningJson = """
                    {
                        "movieId": 1,
                        "auditoriumId": 1,
                        "startTime": "2024-06-01T14:00:00"
                    }
                    """;

            int status = mockMvc.perform(post("/api/v1/screenings")
                    .header("Authorization", "Bearer " + adminToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(screeningJson))
                    .andReturn().getResponse().getStatus();

            assertNotEquals(403, status, "Admin should be able to create screenings");
        }

        @Test
        @DisplayName("Admin can update screening (PATCH /api/v1/screenings/{id})")
        void adminCanUpdateScreening() throws Exception {
            String updateJson = """
                    {
                        "startTime": "2024-06-01T16:00:00"
                    }
                    """;

            int status = mockMvc.perform(patch("/api/v1/screenings/1")
                    .header("Authorization", "Bearer " + adminToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(updateJson))
                    .andReturn().getResponse().getStatus();

            assertNotEquals(403, status, "Admin should be able to update screenings");
        }

        @Test
        @DisplayName("Admin can delete screening (DELETE /api/v1/screenings/{id})")
        void adminCanDeleteScreening() throws Exception {
            int status = mockMvc.perform(delete("/api/v1/screenings/999")
                    .header("Authorization", "Bearer " + adminToken))
                    .andReturn().getResponse().getStatus();

            assertNotEquals(403, status, "Admin should be able to delete screenings");
        }
    }

    // ===================== TEST CASE 4: ADMIN MANAGES USERS =====================

    @Nested
    @DisplayName("Admin Manages Users - User Management Feature")
    class AdminManagesUsersTests {

        @Test
        @DisplayName("Admin can view all users (GET /api/v1/users)")
        void adminCanViewAllUsers() throws Exception {
            mockMvc.perform(get("/api/v1/users")
                    .header("Authorization", "Bearer " + adminToken))
                    .andExpect(status().isOk());
        }

        @Test
        @DisplayName("Admin can view specific user (GET /api/v1/users/{id})")
        void adminCanViewSpecificUser() throws Exception {
            int status = mockMvc.perform(get("/api/v1/users/" + customerUser.getId())
                    .header("Authorization", "Bearer " + adminToken))
                    .andReturn().getResponse().getStatus();

            assertNotEquals(403, status, "Admin should be able to view any user");
        }

        @Test
        @DisplayName("Admin can update user (PATCH /api/v1/users/{id})")
        void adminCanUpdateUser() throws Exception {
            String updateJson = """
                    {
                        "address": "Updated Address"
                    }
                    """;

            int status = mockMvc.perform(patch("/api/v1/users/" + customerUser.getId())
                    .header("Authorization", "Bearer " + adminToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(updateJson))
                    .andReturn().getResponse().getStatus();

            assertNotEquals(403, status, "Admin should be able to update users");
        }

        @Test
        @DisplayName("Admin can delete/disable user (DELETE /api/v1/users/{id})")
        void adminCanDeleteUser() throws Exception {
            int status = mockMvc.perform(delete("/api/v1/users/999")
                    .header("Authorization", "Bearer " + adminToken))
                    .andReturn().getResponse().getStatus();

            assertNotEquals(403, status, "Admin should be able to delete users");
        }
    }

    // ===================== TEST CASE 5: ADMIN VIEWS ALL BOOKINGS
    // =====================

    @Nested
    @DisplayName("Admin Views All Bookings - Admin Oversight")
    class AdminViewsBookingsTests {

        @Test
        @DisplayName("Admin can access bookings endpoint (GET /api/v1/bookings)")
        void adminCanAccessBookings() throws Exception {
            int status = mockMvc.perform(get("/api/v1/bookings")
                    .header("Authorization", "Bearer " + adminToken))
                    .andReturn().getResponse().getStatus();

            assertNotEquals(401, status, "Admin should not get 401");
            assertNotEquals(403, status, "Admin should not get 403");
        }
    }

    // ===================== TEST CASE 6: ADMIN MANAGES PAYMENTS
    // =====================

    @Nested
    @DisplayName("Admin Manages Payments - Payment Management")
    class AdminManagesPaymentsTests {

        @Test
        @DisplayName("Admin can access payments endpoint (GET /api/v1/payments)")
        void adminCanAccessPayments() throws Exception {
            int status = mockMvc.perform(get("/api/v1/payments")
                    .header("Authorization", "Bearer " + adminToken))
                    .andReturn().getResponse().getStatus();

            assertNotEquals(401, status, "Admin should not get 401");
            assertNotEquals(403, status, "Admin should not get 403");
        }
    }

    // ===================== TEST CASE 7: ADMIN HAS FULL ACCESS
    // =====================

    @Nested
    @DisplayName("Admin Has Full Access - Comprehensive Access")
    class AdminFullAccessTests {

        @Test
        @DisplayName("Admin can access all customer features - View movies")
        void adminCanViewMovies() throws Exception {
            mockMvc.perform(get("/api/v1/movies")
                    .header("Authorization", "Bearer " + adminToken))
                    .andExpect(status().isOk());
        }

        @Test
        @DisplayName("Admin can access all customer features - View screenings")
        void adminCanViewScreenings() throws Exception {
            // Screenings may require movieId or other params, so just verify not 401/403
            int status = mockMvc.perform(get("/api/v1/screenings")
                    .header("Authorization", "Bearer " + adminToken))
                    .andReturn().getResponse().getStatus();

            assertNotEquals(401, status, "Admin should not get 401");
            assertNotEquals(403, status, "Admin should not get 403");
        }

        @Test
        @DisplayName("Admin can access all customer features - View auditoriums")
        void adminCanViewAuditoriums() throws Exception {
            mockMvc.perform(get("/api/v1/auditoriums")
                    .header("Authorization", "Bearer " + adminToken))
                    .andExpect(status().isOk());
        }

        @Test
        @DisplayName("Admin has more privileges than customer")
        void adminHasMorePrivilegesThanCustomer() throws Exception {
            // Admin can access user management (customer cannot)
            mockMvc.perform(get("/api/v1/users")
                    .header("Authorization", "Bearer " + adminToken))
                    .andExpect(status().isOk());

            // Customer gets 403 Forbidden
            mockMvc.perform(get("/api/v1/users")
                    .header("Authorization", "Bearer " + customerToken))
                    .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("Admin can create auditoriums (POST /api/v1/auditoriums)")
        void adminCanCreateAuditorium() throws Exception {
            String auditoriumJson = """
                    {
                        "name": "New Auditorium",
                        "capacity": 150
                    }
                    """;

            int status = mockMvc.perform(post("/api/v1/auditoriums")
                    .header("Authorization", "Bearer " + adminToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(auditoriumJson))
                    .andReturn().getResponse().getStatus();

            assertNotEquals(403, status, "Admin should be able to create auditoriums");
        }

        @Test
        @DisplayName("Admin can delete auditoriums (DELETE /api/v1/auditoriums/{id})")
        void adminCanDeleteAuditorium() throws Exception {
            int status = mockMvc.perform(delete("/api/v1/auditoriums/999")
                    .header("Authorization", "Bearer " + adminToken))
                    .andReturn().getResponse().getStatus();

            assertNotEquals(403, status, "Admin should be able to delete auditoriums");
        }
    }
}
