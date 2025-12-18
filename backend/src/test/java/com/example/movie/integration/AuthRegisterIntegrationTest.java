package com.example.movie.integration;

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
public class AuthRegisterIntegrationTest extends TestContainersConfig {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void register_withValidData_returnsCreated() {
        RegisterRequest req = new RegisterRequest();
        req.setUsername("testuser");
        req.setEmail("testuser@example.com");
        req.setPassword("Test@12345");
        req.setAddress("123 Test St");
        req.setPhoneNumber("0123456789");

        ResponseEntity<ApiResponse> response = restTemplate.postForEntity("/api/v1/auth/register", req, ApiResponse.class);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("success", response.getBody().getStatus());
    }

    @Test
    void register_withExistingEmail_returnsConflict() {
        RegisterRequest first = new RegisterRequest();
        first.setUsername("dupuser1");
        first.setEmail("dup@example.com");
        first.setPassword("Test@12345");
        first.setAddress("123 Test St");
        first.setPhoneNumber("0123456780");
        restTemplate.postForEntity("/api/v1/auth/register", first, ApiResponse.class);

        RegisterRequest duplicateEmail = new RegisterRequest();
        duplicateEmail.setUsername("dupuser2");
        duplicateEmail.setEmail("dup@example.com");
        duplicateEmail.setPassword("Test@12345");
        duplicateEmail.setAddress("456 Test St");
        duplicateEmail.setPhoneNumber("0123456781");

        ResponseEntity<ApiResponse> response = restTemplate.postForEntity("/api/v1/auth/register", duplicateEmail, ApiResponse.class);

        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("error", response.getBody().getStatus());
        assertEquals("EMAIL_ALREADY_EXISTS", response.getBody().getErrorCode());
    }
}
