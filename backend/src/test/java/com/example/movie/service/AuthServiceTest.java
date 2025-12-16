package com.example.movie.service;

import com.example.movie.dto.auth.AuthResponse;
import com.example.movie.dto.auth.LoginRequest;
import com.example.movie.dto.auth.RegisterRequest;
import com.example.movie.dto.user.UserResponse;
import com.example.movie.exception.*;
import com.example.movie.model.InvalidatedToken;
import com.example.movie.model.User;
import com.example.movie.repository.InvalidatedTokenRepository;
import com.example.movie.repository.UserRepository;
import com.example.movie.security.SecurityUtil;
import com.example.movie.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Date;
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
    @Mock
    private InvalidatedTokenRepository invalidatedTokenRepository;
    private User user;
    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;

    private User adminUser; // Admin (MỚI)
    private LoginRequest adminLoginRequest; // Admin Login (MỚI)

    private User disabledUser;
    private LoginRequest disabledUserLoginRequest;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setUsername("testuser");
        user.setEmail("test@example.com");
        user.setPassword("encodedPassword");
        user.setRole(User.UserRole.CUSTOMER);
        user.setIsActive(true); // User is active by default
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        registerRequest = new RegisterRequest();
        registerRequest.setUsername("testuser");
        registerRequest.setEmail("test@example.com");
        registerRequest.setPassword("password");
        registerRequest.setPhoneNumber("1234567890");
        registerRequest.setAddress("123 Test Address");

        loginRequest = new LoginRequest();
        loginRequest.setUsername("testuser");
        loginRequest.setPassword("password");

        adminUser = new User();
        adminUser.setId(2L);
        adminUser.setUsername("admin");
        adminUser.setEmail("admin@example.com");
        adminUser.setPassword("encodedAdminPass");
        adminUser.setRole(User.UserRole.ADMIN); // Role ADMIN

        adminLoginRequest = new LoginRequest();
        adminLoginRequest.setUsername("admin");
        adminLoginRequest.setPassword("adminPassword");

        // Tạo một user bị vô hiệu hóa
        disabledUser = new User();
        disabledUser.setUsername("disabledUser");
        disabledUser.setPassword("encodedPass");
        disabledUser.setIsActive(false); // <--- QUAN TRỌNG: Tài khoản bị khóa
        disabledUser.setRole(User.UserRole.CUSTOMER);
        disabledUserLoginRequest = new LoginRequest();
        disabledUserLoginRequest.setUsername("disabledUser");
        disabledUserLoginRequest.setPassword("encodedPass");

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

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);

        // "Kiểm tra xem hàm save có được gọi không, và nếu có, hãy bắt lấy cái tham số
        // truyền vào đó cho tôi"
        verify(userRepository).save(userCaptor.capture());
        // lấy giá trị
        User capturedUser = userCaptor.getValue();
        // Assert
        assertEquals(User.UserRole.CUSTOMER, capturedUser.getRole(), "Logic sai! Role phải là CUSTOMER");
        assertEquals("encodedPassword", capturedUser.getPassword(), "Logic sai! Password chưa được mã hóa");
        assertEquals("testuser", capturedUser.getUsername());

        // Note: createdAt is handled by @CreationTimestamp annotation at runtime
        // (Hibernate)
        // In unit tests with mocks, this field won't be automatically set

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

    // ===================== USER REGISTRATION TEST CASES =====================

    /**
     * Test Case: Duplicate username prevention
     * Mô tả: Đăng ký với username đã tồn tại
     * Kết quả mong đợi: Hệ thống hiển thị "Username already taken"
     */
    @Test
    @DisplayName("Register - Username already exists - Should throw UsernameAlreadyExistException")
    void register_WhenUsernameExists_ThrowsUsernameAlreadyExistException() {
        // Arrange
        when(userRepository.existsByUsername("testuser")).thenReturn(true);

        // Act & Assert
        UsernameAlreadyExistException exception = assertThrows(
                UsernameAlreadyExistException.class,
                () -> authService.register(registerRequest));

        // Verify exception message
        assertEquals("Username already exists!", exception.getMessage());

        // Verify that email check and save are never called (short-circuit)
        verify(userRepository, never()).existsByEmail(any());
        verify(userRepository, never()).save(any(User.class));
    }

    /**
     * Test Case: Default role assignment
     * Mô tả: User mới đăng ký phải được gán role CUSTOMER mặc định
     * Kết quả mong đợi: Role trong database = CUSTOMER
     */
    @Test
    @DisplayName("Register - Default role assignment - Should assign CUSTOMER role automatically")
    void register_ShouldAssignDefaultCustomerRole() {
        // Arrange
        when(userRepository.existsByUsername("testuser")).thenReturn(false);
        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(passwordEncoder.encode(any())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(user);

        // Act
        authService.register(registerRequest);

        // Assert - Capture và kiểm tra User được lưu
        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());

        User capturedUser = userCaptor.getValue();
        assertEquals(User.UserRole.CUSTOMER, capturedUser.getRole(),
                "Người dùng mới phải được gán role CUSTOMER mặc định");
    }

    /**
     * Test Case: Register with valid data - Verify all data saved correctly
     * Mô tả: Kiểm tra tất cả thông tin từ request được lưu đúng
     * Kết quả mong đợi: username, email, password (encoded), phone, address đều
     * được lưu
     */
    @Test
    @DisplayName("Register - Valid data - Should save all request data correctly")
    void register_ShouldSaveAllRequestData() {
        // Arrange
        RegisterRequest request = new RegisterRequest();
        request.setUsername("newuser");
        request.setEmail("newuser@example.com");
        request.setPassword("StrongPass123");
        request.setPhoneNumber("0987654321");
        request.setAddress("123 Main Street, City");

        User savedUser = new User();
        savedUser.setId(2L);
        savedUser.setUsername("newuser");
        savedUser.setEmail("newuser@example.com");
        savedUser.setPassword("encodedStrongPass123");
        savedUser.setPhoneNumber("0987654321");
        savedUser.setAddress("123 Main Street, City");
        savedUser.setRole(User.UserRole.CUSTOMER);

        when(userRepository.existsByUsername("newuser")).thenReturn(false);
        when(userRepository.existsByEmail("newuser@example.com")).thenReturn(false);
        when(passwordEncoder.encode("StrongPass123")).thenReturn("encodedStrongPass123");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        // Act
        UserResponse result = authService.register(request);

        // Assert - Verify captured user data
        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());

        User capturedUser = userCaptor.getValue();
        assertAll("Kiểm tra tất cả các trường được lưu đúng",
                () -> assertEquals("newuser", capturedUser.getUsername()),
                () -> assertEquals("newuser@example.com", capturedUser.getEmail()),
                () -> assertEquals("encodedStrongPass123", capturedUser.getPassword()),
                () -> assertEquals("0987654321", capturedUser.getPhoneNumber()),
                () -> assertEquals("123 Main Street, City", capturedUser.getAddress()),
                () -> assertEquals(User.UserRole.CUSTOMER, capturedUser.getRole()));

        // Verify response contains correct data
        assertNotNull(result);
        assertEquals("newuser", result.getUsername());
        assertEquals("newuser@example.com", result.getEmail());
    }

    /**
     * Test Case: Password strength/encoding validation
     * Mô tả: Kiểm tra password được mã hóa đúng cách trước khi lưu
     * Kết quả mong đợi: Password phải được encode, không lưu raw password
     */
    @Test
    @DisplayName("Register - Password encoding - Should encode password before saving")
    void register_ShouldEncodePassword() {
        // Arrange
        String rawPassword = "MySecretPass123";
        String encodedPassword = "bcrypt$2a$10$encodedPasswordHash";

        registerRequest.setPassword(rawPassword);

        when(userRepository.existsByUsername(any())).thenReturn(false);
        when(userRepository.existsByEmail(any())).thenReturn(false);
        when(passwordEncoder.encode(rawPassword)).thenReturn(encodedPassword);
        when(userRepository.save(any(User.class))).thenReturn(user);

        // Act
        authService.register(registerRequest);

        // Assert
        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());

        User capturedUser = userCaptor.getValue();

        // Verify password was encoded
        verify(passwordEncoder).encode(rawPassword);
        assertEquals(encodedPassword, capturedUser.getPassword(),
                "Password phải được mã hóa trước khi lưu");
        assertNotEquals(rawPassword, capturedUser.getPassword(),
                "Raw password không được lưu trực tiếp vào database");
    }

    /**
     * Test Case: Both username and email exist
     * Mô tả: Username đã tồn tại (kiểm tra trước email)
     * Kết quả mong đợi: Throw UsernameAlreadyExistException (short-circuit)
     */
    @Test
    @DisplayName("Register - Username checked first - Should validate username before email")
    void register_ShouldCheckUsernameBeforeEmail() {
        // Arrange - Cả username và email đều tồn tại
        when(userRepository.existsByUsername("testuser")).thenReturn(true);
        // Email check should NOT be called due to short-circuit

        // Act & Assert
        assertThrows(UsernameAlreadyExistException.class,
                () -> authService.register(registerRequest));

        // Verify username was checked first
        verify(userRepository).existsByUsername("testuser");
        // Verify email was NOT checked (short-circuit)
        verify(userRepository, never()).existsByEmail(any());
    }

    // ----------------- CÁC TEST CASE VỀ FORMAT (ĐANG THIẾU) -----------------

    @Test
    @DisplayName("Register - Format: Should throw exception when Email is invalid")
    void shouldThrowException_WhenEmailFormatIsInvalid() {
        // Arrange
        registerRequest.setEmail("email-khong-hop-le"); // Không có @ và domain

        // Act & Assert
        // Giả sử Service ném IllegalArgumentException khi sai format
        Exception exception = assertThrows(RuntimeException.class, () -> authService.register(registerRequest));

        // Kiểm tra message lỗi (nếu service có trả về message cụ thể)
        // assertTrue(exception.getMessage().contains("format"));
    }

    @Test
    @DisplayName("Register - Format: Should throw exception when Phone Number is invalid")
    void shouldThrowException_WhenPhoneFormatIsInvalid() {
        // Arrange
        registerRequest.setPhoneNumber("123"); // Quá ngắn, không phải sđt chuẩn

        // Act & Assert
        assertThrows(RuntimeException.class, () -> authService.register(registerRequest));
    }

    @Test
    @DisplayName("Register - Format: Should throw exception when Password is too weak")
    void shouldThrowException_WhenPasswordIsWeak() {
        // Arrange
        registerRequest.setPassword("123"); // Ngắn hơn 8 ký tự

        // Act & Assert
        assertThrows(RuntimeException.class, () -> authService.register(registerRequest));
    }

    @Test
    @DisplayName("Register - Validation: Should throw exception when required fields are empty or null")
    void shouldThrowException_WhenRequiredFieldsAreMissing() {
        // 1. Arrange - Tạo request với các trường bị thiếu/rỗng
        RegisterRequest invalidRequest = new RegisterRequest();
        invalidRequest.setUsername(""); // Rỗng
        invalidRequest.setEmail(null);  // Null
        invalidRequest.setPassword("  "); // Chỉ có khoảng trắng

        // 2. Act & Assert
        // Mong đợi Service ném ra lỗi (Ví dụ: IllegalArgumentException hoặc RuntimeException)
        assertThrows(RuntimeException.class, () -> authService.register(invalidRequest));

        // 3. Verify - Quan trọng: Đảm bảo không bao giờ gọi hàm save vào DB
        verify(userRepository, never()).save(any());
    }

    // Login
    @Test
    @DisplayName("Should return JWT tokens when CUSTOMER logs in with valid credentials")
    void shouldReturnTokens_WhenCustomerLoginSuccess() {
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
    @DisplayName("Should login successfully when ADMIN logs in with valid credentials")
    void shouldLoginSuccess_WhenAdminCredentialsAreValid() {
        // Arrange
        when(userRepository.findByUsername("admin")).thenReturn(Optional.of(adminUser));
        when(passwordEncoder.matches("adminPassword", "encodedAdminPass")).thenReturn(true);
        when(securityUtil.createAccessToken(adminUser)).thenReturn("admin-access-token");
        when(securityUtil.createRefreshToken("admin")).thenReturn("admin-refresh-token");

        // Act
        AuthResponse result = authService.login(adminLoginRequest);

        // Assert
        assertNotNull(result);
        assertEquals("admin-access-token", result.getAccessToken());
        assertEquals("admin-refresh-token", result.getRefreshToken());

        // Kiểm tra xem hàm tạo token có thực sự được gọi với object adminUser không
        verify(securityUtil).createAccessToken(adminUser);
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
    @DisplayName("Should throw AccountDisabledException when login with disabled account")
    void shouldThrowException_WhenAccountIsDisabled() {
        // 1. Arrange
        disabledUserLoginRequest.setPassword("password");
        // Mock: Tìm thấy user, Password đúng
        when(userRepository.findByUsername("disabledUser")).thenReturn(Optional.of(disabledUser));
        when(passwordEncoder.matches("password", "encodedPass")).thenReturn(true);

        // 2. Act & Assert
        // Mong đợi hệ thống ném ra lỗi AccountDisabledException
        AccountDisabledException exception = assertThrows(
                AccountDisabledException.class,
                () -> authService.login(disabledUserLoginRequest));

        assertEquals("Account disabled", exception.getMessage());

        // Đảm bảo không có token nào được tạo ra
        verify(securityUtil, never()).createAccessToken(any());
    }

    // ===================== SESSION CREATION TEST CASES =====================

    /**
     * Test Case: Session creation
     * Mô tả: Successful login → JWT access token and refresh token generated
     * Kết quả mong đợi: Cả access token và refresh token đều được tạo và không null
     */
    @Test
    @DisplayName("Session Creation - Should generate both access and refresh tokens on successful login")
    void shouldGenerateBothTokens_WhenLoginSuccessful() {
        // Arrange
        user.setIsActive(true);
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password", "encodedPassword")).thenReturn(true);
        when(securityUtil.createAccessToken(user)).thenReturn("generated-access-token");
        when(securityUtil.createRefreshToken("testuser")).thenReturn("generated-refresh-token");

        // Act
        AuthResponse result = authService.login(loginRequest);

        // Assert - Kiểm tra cả 2 token đều được tạo
        assertNotNull(result.getAccessToken(), "Access token phải được tạo");
        assertNotNull(result.getRefreshToken(), "Refresh token phải được tạo");
        assertFalse(result.getAccessToken().isEmpty(), "Access token không được rỗng");
        assertFalse(result.getRefreshToken().isEmpty(), "Refresh token không được rỗng");

        // Verify cả 2 method tạo token đều được gọi
        verify(securityUtil).createAccessToken(user);
        verify(securityUtil).createRefreshToken("testuser");
    }

    /**
     * Test Case: Token structure verification
     * Mô tả: Kiểm tra access token và refresh token có cấu trúc khác nhau
     * Kết quả mong đợi: Tokens có giá trị khác nhau
     */
    @Test
    @DisplayName("Token Structure - Access token and refresh token should be different")
    void shouldReturnDifferentTokens_WhenLoginSuccessful() {
        // Arrange
        user.setIsActive(true);
        String accessToken = "eyJhbGciOiJSUzI1NiJ9.access.signature";
        String refreshToken = "eyJhbGciOiJSUzI1NiJ9.refresh.signature";

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password", "encodedPassword")).thenReturn(true);
        when(securityUtil.createAccessToken(user)).thenReturn(accessToken);
        when(securityUtil.createRefreshToken("testuser")).thenReturn(refreshToken);

        // Act
        AuthResponse result = authService.login(loginRequest);

        // Assert - Access token và refresh token phải khác nhau
        assertNotEquals(result.getAccessToken(), result.getRefreshToken(),
                "Access token và Refresh token phải khác nhau");
    }

    /**
     * Test Case: Login response should contain user info
     * Mô tả: Response phải chứa đầy đủ thông tin user
     */
    @Test
    @DisplayName("Session Creation - Response should contain complete user information")
    void shouldReturnCompleteUserInfo_WhenLoginSuccessful() {
        // Arrange
        user.setIsActive(true);
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password", "encodedPassword")).thenReturn(true);
        when(securityUtil.createAccessToken(user)).thenReturn("access-token");
        when(securityUtil.createRefreshToken("testuser")).thenReturn("refresh-token");

        // Act
        AuthResponse result = authService.login(loginRequest);

        // Assert - Response chứa đầy đủ thông tin user
        assertAll("Response phải chứa đầy đủ thông tin user",
                () -> assertEquals(user.getId(), result.getId()),
                () -> assertEquals(user.getUsername(), result.getUsername()),
                () -> assertEquals(user.getEmail(), result.getEmail()),
                () -> assertEquals(user.getRole().name(), result.getRole()),
                () -> assertNotNull(result.getAccessToken()),
                () -> assertNotNull(result.getRefreshToken()));
    }

    /**
     * Test Case: Refresh token should generate new access token
     * Mô tả: Refresh token có thể được sử dụng để tạo access token mới
     */
    @Test
    @DisplayName("Token Refresh - Should generate new access token from valid refresh token")
    void shouldGenerateNewAccessToken_WhenRefreshTokenIsValid() {
        // Arrange
        String validRefreshToken = "valid-refresh-token";
        String newAccessToken = "new-access-token";

        // Mock JWT decoder
        org.springframework.security.oauth2.jwt.Jwt mockJwt = mock(org.springframework.security.oauth2.jwt.Jwt.class);
        org.springframework.security.oauth2.jwt.JwtDecoder mockDecoder = mock(
                org.springframework.security.oauth2.jwt.JwtDecoder.class);

        when(mockJwt.getSubject()).thenReturn("testuser");
        when(mockDecoder.decode(validRefreshToken)).thenReturn(mockJwt);
        when(securityUtil.getJwtDecoder()).thenReturn(mockDecoder);
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(securityUtil.createAccessToken(user)).thenReturn(newAccessToken);

        // Act
        AuthResponse result = authService.refreshToken(validRefreshToken);

        // Assert
        assertEquals(newAccessToken, result.getAccessToken());
        assertEquals(validRefreshToken, result.getRefreshToken()); // Refresh token giữ nguyên
        verify(securityUtil).createAccessToken(user);
    }
    @Test
    @DisplayName("Logout - Should invalidate token by saving to blacklist")
    void logout_ShouldInvalidateToken_WhenTokenIsValid() {
        // Arrange
        String tokenValue = "eyJhbGciOiJIUzI1NiJ9.valid.token";
        String authHeader = "Bearer " + tokenValue;

        // Giả lập lấy được ngày hết hạn từ token
        Date mockExpiryDate = new Date();
        when(securityUtil.getExpirationDateFromToken(tokenValue)).thenReturn(mockExpiryDate);

        // Act
        authService.logout(authHeader);

        // Assert
        // Quan trọng: Kiểm tra xem hàm save của invalidatedTokenRepository có được gọi không?
        verify(invalidatedTokenRepository, times(1)).save(any(InvalidatedToken.class));
    }

    @Test
    @DisplayName("Logout - Should do nothing when Authorization header is invalid")
    void logout_ShouldDoNothing_WhenHeaderIsInvalid() {
        // 1. Arrange - Case 1: Header không có chữ Bearer
        String invalidHeader = "InvalidHeaderString";

        // 2. Act
        authService.logout(invalidHeader);

        // 3. Assert
        // Đảm bảo không có gì được lưu vào DB
        verify(invalidatedTokenRepository, never()).save(any());

        // 1. Arrange - Case 2: Header là null
        authService.logout(null);

        // 3. Assert (Lại)
        verify(invalidatedTokenRepository, never()).save(any());
    }
}
