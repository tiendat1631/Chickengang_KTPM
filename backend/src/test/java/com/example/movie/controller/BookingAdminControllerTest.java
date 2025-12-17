package com.example.movie.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class BookingAdminControllerTest {

    @Autowired
    private MockMvc mockMvc;

    /**
     * M3-08: Filter by Status
     * Expect: GET /api/v1/admin/bookings?status=CONFIRMED
     */
    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void testAdminGetBookings_FilterByStatus() throws Exception {
        mockMvc.perform(get("/api/v1/admin/bookings")
                .param("status", "CONFIRMED"))
                .andExpect(status().isOk());
    }

    /**
     * M3-09: Sort by Date
     * Expect: GET /api/v1/admin/bookings?sort=date,desc
     */
    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void testAdminGetBookings_SortByDate() throws Exception {
        mockMvc.perform(get("/api/v1/admin/bookings")
                .param("sort", "createdOn,desc"))
                .andExpect(status().isOk());
    }

    /**
     * M3-11: Pagination
     * Expect: GET /api/v1/admin/bookings?page=0&size=10
     */
    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void testAdminGetBookings_Pagination() throws Exception {
        mockMvc.perform(get("/api/v1/admin/bookings")
                .param("page", "0")
                .param("size", "10"))
                .andExpect(status().isOk());
    }

    /**
     * M3-21 -> M3-26: Admin Search/Filter
     * Expect: GET /api/v1/admin/bookings?search=BK-2024
     */
    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void testAdminSearchBooking_ByCode() throws Exception {
        mockMvc.perform(get("/api/v1/admin/bookings")
                .param("search", "BK-2024"))
                .andExpect(status().isOk());
    }
}
