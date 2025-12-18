package com.example.movie.security;

import com.example.movie.model.User;
import com.example.movie.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
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
import org.springframework.test.web.servlet.MvcResult;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.UUID;

/**
 * Password Security Tests
 * 
 * Test Cases:
 * 1. Password hashing - Passwords stored as bcrypt hash, not plaintext
 * 2. Password not in API response - GET /api/users → Password field not
 * returned
 * 3. Forgot password (if implemented)
 * 4. Change password (if implemented)
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class PasswordSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private SecurityUtil securityUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private User adminUser;
    private User testUser;
    private String adminToken;

    @BeforeEach
    void setUp() {
        // Create admin user for viewing users
        adminUser = userRepository.findByUsername("pwdadmin").orElseGet(() -> {
            User user = new User();
            user.setUsername("pwdadmin");
            user.setEmail("pwdadmin@test.com");
            user.setPassword(passwordEncoder.encode("adminpass123"));
            user.setRole(User.UserRole.ADMIN);
            user.setIsActive(true);
            user.setPhoneNumber("0123456789");
            user.setAddress("Admin Address");
            return userRepository.save(user);
        });

        adminToken = securityUtil.createAccessToken(adminUser);

        // Create regular test user
        testUser = userRepository.findByUsername("pwdtestuser").orElseGet(() -> {
            User user = new User();
            user.setUsername("pwdtestuser");
            user.setEmail("pwdtestuser@test.com");
            user.setPassword(passwordEncoder.encode("testpass123"));
            user.setRole(User.UserRole.CUSTOMER);
            user.setIsActive(true);
            user.setPhoneNumber("0987654321");
            user.setAddress("Test Address");
            return userRepository.save(user);
        });
    }

    // ===================== PASSWORD HASHING TESTS =====================

    @Nested
    @DisplayName("Password Hashing - BCrypt Storage")
    class PasswordHashingTests {

        @Test
        @DisplayName("Password is stored as bcrypt hash, not plaintext")
        void password_IsStoredAsBcryptHash() {
            // Get user from database
            User savedUser = userRepository.findByUsername("pwdtestuser").orElseThrow();

            // Password in DB should NOT be plaintext
            assertNotEquals("testpass123", savedUser.getPassword());

            // Password should start with bcrypt prefix
            assertTrue(savedUser.getPassword().startsWith("$2a$") ||
                    savedUser.getPassword().startsWith("$2b$") ||
                    savedUser.getPassword().startsWith("$2y$"),
                    "Password should be hashed with bcrypt");
        }

        @Test
        @DisplayName("BCrypt hash can verify correct password")
        void bcryptHash_CanVerifyCorrectPassword() {
            User savedUser = userRepository.findByUsername("pwdtestuser").orElseThrow();

            // Password encoder should verify the correct password
            assertTrue(passwordEncoder.matches("testpass123", savedUser.getPassword()));
        }

        @Test
        @DisplayName("BCrypt hash rejects incorrect password")
        void bcryptHash_RejectsIncorrectPassword() {
            User savedUser = userRepository.findByUsername("pwdtestuser").orElseThrow();

            // Password encoder should reject incorrect passwords
            assertFalse(passwordEncoder.matches("wrongpassword", savedUser.getPassword()));
        }

        @Test
        @DisplayName("Same password produces different hashes (salt)")
        void samePassword_ProducesDifferentHashes() {
            // Encode same password twice
            String hash1 = passwordEncoder.encode("samepassword");
            String hash2 = passwordEncoder.encode("samepassword");

            // Hashes should be different due to salt
            assertNotEquals(hash1, hash2);

            // But both should still verify correctly
            assertTrue(passwordEncoder.matches("samepassword", hash1));
            assertTrue(passwordEncoder.matches("samepassword", hash2));
        }

        @Test
        @DisplayName("Registration stores password as hash")
        void registration_StoresPasswordAsHash() throws Exception {
            String uniqueId = UUID.randomUUID().toString().substring(0, 8);
            String uniqueUsername = "nrg" + uniqueId;
            String uniquePhone = "01" + uniqueId.replaceAll("[^0-9]", "1").substring(0, 8);
            String registerPayload = """
                    {
                        "username": "%s",
                        "email": "%s@test.com",
                        "password": "plaintext123",
                        "phoneNumber": "%s",
                        "address": "New Address"
                    }
                    """.formatted(uniqueUsername, uniqueUsername, uniquePhone);

            mockMvc.perform(post("/api/v1/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(registerPayload))
                    .andExpect(status().is2xxSuccessful());

            // Verify in database
            User newUser = userRepository.findByUsername(uniqueUsername).orElseThrow();
            assertNotEquals("plaintext123", newUser.getPassword());
            assertTrue(passwordEncoder.matches("plaintext123", newUser.getPassword()));
        }
    }

    // ===================== PASSWORD NOT IN API RESPONSE =====================

    @Nested
    @DisplayName("Password Not In API Response - Sensitive Data Protection")
    class PasswordNotInResponseTests {

        @Test
        @DisplayName("GET /api/v1/users does not expose password field")
        void getUsers_DoesNotExposePassword() throws Exception {
            MvcResult result = mockMvc.perform(get("/api/v1/users")
                    .header("Authorization", "Bearer " + adminToken))
                    .andExpect(status().isOk())
                    .andReturn();

            String responseBody = result.getResponse().getContentAsString();

            // Password field should not be in response
            assertFalse(responseBody.contains("\"password\""),
                    "Response should not contain password field");

            // Also verify actual password hash is not exposed
            User savedUser = userRepository.findByUsername("pwdtestuser").orElseThrow();
            assertFalse(responseBody.contains(savedUser.getPassword()),
                    "Response should not contain password hash value");
        }

        @Test
        @DisplayName("GET /api/v1/users/{id} does not expose password field")
        void getUserById_DoesNotExposePassword() throws Exception {
            MvcResult result = mockMvc.perform(get("/api/v1/users/" + testUser.getId())
                    .header("Authorization", "Bearer " + adminToken))
                    .andExpect(status().isOk())
                    .andReturn();

            String responseBody = result.getResponse().getContentAsString();

            assertFalse(responseBody.contains("\"password\""),
                    "Response should not contain password field");
        }

        @Test
        @DisplayName("Login response does not expose password field")
        void loginResponse_DoesNotExposePassword() throws Exception {
            String loginPayload = """
                    {
                        "username": "pwdtestuser",
                        "password": "testpass123"
                    }
                    """;

            MvcResult result = mockMvc.perform(post("/api/v1/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(loginPayload))
                    .andExpect(status().isOk())
                    .andReturn();

            String responseBody = result.getResponse().getContentAsString();

            // Password should not be in response
            assertFalse(responseBody.contains("testpass123"),
                    "Response should not contain plaintext password");
            assertFalse(responseBody.contains("\"password\""),
                    "Response should not contain password field");
        }

        @Test
        @DisplayName("Registration response does not expose password field")
        void registerResponse_DoesNotExposePassword() throws Exception {
            String uniqueId = UUID.randomUUID().toString().substring(0, 8);
            String uniqueUsername = "rnp" + uniqueId;
            String uniquePhone = "01" + uniqueId.replaceAll("[^0-9]", "2").substring(0, 8);
            String registerPayload = """
                    {
                        "username": "%s",
                        "email": "%s@test.com",
                        "password": "mypassword123",
                        "phoneNumber": "%s",
                        "address": "New Address"
                    }
                    """.formatted(uniqueUsername, uniqueUsername, uniquePhone);

            MvcResult result = mockMvc.perform(post("/api/v1/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(registerPayload))
                    .andExpect(status().is2xxSuccessful())
                    .andReturn();

            String responseBody = result.getResponse().getContentAsString();

            assertFalse(responseBody.contains("mypassword123"),
                    "Response should not contain plaintext password");
        }
    }

    // ===================== SESSION TOKEN SECURITY =====================

    @Nested
    @DisplayName("Token Security - JWT Expiration")
    class TokenSecurityTests {

        @Test
        @DisplayName("Access token has reasonable expiration time")
        void accessToken_HasReasonableExpiration() {
            String token = securityUtil.createAccessToken(testUser);
            java.util.Date expiration = securityUtil.getExpirationDateFromToken(token);

            // Token should not already be expired
            assertTrue(expiration.after(new java.util.Date()),
                    "Token should not be expired immediately");

            // Token expiration should be reasonable (less than 24 hours for regular users)
            long expirationMs = expiration.getTime() - System.currentTimeMillis();
            assertTrue(expirationMs < 24 * 60 * 60 * 1000,
                    "Access token should expire within 24 hours");
        }

        @Test
        @DisplayName("Refresh token has longer expiration than access token")
        void refreshToken_HasLongerExpiration() {
            String accessToken = securityUtil.createAccessToken(testUser);
            String refreshToken = securityUtil.createRefreshToken(testUser.getUsername());

            java.util.Date accessExpiration = securityUtil.getExpirationDateFromToken(accessToken);
            java.util.Date refreshExpiration = securityUtil.getExpirationDateFromToken(refreshToken);

            // Refresh token should expire after access token
            assertTrue(refreshExpiration.after(accessExpiration),
                    "Refresh token should have longer expiration than access token");
        }
    }

    // ===================== CHANGE PASSWORD (NOT YET IMPLEMENTED)
    // =====================

    @Nested
    @DisplayName("Change Password - Requires Old Password Verification")
    class ChangePasswordTests {

        @Test
        @Disabled("Feature not yet implemented - POST /api/v1/auth/change-password endpoint needed")
        @DisplayName("User can change password with correct old password")
        void changePassword_WithCorrectOldPassword_Succeeds() throws Exception {
            // EXPECTED BEHAVIOR:
            // 1. User sends: { oldPassword, newPassword }
            // 2. System verifies old password matches
            // 3. System updates password to new hash
            // 4. Returns success response

            String changePasswordPayload = """
                    {
                        "oldPassword": "testpass123",
                        "newPassword": "newpassword456"
                    }
                    """;

            mockMvc.perform(post("/api/v1/auth/change-password")
                    .header("Authorization", "Bearer " + adminToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(changePasswordPayload))
                    .andExpect(status().isOk());
        }

        @Test
        @Disabled("Feature not yet implemented - POST /api/v1/auth/change-password endpoint needed")
        @DisplayName("Change password fails with incorrect old password")
        void changePassword_WithIncorrectOldPassword_Fails() throws Exception {
            // EXPECTED BEHAVIOR:
            // User provides wrong old password → 400 Bad Request or 401 Unauthorized

            String changePasswordPayload = """
                    {
                        "oldPassword": "wrongpassword",
                        "newPassword": "newpassword456"
                    }
                    """;

            mockMvc.perform(post("/api/v1/auth/change-password")
                    .header("Authorization", "Bearer " + adminToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(changePasswordPayload))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @Disabled("Feature not yet implemented - POST /api/v1/auth/change-password endpoint needed")
        @DisplayName("New password is stored as hash after change")
        void changePassword_NewPasswordStoredAsHash() throws Exception {
            // EXPECTED BEHAVIOR:
            // After password change, new password should be bcrypt hashed in DB

            fail("Implement: verify new password is stored as bcrypt hash, not plaintext");
        }
    }

    // ===================== FORGOT PASSWORD (NOT YET IMPLEMENTED)
    // =====================

    @Nested
    @DisplayName("Forgot Password - Email Reset Flow")
    class ForgotPasswordTests {

        @Test
        @Disabled("Feature not yet implemented - POST /api/v1/auth/forgot-password endpoint needed")
        @DisplayName("Forgot password request sends reset email")
        void forgotPassword_SendsResetEmail() throws Exception {
            // EXPECTED BEHAVIOR:
            // 1. User sends: { email }
            // 2. System generates reset token
            // 3. System sends email with reset link
            // 4. Returns success (even if email doesn't exist - security)

            String forgotPasswordPayload = """
                    {
                        "email": "pwdtestuser@test.com"
                    }
                    """;

            mockMvc.perform(post("/api/v1/auth/forgot-password")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(forgotPasswordPayload))
                    .andExpect(status().isOk());
        }

        @Test
        @Disabled("Feature not yet implemented - POST /api/v1/auth/reset-password endpoint needed")
        @DisplayName("Reset password with valid token succeeds")
        void resetPassword_WithValidToken_Succeeds() throws Exception {
            // EXPECTED BEHAVIOR:
            // 1. User clicks reset link with token
            // 2. User sends: { token, newPassword }
            // 3. System verifies token is valid and not expired
            // 4. System updates password

            String resetPasswordPayload = """
                    {
                        "token": "valid-reset-token",
                        "newPassword": "brandnewpassword123"
                    }
                    """;

            mockMvc.perform(post("/api/v1/auth/reset-password")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(resetPasswordPayload))
                    .andExpect(status().isOk());
        }

        @Test
        @Disabled("Feature not yet implemented - Reset token validation needed")
        @DisplayName("Reset password with expired token fails")
        void resetPassword_WithExpiredToken_Fails() throws Exception {
            // EXPECTED BEHAVIOR:
            // Expired token → 400 Bad Request with "Token expired" message

            fail("Implement: create expired token and verify it's rejected");
        }

        @Test
        @Disabled("Feature not yet implemented - Reset token validation needed")
        @DisplayName("Reset password with invalid token fails")
        void resetPassword_WithInvalidToken_Fails() throws Exception {
            // EXPECTED BEHAVIOR:
            // Invalid/tampered token → 400 Bad Request

            String resetPasswordPayload = """
                    {
                        "token": "fake-invalid-token",
                        "newPassword": "newpassword123"
                    }
                    """;

            mockMvc.perform(post("/api/v1/auth/reset-password")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(resetPasswordPayload))
                    .andExpect(status().isBadRequest());
        }
    }
}
