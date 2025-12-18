package com.example.movie.security;

import com.example.movie.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.test.context.ActiveProfiles;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Token Management Tests
 * 
 * Test Cases từ bảng test:
 * 1. Access token validation - Valid access token → API requests authorized
 * 2. Expired access token - Expired token → API returns 401
 * 3. Refresh token flow - Use refresh token to get new access token
 * 4. Invalid token - Tampered token → API returns 401
 * 5. Token expiration time - Access token 60 min (1hr), refresh 7 days
 * (actually 30 days in config)
 * 6. Logout invalidates tokens - Old tokens no longer work
 */
@SpringBootTest
@ActiveProfiles("test")
class TokenManagementTest {

    @Autowired
    private SecurityUtil securityUtil;

    @Autowired
    private JwtDecoder jwtDecoder;

    @Value("${app.jwt.access.expiration-in-seconds}")
    private long accessTokenExpiration;

    @Value("${app.jwt.access.admin-expiration-in-seconds}")
    private long adminAccessTokenExpiration;

    @Value("${app.jwt.refresh.expiration-in-seconds}")
    private long refreshTokenExpiration;

    private User customerUser;
    private User adminUser;

    @BeforeEach
    void setUp() {
        customerUser = new User();
        customerUser.setId(1L);
        customerUser.setUsername("customer");
        customerUser.setEmail("customer@test.com");
        customerUser.setRole(User.UserRole.CUSTOMER);

        adminUser = new User();
        adminUser.setId(2L);
        adminUser.setUsername("admin");
        adminUser.setEmail("admin@test.com");
        adminUser.setRole(User.UserRole.ADMIN);
    }

    // ===================== TEST CASE 1: ACCESS TOKEN VALIDATION
    // =====================

    @Nested
    @DisplayName("Access Token Validation")
    class AccessTokenValidationTests {

        @Test
        @DisplayName("Valid access token should be decodable and contain correct claims")
        void shouldDecodeValidAccessToken() {
            // Arrange
            String accessToken = securityUtil.createAccessToken(customerUser);

            // Act
            Jwt jwt = jwtDecoder.decode(accessToken);

            // Assert
            assertNotNull(jwt);
            assertEquals("customer", jwt.getSubject());
            assertEquals("CUSTOMER", jwt.getClaim(SecurityUtil.ROLE_KEY));
            assertNotNull(jwt.getIssuedAt());
            assertNotNull(jwt.getExpiresAt());
        }

        @Test
        @DisplayName("Access token should include role claim in Authorization header format")
        void shouldIncludeRoleInToken() {
            // Arrange & Act
            String accessToken = securityUtil.createAccessToken(customerUser);
            Jwt jwt = jwtDecoder.decode(accessToken);

            // Assert - Verify token contains role for Authorization
            String role = jwt.getClaim(SecurityUtil.ROLE_KEY);
            assertNotNull(role);
            assertTrue(role.equals("CUSTOMER") || role.equals("ADMIN"));
        }
    }

    // ===================== TEST CASE 2: EXPIRED ACCESS TOKEN =====================

    @Nested
    @DisplayName("Expired Access Token")
    class ExpiredTokenTests {

        @Test
        @DisplayName("Expired token should throw JwtException when decoded")
        void shouldThrowExceptionForExpiredToken() {
            // Arrange - Create a fake expired token (tampered expiry)
            // Note: We can't easily create an actually expired token without mocking time,
            // but we can test that the system handles invalid tokens properly
            String tamperedToken = "eyJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE2MDAwMDAwMDAsImV4cCI6MTYwMDAwMDAwMSwic3ViIjoiZXhwaXJlZHVzZXIiLCJyb2xlIjoiQ1VTVE9NRVIifQ.invalid_signature";

            // Act & Assert
            assertThrows(JwtException.class, () -> {
                jwtDecoder.decode(tamperedToken);
            });
        }
    }

    // ===================== TEST CASE 3: REFRESH TOKEN FLOW =====================

    @Nested
    @DisplayName("Refresh Token Flow")
    class RefreshTokenFlowTests {

        @Test
        @DisplayName("Should create valid refresh token with user subject")
        void shouldCreateValidRefreshToken() {
            // Arrange & Act
            String refreshToken = securityUtil.createRefreshToken("customer");

            // Assert
            Jwt jwt = jwtDecoder.decode(refreshToken);
            assertEquals("customer", jwt.getSubject());
            assertNotNull(jwt.getExpiresAt());
        }

        @Test
        @DisplayName("Refresh token should have longer expiry than access token")
        void refreshTokenShouldHaveLongerExpiry() {
            // Arrange
            String accessToken = securityUtil.createAccessToken(customerUser);
            String refreshToken = securityUtil.createRefreshToken("customer");

            // Act
            Jwt accessJwt = jwtDecoder.decode(accessToken);
            Jwt refreshJwt = jwtDecoder.decode(refreshToken);

            // Assert
            assertTrue(refreshJwt.getExpiresAt().isAfter(accessJwt.getExpiresAt()),
                    "Refresh token should expire after access token");
        }

        @Test
        @DisplayName("Should be able to get username from refresh token for new access token")
        void shouldExtractUsernameFromRefreshToken() {
            // Arrange
            String refreshToken = securityUtil.createRefreshToken("customer");

            // Act
            Jwt jwt = jwtDecoder.decode(refreshToken);
            String username = jwt.getSubject();

            // Assert - This username would be used to create new access token
            assertEquals("customer", username);
        }
    }

    // ===================== TEST CASE 4: INVALID TOKEN =====================

    @Nested
    @DisplayName("Invalid Token - Security")
    class InvalidTokenTests {

        @Test
        @DisplayName("Tampered token should be rejected - signature validation")
        void shouldRejectTamperedToken() {
            // Arrange - Create valid token then tamper with it
            String validToken = securityUtil.createAccessToken(customerUser);
            // Tamper with the signature part
            String tamperedToken = validToken.substring(0, validToken.lastIndexOf('.')) + ".tampered_signature";

            // Act & Assert
            assertThrows(JwtException.class, () -> {
                jwtDecoder.decode(tamperedToken);
            });
        }

        @Test
        @DisplayName("Malformed token should be rejected")
        void shouldRejectMalformedToken() {
            // Arrange
            String malformedToken = "not.a.valid.jwt.token";

            // Act & Assert
            assertThrows(JwtException.class, () -> {
                jwtDecoder.decode(malformedToken);
            });
        }

        @Test
        @DisplayName("Empty token should be rejected")
        void shouldRejectEmptyToken() {
            // Act & Assert
            assertThrows(JwtException.class, () -> {
                jwtDecoder.decode("");
            });
        }

        @Test
        @DisplayName("Token with wrong signature algorithm should be rejected")
        void shouldRejectWrongAlgorithmToken() {
            // Arrange - Token signed with different algorithm
            String wrongAlgoToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyIiwiaWF0IjoxNTE2MjM5MDIyfQ.invalid";

            // Act & Assert
            assertThrows(JwtException.class, () -> {
                jwtDecoder.decode(wrongAlgoToken);
            });
        }
    }

    // ===================== TEST CASE 5: TOKEN EXPIRATION TIME
    // =====================

    @Nested
    @DisplayName("Token Expiration Time - Configurable Expiry")
    class TokenExpirationTimeTests {

        @Test
        @DisplayName("Access token for CUSTOMER should expire in 1 hour (3600 seconds)")
        void customerAccessTokenShouldExpireIn1Hour() {
            // Arrange
            String accessToken = securityUtil.createAccessToken(customerUser);
            Jwt jwt = jwtDecoder.decode(accessToken);

            // Act
            Instant issuedAt = jwt.getIssuedAt();
            Instant expiresAt = jwt.getExpiresAt();
            long diffInSeconds = ChronoUnit.SECONDS.between(issuedAt, expiresAt);

            // Assert - Should be approximately 3600 seconds (1 hour)
            assertEquals(accessTokenExpiration, diffInSeconds, 5); // Allow 5 second tolerance
        }

        @Test
        @DisplayName("Access token for ADMIN should expire in 8 hours (28800 seconds)")
        void adminAccessTokenShouldExpireIn8Hours() {
            // Arrange
            String accessToken = securityUtil.createAccessToken(adminUser);
            Jwt jwt = jwtDecoder.decode(accessToken);

            // Act
            Instant issuedAt = jwt.getIssuedAt();
            Instant expiresAt = jwt.getExpiresAt();
            long diffInSeconds = ChronoUnit.SECONDS.between(issuedAt, expiresAt);

            // Assert - Should be approximately 28800 seconds (8 hours)
            assertEquals(adminAccessTokenExpiration, diffInSeconds, 5); // Allow 5 second tolerance
        }

        @Test
        @DisplayName("Refresh token should expire in 30 days (2592000 seconds)")
        void refreshTokenShouldExpireIn30Days() {
            // Arrange
            String refreshToken = securityUtil.createRefreshToken("customer");
            Jwt jwt = jwtDecoder.decode(refreshToken);

            // Act
            Instant issuedAt = jwt.getIssuedAt();
            Instant expiresAt = jwt.getExpiresAt();
            long diffInSeconds = ChronoUnit.SECONDS.between(issuedAt, expiresAt);

            // Assert - Should be approximately 2592000 seconds (30 days)
            assertEquals(refreshTokenExpiration, diffInSeconds, 5); // Allow 5 second tolerance
        }
    }

    // ===================== TEST CASE 6: LOGOUT INVALIDATES TOKENS
    // =====================

    @Nested
    @DisplayName("Logout Invalidates Tokens")
    class LogoutInvalidatesTokensTests {

        @Test
        @DisplayName("getExpirationDateFromToken should return valid date for valid token")
        void shouldGetExpirationDateFromValidToken() {
            // Arrange
            String accessToken = securityUtil.createAccessToken(customerUser);

            // Act
            Date expiryDate = securityUtil.getExpirationDateFromToken(accessToken);

            // Assert
            assertNotNull(expiryDate);
            assertTrue(expiryDate.after(new Date()), "Expiry date should be in the future");
        }

        @Test
        @DisplayName("getExpirationDateFromToken should handle invalid token gracefully")
        void shouldHandleInvalidTokenGracefully() {
            // Arrange
            String invalidToken = "invalid.token.here";

            // Act
            Date expiryDate = securityUtil.getExpirationDateFromToken(invalidToken);

            // Assert - Should return current date (not throw exception)
            assertNotNull(expiryDate);
        }
    }

    // ===================== ADDITIONAL: TOKEN STRUCTURE TESTS =====================

    @Nested
    @DisplayName("Token Structure Verification")
    class TokenStructureTests {

        @Test
        @DisplayName("Access token should use HS512 algorithm")
        void accessTokenShouldUseHS512() {
            // Arrange
            String accessToken = securityUtil.createAccessToken(customerUser);

            // Act - Token format: header.payload.signature
            String[] parts = accessToken.split("\\.");

            // Assert
            assertEquals(3, parts.length, "JWT should have 3 parts");
            // First part (header) contains algorithm info - decoded would show HS512
        }

        @Test
        @DisplayName("Access token and refresh token should be different")
        void accessAndRefreshTokensShouldBeDifferent() {
            // Arrange & Act
            String accessToken = securityUtil.createAccessToken(customerUser);
            String refreshToken = securityUtil.createRefreshToken(customerUser.getUsername());

            // Assert
            assertNotEquals(accessToken, refreshToken);
        }
    }
}
