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

import java.nio.charset.StandardCharsets;
import java.util.Base64;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Authorization Bypass Attempts Tests
 * 
 * Test Cases:
 * 1. Direct URL access - Customer enters /admin URL → Redirected or 403
 * Forbidden
 * 2. Direct API call - Customer calls admin API endpoint → 403 Forbidden
 * 3. Token manipulation - Modify token payload (role: ADMIN) → Signature
 * invalid, rejected
 * 4. Privilege escalation - Customer tries to modify their role → Operation
 * blocked
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@org.springframework.transaction.annotation.Transactional
class AuthorizationBypassTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private SecurityUtil securityUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private String customerToken;
    private User customerUser;

    @BeforeEach
    void setUp() {
        // Create customer user
        customerUser = userRepository.findByUsername("bypasscustomer").orElseGet(() -> {
            User user = new User();
            user.setUsername("bypasscustomer");
            user.setEmail("bypasscustomer@test.com");
            user.setPassword(passwordEncoder.encode("password123"));
            user.setRole(User.UserRole.CUSTOMER);
            user.setIsActive(true);
            user.setPhoneNumber("0123456789");
            user.setAddress("Test Address");
            return userRepository.save(user);
        });

        // Generate valid customer token
        customerToken = securityUtil.createAccessToken(customerUser);
    }

    // ===================== TEST CASE 1: DIRECT URL ACCESS =====================

    @Nested
    @DisplayName("Direct URL Access - Frontend + Backend Enforcement")
    class DirectUrlAccessTests {

        @Test
        @DisplayName("Customer accessing /api/v1/users → 403 Forbidden")
        void customerAccessAdminUsersEndpoint_Returns403() throws Exception {
            mockMvc.perform(get("/api/v1/users")
                    .header("Authorization", "Bearer " + customerToken))
                    .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("Customer accessing admin movie creation → 403 Forbidden")
        void customerAccessAdminMovieCreate_Returns403() throws Exception {
            mockMvc.perform(post("/api/v1/movies")
                    .header("Authorization", "Bearer " + customerToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{\"title\":\"Hack Movie\"}"))
                    .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("Customer accessing admin user delete → 403 Forbidden")
        void customerAccessAdminUserDelete_Returns403() throws Exception {
            mockMvc.perform(delete("/api/v1/users/1")
                    .header("Authorization", "Bearer " + customerToken))
                    .andExpect(status().isForbidden());
        }
    }

    // ===================== TEST CASE 2: DIRECT API CALL =====================

    @Nested
    @DisplayName("Direct API Call - API Level Enforcement")
    class DirectApiCallTests {

        @Test
        @DisplayName("Customer calls admin POST /api/v1/auditoriums → 403 Forbidden")
        void customerCallsAdminAuditoriumCreate_Returns403() throws Exception {
            mockMvc.perform(post("/api/v1/auditoriums")
                    .header("Authorization", "Bearer " + customerToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{\"name\":\"Hacked Auditorium\"}"))
                    .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("Customer calls admin DELETE /api/v1/screenings → 403 Forbidden")
        void customerCallsAdminScreeningDelete_Returns403() throws Exception {
            mockMvc.perform(delete("/api/v1/screenings/1")
                    .header("Authorization", "Bearer " + customerToken))
                    .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("Customer calls admin PATCH /api/v1/movies → 403 Forbidden")
        void customerCallsAdminMovieUpdate_Returns403() throws Exception {
            mockMvc.perform(patch("/api/v1/movies/1")
                    .header("Authorization", "Bearer " + customerToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{\"title\":\"Hacked Title\"}"))
                    .andExpect(status().isForbidden());
        }
    }

    // ===================== TEST CASE 3: TOKEN MANIPULATION =====================

    @Nested
    @DisplayName("Token Manipulation - JWT Integrity Check")
    class TokenManipulationTests {

        @Test
        @DisplayName("Tampered token payload (role changed to ADMIN) → Signature verification fails (401)")
        void tamperedTokenPayload_IsRejected() throws Exception {
            // Take a valid token and modify the payload
            String[] parts = customerToken.split("\\.");

            // Decode payload, modify role to ADMIN
            String payload = new String(Base64.getUrlDecoder().decode(parts[1]), StandardCharsets.UTF_8);
            String tamperedPayload = payload.replace("CUSTOMER", "ADMIN");
            String tamperedPayloadEncoded = Base64.getUrlEncoder().withoutPadding()
                    .encodeToString(tamperedPayload.getBytes(StandardCharsets.UTF_8));

            // Create tampered token (header.tamperedPayload.originalSignature)
            String tamperedToken = parts[0] + "." + tamperedPayloadEncoded + "." + parts[2];

            // Tampered token should be rejected due to signature mismatch
            mockMvc.perform(get("/api/v1/users")
                    .header("Authorization", "Bearer " + tamperedToken))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("Token with missing signature → Rejected (401)")
        void tokenWithMissingSignature_IsRejected() throws Exception {
            String[] parts = customerToken.split("\\.");
            String unsignedToken = parts[0] + "." + parts[1] + ".";

            mockMvc.perform(get("/api/v1/users")
                    .header("Authorization", "Bearer " + unsignedToken))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("Completely fake token → Rejected (401)")
        void completelyFakeToken_IsRejected() throws Exception {
            String fakeToken = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJoYWNrZXIiLCJyb2xlIjoiQURNSU4ifQ.fakeSignature123";

            mockMvc.perform(get("/api/v1/users")
                    .header("Authorization", "Bearer " + fakeToken))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("Malformed token format → Rejected (401)")
        void malformedToken_IsRejected() throws Exception {
            String malformedToken = "not.a.valid.jwt.token";

            mockMvc.perform(get("/api/v1/users")
                    .header("Authorization", "Bearer " + malformedToken))
                    .andExpect(status().isUnauthorized());
        }
    }

    // ===================== TEST CASE 4: PRIVILEGE ESCALATION =====================

    @Nested
    @DisplayName("Privilege Escalation - Role Change by Admin Only")
    class PrivilegeEscalationTests {

        @Test
        @DisplayName("Customer tries to modify own role to ADMIN → Forbidden or ignored")
        void customerTriesToEscalateOwnRole_IsDenied() throws Exception {
            // Customer tries to update their own profile with admin role
            String escalationPayload = """
                    {
                        "role": "ADMIN"
                    }
                    """;

            // This should either be:
            // 1. Forbidden (403) if system detects role change attempt
            // 2. Ignored (role not changed) if system only allows admin to change roles
            mockMvc.perform(patch("/api/v1/users/" + customerUser.getId())
                    .header("Authorization", "Bearer " + customerToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(escalationPayload));

            // Customer should NOT be able to change their role
            // Verify they still cannot access admin endpoint afterward
            mockMvc.perform(get("/api/v1/users")
                    .header("Authorization", "Bearer " + customerToken))
                    .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("Customer tries to create admin user → 403 Forbidden")
        void customerTriesToCreateAdminUser_IsForbidden() throws Exception {
            String newAdminPayload = """
                    {
                        "username": "newadmin",
                        "email": "newadmin@hack.com",
                        "password": "password123",
                        "role": "ADMIN"
                    }
                    """;

            mockMvc.perform(post("/api/v1/users")
                    .header("Authorization", "Bearer " + customerToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(newAdminPayload))
                    .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("Customer tries to delete another user → 403 Forbidden")
        void customerTriesToDeleteOtherUser_IsForbidden() throws Exception {
            mockMvc.perform(delete("/api/v1/users/999")
                    .header("Authorization", "Bearer " + customerToken))
                    .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("Unauthenticated user tries to access protected resource → 401")
        void unauthenticatedAccessProtected_Returns401() throws Exception {
            mockMvc.perform(get("/api/v1/bookings"))
                    .andExpect(status().isUnauthorized());
        }
    }
}
