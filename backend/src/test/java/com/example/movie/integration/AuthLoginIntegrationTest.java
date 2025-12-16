package com.example.movie.integration;

import com.example.movie.dto.auth.AuthResponse;
import com.example.movie.dto.auth.LoginRequest;
import com.example.movie.dto.auth.RegisterRequest;
import com.example.movie.dto.response.ApiResponse;
import com.example.movie.testutil.TestContainersConfig;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class AuthLoginIntegrationTest extends TestContainersConfig {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void login_withValidCredentials_returnsAuthResponse() {
        // register user first
        RegisterRequest reg = new RegisterRequest();
        reg.setUsername("loginuser");
        reg.setEmail("loginuser@example.com");
        reg.setPassword("Login@12345");
        reg.setAddress("Addr");
        reg.setPhoneNumber("0987654321");
        restTemplate.postForEntity("/api/v1/auth/register", reg, ApiResponse.class);

        // login
        LoginRequest login = new LoginRequest();
        login.setUsername("loginuser");
        login.setPassword("Login@12345");

        ResponseEntity<ApiResponse> response = restTemplate.postForEntity("/api/v1/auth/login", login, ApiResponse.class);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        Object data = response.getBody().getData();
        assertNotNull(data);
    }

    @Test
    void login_withInvalidPassword_returnsUnauthorized() {
        RegisterRequest reg = new RegisterRequest();
        reg.setUsername("invalidpassuser");
        reg.setEmail("invalidpass@example.com");
        reg.setPassword("Right@12345");
        reg.setAddress("Addr");
        reg.setPhoneNumber("0999999999");
        restTemplate.postForEntity("/api/v1/auth/register", reg, ApiResponse.class);

        LoginRequest login = new LoginRequest();
        login.setUsername("invalidpassuser");
        login.setPassword("WrongPassword");

        ResponseEntity<ApiResponse> response = restTemplate.postForEntity("/api/v1/auth/login", login, ApiResponse.class);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("error", response.getBody().getStatus());
        assertEquals("INVALID_CREDENTIAL", response.getBody().getErrorCode());
    }
}
