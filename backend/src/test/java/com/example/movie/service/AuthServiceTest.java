package com.example.movie.service;

import com.example.movie.dto.auth.AuthResponse;
import com.example.movie.dto.auth.LoginRequest;
import com.example.movie.dto.auth.RegisterRequest;
import com.example.movie.dto.user.UserResponse;
import com.example.movie.exception.EmailAlreadyExistException;
import com.example.movie.exception.InvalidCredentialException;
import com.example.movie.exception.UserNotFoundException;
import com.example.movie.exception.UsernameAlreadyExistException;
import com.example.movie.model.User;
import com.example.movie.repository.UserRepository;
import com.example.movie.security.SecurityUtil;
import com.example.movie.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;

import java.time.LocalDateTime;
import java.time.Instant;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private SecurityUtil securityUtil;

    @InjectMocks
    private AuthServiceImpl authService;

    private User user;
    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setUsername("testuser");
        user.setEmail("test@example.com");
        user.setPassword("encodedPassword");
        user.setRole(User.UserRole.CUSTOMER);
        user.setPhoneNumber("1234567890");
        user.setAddress("123 Street");
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        registerRequest = new RegisterRequest();
        registerRequest.setUsername("testuser");
        registerRequest.setEmail("test@example.com");
        registerRequest.setPassword("password");
        registerRequest.setPhoneNumber("1234567890");

        loginRequest = new LoginRequest();
        loginRequest.setUsername("testuser");
        loginRequest.setPassword("password");
    }

    @Test
    void register_Success() {
        // Arrange
        when(userRepository.existsByUsername("testuser")).thenReturn(false);
        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password")).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(user);

        // Act
        UserResponse result = authService.register(registerRequest);

        // Assert
        assertNotNull(result);
        assertEquals("testuser", result.getUsername());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void register_WhenEmailExists_ThrowsException() {
        // Arrange
        when(userRepository.existsByUsername("testuser")).thenReturn(false);
        when(userRepository.existsByEmail("test@example.com")).thenReturn(true);

        // Act & Assert
        assertThrows(EmailAlreadyExistException.class, () -> authService.register(registerRequest));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void register_WhenUsernameExists_ThrowsException() {
        // Arrange
        when(userRepository.existsByUsername("testuser")).thenReturn(true);

        // Act & Assert
        assertThrows(UsernameAlreadyExistException.class, () -> authService.register(registerRequest));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void login_Success() {
        // Arrange
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password", "encodedPassword")).thenReturn(true);
        when(securityUtil.createAccessToken(user)).thenReturn("accessToken");
        when(securityUtil.createRefreshToken("testuser")).thenReturn("refreshToken");

        // Act
        AuthResponse result = authService.login(loginRequest);

        // Assert
        assertNotNull(result);
        assertEquals("accessToken", result.getAccessToken());
        assertEquals("refreshToken", result.getRefreshToken());
    }

    @Test
    void login_InvalidPassword_ThrowsException() {
        // Arrange
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password", "encodedPassword")).thenReturn(false);

        // Act & Assert
        assertThrows(InvalidCredentialException.class, () -> authService.login(loginRequest));
    }

    @Test
    void login_UserNotFound_ThrowsException() {
        // Arrange
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(UserNotFoundException.class, () -> authService.login(loginRequest));
    }

    @Test
    void refreshToken_WithValidToken_ReturnsNewAccessToken() {
        // Arrange
        JwtDecoder jwtDecoder = mock(JwtDecoder.class);
        when(securityUtil.getJwtDecoder()).thenReturn(jwtDecoder);

        Instant now = Instant.now();
        Jwt jwt = new Jwt(
                "refreshTokenValue",
                now,
                now.plusSeconds(3600),
                Map.of("alg", "HS512"),
                Map.of("sub", "testuser")
        );
        when(jwtDecoder.decode("validRefreshToken")).thenReturn(jwt);
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(securityUtil.createAccessToken(user)).thenReturn("newAccessToken");

        // Act
        AuthResponse response = authService.refreshToken("validRefreshToken");

        // Assert
        assertNotNull(response);
        assertEquals("newAccessToken", response.getAccessToken());
        assertEquals("validRefreshToken", response.getRefreshToken());
        assertEquals("testuser", response.getUsername());
    }

    @Test
    void refreshToken_WithInvalidToken_ThrowsRuntimeException() {
        // Arrange
        JwtDecoder jwtDecoder = mock(JwtDecoder.class);
        when(securityUtil.getJwtDecoder()).thenReturn(jwtDecoder);
        when(jwtDecoder.decode("badToken")).thenThrow(new JwtException("invalid"));

        // Act & Assert
        RuntimeException ex = assertThrows(RuntimeException.class, () -> authService.refreshToken("badToken"));
        assertEquals("Invalid refresh token", ex.getMessage());
    }
}
