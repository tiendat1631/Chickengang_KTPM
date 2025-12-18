package com.example.movie.controller;

import com.example.movie.dto.screening.ScreeningResponse;
import com.example.movie.model.Screening;
import com.example.movie.service.ScreeningService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ScreeningController.class)
@AutoConfigureMockMvc(addFilters = false) // Disable security for this test
public class ScreeningControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ScreeningService screeningService;

    // Mock beans for security dependencies usually required by @WebMvcTest
    @MockBean
    private org.springframework.security.oauth2.jwt.JwtDecoder jwtDecoder;
    @MockBean
    private com.example.movie.service.impl.CustomUserDetailsService customUserDetailsService;

    private ScreeningResponse screening1;
    private ScreeningResponse screening2;

    @BeforeEach
    void setUp() {
        screening1 = ScreeningResponse.builder()
                .id(1L)
                .movieId(101L)
                .movieTitle("Avengers: Endgame")
                .auditoriumId(1L)
                .auditoriumName("Hall A")
                .startTime(LocalDateTime.of(2025, 12, 20, 18, 0))
                .endTime(LocalDateTime.of(2025, 12, 20, 21, 0))
                .status(Screening.Status.ACTIVE)
                .format(Screening.Format.TwoD)
                .build();

        screening2 = ScreeningResponse.builder()
                .id(2L)
                .movieId(101L)
                .movieTitle("Avengers: Endgame")
                .auditoriumId(2L)
                .auditoriumName("Hall B")
                .startTime(LocalDateTime.of(2025, 12, 21, 19, 0))
                .endTime(LocalDateTime.of(2025, 12, 21, 22, 0))
                .status(Screening.Status.ACTIVE)
                .format(Screening.Format.IMAX)
                .build();
    }

    // TestCase ID: [Module1-18] / M1-18: View screenings
    @Test
    void getScreeningsByMovieId_ShouldReturnListOfScreenings() throws Exception {
        Long movieId = 101L;
        List<ScreeningResponse> screenings = Arrays.asList(screening1, screening2);

        Mockito.when(screeningService.getScreeningsByMovieId(eq(movieId))).thenReturn(screenings);

        mockMvc.perform(get("/api/v1/screenings/movie/{movieId}", movieId)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.data.size()").value(2))
                .andExpect(jsonPath("$.data[0].id").value(1))
                .andExpect(jsonPath("$.data[0].movieTitle").value("Avengers: Endgame"))
                .andExpect(jsonPath("$.data[1].id").value(2))
                .andExpect(jsonPath("$.data[1].format").value("IMAX"));
    }

    @Test
    void getScreeningsByMovieId_ShouldReturnEmptyList_WhenNoScreeningsFound() throws Exception {
        Long movieId = 999L;
        Mockito.when(screeningService.getScreeningsByMovieId(eq(movieId))).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/v1/screenings/movie/{movieId}", movieId)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isEmpty());
    }
}
