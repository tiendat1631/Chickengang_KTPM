package com.example.movie.controller;

import com.example.movie.dto.movie.MovieResponse;
import com.example.movie.dto.response.PageResponse;
import com.example.movie.service.MovieService;
import com.example.movie.service.impl.CustomUserDetailsService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import org.springframework.security.oauth2.jwt.JwtDecoder;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = MovieController.class)
@AutoConfigureMockMvc(addFilters = false)
class MovieControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private MovieService movieService;

    @MockBean
    private JwtDecoder jwtDecoder;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    @Test
    void getMovies_ShouldReturnWrappedPageResponse() throws Exception {
        PageResponse<MovieResponse> pageResponse = PageResponse.<MovieResponse>builder()
                .content(List.of(MovieResponse.builder().id(1L).title("Interstellar").build()))
                .totalElements(1)
                .totalPages(1)
                .currentPage(0)
                .pageSize(10)
                .hasNext(false)
                .hasPrevious(false)
                .build();
        given(movieService.searchAndFilterMovies(any(), any())).willReturn(pageResponse);

        mockMvc.perform(get("/api/v1/movies")
                        .param("page", "0")
                        .param("size", "10")
                        .param("search", "Interstellar")
                        .param("genre", "Sci-Fi")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.message").value("get list success"))
                .andExpect(jsonPath("$.data.totalElements").value(1))
                .andExpect(jsonPath("$.data.content[0].title").value("Interstellar"));
    }
}

