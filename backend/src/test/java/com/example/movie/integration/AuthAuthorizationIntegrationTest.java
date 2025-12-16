package com.example.movie.integration;

import com.example.movie.dto.auth.LoginRequest;
import com.example.movie.dto.auth.RegisterRequest;
import com.example.movie.dto.response.ApiResponse;
import com.example.movie.model.User;
import com.example.movie.repository.UserRepository;
import com.example.movie.testutil.TestContainersConfig;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class AuthAuthorizationIntegrationTest extends TestContainersConfig {

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    void unauthenticated_accessProtectedEndpoint_returnsUnauthorized() {
        ResponseEntity<ApiResponse> response = restTemplate.getForEntity("/api/v1/bookings", ApiResponse.class);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("error", response.getBody().getStatus());
    }

    @Test
    void accessProtectedEndpoint_withInvalidToken_returnsUnauthorized() {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth("invalid-token");
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<ApiResponse> response = restTemplate.exchange("/api/v1/bookings", HttpMethod.GET, entity, ApiResponse.class);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("error", response.getBody().getStatus());
    }

    @Test
    void customer_cannotAccessAdminEndpoint_returnsForbidden() {
        // register customer
        RegisterRequest reg = new RegisterRequest();
        reg.setUsername("custuser");
        reg.setEmail("custuser@example.com");
        reg.setPassword("Cust@12345");
        reg.setAddress("Addr");
        reg.setPhoneNumber("0111111111");
        restTemplate.postForEntity("/api/v1/auth/register", reg, ApiResponse.class);

        // login
        LoginRequest login = new LoginRequest();
        login.setUsername("custuser");
        login.setPassword("Cust@12345");
        ResponseEntity<ApiResponse> loginResp = restTemplate.postForEntity("/api/v1/auth/login", login, ApiResponse.class);
        assertEquals(HttpStatus.OK, loginResp.getStatusCode());
        Map data = (Map) loginResp.getBody().getData();
        assertNotNull(data.get("accessToken"));
        String token = (String) data.get("accessToken");

        // attempt to create movie (admin-only)
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(token);

        Map<String, Object> movie = new HashMap<>();
        movie.put("title", "Test Movie");
        movie.put("director", "Dir");
        movie.put("actors", "A1,A2");
        movie.put("genres", "Drama");
        movie.put("releaseDate", LocalDate.now().toString());
        movie.put("duration", "120");
        movie.put("language", "EN");
        movie.put("rated", "PG");
        movie.put("description", "desc");

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(movie, headers);

        ResponseEntity<String> resp = restTemplate.exchange("/api/v1/movies", HttpMethod.POST, entity, String.class);
        assertEquals(HttpStatus.FORBIDDEN, resp.getStatusCode());
    }

    @Test
    void admin_canAccessAdminEndpoint_returnsCreated() {
        String unique = UUID.randomUUID().toString().substring(0, 8);
        String phoneNumber = String.format("09%08d", ThreadLocalRandom.current().nextInt(0, 100_000_000));

        User admin = new User();
        admin.setUsername("admin_" + unique);
        admin.setEmail("admin_" + unique + "@example.com");
        admin.setPassword(passwordEncoder.encode("Admin@12345"));
        admin.setPhoneNumber(phoneNumber);
        admin.setAddress("Admin St");
        admin.setRole(User.UserRole.ADMIN);
        admin.setIsActive(true);
        userRepository.save(admin);

        LoginRequest login = new LoginRequest();
        login.setUsername(admin.getUsername());
        login.setPassword("Admin@12345");
        ResponseEntity<ApiResponse> loginResp = restTemplate.postForEntity("/api/v1/auth/login", login, ApiResponse.class);
        assertEquals(HttpStatus.OK, loginResp.getStatusCode());
        Map data = (Map) loginResp.getBody().getData();
        String token = (String) data.get("accessToken");
        assertNotNull(token);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(token);

        Map<String, Object> movie = new HashMap<>();
        movie.put("title", "Admin Movie " + unique);
        movie.put("director", "Dir");
        movie.put("actors", "A1,A2");
        movie.put("genres", "Drama");
        movie.put("releaseDate", LocalDate.now().toString());
        movie.put("duration", "120");
        movie.put("language", "EN");
        movie.put("rated", "PG");
        movie.put("description", "desc");

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(movie, headers);

        ResponseEntity<ApiResponse> resp = restTemplate.exchange("/api/v1/movies", HttpMethod.POST, entity, ApiResponse.class);
        assertEquals(HttpStatus.CREATED, resp.getStatusCode());
        assertNotNull(resp.getBody());
        assertEquals("success", resp.getBody().getStatus());
    }
}
