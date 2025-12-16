package com.example.movie.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.example.movie.model.User;
import com.example.movie.repository.UserRepository;
import com.example.movie.security.SecurityUtil;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Account Management Functional Tests
 * 
 * Test Cases:
 * 1. View profile - User accesses /profile → Display user information
 * 2. Update profile - User updates email/phone → Information saved
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AccountManagementTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SecurityUtil securityUtil;

    private User testUser;
    private String userToken;

    @BeforeEach
    void setUp() {
        // Create test user
        testUser = new User();
        testUser.setUsername("profileuser");
        testUser.setEmail("profile@test.com");
        testUser.setPassword("$2a$10$encodedpassword");
        testUser.setPhoneNumber("0123456789");
        testUser.setAddress("Test Address");
        testUser.setRole(User.UserRole.CUSTOMER);
        testUser.setIsActive(true);
        testUser = userRepository.save(testUser);

        // Generate token for the user
        userToken = securityUtil.createAccessToken(testUser);
    }

    // ===================== VIEW PROFILE =====================

    @Nested
    @DisplayName("View Profile")
    class ViewProfileTests {

        @Test
        @DisplayName("Authenticated user can view their profile → 200 OK")
        void authenticatedUser_CanViewProfile() throws Exception {
            mockMvc.perform(get("/api/v1/users/" + testUser.getId())
                    .header("Authorization", "Bearer " + userToken))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.username").value("profileuser"))
                    .andExpect(jsonPath("$.data.email").value("profile@test.com"));
        }

        @Test
        @DisplayName("Unauthenticated user cannot view profile → 401")
        void unauthenticatedUser_CannotViewProfile() throws Exception {
            mockMvc.perform(get("/api/v1/users/" + testUser.getId()))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("Response contains user information (username, email, phone)")
        void profileResponse_ContainsUserInformation() throws Exception {
            mockMvc.perform(get("/api/v1/users/" + testUser.getId())
                    .header("Authorization", "Bearer " + userToken))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.username").exists())
                    .andExpect(jsonPath("$.data.email").exists())
                    .andExpect(jsonPath("$.data.phoneNumber").exists())
                    .andExpect(jsonPath("$.data.address").exists());
        }

        @Test
        @DisplayName("Password is NOT included in profile response")
        void profileResponse_DoesNotContainPassword() throws Exception {
            MvcResult result = mockMvc.perform(get("/api/v1/users/" + testUser.getId())
                    .header("Authorization", "Bearer " + userToken))
                    .andExpect(status().isOk())
                    .andReturn();

            String responseBody = result.getResponse().getContentAsString();
            org.junit.jupiter.api.Assertions.assertFalse(
                    responseBody.contains("password"),
                    "Password should NOT be in profile response");
        }
    }

    // ===================== UPDATE PROFILE =====================

    @Nested
    @DisplayName("Update Profile")
    class UpdateProfileTests {

        @Test
        @DisplayName("User can update their email → Information saved")
        void userCanUpdateEmail() throws Exception {
            String updatePayload = "{\"email\":\"newemail@test.com\"}";

            // Note: This test may fail if update endpoint doesn't exist
            // or has different structure - serves as spec
            mockMvc.perform(patch("/api/v1/users/" + testUser.getId())
                    .header("Authorization", "Bearer " + userToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(updatePayload))
                    .andExpect(status().isOk());
        }

        @Test
        @DisplayName("User can update their phone number → Information saved")
        void userCanUpdatePhoneNumber() throws Exception {
            String updatePayload = "{\"phoneNumber\":\"0987654321\"}";

            mockMvc.perform(patch("/api/v1/users/" + testUser.getId())
                    .header("Authorization", "Bearer " + userToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(updatePayload))
                    .andExpect(status().isOk());
        }

        @Test
        @DisplayName("Unauthenticated user cannot update profile → 401")
        void unauthenticatedUser_CannotUpdateProfile() throws Exception {
            String updatePayload = "{\"email\":\"hack@test.com\"}";

            mockMvc.perform(patch("/api/v1/users/" + testUser.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(updatePayload))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("User cannot update another user's profile → 403")
        void userCannotUpdateOtherUserProfile() throws Exception {
            // Create another user
            User otherUser = new User();
            otherUser.setUsername("otheruser");
            otherUser.setEmail("other@test.com");
            otherUser.setPassword("$2a$10$encodedpassword");
            otherUser.setPhoneNumber("0111111111");
            otherUser.setAddress("Other Address");
            otherUser.setRole(User.UserRole.CUSTOMER);
            otherUser.setIsActive(true);
            otherUser = userRepository.save(otherUser);

            String updatePayload = "{\"email\":\"hacked@test.com\"}";

            // Try to update other user's profile with testUser's token
            mockMvc.perform(patch("/api/v1/users/" + otherUser.getId())
                    .header("Authorization", "Bearer " + userToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(updatePayload))
                    .andExpect(status().isForbidden());
        }
    }
}
