package com.example.movie.controller;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Controller Validation Tests
 * 
 * Test Cases từ bảng test:
 * 4. Email format validation - Enter invalid email "notanemail" → System shows
 * format error
 * 5. Password strength validation - Enter weak password "123" → "Password must
 * be at least 8 characters"
 * 6. Required fields validation - Submit form with empty required fields →
 * System shows validation errors
 * 7. Phone number format - Enter invalid phone "123" → Phone format: 10 digits
 * 13. Login with empty fields - Submit login with empty username/password →
 * System shows validation errors
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthControllerValidationTest {

    @Autowired
    private MockMvc mockMvc;

    // ===================== REGISTRATION VALIDATION TESTS =====================

    @Nested
    @DisplayName("Register - Required Fields Validation")
    class RegisterRequiredFieldsTests {

        @Test
        @DisplayName("Should return 400 when username is empty")
        void shouldReturn400_WhenUsernameIsEmpty() throws Exception {
            String requestJson = """
                    {
                        "username": "",
                        "email": "test@example.com",
                        "password": "password123",
                        "address": "123 Street",
                        "phoneNumber": "0123456789"
                    }
                    """;

            mockMvc.perform(post("/api/v1/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(requestJson))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("Should return 400 when all required fields are empty")
        void shouldReturn400_WhenAllFieldsAreEmpty() throws Exception {
            String requestJson = """
                    {
                        "username": "",
                        "email": "",
                        "password": "",
                        "address": "",
                        "phoneNumber": ""
                    }
                    """;

            mockMvc.perform(post("/api/v1/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(requestJson))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("Should return 400 when fields are null/missing")
        void shouldReturn400_WhenFieldsAreMissing() throws Exception {
            String requestJson = """
                    {
                        "username": "testuser"
                    }
                    """;

            mockMvc.perform(post("/api/v1/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(requestJson))
                    .andExpect(status().isBadRequest());
        }
    }

    @Nested
    @DisplayName("Register - Email Format Validation")
    class RegisterEmailValidationTests {

        @Test
        @DisplayName("Should return 400 when email format is invalid - 'notanemail'")
        void shouldReturn400_WhenEmailFormatIsInvalid() throws Exception {
            String requestJson = """
                    {
                        "username": "testuser",
                        "email": "notanemail",
                        "password": "password123",
                        "address": "123 Street",
                        "phoneNumber": "0123456789"
                    }
                    """;

            mockMvc.perform(post("/api/v1/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(requestJson))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("Should return 400 when email is missing @")
        void shouldReturn400_WhenEmailMissingAt() throws Exception {
            String requestJson = """
                    {
                        "username": "testuser",
                        "email": "testexample.com",
                        "password": "password123",
                        "address": "123 Street",
                        "phoneNumber": "0123456789"
                    }
                    """;

            mockMvc.perform(post("/api/v1/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(requestJson))
                    .andExpect(status().isBadRequest());
        }
    }

    @Nested
    @DisplayName("Register - Password Strength Validation")
    class RegisterPasswordValidationTests {

        @Test
        @DisplayName("Should return 400 when password is too short - '123'")
        void shouldReturn400_WhenPasswordIsTooShort() throws Exception {
            String requestJson = """
                    {
                        "username": "testuser",
                        "email": "test@example.com",
                        "password": "123",
                        "address": "123 Street",
                        "phoneNumber": "0123456789"
                    }
                    """;

            mockMvc.perform(post("/api/v1/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(requestJson))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("Should return 400 when password is 7 characters")
        void shouldReturn400_WhenPasswordIs7Chars() throws Exception {
            String requestJson = """
                    {
                        "username": "testuser",
                        "email": "test@example.com",
                        "password": "1234567",
                        "address": "123 Street",
                        "phoneNumber": "0123456789"
                    }
                    """;

            mockMvc.perform(post("/api/v1/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(requestJson))
                    .andExpect(status().isBadRequest());
        }
    }

    @Nested
    @DisplayName("Register - Phone Number Format Validation")
    class RegisterPhoneValidationTests {

        @Test
        @DisplayName("Should return 400 when phone number is too short - '123'")
        void shouldReturn400_WhenPhoneIsTooShort() throws Exception {
            String requestJson = """
                    {
                        "username": "testuser",
                        "email": "test@example.com",
                        "password": "password123",
                        "address": "123 Street",
                        "phoneNumber": "123"
                    }
                    """;

            mockMvc.perform(post("/api/v1/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(requestJson))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("Should return 400 when phone number contains letters")
        void shouldReturn400_WhenPhoneContainsLetters() throws Exception {
            String requestJson = """
                    {
                        "username": "testuser",
                        "email": "test@example.com",
                        "password": "password123",
                        "address": "123 Street",
                        "phoneNumber": "012345abcd"
                    }
                    """;

            mockMvc.perform(post("/api/v1/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(requestJson))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("Should return 400 when phone number is 9 digits")
        void shouldReturn400_WhenPhoneIs9Digits() throws Exception {
            String requestJson = """
                    {
                        "username": "testuser",
                        "email": "test@example.com",
                        "password": "password123",
                        "address": "123 Street",
                        "phoneNumber": "012345678"
                    }
                    """;

            mockMvc.perform(post("/api/v1/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(requestJson))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("Should return 400 when phone number is 11 digits")
        void shouldReturn400_WhenPhoneIs11Digits() throws Exception {
            String requestJson = """
                    {
                        "username": "testuser",
                        "email": "test@example.com",
                        "password": "password123",
                        "address": "123 Street",
                        "phoneNumber": "01234567890"
                    }
                    """;

            mockMvc.perform(post("/api/v1/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(requestJson))
                    .andExpect(status().isBadRequest());
        }
    }

    // ===================== LOGIN VALIDATION TESTS =====================

    @Nested
    @DisplayName("Login - Empty Fields Validation")
    class LoginEmptyFieldsTests {

        @Test
        @DisplayName("Should return 400 when username is empty")
        void shouldReturn400_WhenLoginUsernameIsEmpty() throws Exception {
            String requestJson = """
                    {
                        "username": "",
                        "password": "password123"
                    }
                    """;

            mockMvc.perform(post("/api/v1/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(requestJson))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("Should return 400 when password is empty")
        void shouldReturn400_WhenLoginPasswordIsEmpty() throws Exception {
            String requestJson = """
                    {
                        "username": "testuser",
                        "password": ""
                    }
                    """;

            mockMvc.perform(post("/api/v1/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(requestJson))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("Should return 400 when both username and password are empty")
        void shouldReturn400_WhenBothFieldsAreEmpty() throws Exception {
            String requestJson = """
                    {
                        "username": "",
                        "password": ""
                    }
                    """;

            mockMvc.perform(post("/api/v1/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(requestJson))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("Should return 400 when fields are missing/null")
        void shouldReturn400_WhenLoginFieldsAreMissing() throws Exception {
            String requestJson = """
                    {}
                    """;

            mockMvc.perform(post("/api/v1/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(requestJson))
                    .andExpect(status().isBadRequest());
        }
    }
}
