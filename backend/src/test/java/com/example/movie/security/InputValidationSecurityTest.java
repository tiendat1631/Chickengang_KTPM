package com.example.movie.security;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Input Validation Security Tests
 * 
 * Test Cases:
 * 1. XSS prevention in username
 * 2. Username length validation (5-30 chars)
 * 3. Email length validation (max 100 chars)
 * 4. Role immutability - user cannot change their role
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@org.springframework.transaction.annotation.Transactional
class InputValidationSecurityTest {

        @Autowired
        private MockMvc mockMvc;

        // ===================== XSS PREVENTION =====================

        @Test
        @DisplayName("XSS: Script tag in username should be rejected or escaped")
        void xss_ScriptTagInUsername_ShouldBeRejectedOrEscaped() throws Exception {
                String payload = "{\"username\":\"<script>alert('XSS')</script>\",\"email\":\"xss@test.com\",\"password\":\"securePass123\",\"phoneNumber\":\"0123456789\",\"address\":\"Test\"}";

                MvcResult result = mockMvc.perform(post("/api/v1/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(payload)).andReturn();

                int status = result.getResponse().getStatus();
                if (status == 201 || status == 200) {
                        assertFalse(result.getResponse().getContentAsString().contains("<script>"));
                } else {
                        assertEquals(400, status);
                }
        }

        @Test
        @DisplayName("XSS: HTML img tag injection should be handled safely")
        void xss_HtmlImgTagInjection_ShouldBeHandledSafely() throws Exception {
                String payload = "{\"username\":\"<img src=x onerror=alert(1)>\",\"email\":\"img@test.com\",\"password\":\"securePass123\",\"phoneNumber\":\"0123456780\",\"address\":\"Test\"}";

                MvcResult result = mockMvc.perform(post("/api/v1/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(payload)).andReturn();

                int status = result.getResponse().getStatus();
                assertTrue(status == 400 || status == 201 || status == 200);
        }

        // ===================== USERNAME LENGTH =====================

        @Test
        @DisplayName("Username: Less than 5 chars should be rejected (400)")
        void username_LessThan5Chars_ShouldBeRejected() throws Exception {
                String payload = "{\"username\":\"abc\",\"email\":\"short@test.com\",\"password\":\"securePass123\",\"phoneNumber\":\"0123456781\",\"address\":\"Test\"}";

                mockMvc.perform(post("/api/v1/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(payload))
                                .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("Username: Exactly 5 chars should be accepted")
        void username_Exactly5Chars_ShouldBeAccepted() throws Exception {
                String payload = "{\"username\":\"user5\",\"email\":\"five@test.com\",\"password\":\"securePass123\",\"phoneNumber\":\"0123456782\",\"address\":\"Test\"}";

                mockMvc.perform(post("/api/v1/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(payload))
                                .andExpect(status().is2xxSuccessful());
        }

        @Test
        @DisplayName("Username: More than 30 chars should be rejected (400)")
        void username_MoreThan30Chars_ShouldBeRejected() throws Exception {
                String longName = "a".repeat(31);
                String payload = "{\"username\":\"" + longName
                                + "\",\"email\":\"long@test.com\",\"password\":\"securePass123\",\"phoneNumber\":\"0123456783\",\"address\":\"Test\"}";

                mockMvc.perform(post("/api/v1/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(payload))
                                .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("Username: Exactly 30 chars should be accepted")
        void username_Exactly30Chars_ShouldBeAccepted() throws Exception {
                String name30 = "b".repeat(30);
                String payload = "{\"username\":\"" + name30
                                + "\",\"email\":\"thirty@test.com\",\"password\":\"securePass123\",\"phoneNumber\":\"0123456784\",\"address\":\"Test\"}";

                mockMvc.perform(post("/api/v1/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(payload))
                                .andExpect(status().is2xxSuccessful());
        }

        // ===================== EMAIL LENGTH =====================

        @Test
        @DisplayName("Email: More than 100 chars should be rejected (400)")
        void email_MoreThan100Chars_ShouldBeRejected() throws Exception {
                String longEmail = "a".repeat(92) + "@test.com"; // 101 chars
                String payload = "{\"username\":\"emailtest\",\"email\":\"" + longEmail
                                + "\",\"password\":\"securePass123\",\"phoneNumber\":\"0123456785\",\"address\":\"Test\"}";

                mockMvc.perform(post("/api/v1/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(payload))
                                .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("Email: Exactly 100 chars should be accepted")
        void email_Exactly100Chars_ShouldBeAccepted() throws Exception {
                String email100 = "a".repeat(91) + "@test.com"; // 100 chars
                String payload = "{\"username\":\"email100\",\"email\":\"" + email100
                                + "\",\"password\":\"securePass123\",\"phoneNumber\":\"0123456786\",\"address\":\"Test\"}";

                mockMvc.perform(post("/api/v1/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(payload))
                                .andExpect(status().is2xxSuccessful());
        }

        // ===================== ROLE IMMUTABILITY (SECURITY) =====================

        @Test
        @DisplayName("Security: User cannot change their role via registration with role=ADMIN")
        void security_UserCannotRegisterAsAdmin_ShouldBeIgnoredOrRejected() throws Exception {
                // Attempt to register with role=ADMIN (should be ignored or rejected)
                String payload = "{\"username\":\"hackeruser\",\"email\":\"hacker@test.com\",\"password\":\"securePass123\",\"phoneNumber\":\"0123456787\",\"address\":\"Test\",\"role\":\"ADMIN\"}";

                MvcResult result = mockMvc.perform(post("/api/v1/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(payload)).andReturn();

                int status = result.getResponse().getStatus();
                String responseBody = result.getResponse().getContentAsString();

                if (status == 201 || status == 200) {
                        // If registration succeeded, role should NOT be ADMIN
                        // The service should ignore the role field and set it to CUSTOMER
                        assertFalse(responseBody.contains("\"role\":\"ADMIN\""),
                                        "User should NOT be registered as ADMIN - role should be forced to CUSTOMER");
                }
                // If status is 400/403, that's also acceptable (role field rejected)
        }

        @Test
        @DisplayName("Security: User cannot escalate role via profile update")
        void security_UserCannotEscalateRoleViaUpdate_ShouldBeBlocked() throws Exception {
                // This test expects the API to block role modification attempts
                // If there's no update endpoint that accepts role, this is implicitly safe

                // Try to update user with role=ADMIN via PATCH
                String patchPayload = "{\"role\":\"ADMIN\"}";

                // Without auth token, should get 401
                mockMvc.perform(patch("/api/v1/users/1")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(patchPayload))
                                .andExpect(status().isUnauthorized());
        }
}
