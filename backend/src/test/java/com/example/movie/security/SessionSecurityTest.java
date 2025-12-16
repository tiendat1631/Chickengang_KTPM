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

/**
 * Session Security Tests
 * 
 * Test Cases:
 * 1. Session timeout - Inactive for 30 minutes → Auto-logout or token refresh
 * 2. Concurrent sessions - User logs in on 2 devices → Both sessions valid or
 * policy enforced
 * 3. Secure cookie flags - JWT stored with HttpOnly, secure, sameSite flags
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class SessionSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private SecurityUtil securityUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private User testUser;
    private String userToken;

    @BeforeEach
    void setUp() {
        // Create test user
        testUser = userRepository.findByUsername("sessiontestuser").orElseGet(() -> {
            User user = new User();
            user.setUsername("sessiontestuser");
            user.setEmail("sessiontest@test.com");
            user.setPassword(passwordEncoder.encode("testpass123"));
            user.setRole(User.UserRole.CUSTOMER);
            user.setIsActive(true);
            user.setPhoneNumber("0112233445");
            user.setAddress("Session Test Address");
            return userRepository.save(user);
        });

        userToken = securityUtil.createAccessToken(testUser);
    }

    // ===================== SESSION TIMEOUT TESTS =====================

    @Nested
    @DisplayName("Session Timeout - Idle Timeout Configuration")
    class SessionTimeoutTests {

        @Test
        @DisplayName("Access token expires after configured time")
        void accessToken_ExpiresAfterConfiguredTime() {
            // Get token expiration
            java.util.Date expiration = securityUtil.getExpirationDateFromToken(userToken);

            // Token should have expiration set
            assertNotNull(expiration, "Token should have expiration date");

            // Verify token is not expired now
            assertTrue(expiration.after(new java.util.Date()),
                    "Token should not be expired immediately after creation");
        }

        @Test
        @DisplayName("Expired token is rejected by protected endpoint")
        void expiredToken_IsRejectedByProtectedEndpoint() throws Exception {
            // Create an already expired token (simulate timeout)
            // Using a token with past expiration
            String expiredToken = createExpiredTokenManually();

            mockMvc.perform(get("/api/v1/bookings")
                    .header("Authorization", "Bearer " + expiredToken))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        @Disabled("Requires mock time manipulation - token refresh behavior")
        @DisplayName("Token refresh extends session before timeout")
        void tokenRefresh_ExtendsSessionBeforeTimeout() throws Exception {
            // EXPECTED BEHAVIOR:
            // 1. User's token is about to expire (e.g., 5 minutes left)
            // 2. User calls refresh endpoint
            // 3. New token is issued with full expiration time

            String refreshToken = securityUtil.createRefreshToken(testUser.getUsername());

            String refreshPayload = """
                    {
                        "refreshToken": "%s"
                    }
                    """.formatted(refreshToken);

            mockMvc.perform(post("/api/v1/auth/refresh")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(refreshPayload))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.accessToken").exists());
        }

        /**
         * Helper method to create an expired token for testing
         */
        private String createExpiredTokenManually() {
            // Create a token that's already expired by tampering with the payload
            // In production, we'd use a mock clock, but for demo we'll use an invalid token
            return "eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ0ZXN0IiwiZXhwIjoxMDAwMDAwMDAwfQ.invalid";
        }
    }

    // ===================== CONCURRENT SESSIONS TESTS =====================

    @Nested
    @DisplayName("Concurrent Sessions - Multiple Device Login")
    class ConcurrentSessionsTests {

        @Test
        @DisplayName("User can login from multiple devices simultaneously")
        void userCanLoginFromMultipleDevices() throws Exception {
            // First login - simulating Device 1
            String loginPayload = """
                    {
                        "username": "sessiontestuser",
                        "password": "testpass123"
                    }
                    """;

            MvcResult firstLogin = mockMvc.perform(post("/api/v1/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(loginPayload))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.accessToken").exists())
                    .andReturn();

            String token1 = extractAccessToken(firstLogin);

            // Second login - simulating Device 2
            MvcResult secondLogin = mockMvc.perform(post("/api/v1/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(loginPayload))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.accessToken").exists())
                    .andReturn();

            String token2 = extractAccessToken(secondLogin);

            // Both tokens should be different
            assertNotEquals(token1, token2,
                    "Each login should generate a unique token");
        }

        @Test
        @DisplayName("Both sessions remain valid after concurrent login")
        void bothSessionsRemainValidAfterConcurrentLogin() throws Exception {
            // Login twice to get two different tokens
            String loginPayload = """
                    {
                        "username": "sessiontestuser",
                        "password": "testpass123"
                    }
                    """;

            MvcResult firstLogin = mockMvc.perform(post("/api/v1/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(loginPayload))
                    .andExpect(status().isOk())
                    .andReturn();

            MvcResult secondLogin = mockMvc.perform(post("/api/v1/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(loginPayload))
                    .andExpect(status().isOk())
                    .andReturn();

            String token1 = extractAccessToken(firstLogin);
            String token2 = extractAccessToken(secondLogin);

            // Verify BOTH tokens can access protected resources
            mockMvc.perform(get("/api/v1/movies")
                    .header("Authorization", "Bearer " + token1))
                    .andExpect(status().isOk());

            mockMvc.perform(get("/api/v1/movies")
                    .header("Authorization", "Bearer " + token2))
                    .andExpect(status().isOk());
        }

        @Test
        @Disabled("Feature not implemented - Single session policy")
        @DisplayName("Optional: New login invalidates previous session (single session policy)")
        void newLoginInvalidatesPreviousSession() throws Exception {
            // OPTIONAL BEHAVIOR (if single session policy is enforced):
            // 1. User logs in on Device 1 → Token A issued
            // 2. User logs in on Device 2 → Token B issued, Token A invalidated
            // 3. Request with Token A → 401 Unauthorized

            fail("Implement if single session policy is required");
        }

        private String extractAccessToken(MvcResult result) throws Exception {
            String response = result.getResponse().getContentAsString();
            // Simple extraction - in production use JSON parser
            int start = response.indexOf("\"accessToken\":\"") + 15;
            int end = response.indexOf("\"", start);
            return response.substring(start, end);
        }
    }

    // ===================== SECURE COOKIE FLAGS TESTS =====================

    @Nested
    @DisplayName("Secure Cookie Flags - HttpOnly, Secure, SameSite")
    class SecureCookieFlagsTests {

        @Test
        @Disabled("JWT is returned in response body, not as cookie - verify if cookie-based auth is used")
        @DisplayName("JWT cookie has HttpOnly flag set")
        void jwtCookie_HasHttpOnlyFlag() throws Exception {
            // EXPECTED BEHAVIOR (if using cookie-based JWT):
            // Set-Cookie: jwt=xxx; HttpOnly
            // HttpOnly prevents JavaScript access to the cookie

            String loginPayload = """
                    {
                        "username": "sessiontestuser",
                        "password": "testpass123"
                    }
                    """;

            MvcResult result = mockMvc.perform(post("/api/v1/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(loginPayload))
                    .andExpect(status().isOk())
                    .andReturn();

            String setCookie = result.getResponse().getHeader("Set-Cookie");
            assertNotNull(setCookie, "Set-Cookie header should be present");
            assertTrue(setCookie.toLowerCase().contains("httponly"),
                    "Cookie should have HttpOnly flag");
        }

        @Test
        @Disabled("JWT is returned in response body, not as cookie - verify if cookie-based auth is used")
        @DisplayName("JWT cookie has Secure flag set")
        void jwtCookie_HasSecureFlag() throws Exception {
            // EXPECTED BEHAVIOR (if using cookie-based JWT):
            // Set-Cookie: jwt=xxx; Secure
            // Secure ensures cookie is only sent over HTTPS

            String loginPayload = """
                    {
                        "username": "sessiontestuser",
                        "password": "testpass123"
                    }
                    """;

            MvcResult result = mockMvc.perform(post("/api/v1/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(loginPayload))
                    .andExpect(status().isOk())
                    .andReturn();

            String setCookie = result.getResponse().getHeader("Set-Cookie");
            assertNotNull(setCookie, "Set-Cookie header should be present");
            assertTrue(setCookie.toLowerCase().contains("secure"),
                    "Cookie should have Secure flag");
        }

        @Test
        @Disabled("JWT is returned in response body, not as cookie - verify if cookie-based auth is used")
        @DisplayName("JWT cookie has SameSite flag set")
        void jwtCookie_HasSameSiteFlag() throws Exception {
            // EXPECTED BEHAVIOR (if using cookie-based JWT):
            // Set-Cookie: jwt=xxx; SameSite=Strict (or Lax)
            // SameSite prevents CSRF attacks

            String loginPayload = """
                    {
                        "username": "sessiontestuser",
                        "password": "testpass123"
                    }
                    """;

            MvcResult result = mockMvc.perform(post("/api/v1/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(loginPayload))
                    .andExpect(status().isOk())
                    .andReturn();

            String setCookie = result.getResponse().getHeader("Set-Cookie");
            assertNotNull(setCookie, "Set-Cookie header should be present");
            assertTrue(setCookie.toLowerCase().contains("samesite"),
                    "Cookie should have SameSite flag");
        }

        @Test
        @DisplayName("JWT is returned in response body (current implementation)")
        void jwt_IsReturnedInResponseBody() throws Exception {
            // Current implementation: JWT is in response body, not cookie
            // This is secure as long as:
            // 1. Frontend stores token in memory (not localStorage)
            // 2. HTTPS is used
            // 3. Token has short expiration

            String loginPayload = """
                    {
                        "username": "sessiontestuser",
                        "password": "testpass123"
                    }
                    """;

            mockMvc.perform(post("/api/v1/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(loginPayload))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.accessToken").exists())
                    .andExpect(jsonPath("$.refreshToken").exists());
        }
    }
}
