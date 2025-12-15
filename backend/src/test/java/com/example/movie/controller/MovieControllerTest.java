package com.example.movie.controller;

import com.example.movie.dto.movie.MovieResponse;
import com.example.movie.dto.movie.MovieSearchRequest;
import com.example.movie.dto.response.PageResponse;
import com.example.movie.exception.InvalidId;
import com.example.movie.service.MovieService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(MovieController.class)
@AutoConfigureMockMvc(addFilters = false) // Disable security filters for simple controller test
public class MovieControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private MovieService movieService;

    @MockBean
    private org.springframework.security.oauth2.jwt.JwtDecoder jwtDecoder;

    @MockBean
    private com.example.movie.service.impl.CustomUserDetailsService customUserDetailsService;

    private MovieResponse movieResponse;

    @BeforeEach
    void setUp() {
        movieResponse = new MovieResponse();
        movieResponse.setId(1L);
        movieResponse.setTitle("Test Movie");
        movieResponse.setDirector("Test Director");
    }

    @Test
    void getMovieById_ShouldReturnMovie_WhenExists() throws Exception {
        when(movieService.getMovieById(1L)).thenReturn(movieResponse);

        mockMvc.perform(get("/api/v1/movies/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.title").value("Test Movie"));
    }

    @Test
    void getMovieById_ShouldReturn409Conflict_WhenNotFound() throws Exception {
        // GlobalExceptionHandler maps InvalidId to 409 CONFLICT
        when(movieService.getMovieById(99L)).thenThrow(new InvalidId(99L));

        mockMvc.perform(get("/api/v1/movies/99")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.errorCode").value("INVALID_ID"));
    }

    @Test
    void searchMovies_ShouldReturnPagedResult() throws Exception {
        PageResponse<MovieResponse> pageResponse = PageResponse.<MovieResponse>builder()
                .content(Collections.singletonList(movieResponse))
                .totalElements(1)
                .totalPages(1)
                .currentPage(0)
                .pageSize(10)
                .build();

        when(movieService.searchAndFilterMovies(any(MovieSearchRequest.class), any(Pageable.class)))
                .thenReturn(pageResponse);

        mockMvc.perform(get("/api/v1/movies")
                .param("search", "Test")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content[0].title").value("Test Movie"));
    }
}
